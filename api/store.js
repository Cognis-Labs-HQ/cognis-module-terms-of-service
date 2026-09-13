export const DOCUMENTS = Object.freeze({
    "terms-of-service": "/terms-of-service",
    "privacy-policy": "/privacy-policy",
    eula: "/eula",
});

function documentFromRow(row) {
    if (!row) return null;
    return {
        slug: String(row.slug),
        version: String(row.version),
        markdown: String(row.markdown),
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
                { name: "terms_version", type: "text" },
                { name: "privacy_version", type: "text" },
                { name: "eula_version", type: "text" },
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
            !status.required ||
            status.documents.some(
                (document) => versions[document.slug] !== document.version,
            )
        ) {
            throw new Error("stale_document_versions");
        }
        const consentedAt = new Date().toISOString();
        await this.database.executeCommand({
            option: "UPSERT",
            table: "terms_of_service_consents",
            conflictColumns: ["account_id"],
            values: {
                account_id: accountId,
                terms_version: versions["terms-of-service"] ?? null,
                privacy_version: versions["privacy-policy"] ?? null,
                eula_version: versions.eula ?? null,
                consented_at: consentedAt,
            },
            update: [
                "terms_version",
                "privacy_version",
                "eula_version",
                "consented_at",
            ],
        });
        return { ...status, accepted: true, consentedAt };
    }

    async deleteAll() {
        await this.database.executeCommand({
            option: "DELETE",
            table: "terms_of_service_consents",
        });
        await this.versions.deleteAll();
    }
}
