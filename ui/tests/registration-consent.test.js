import assert from "node:assert/strict";
import test from "node:test";
import {
    completeRegistration,
    validateRegistration,
} from "../registration-consent.js";

const values = { termsOfServiceConsent: true };
const status = {
    required: true,
    documents: [{ slug: "eula", version: "current-eula" }],
};

test("registration submits only explicit acceptance through declared operations", async () => {
    const calls = [];
    await completeRegistration({
        values,
        async executeOnboarding(operation, input) {
            calls.push({ operation, input });
            return status;
        },
    });
    assert.deepEqual(calls, [
        { operation: "terms-of-service:consent:status", input: {} },
        {
            operation: "terms-of-service:consent:record",
            input: {
                accepted: true,
                versions: { eula: "current-eula" },
            },
        },
    ]);
});

for (const selection of [undefined, {}, { termsOfServiceConsent: false }]) {
    test(`cancelled or missing checkbox never invokes onboarding ${JSON.stringify(selection)}`, async () => {
        let called = false;
        await assert.rejects(
            completeRegistration({
                values: selection,
                executeOnboarding() {
                    called = true;
                },
            }),
            /consent_required/,
        );
        assert.equal(called, false);
    });
}

test("completion preserves version-change failure and never retries acceptance", async () => {
    let writes = 0;
    const conflict = Object.assign(new Error("stale_document_versions"), {
        status: 409,
    });
    await assert.rejects(
        completeRegistration({
            values,
            async executeOnboarding(operation) {
                if (operation.endsWith(":status")) return status;
                writes += 1;
                throw conflict;
            },
        }),
        conflict,
    );
    assert.equal(writes, 1);
});

test("already current consent does not submit another acceptance", async () => {
    let calls = 0;
    await completeRegistration({
        values,
        executeOnboarding: async () => {
            calls += 1;
            return { required: false, documents: [] };
        },
    });
    assert.equal(calls, 1);
    assert.equal(
        validateRegistration({ values, i18n: { t: (key) => key } }),
        null,
    );
});
