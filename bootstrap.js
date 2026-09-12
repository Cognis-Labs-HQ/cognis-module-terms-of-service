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
    registerUi(ctx);
    registerApi(ctx.router, ctx);
    if (ctx.flow.exists("construct-registration-ui")) {
        ctx.flow.extend(
            "construct-registration-ui",
            "compose-form",
            { id: "terms-of-service:add-consent" },
            () => ({
                integrations: [
                    {
                        id: "terms-of-service-consent",
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
