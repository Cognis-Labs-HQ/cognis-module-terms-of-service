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
    assert.deepEqual(
        databaseCalls[0].columns
            .filter(({ name }) => name.endsWith("_version"))
            .map(({ name, notNull, default: defaultValue }) => ({
                name,
                notNull,
                default: defaultValue,
            })),
        [
            {
                name: "terms_version",
                notNull: true,
                default: "unpublished",
            },
            {
                name: "privacy_version",
                notNull: true,
                default: "unpublished",
            },
            {
                name: "eula_version",
                notNull: true,
                default: "unpublished",
            },
        ],
    );
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
                        terms_version: "unpublished",
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
        status.documents.map(({ slug, state, accepted }) => ({
            slug,
            state,
            accepted,
        })),
        [
            { slug: "terms-of-service", state: "new", accepted: false },
            { slug: "privacy-policy", state: "updated", accepted: true },
        ],
    );
});

test("recording consent rejects stale versions", async () => {
    const tracker = versionTracker([
        {
            slug: "terms-of-service",
            version: "terms-current",
            markdown: "t",
        },
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

test("recording consent rejects an incomplete published version set", async () => {
    const tracker = versionTracker([
        {
            slug: "terms-of-service",
            version: "terms-current",
            markdown: "t",
        },
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
            "terms-of-service": "terms-current",
        }),
        /incomplete_consent_versions/,
    );
});

test("recording consent persists every accepted document version", async () => {
    const documents = [
        { slug: "terms-of-service", version: "terms-v2", markdown: "terms" },
        {
            slug: "privacy-policy",
            version: "privacy-v3",
            markdown: "privacy",
        },
    ];
    const tracker = {
        createStore() {
            return {
                async getLatest(slug) {
                    return (
                        documents.find((document) => document.slug === slug) ??
                        null
                    );
                },
            };
        },
    };
    let consent;
    let writeCommand;
    const database = {
        async executeCommand(command) {
            if (command.option === "INSERT") {
                writeCommand = command;
                consent = command.values;
                return { rows: [] };
            }
            return { rows: consent ? [consent] : [] };
        },
    };
    const status = await new LegalDocumentStore(
        database,
        tracker,
    ).recordConsent("account-1", {
        "terms-of-service": "terms-v2",
        "privacy-policy": "privacy-v3",
    });

    assert.equal(consent.account_id, "account-1");
    assert.equal(consent.terms_version, "terms-v2");
    assert.equal(consent.privacy_version, "privacy-v3");
    assert.equal(writeCommand.conflict.action, "update");
    assert.deepEqual(writeCommand.conflict.target, ["account_id"]);
    assert.equal(writeCommand.conflict.update.terms_version, "terms-v2");
    assert.equal(status.required, false);
    assert.equal(status.accepted, true);
});

test("consent reports expose the selected document version per account", async () => {
    const database = {
        async executeCommand(command) {
            assert.deepEqual(command.columns, [
                "account_id",
                "privacy_version",
                "consented_at",
            ]);
            return {
                rows: [
                    {
                        account_id: "account-1",
                        privacy_version: "privacy-v3",
                        consented_at: "2026-09-13T00:00:00Z",
                    },
                    {
                        account_id: "account-2",
                        privacy_version: "unpublished",
                        consented_at: "2026-09-12T00:00:00Z",
                    },
                ],
            };
        },
    };
    const report = await new LegalDocumentStore(
        database,
        versionTracker(),
    ).listConsentForDocument("privacy-policy");
    assert.deepEqual(report, [
        {
            accountId: "account-1",
            version: "privacy-v3",
            consentedAt: "2026-09-13T00:00:00Z",
        },
        {
            accountId: "account-2",
            version: null,
            consentedAt: "2026-09-12T00:00:00Z",
        },
    ]);
});

test("recording one published document supplies every non-null version column", async () => {
    const document = {
        slug: "terms-of-service",
        version: "terms-v1",
        markdown: "terms",
    };
    const tracker = {
        createStore() {
            return {
                async getLatest(slug) {
                    return slug === document.slug ? document : null;
                },
            };
        },
    };
    let consent;
    const database = {
        async executeCommand(command) {
            if (command.option === "INSERT") {
                consent = command.values;
                return { rows: [] };
            }
            return { rows: consent ? [consent] : [] };
        },
    };
    const status = await new LegalDocumentStore(
        database,
        tracker,
    ).recordConsent("account-1", {
        "terms-of-service": "terms-v1",
    });

    assert.equal(consent.terms_version, "terms-v1");
    assert.equal(consent.privacy_version, "unpublished");
    assert.equal(consent.eula_version, "unpublished");
    assert.equal(status.required, false);
    assert.equal(status.accepted, true);
});
