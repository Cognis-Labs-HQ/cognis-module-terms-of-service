import { readJson, sendJson } from "./reuse/http.js";
import { DOCUMENTS, LegalDocumentStore } from "./store.js";

const MAX_MARKDOWN_BYTES = 1_000_000;

function accountId(claims) {
    return String(claims?.sub ?? "").trim();
}

export function consentFailure(error) {
    const status =
        error.message === "invalid_json" ||
        error.message === "invalid_consent_versions" ||
        error.message === "incomplete_consent_versions"
            ? 400
            : error.message === "request_too_large"
              ? 413
              : error.message === "stale_document_versions"
                ? 409
                : 500;
    return {
        status,
        payload: {
            error: {
                code: status < 500 ? error.message : "internal_error",
                message:
                    status === 409
                        ? "The legal documents changed; review them again."
                        : status < 500
                          ? "The consent request is invalid."
                          : "Consent could not be recorded.",
            },
        },
    };
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
            const claims = await requireAuth(request, response, "admin");
            if (!claims || response.writableEnded) return;
            await ready;
            sendJson(response, 200, { data: await store.listLatest() });
        },
        { access: { minRole: "admin" } },
    );

    for (const slug of Object.keys(DOCUMENTS)) {
        router.get(
            `/api/v1/modules/terms-of-service/consent-report/${slug}`,
            async (request, response) => {
                const claims = await requireAuth(request, response, "admin");
                if (!claims || response.writableEnded) return;
                await ready;
                sendJson(response, 200, {
                    data: await store.listConsentForDocument(slug),
                });
            },
            { access: { minRole: "admin" } },
        );
    }

    for (const slug of Object.keys(DOCUMENTS)) {
        router.put(
            `/api/v1/modules/terms-of-service/documents/${slug}`,
            async (request, response) => {
                const claims = await requireAuth(request, response, "admin");
                if (!claims || response.writableEnded) return;
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
                        accountId(claims),
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
                            code: invalidRequest
                                ? error.message
                                : "internal_error",
                            message: invalidRequest
                                ? "The request body is invalid."
                                : "The legal document could not be published.",
                        },
                    });
                }
            },
            { access: { minRole: "admin" } },
        );
    }

    for (const slug of Object.keys(DOCUMENTS)) {
        router.get(
            `/api/v1/modules/terms-of-service/public/${slug}`,
            async (_request, response) => {
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
        );
    }

    router.get(
        "/api/v1/modules/terms-of-service/consent",
        async (request, response) => {
            const claims = await requireAuth(request, response, "user");
            if (!claims || response.writableEnded) return;
            await ready;
            sendJson(response, 200, {
                data: await store.consentStatus(accountId(claims)),
            });
        },
        { access: { minRole: "user" } },
    );

    router.post(
        "/api/v1/modules/terms-of-service/consent",
        async (request, response) => {
            const claims = await requireAuth(request, response, "user");
            if (!claims || response.writableEnded) return;
            try {
                const body = await readJson(request);
                const versions = body.versions;
                if (
                    !versions ||
                    typeof versions !== "object" ||
                    Array.isArray(versions) ||
                    Object.keys(versions).some(
                        (slug) =>
                            !DOCUMENTS.some(
                                (document) => document.slug === slug,
                            ) || typeof versions[slug] !== "string",
                    ) ||
                    body.accepted !== true
                ) {
                    throw new Error("invalid_consent_versions");
                }
                await ready;
                const status = await store.recordConsent(
                    accountId(claims),
                    versions,
                );
                ctx.log?.("info", "Legal consent recorded.", {
                    component: "terms-of-service",
                    operation: "recordConsent",
                    accountId: accountId(claims),
                    documentSlugs: Object.keys(versions),
                });
                sendJson(response, 201, { data: status });
            } catch (error) {
                const failure = consentFailure(error);
                ctx.log?.("error", "Legal consent recording failed.", {
                    component: "terms-of-service",
                    operation: "recordConsent",
                    accountId: accountId(claims),
                    error: error.message,
                });
                sendJson(response, failure.status, failure.payload);
            }
        },
        { access: { minRole: "user" } },
    );
}
