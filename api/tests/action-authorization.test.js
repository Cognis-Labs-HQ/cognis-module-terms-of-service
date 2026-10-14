import assert from "node:assert/strict";
import test from "node:test";
import { registerApi } from "../index.js";
import { createFlowRuntime } from "./reuse/flow-runtime.js";

function fixture() {
    const runtime = createFlowRuntime();
    const mutations = [];
    const database = {
        async ensureTable() {},
        async executeCommand(command) {
            if (command.option === "INSERT") mutations.push(command.values);
            return { rows: [] };
        },
    };
    const versions = {
        async ensureSchema() {},
        async getLatest(slug) {
            return { slug, version: "hash", markdown: "Document" };
        },
        async publish(document) {
            mutations.push(document);
            return {
                slug: document.slug,
                version: "hash",
                markdown: document.content,
            };
        },
    };
    registerApi(
        { get() {}, put() {}, post() {} },
        {
            ...runtime,
            log() {},
            getCapability(id) {
                if (id === "db:executor") return database;
                if (id === "docs:versionStore")
                    return { createStore: () => versions };
                if (id === "auth:requireAuth")
                    return async (request, response, role) =>
                        request.principal &&
                        (role === "user" || request.principal.role === "admin")
                            ? request.principal
                            : null;
            },
        },
    );
    return { runtime, mutations };
}

test("direct mutation flows reject anonymous callers and non-admin publishing before persistence", async () => {
    const { runtime, mutations } = fixture();
    await assert.rejects(
        runtime.flow.run("terms-of-service:publish", [
            {},
            {},
            "terms-of-service",
            "Document",
        ]),
        /authorization_required/,
    );
    await assert.rejects(
        runtime.flow.run("terms-of-service:publish", [
            { principal: { sub: "user", role: "user" } },
            {},
            "terms-of-service",
            "Document",
        ]),
        /authorization_required/,
    );
    await assert.rejects(
        runtime.flow.run("terms-of-service:recordConsent", [{}, {}, {}]),
        /authorization_required/,
    );
    assert.deepEqual(mutations, []);
});

test("publication derives its actor from the authenticated request", async () => {
    const { runtime, mutations } = fixture();
    await runtime.flow.run("terms-of-service:publish", [
        { principal: { sub: "admin", role: "admin" } },
        {},
        "terms-of-service",
        "Document",
        "forged-account",
    ]);
    assert.equal(mutations[0].actorId, "admin");
    assert.deepEqual(runtime.executions.slice(-4), [
        "terms-of-service:publish:authorize",
        "terms-of-service:publish:validate",
        "terms-of-service:publish:execute",
        "terms-of-service:publish:present",
    ]);
});

test("consent records only the authenticated account even for direct flow callers", async () => {
    const { runtime, mutations } = fixture();
    await runtime.flow.run("terms-of-service:recordConsent", [
        { principal: { sub: "user", role: "user" } },
        {},
        { "terms-of-service": "hash", "privacy-policy": "hash", eula: "hash" },
        "forged-account",
    ]);
    assert.equal(mutations[0].account_id, "user");
});
