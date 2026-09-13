export function registerCommands({ register, apiGet }) {
    register(
        "terms-of-service:documents",
        async ({ apiBaseUrl, getApiToken }) =>
            apiGet(
                apiBaseUrl,
                "/api/v1/modules/terms-of-service/documents",
                await getApiToken(),
            ),
        {
            usage: "cognisctl terms-of-service:documents",
            description: "List the current legal document versions.",
        },
    );

    register(
        "terms-of-service:consent",
        async ({ apiBaseUrl, getApiToken }) =>
            apiGet(
                apiBaseUrl,
                "/api/v1/modules/terms-of-service/consent",
                await getApiToken(),
            ),
        {
            usage: "cognisctl terms-of-service:consent",
            description: "Show consent status for the authenticated account.",
        },
    );
}
