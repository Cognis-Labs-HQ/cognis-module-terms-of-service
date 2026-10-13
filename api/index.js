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
                validate: validateDocument,
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
