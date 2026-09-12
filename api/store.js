export const DOCUMENTS = Object.freeze({
    "terms-of-service": "/terms-of-service",
    "privacy-policy": "/privacy-policy",
    eula: "/eula",
});

export class LegalDocumentStore {
    constructor(database) {
        this.database = database;
    }

    async ensureSchema() {
        await this.database.ensureTable({
            name: "terms_of_service_documents",
            columns: [
                { name: "slug", type: "text", primaryKey: true },
                { name: "markdown", type: "text", notNull: true },
                { name: "updated_by", type: "text", notNull: true },
                {
                    name: "updated_at",
                    type: "timestamp",
                    notNull: true,
                    default: "now",
                },
            ],
        });
    }

    async get(slug) {
        const result = await this.database.executeCommand({
            option: "SELECT",
            table: "terms_of_service_documents",
            columns: ["slug", "markdown", "updated_at"],
            where: [{ column: "slug", value: slug }],
        });
        const row = result.rows?.[0];
        return row
            ? {
                  slug: String(row.slug),
                  markdown: String(row.markdown),
                  updatedAt: row.updated_at,
                  path: DOCUMENTS[slug],
              }
            : null;
    }

    async list() {
        const documents = await Promise.all(
            Object.keys(DOCUMENTS).map((slug) => this.get(slug)),
        );
        return Object.keys(DOCUMENTS).map(
            (slug, index) =>
                documents[index] ?? { slug, path: DOCUMENTS[slug] },
        );
    }

    async save(slug, markdown, accountId) {
        await this.database.executeCommand({
            option: "UPSERT",
            table: "terms_of_service_documents",
            conflictColumns: ["slug"],
            values: {
                slug,
                markdown,
                updated_by: accountId,
                updated_at: new Date().toISOString(),
            },
            update: ["markdown", "updated_by", "updated_at"],
        });
        return this.get(slug);
    }

    async deleteAll() {
        await this.database.executeCommand({
            option: "DELETE",
            table: "terms_of_service_documents",
        });
    }
}
