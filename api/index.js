import { readJson, sendJson } from "./reuse/http.js";
import { DOCUMENTS, LegalDocumentStore } from "./store.js";

const MAX_MARKDOWN_BYTES = 1_000_000;

function accountId(request) {
    return String(request.auth?.accountId ?? request.auth?.sub ?? "").trim();
}

function isKnownSlug(slug) {
    return Object.hasOwn(DOCUMENTS, slug);
}

export function registerApi(router, ctx) {
    const database = ctx.getCapability("db:executor");
    const requireAuth = ctx.getCapability("auth:requireAuth");
    if (!database || typeof requireAuth !== "function") {
        throw new Error(
            "Terms of Service requires db:executor and auth:requireAuth.",
        );
    }
    const store = new LegalDocumentStore(database);
    const ready = store.ensureSchema();

    router.get(
        "/api/v1/modules/terms-of-service/documents",
        async (request, response) => {
            await requireAuth(request, response, { minRole: "admin" });
            if (response.writableEnded) return;
            await ready;
            sendJson(response, 200, { data: await store.list() });
        },
        { access: { minRole: "admin" } },
    );

    router.put(
        "/api/v1/modules/terms-of-service/documents/:slug",
        async (request, response) => {
            await requireAuth(request, response, { minRole: "admin" });
            if (response.writableEnded) return;
            const slug = String(request.params?.slug ?? "");
            if (!isKnownSlug(slug)) {
                sendJson(response, 404, {
                    error: {
                        code: "unknown_document",
                        message: "Unknown legal document.",
                    },
                });
                return;
            }
            try {
                const body = await readJson(request, {
                    maxBytes: MAX_MARKDOWN_BYTES,
                });
                if (
                    typeof body.markdown !== "string" ||
                    !body.markdown.trim()
                ) {
                    sendJson(response, 400, {
                        error: {
                            code: "invalid_markdown",
                            message: "Markdown content is required.",
                        },
                    });
                    return;
                }
                await ready;
                const document = await store.save(
                    slug,
                    body.markdown,
                    accountId(request),
                );
                ctx.log?.("info", "Legal document published.", {
                    component: "terms-of-service",
                    operation: "publishDocument",
                    slug,
                });
                sendJson(response, 200, { data: document });
            } catch (error) {
                const invalidRequest = [
                    "invalid_json",
                    "request_too_large",
                ].includes(error.message);
                ctx.log?.("error", "Legal document publication failed.", {
                    component: "terms-of-service",
                    operation: "publishDocument",
                    slug,
                    error: error.message,
                });
                sendJson(response, invalidRequest ? 400 : 500, {
                    error: {
                        code: invalidRequest ? error.message : "internal_error",
                        message: invalidRequest
                            ? "The request body is invalid."
                            : "The legal document could not be published.",
                    },
                });
            }
        },
        { access: { minRole: "admin" } },
    );

    router.get(
        "/api/v1/modules/terms-of-service/public/:slug",
        async (request, response) => {
            const slug = String(request.params?.slug ?? "");
            if (!isKnownSlug(slug)) {
                sendJson(response, 404, {
                    error: {
                        code: "unknown_document",
                        message: "Unknown legal document.",
                    },
                });
                return;
            }
            await ready;
            const document = await store.get(slug);
            if (!document) {
                sendJson(response, 404, {
                    error: {
                        code: "not_published",
                        message: "This document is not published.",
                    },
                });
                return;
            }
            sendJson(response, 200, { data: document });
        },
        { access: { public: true } },
    );
}
