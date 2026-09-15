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
    const publicationResults = await Promise.allSettled(
        DOCUMENTS.map(async (document) => {
            const response = await apiFetch(
                `/api/v1/modules/terms-of-service/public/${document.slug}`,
                { suppressAccessDeniedEvent: true },
            );
            if (response.status === 404) return;
            if (!response.ok) throw new Error("public_document_unavailable");
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
        }),
    );
    publicationResults.forEach((result, index) => {
        if (result.status !== "rejected") return;
        uiCtx.capabilities.get("ui:log")?.(
            "error",
            "Authentication footer legal link loading failed.",
            {
                component: "terms-of-service",
                operation: "loadAuthFooterLink",
                slug: DOCUMENTS[index].slug,
                error:
                    result.reason instanceof Error
                        ? result.reason.message
                        : String(result.reason),
            },
        );
    });
}
