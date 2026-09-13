import assert from "node:assert/strict";
import { Readable } from "node:stream";
import test from "node:test";
import { registerApi } from "../index.js";

test("publishing attributes the document to authenticated claims", async () => {
    let publishInput;
    let putHandler;
    const router = {
        get() {},
        post() {},
        put(path, handler) {
            if (path.endsWith("/:slug")) putHandler = handler;
        },
    };
    const ctx = {
        getCapability(name) {
            if (name === "auth:requireAuth") {
                return () => ({ sub: "admin-account", role: "admin" });
            }
            if (name === "db:executor") {
                return { async ensureTable() {} };
            }
            if (name === "docs:versionStore") {
                return {
                    createStore: () => ({
                        async ensureSchema() {},
                        async getLatest() {},
                        async publish(input) {
                            publishInput = input;
                            return {
                                ...input,
                                version: "version-1",
                                published_at: "2026-09-13T00:00:00.000Z",
                            };
                        },
                    }),
                };
            }
            assert.fail(`Unexpected capability: ${name}`);
        },
        log() {},
    };
    registerApi(router, ctx);

    const request = Readable.from([JSON.stringify({ markdown: "# Terms" })]);
    request.params = { slug: "terms-of-service" };
    const response = {
        writableEnded: false,
        writeHead(status) {
            this.status = status;
        },
        end(body) {
            this.body = JSON.parse(body);
            this.writableEnded = true;
        },
    };
    await putHandler(request, response);

    assert.equal(response.status, 200);
    assert.equal(publishInput.actorId, "admin-account");
    assert.equal(publishInput.content, "# Terms");
    assert.equal(response.body.data.markdown, "# Terms");
});
