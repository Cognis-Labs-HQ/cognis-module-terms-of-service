import { createActionService } from "./reuse/action-flows.js";
import { DOCUMENTS, LegalDocumentStore } from "./store.js";
import { registerDocumentRoutes } from "./routes/documents/index.js";

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

    const authenticateAction = async (input, role, action) => {
        const [request, response] = input;
        const claims =
            typeof request === "object" &&
            request !== null &&
            typeof response === "object" &&
            response !== null
                ? await requireAuth(request, response, role)
                : null;
        const accountId = String(claims?.sub ?? "").trim();
        if (!accountId || response?.writableEnded) {
            ctx.log?.("error", "Legal action authorization failed.", {
                component: "terms-of-service",
                operation: action,
                requiredRole: role,
            });
            throw new Error("authorization_required");
        }
        return accountId;
    };

    const validateAccount = ([accountId]) => {
        if (typeof accountId !== "string" || !accountId.trim())
            throw new Error("invalid_account");
    };
    const validateDocument = ([slug]) => {
        if (!Object.hasOwn(DOCUMENTS, slug))
            throw new Error("invalid_document");
    };
    const service = createActionService(
        ctx,
        "terms-of-service",
        {
            listLatest: { execute: () => store.listLatest() },
            getLatest: {
                validate: validateDocument,
                execute: (slug) => store.getLatest(slug),
            },
            publish: {
                authorize: async (input) => [
                    input[2],
                    input[3],
                    await authenticateAction(input, "admin", "publish"),
                ],
                validate: (input) => {
                    validateDocument(input);
                    if (
                        typeof input[1] !== "string" ||
                        !input[1].trim() ||
                        Buffer.byteLength(input[1], "utf8") > 1_000_000
                    )
                        throw new Error("invalid_markdown");
                },
                execute: (...args) => store.publish(...args),
            },
            listConsentForDocument: {
                validate: validateDocument,
                execute: (slug) => store.listConsentForDocument(slug),
            },
            consentDiff: {
                validate: validateAccount,
                execute: (...args) => store.consentDiff(...args),
            },
            consentStatus: {
                validate: validateAccount,
                execute: (accountId) => store.consentStatus(accountId),
            },
            recordConsent: {
                authorize: async (input) => [
                    await authenticateAction(input, "user", "recordConsent"),
                    input[2],
                ],
                validate: validateAccount,
                execute: (...args) => store.recordConsent(...args),
            },
        },
        ready,
    );
    registerDocumentRoutes(router, {
        requireAuth,
        service,
        ready,
        log: ctx.log,
    });
}
