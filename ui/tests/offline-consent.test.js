import test from "node:test";
import assert from "node:assert/strict";
import { createOfflineConsent } from "../offline-consent.js";

function fixture() {
    const values = new Map([["cognis_account", "first"]]);
    const receipts = [];
    const storage = {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        removeItem: (key) => values.delete(key),
    };
    const make = () =>
        createOfflineConsent({
            storage,
            policy: {
                update: (id, status) => receipts.push({ id, ...status }),
            },
        });
    return { make, values, receipts };
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
