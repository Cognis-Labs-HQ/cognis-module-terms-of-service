import assert from "node:assert/strict";
import test from "node:test";
import { registerOnboarding } from "../consent/onboarding.js";
import { LegalDocumentStore } from "../store.js";
import { createFlowRuntime } from "./reuse/flow-runtime.js";

function fixture() {
    const runtime = createFlowRuntime();
    const operations = new Map();
    const writes = [];
    const rows = new Map();
    const logs = [];
    let generation = 0;
    let beforeRead = async () => {};
    const versions = { "terms-of-service": "terms-v1", eula: "eula-v1" };
    const database = {
        async ensureTable() {},
        async executeCommand(command) {
            if (command.option === "INSERT") {
                writes.push(command);
                rows.set(command.values.account_id, command.values);
                return { rows: [] };
            }
            await beforeRead();
            const row = rows.get(command.where[0].value);
            return { rows: row ? [row] : [] };
        },
    };
    const tracker = {
        createStore: () => ({
            async ensureSchema() {},
            async getLatest(slug) {
                return versions[slug]
                    ? { slug, version: versions[slug], markdown: "Synthetic" }
                    : null;
            },
        }),
    };
    const store = new LegalDocumentStore(database, tracker);
    const register = () =>
        registerOnboarding(
            { ...runtime, log: (...args) => logs.push(args) },
            {
                registerOperation(operation) {
                    assert.equal(operations.has(operation.id), false);
                    operations.set(operation.id, operation);
                },
            },
            store,
            store.ensureSchema(),
        );
    register();
    const invoke = async (name, input, accountId = "new-account") => {
        const operation = operations.get(`terms-of-service:consent:${name}`);
        const expected = generation;
        let active = true;
        const context = {
            accountId,
            async assertCurrent() {
                if (!active || generation !== expected)
                    throw new Error("onboarding_operation_expired");
            },
        };
        try {
            return await operation.execute(context, input);
        } finally {
            active = false;
        }
    };
    return {
        runtime,
        operations,
        writes,
        logs,
        versions,
        invoke,
        disable() {
            generation += 1;
            operations.clear();
        },
        setBeforeRead(callback) {
            beforeRead = callback;
        },
    };
}

const consent = () => ({
    accepted: true,
    versions: { "terms-of-service": "terms-v1", eula: "eula-v1" },
});

test("registered onboarding operations use verified subject and exact versions", async () => {
    const host = fixture();
    const status = await host.invoke("status", {});
    assert.equal(status.required, true);
    const result = await host.invoke("record", consent());
    assert.equal(result.accepted, true);
    assert.equal(host.writes.length, 1);
    assert.equal(host.writes[0].values.account_id, "new-account");
    assert.equal(host.writes[0].values.terms_version, "terms-v1");
    assert.ok(
        host.runtime.executions.includes(
            "terms-of-service:prepareOnboardingConsent:validateConsent",
        ),
    );
    assert.equal(host.logs.filter(([level]) => level === "info").length, 1);
    await assert.rejects(host.invoke("record", consent()), { status: 409 });
    assert.equal(host.writes.length, 1);
});

for (const input of [
    {},
    { accepted: false, versions: consent().versions },
    { ...consent(), accountId: "someone-else" },
    { accepted: true, versions: { unknown: "v1" } },
    { accepted: true, versions: { "terms-of-service": "terms-v1" } },
]) {
    test(`onboarding rejects invalid or incomplete acceptance ${JSON.stringify(input)}`, async () => {
        const host = fixture();
        await assert.rejects(host.invoke("record", input), { status: 400 });
        assert.equal(host.writes.length, 0);
    });
}

test("stale and unpublished versions never record consent", async () => {
    for (const versions of [
        { ...consent().versions, eula: "old" },
        { ...consent().versions, "privacy-policy": "unpublished-guess" },
    ]) {
        const host = fixture();
        await assert.rejects(
            host.invoke("record", { accepted: true, versions }),
            { status: 409 },
        );
        assert.equal(host.writes.length, 0);
    }
});

test("status rejects caller supplied identity", async () => {
    const host = fixture();
    await assert.rejects(host.invoke("status", { accountId: "someone-else" }), {
        status: 400,
    });
    assert.equal(host.writes.length, 0);
});

test("raw preparation flow cannot record consent", async () => {
    const host = fixture();
    await host.runtime.flow.run(
        "terms-of-service:prepareOnboardingConsent",
        consent(),
    );
    assert.equal(host.writes.length, 0);
});

test("revocation or provider removal during version reads blocks persistence", async () => {
    const host = fixture();
    host.setBeforeRead(async () => host.disable());
    await assert.rejects(
        host.invoke("record", consent()),
        /onboarding_operation_expired/,
    );
    assert.equal(host.writes.length, 0);
    assert.equal(host.operations.size, 0);
});
