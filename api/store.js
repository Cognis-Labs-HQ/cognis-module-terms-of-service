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
        markdown: String(row.content),
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
                { name: "terms_version", type: "text", notNull: true },
                { name: "privacy_version", type: "text", notNull: true },
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
        const [terms, privacy, result] = await Promise.all([
            this.getLatest("terms-of-service"),
            this.getLatest("privacy-policy"),
            this.database.executeCommand({
                option: "SELECT",
                table: "terms_of_service_consents",
                columns: ["terms_version", "privacy_version", "consented_at"],
                where: [{ column: "account_id", value: accountId }],
            }),
        ]);
        const consent = result.rows?.[0];
        const ready = Boolean(terms?.version && privacy?.version);
        return {
            required: ready,
            accepted:
                ready &&
                consent?.terms_version === terms.version &&
                consent?.privacy_version === privacy.version,
            termsVersion: terms?.version ?? null,
            privacyVersion: privacy?.version ?? null,
            consentedAt: consent?.consented_at ?? null,
        };
    }

    async recordConsent(accountId, termsVersion, privacyVersion) {
        const status = await this.consentStatus(accountId);
        if (
            !status.required ||
            status.termsVersion !== termsVersion ||
            status.privacyVersion !== privacyVersion
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
                terms_version: termsVersion,
                privacy_version: privacyVersion,
                consented_at: consentedAt,
            },
            update: ["terms_version", "privacy_version", "consented_at"],
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
