import { definition } from "./plays.js";

/** Register only through the host's public tutorial and resource contracts. */
export async function mountProvider(ctx) {
    const api = ctx.capabilities.get("ui:tutorials");
    if (api?.version !== 1) throw new Error("tutorial_contract_unavailable");
    const owner = api.owner("module.terms-of-service", {
        signal: ctx.signal,
        stringsBaseUrls: ["/static/modules/terms-of-service/languages"],
    });
    try {
        const targets = {};
        for (const [name, selector] of Object.entries({
            document: ".terms-of-service-rendered",
            navigation: "[data-legal-document-navigation]",
        })) {
            targets[name] = (
                await owner.target(name, {
                    resolve: () => {
                        const matches = document.querySelectorAll(selector);
                        return matches.length === 1 ? matches[0] : null;
                    },
                })
            ).id;
        }
        const play = await owner.register({
            ...definition,
            available: () =>
                ctx.capabilities.get("session:isAuthenticated")?.() === true &&
                ctx.capabilities.get("offline:state")?.isOffline() !== true,
            requires: ["ui:navigate"],
            steps: definition.steps.map((step) => ({
                ...step,
                ...(step.target ? { target: targets[step.target] } : {}),
            })),
        });
        ctx.capabilities.contribute("terms-of-service:tutorials", play);
        return owner.dispose;
    } catch (error) {
        owner.dispose();
        throw error;
    }
}
