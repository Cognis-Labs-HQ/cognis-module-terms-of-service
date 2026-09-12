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
    const versionTracker = ctx.getCapability("docs:versionStore");
    if (
        !database ||
        typeof requireAuth !== "function" ||
        typeof versionTracker?.createStore !== "function"
    ) {
        throw new Error(
            "Terms of Service requires db:executor, auth:requireAuth, and docs:versionStore.",
        );
    }
    const store = new LegalDocumentStore(database, versionTracker);
    const ready = store.ensureSchema();

    router.get(
        "/api/v1/modules/terms-of-service/documents",
        async (request, response) => {
            await requireAuth(request, response, "admin");
            if (response.writableEnded) return;
            await ready;
            sendJson(response, 200, { data: await store.listLatest() });
        },
        { access: { minRole: "admin" } },
    );

    router.put(
        "/api/v1/modules/terms-of-service/documents/:slug",
        async (request, response) => {
            await requireAuth(request, response, "admin");
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
                const document = await store.publish(
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
            const document = await store.getLatest(slug);
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

    router.get(
        "/api/v1/modules/terms-of-service/consent",
        async (request, response) => {
            await requireAuth(request, response, "user");
            if (response.writableEnded) return;
            await ready;
            sendJson(response, 200, {
                data: await store.consentStatus(accountId(request)),
            });
        },
        { access: { minRole: "user" } },
    );

    router.post(
        "/api/v1/modules/terms-of-service/consent",
        async (request, response) => {
            await requireAuth(request, response, "user");
            if (response.writableEnded) return;
            try {
                const body = await readJson(request);
                const termsVersion = String(body.termsVersion ?? "").trim();
                const privacyVersion = String(body.privacyVersion ?? "").trim();
                if (
                    !termsVersion ||
                    !privacyVersion ||
                    body.accepted !== true
                ) {
                    sendJson(response, 400, {
                        error: {
                            code: "consent_required",
                            message:
                                "Current legal documents must be accepted.",
                        },
                    });
                    return;
                }
                await ready;
                const status = await store.recordConsent(
                    accountId(request),
                    termsVersion,
                    privacyVersion,
                );
                ctx.log?.("info", "Legal consent recorded.", {
                    component: "terms-of-service",
                    operation: "recordConsent",
                    accountId: accountId(request),
                    termsVersion,
                    privacyVersion,
                });
                sendJson(response, 201, { data: status });
            } catch (error) {
                const clientError = [
                    "invalid_json",
                    "request_too_large",
                    "stale_document_versions",
                ].includes(error.message);
                ctx.log?.("error", "Legal consent recording failed.", {
                    component: "terms-of-service",
                    operation: "recordConsent",
                    accountId: accountId(request),
                    error: error.message,
                });
                sendJson(response, clientError ? 409 : 500, {
                    error: {
                        code: clientError ? error.message : "internal_error",
                        message: clientError
                            ? "The legal documents changed; review them again."
                            : "Consent could not be recorded.",
                    },
                });
            }
        },
        { access: { minRole: "user" } },
    );
}
