import path from "node:path";

const PUBLIC_ROUTES = ["terms-of-service", "privacy-policy", "eula"];

export function registerUi(ctx) {
    const uiReuse = ctx.getCapability("ui:reuse");
    if (!uiReuse?.has?.("markdown:composer")) {
        throw new Error(
            "Terms of Service requires the markdown:composer UI reuse contract.",
        );
    }
    ctx.registerStaticDir("", path.join(ctx.moduleRoot, "ui"));
    ctx.registerAdminSection({
        id: "terms-of-service-legal",
        group: "legal",
        path: "/administration/legal",
        labelKey: "module.terms_of_service.admin.title",
        scriptUrl: "/static/modules/terms-of-service/app.js",
        stylesheets: ["/static/modules/terms-of-service/styles/legal.css"],
        stringsBaseUrl: "/static/modules/terms-of-service/languages",
        access: { minRole: "admin" },
    });
    for (const slug of PUBLIC_ROUTES) {
        ctx.registerSpaRoute({
            id: `terms-of-service-${slug}`,
            pattern: `^/${slug}$`,
            base: `/${slug}`,
            scriptUrl: "/static/modules/terms-of-service/app.js",
            stylesheets: ["/static/modules/terms-of-service/styles/legal.css"],
            access: { public: true },
        });
    }
}
