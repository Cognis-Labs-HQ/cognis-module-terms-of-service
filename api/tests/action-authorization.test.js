import assert from "node:assert/strict";
import test from "node:test";
import { registerApi } from "../index.js";
import { createFlowRuntime } from "./reuse/flow-runtime.js";

function fixture({ failMutation = false } = {}) {
    const runtime = createFlowRuntime();
    const mutations = [];
    const logs = [];
    const queries = [];
    const routes = new Map();
    const database = {
        async ensureTable() {},
        async executeCommand(command) {
            queries.push(command);
            if (command.option === "INSERT") {
                if (failMutation) throw new Error("persistence_failed");
                mutations.push(command.values);
            }
            return { rows: [] };
        },
    };
    const versions = {
        async ensureSchema() {},
        async getLatest(slug) {
            return { slug, version: "hash", markdown: "Document" };
        },
        async publish(document) {
            if (failMutation) throw new Error("persistence_failed");
            mutations.push(document);
            return {
                slug: document.slug,
                version: "hash",
                markdown: document.content,
            };
        },
    };
    registerApi(
        Object.fromEntries(
            ["get", "put", "post"].map((method) => [
                method,
                (path, handler) => routes.set(`${method}:${path}`, handler),
            ]),
        ),
        {
            ...runtime,
            log: (...args) => logs.push(args),
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
    return { runtime, mutations, logs, queries, routes };
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

test("consent reports require verified administrators before querying accounts", async () => {
    const { runtime, queries } = fixture();
    for (const input of [
        ["terms-of-service"],
        [{}, {}, "terms-of-service"],
        [{ principal: { sub: "user", role: "user" } }, {}, "terms-of-service"],
    ]) {
        await assert.rejects(
            runtime.flow.run("terms-of-service:listConsentForDocument", input),
            /authorization_required/,
        );
    }
    assert.deepEqual(queries, []);
    const result = await runtime.flow.run(
        "terms-of-service:listConsentForDocument",
        [
            { principal: { sub: "admin", role: "admin" } },
            {},
            "terms-of-service",
        ],
    );
    assert.deepEqual(result.data.result, []);
    assert.equal(queries.length, 1);
    assert.equal(queries[0].option, "SELECT");
    assert.deepEqual(runtime.executions.slice(-4), [
        "terms-of-service:listConsentForDocument:authorize",
        "terms-of-service:listConsentForDocument:validate",
        "terms-of-service:listConsentForDocument:execute",
        "terms-of-service:listConsentForDocument:present",
    ]);
});

test("the consent report route passes authenticated request context into its flow", async () => {
    const { routes, queries } = fixture();
    const response = {
        writeHead(status) {
            this.status = status;
        },
        end(body) {
            this.body = JSON.parse(body);
            this.writableEnded = true;
        },
    };
    await routes.get(
        "get:/api/v1/modules/terms-of-service/consent-report/terms-of-service",
    )({ principal: { sub: "admin", role: "admin" } }, response);
    assert.equal(response.status, 200);
    assert.deepEqual(response.body.data, []);
    assert.equal(queries.length, 1);
});

test("direct mutation flows audit verified actors exactly once after success", async () => {
    const { runtime, logs } = fixture();
    await runtime.flow.run("terms-of-service:publish", [
        { principal: { sub: "admin", role: "admin" } },
        {},
        "terms-of-service",
        "Document",
    ]);
    await runtime.flow.run("terms-of-service:recordConsent", [
        { principal: { sub: "user", role: "user" } },
        {},
        { "terms-of-service": "hash", "privacy-policy": "hash", eula: "hash" },
    ]);
    assert.deepEqual(logs, [
        [
            "info",
            "Legal document published.",
            {
                component: "terms-of-service",
                operation: "publishDocument",
                accountId: "admin",
                slug: "terms-of-service",
                version: "hash",
            },
        ],
        [
            "info",
            "Legal consent recorded.",
            {
                component: "terms-of-service",
                operation: "recordConsent",
                accountId: "user",
                documentSlugs: ["terms-of-service", "privacy-policy", "eula"],
            },
        ],
    ]);
});

test("failed persistence does not log successful legal mutations", async () => {
    const { runtime, logs } = fixture({ failMutation: true });
    await assert.rejects(
        runtime.flow.run("terms-of-service:publish", [
            { principal: { sub: "admin", role: "admin" } },
            {},
            "terms-of-service",
            "Document",
        ]),
        /persistence_failed/,
    );
    await assert.rejects(
        runtime.flow.run("terms-of-service:recordConsent", [
            { principal: { sub: "user", role: "user" } },
            {},
            {
                "terms-of-service": "hash",
                "privacy-policy": "hash",
                eula: "hash",
            },
        ]),
        /persistence_failed/,
    );
    assert.equal(logs.filter(([level]) => level === "info").length, 0);
});
