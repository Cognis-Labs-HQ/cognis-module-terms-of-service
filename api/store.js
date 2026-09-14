export const DOCUMENTS = Object.freeze({
    "terms-of-service": "/terms-of-service",
    "privacy-policy": "/privacy-policy",
    eula: "/eula",
});

const UNPUBLISHED_VERSION = "unpublished";

function documentFromRow(row) {
    if (!row) return null;
    return {
        slug: String(row.slug),
        version: String(row.version),
        markdown: String(row.markdown ?? ""),
        publishedAt: row.published_at,
        path: DOCUMENTS[row.slug],
    };
}

export class LegalDocumentStore {
    constructor(database, versionTracker) {
        this.database = database;
        if (typeof versionTracker?.createStore !== "function") {
            throw new Error(
                "Required capability unavailable: docs:versionStore",
            );
        }
        this.versions = versionTracker.createStore({
            namespace: "terms-of-service",
            database,
            documents: DOCUMENTS,
        });
    }

    async ensureSchema() {
        await this.versions.ensureSchema();
        await this.database.ensureTable({
            name: "terms_of_service_consents",
            columns: [
                { name: "account_id", type: "text", primaryKey: true },
                {
                    name: "terms_version",
                    type: "text",
                    notNull: true,
                    default: UNPUBLISHED_VERSION,
                },
                {
                    name: "privacy_version",
                    type: "text",
                    notNull: true,
                    default: UNPUBLISHED_VERSION,
                },
                {
                    name: "eula_version",
                    type: "text",
                    notNull: true,
                    default: UNPUBLISHED_VERSION,
                },
                {
                    name: "consented_at",
                    type: "timestamp",
                    notNull: true,
                    default: "now",
                },
            ],
        });
    }

    async getLatest(slug) {
        return documentFromRow(await this.versions.getLatest(slug));
    }

    async listLatest() {
        const documents = await Promise.all(
            Object.keys(DOCUMENTS).map((slug) => this.getLatest(slug)),
        );
        return Object.keys(DOCUMENTS).map(
            (slug, index) =>
                documents[index] ?? { slug, path: DOCUMENTS[slug] },
        );
    }

    async publish(slug, markdown, accountId) {
        return documentFromRow(
            await this.versions.publish({
                slug,
                content: markdown,
                actorId: accountId,
            }),
        );
    }

    async consentStatus(accountId) {
        const [documents, result] = await Promise.all([
            this.listLatest(),
            this.database.executeCommand({
                option: "SELECT",
                table: "terms_of_service_consents",
                columns: [
                    "terms_version",
                    "privacy_version",
                    "eula_version",
                    "consented_at",
                ],
                where: [{ column: "account_id", value: accountId }],
            }),
        ]);
        const consent = result.rows?.[0];
        const versionColumns = {
            "terms-of-service": "terms_version",
            "privacy-policy": "privacy_version",
            eula: "eula_version",
        };
        const publishedDocuments = documents
            .filter((document) => document.version)
            .map((document) => ({
                ...document,
                state: consent?.[versionColumns[document.slug]]
                    ? "updated"
                    : "new",
                accepted:
                    consent?.[versionColumns[document.slug]] ===
                    document.version,
            }));
        const required = publishedDocuments.some(
            (document) => !document.accepted,
        );
        return {
            required,
            accepted: publishedDocuments.length > 0 && !required,
            documents: publishedDocuments,
            consentedAt: consent?.consented_at ?? null,
        };
    }

    async recordConsent(accountId, versions) {
        const status = await this.consentStatus(accountId);
        if (
            status.documents.some(
                (document) => !Object.hasOwn(versions, document.slug),
            )
        ) {
            throw new Error("incomplete_consent_versions");
        }
        if (
            !status.required ||
            status.documents.some(
                (document) => versions[document.slug] !== document.version,
            )
        ) {
            throw new Error("stale_document_versions");
        }
        const consentedAt = new Date().toISOString();
        const values = {
            account_id: accountId,
            terms_version: versions["terms-of-service"] ?? UNPUBLISHED_VERSION,
            privacy_version: versions["privacy-policy"] ?? UNPUBLISHED_VERSION,
            eula_version: versions.eula ?? UNPUBLISHED_VERSION,
            consented_at: consentedAt,
        };
        await this.database.executeCommand({
            option: "INSERT",
            table: "terms_of_service_consents",
            values,
            conflict: {
                action: "update",
                target: ["account_id"],
                update: {
                    terms_version: values.terms_version,
                    privacy_version: values.privacy_version,
                    eula_version: values.eula_version,
                    consented_at: values.consented_at,
                },
            },
        });
        return this.consentStatus(accountId);
    }

    async listConsentForDocument(slug) {
        const versionColumns = {
            "terms-of-service": "terms_version",
            "privacy-policy": "privacy_version",
            eula: "eula_version",
        };
        const versionColumn = versionColumns[slug];
        if (!versionColumn) throw new Error("invalid_document_slug");
        const result = await this.database.executeCommand({
            option: "SELECT",
            table: "terms_of_service_consents",
            columns: ["account_id", versionColumn, "consented_at"],
        });
        return (result.rows ?? []).map((row) => ({
            accountId: String(row.account_id),
            version: row[versionColumn] ? String(row[versionColumn]) : null,
            consentedAt: row.consented_at ?? null,
        }));
    }

    async deleteAll() {
        await this.database.executeCommand({
            option: "DELETE",
            table: "terms_of_service_consents",
        });
        await this.versions.deleteAll();
    }
}
