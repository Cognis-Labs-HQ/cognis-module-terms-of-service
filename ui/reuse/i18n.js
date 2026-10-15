import { importReuseModule, uiCtx } from "./resources.js";

const { createI18n, extendI18n } = await importReuseModule("i18n.js");
const componentStringBaseUrls = ["/static/modules/terms-of-service/languages"];

export async function createLegalI18n() {
    const primary = await createI18n({ componentStringBaseUrls });
    let fallback;
    const titleKeys = ["terms", "privacy", "eula"].map(
        (title) => `module.terms-of-service.document.${title}`,
    );
    if (primary.locale !== "en" || titleKeys.some((key) => !primary.t(key))) {
        fallback = await extendI18n(
            { locale: "en", t: () => "" },
            componentStringBaseUrls,
        );
    }
    const missingKeys = new Set();
    return {
        locale: primary.locale,
        t(key) {
            const translated = primary.t(key);
            if (translated) return translated;
            if (!missingKeys.has(key)) {
                missingKeys.add(key);
                uiCtx.capabilities.get("ui:log")?.(
                    "error",
                    "Legal translation unavailable in the selected locale.",
                    {
                        component: "terms-of-service",
                        operation: "translateLegalContent",
                        locale: primary.locale,
                        key,
                    },
                );
            }
            return fallback?.t(key) ?? "";
        },
    };
}
