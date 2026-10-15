import { importReuseModule } from "./reuse/resources.js";

const [{ apiFetch }, { createI18n }] = await Promise.all([
    importReuseModule("api-client.js"),
    importReuseModule("i18n.js"),
]);

const DOCUMENTS = [
    { slug: "terms-of-service", titleKey: "terms" },
    { slug: "privacy-policy", titleKey: "privacy" },
    { slug: "eula", titleKey: "eula" },
];

export async function listAuthFooterLinks() {
    const i18n = await createI18n({
        componentStringBaseUrls: ["/static/modules/terms-of-service/languages"],
    });
    const response = await apiFetch("/api/v1/modules/terms-of-service/public", {
        suppressAccessDeniedEvent: true,
    });
    if (!response.ok) throw new Error("public_documents_unavailable");
    const publishedSlugs = new Set(
        (await response.json()).data.map((document) => document.slug),
    );
    return DOCUMENTS.filter((document) =>
        publishedSlugs.has(document.slug),
    ).map((document) => ({
        id: document.slug,
        side: "right",
        href: `/${document.slug}`,
        label: i18n.t(`module.terms-of-service.document.${document.titleKey}`),
        target: "_blank",
    }));
}
