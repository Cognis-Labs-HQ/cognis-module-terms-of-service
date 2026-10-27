import test from "node:test";
import assert from "node:assert/strict";
import { createOfflineConsent } from "../offline-consent.js";

function fixture() {
    const values = new Map([["cognis_account", "first"]]);
    const receipts = [];
    const logs = [];
    const storage = {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        removeItem: (key) => values.delete(key),
    };
    const make = () =>
        createOfflineConsent({
            storage,
            log: (...args) => logs.push(args),
            policy: {
                update: (id, status) => receipts.push({ id, ...status }),
            },
        });
    return { make, values, receipts, storage, logs };
}
function status(version, accepted = true) {
    return {
        required: !accepted,
        accepted,
        documents: [
            {
                slug: "terms-of-service",
                version,
                consentedVersion: accepted ? version : "v1",
                accepted,
                markdown: `# ${version}`,
                publishedAt:
                    version === "v1"
                        ? "2026-10-23T00:00:00Z"
                        : "2026-10-24T00:00:00Z",
            },
        ],
    };
}

test("unknown or unaccepted cached terms deny offline access; server-confirmed current consent permits it", () => {
    const state = fixture();
    const consent = state.make();
    consent.restore();
    assert.equal(state.receipts.at(-1).allowed, false);
    consent.record(status("v1"));
    assert.equal(consent.allowed(), true);
    consent.observe({
        slug: "terms-of-service",
        version: "v1",
        markdown: "# Cached public text",
    });
    assert.equal(consent.allowed(), true);
    assert.equal(consent.load().documents[0].markdown, "# Cached public text");
    assert.equal(
        state.make().restore().documents[0].markdown,
        "# Cached public text",
    );
    consent.record(status("v2", false));
    assert.equal(consent.allowed(), false);
    assert.equal(state.receipts.at(-1).allowed, false);
    assert.equal(state.make().restore().documents[0].version, "v2");
    assert.equal(state.receipts.at(-1).allowed, false);
    consent.record(status("v2"));
    assert.equal(state.receipts.at(-1).allowed, true);
});

test("publicly fetched newer terms invalidate consent and older in-flight responses cannot restore it", () => {
    const state = fixture();
    const consent = state.make();
    consent.record(status("v1"));
    consent.observe(status("v2", false).documents[0]);
    assert.equal(consent.allowed(), false);
    consent.record(status("v1"));
    assert.equal(consent.allowed(), false);
    assert.equal(consent.load().documents[0].version, "v2");
    state.values.set("cognis_account", "second");
    assert.equal(consent.allowed(), false);
    assert.equal(consent.load(), null);
});

test("an unusable snapshot invalidates the prior cached permission", () => {
    const state = fixture();
    const consent = state.make();
    consent.record(status("v1"));
    assert.throws(() => consent.record({}), /invalid_consent_snapshot/);
    assert.equal(consent.allowed(), false);
    assert.equal(state.receipts.at(-1).allowed, false);
});

test("a newly observed document survives an older response that omits its slug", () => {
    const state = fixture();
    const consent = state.make();
    consent.record(status("v1"));
    const eula = { ...status("v2", false).documents[0], slug: "eula" };
    consent.observe(eula);
    const stale = consent.record(status("v1"));
    assert.equal(stale.required, true);
    assert.equal(stale.accepted, false);
    assert.equal(consent.allowed(), false);
    assert.deepEqual(
        stale.documents.map(({ slug }) => slug),
        ["terms-of-service", "eula"],
    );
    assert.equal(state.make().restore().documents[1].accepted, false);
    assert.equal(state.receipts.at(-1).allowed, false);
    consent.record({
        required: false,
        accepted: true,
        documents: [
            ...status("v1").documents,
            { ...eula, accepted: true, consentedVersion: eula.version },
        ],
    });
    assert.equal(consent.allowed(), true);
});

test("oversized snapshots keep fresh online status while denying offline restoration", () => {
    const state = fixture();
    const consent = state.make();
    consent.record(status("v1"));
    const fresh = status("v2", false);
    fresh.documents[0].markdown = "x".repeat(500001);
    const result = consent.record(fresh);
    assert.equal(result.required, true);
    assert.equal(result.documents[0].markdown, fresh.documents[0].markdown);
    assert.equal(consent.load(), null);
    assert.equal(state.make().restore(), null);
    assert.equal(state.receipts.at(-1).allowed, false);
    assert.equal(state.logs.at(-1)[2].operation, "writeOfflineConsent");
    assert.doesNotThrow(() => state.make().observe(fresh.documents[0]));
    const stale = state.make().record(status("v1"));
    assert.equal(stale.documents[0].version, "v2");
    assert.equal(stale.required, true);
});

test("unwritable storage preserves online acceptance but cannot reuse stale permission", () => {
    const state = fixture();
    const consent = state.make();
    consent.record(status("v1"));
    const setItem = state.storage.setItem;
    const removeItem = state.storage.removeItem;
    state.storage.setItem = () => {
        throw new Error("quota_exceeded");
    };
    state.storage.removeItem = () => {
        throw new Error("storage_unavailable");
    };
    const result = consent.record(status("v2", false));
    assert.equal(result.required, true);
    assert.equal(consent.allowed(), false);
    assert.equal(state.make().restore(), null);
    assert.equal(state.receipts.at(-1).allowed, false);
    const accepted = consent.record(status("v2"));
    assert.equal(accepted.accepted, true);
    assert.equal(accepted.required, false);
    assert.equal(consent.allowed(), false);
    assert.equal(state.receipts.at(-1).allowed, false);
    assert.ok(
        state.logs.some(
            ([, , meta]) => meta.operation === "removeOfflineConsent",
        ),
    );
    state.storage.setItem = setItem;
    state.storage.removeItem = removeItem;
    consent.record(status("v2"));
    assert.equal(consent.allowed(), true);
    state.values.set("cognis_account", "second");
    assert.equal(consent.load(), null);
});

test("unreadable account storage does not block a fresh online status", () => {
    const state = fixture();
    state.storage.getItem = () => {
        throw new Error("storage_unavailable");
    };
    const consent = state.make();
    assert.equal(consent.record(status("v2", false)).required, true);
    assert.equal(consent.load(), null);
    assert.equal(state.receipts.at(-1).allowed, false);
});
