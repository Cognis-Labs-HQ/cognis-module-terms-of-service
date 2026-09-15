import { importReuseModule, uiCtx } from "./reuse/resources.js";

const { createI18n } = await importReuseModule("i18n.js");

const DOCUMENTS = [
    { slug: "terms-of-service", titleKey: "terms" },
    { slug: "privacy-policy", titleKey: "privacy" },
    { slug: "eula", titleKey: "eula" },
];
const footerLinks = uiCtx.capabilities.get("ui:footerLinks");

if (typeof footerLinks?.add === "function") {
    footerLinks.remove?.("core:changelogs");
    const i18n = await createI18n({
        componentStringBaseUrls: ["/static/modules/terms-of-service/languages"],
    });
    DOCUMENTS.forEach((document) => {
        const linkId = `terms-of-service:${document.slug}`;
        if (footerLinks.list?.().some((link) => link.id === linkId)) return;
        footerLinks.add({
            id: linkId,
            side: "right",
            href: `/${document.slug}`,
            label: i18n.t(
                `module.terms_of_service.document.${document.titleKey}`,
            ),
        });
    });
}
