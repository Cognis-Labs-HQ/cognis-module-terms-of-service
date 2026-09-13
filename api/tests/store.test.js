import assert from "node:assert/strict";
import test from "node:test";
import { LegalDocumentStore } from "../store.js";

function versionTracker(latestDocuments = []) {
    const calls = [];
    return {
        calls,
        createStore(options) {
            calls.push(["create", options]);
            return {
                async ensureSchema() {
                    calls.push(["schema"]);
                },
                async getLatest() {
                    return latestDocuments.shift() ?? null;
                },
                async publish(document) {
                    calls.push(["publish", document]);
                    return {
                        slug: document.slug,
                        version: "immutable-v1",
                        markdown: document.content,
                        published_at: "2026-09-12",
                    };
                },
                async deleteAll() {
                    calls.push(["deleteAll"]);
                },
            };
        },
    };
}

test("publishing delegates immutable versions to the core tracker", async () => {
    const databaseCalls = [];
    const database = {
        async ensureTable(definition) {
            databaseCalls.push(definition);
        },
    };
    const tracker = versionTracker();
    const store = new LegalDocumentStore(database, tracker);
    await store.ensureSchema();
    const document = await store.publish("eula", "# EULA", "admin-1");

    assert.equal(tracker.calls[0][1].namespace, "terms-of-service");
    assert.equal(tracker.calls[1][0], "schema");
    assert.equal(tracker.calls[2][1].actorId, "admin-1");
    assert.equal(databaseCalls[0].name, "terms_of_service_consents");
    assert.equal(document.version, "immutable-v1");
    assert.equal(document.markdown, "# EULA");
});

test("consent identifies each unacknowledged published document", async () => {
    const tracker = versionTracker([
        { slug: "terms-of-service", version: "terms-v2", markdown: "terms" },
        {
            slug: "privacy-policy",
            version: "privacy-v3",
            markdown: "privacy",
        },
    ]);
    const database = {
        async executeCommand() {
            return {
                rows: [
                    {
                        terms_version: "terms-v1",
                        privacy_version: "privacy-v3",
                    },
                ],
            };
        },
    };
    const status = await new LegalDocumentStore(
        database,
        tracker,
    ).consentStatus("account-1");
    assert.equal(status.required, true);
    assert.equal(status.accepted, false);
    assert.deepEqual(
        status.documents.map(({ slug, accepted }) => ({ slug, accepted })),
        [
            { slug: "terms-of-service", accepted: false },
            { slug: "privacy-policy", accepted: true },
        ],
    );
});

test("recording consent rejects stale versions", async () => {
    const tracker = versionTracker([
        { slug: "terms-of-service", version: "terms-current", markdown: "t" },
        {
            slug: "privacy-policy",
            version: "privacy-current",
            markdown: "p",
        },
    ]);
    const database = {
        async executeCommand() {
            return { rows: [] };
        },
    };
    await assert.rejects(
        new LegalDocumentStore(database, tracker).recordConsent("account-1", {
            "terms-of-service": "terms-old",
            "privacy-policy": "privacy-current",
        }),
        /stale_document_versions/,
    );
});
