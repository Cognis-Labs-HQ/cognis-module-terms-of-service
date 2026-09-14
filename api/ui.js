import path from "node:path";

const PUBLIC_ROUTES = ["terms-of-service", "privacy-policy", "eula"];

export function registerUi(ctx) {
    ctx.registerStaticDir("", path.join(ctx.moduleRoot, "ui"));
    ctx.registerAdminSection({
        id: "terms-of-service-legal",
        label: "module.terms_of_service.admin.title",
        scriptUrl: "/static/modules/terms-of-service/app.js",
        stylesheets: ["/static/modules/terms-of-service/styles/legal.css"],
        stringsBaseUrl: "/static/modules/terms-of-service/languages",
        access: { minRole: "admin" },
    });
    ctx.registerNavbarPlugin({
        scriptUrl: "/static/modules/terms-of-service/consent-enforcement.js",
        stylesheets: ["/static/modules/terms-of-service/styles/legal.css"],
        access: { minRole: "user" },
    });
    for (const slug of PUBLIC_ROUTES) {
        ctx.registerSpaRoute({
            id: `terms-of-service-${slug}`,
            pattern: `^/${slug}$`,
            base: `/${slug}`,
            scriptUrl: "/static/modules/terms-of-service/app.js",
            stylesheets: ["/static/modules/terms-of-service/styles/legal.css"],
            public: true,
        });
    }
}
