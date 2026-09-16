import { importReuseModule, uiCtx } from "./reuse/resources.js";

const [{ apiFetch }, { createI18n }] = await Promise.all([
    importReuseModule("api-client.js"),
    importReuseModule("i18n.js"),
]);

const DOCUMENTS = [
    { slug: "terms-of-service", titleKey: "terms" },
    { slug: "privacy-policy", titleKey: "privacy" },
    { slug: "eula", titleKey: "eula" },
];
const footerLinks = uiCtx.capabilities.get("ui:footerLinks");
const linkDisposers = [];
let removedChangelogLink;

export function teardownAuthFooterPlugin() {
    linkDisposers.splice(0).forEach((dispose) => dispose());
    if (
        removedChangelogLink &&
        !footerLinks
            .list?.()
            .some((link) => link.id === removedChangelogLink.id)
    ) {
        footerLinks.add(removedChangelogLink);
    }
    removedChangelogLink = undefined;
}

if (typeof footerLinks?.add === "function") {
    removedChangelogLink = footerLinks
        .list?.()
        .find((link) => link.id === "core:changelogs");
    footerLinks.remove?.("core:changelogs");
    const i18n = await createI18n({
        componentStringBaseUrls: ["/static/modules/terms-of-service/languages"],
    });
    try {
        const response = await apiFetch(
            "/api/v1/modules/terms-of-service/public",
            { suppressAccessDeniedEvent: true },
        );
        if (!response.ok) throw new Error("public_documents_unavailable");
        const publishedSlugs = new Set(
            (await response.json()).data.map((document) => document.slug),
        );
        DOCUMENTS.filter((document) =>
            publishedSlugs.has(document.slug),
        ).forEach((document) => {
            const linkId = `terms-of-service:${document.slug}`;
            if (footerLinks.list?.().some((link) => link.id === linkId)) return;
            linkDisposers.push(
                footerLinks.add({
                    id: linkId,
                    side: "right",
                    href: `/${document.slug}`,
                    label: i18n.t(
                        `module.terms_of_service.document.${document.titleKey}`,
                    ),
                }),
            );
        });
    } catch (error) {
        uiCtx.capabilities.get("ui:log")?.(
            "error",
            "Authentication footer legal links loading failed.",
            {
                component: "terms-of-service",
                operation: "loadAuthFooterLinks",
                error: error instanceof Error ? error.message : String(error),
            },
        );
    }
}
