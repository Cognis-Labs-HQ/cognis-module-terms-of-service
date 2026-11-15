import { registerOnboarding } from "./api/consent/onboarding.js";
import { registerApi } from "./api/index.js";
import { LegalDocumentStore } from "./api/store.js";
import { registerUi } from "./api/ui.js";

export async function uninstallModule(ctx, { deleteContent }) {
    if (!deleteContent) return;

    const store = new LegalDocumentStore(
        ctx.getCapability("db:executor"),
        ctx.getCapability("docs:versionStore"),
    );
    await store.ensureSchema();
    await store.deleteAll();
    ctx.log?.("info", "Legal documents deleted during uninstall.", {
        component: "terms-of-service",
        operation: "uninstallCleanup",
        deleteContent,
    });
}

export function bootstrapModule(ctx) {
    const onboarding = ctx.getCapability("auth:onboarding");
    if (typeof onboarding?.registerOperation !== "function")
        throw new Error("Required capability unavailable: auth:onboarding");
    registerUi(ctx);
    const { store, ready } = registerApi(ctx.router, ctx);
    registerOnboarding(ctx, onboarding, store, ready);
    if (ctx.flow.exists("constructRegistrationUi")) {
        ctx.flow.extend(
            "constructRegistrationUi",
            "compose-form",
            { id: "terms-of-service:add-consent" },
            () => ({
                integrations: [
                    {
                        id: "terms-of-service-consent",
                        onboardingOperations: [
                            "terms-of-service:consent:status",
                            "terms-of-service:consent:record",
                        ],
                        scriptUrl:
                            "/static/modules/terms-of-service/registration-consent.js",
                        stringsBaseUrl:
                            "/static/modules/terms-of-service/languages",
                    },
                ],
            }),
        );
    }
    ctx.log?.("info", "Terms of Service module enabled.", {
        component: "terms-of-service",
        operation: "bootstrap",
    });
}
