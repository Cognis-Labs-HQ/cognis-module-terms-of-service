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
            if (path.endsWith("/terms-of-service")) putHandler = handler;
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
                                markdown: input.content,
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

test("public document index lists only published document metadata", async () => {
    let publicIndexHandler;
    const router = {
        get(path, handler) {
            if (path === "/api/v1/modules/terms-of-service/public") {
                publicIndexHandler = handler;
            }
        },
        post() {},
        put() {},
    };
    const ctx = {
        getCapability(name) {
            if (name === "auth:requireAuth") return () => null;
            if (name === "db:executor") return { async ensureTable() {} };
            if (name === "docs:versionStore") {
                return {
                    createStore: () => ({
                        async ensureSchema() {},
                        async getLatest(slug) {
                            if (slug === "eula") return null;
                            return {
                                slug,
                                version: `${slug}-version`,
                                content: `# ${slug}`,
                                published_at: "2026-09-15T00:00:00.000Z",
                            };
                        },
                    }),
                };
            }
            assert.fail(`Unexpected capability: ${name}`);
        },
    };
    registerApi(router, ctx);

    const response = {
        writeHead(status) {
            this.status = status;
        },
        end(body) {
            this.body = JSON.parse(body);
        },
    };
    await publicIndexHandler({}, response);

    assert.equal(response.status, 200);
    assert.deepEqual(
        response.body.data.map((document) => document.slug),
        ["terms-of-service", "privacy-policy"],
    );
    assert.ok(
        response.body.data.every(
            (document) => !Object.hasOwn(document, "markdown"),
        ),
    );
});
