import { guides } from "./admin.js";

export async function mountProvider(ctx) {
    const { mountTutorialProvider } = await ctx.capabilities
        .get("ui:reuse")
        .importModule("tutorials/pages.js");
    return mountTutorialProvider(ctx, {
        guides,
        stringsBaseUrls: ["/static/modules/terms-of-service/languages"],
        capability: "terms-of-service:adminTutorials",
    });
}
