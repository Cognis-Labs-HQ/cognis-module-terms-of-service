export const definition = {
    version: 1,
    page: ({ pathname }) =>
        ["/terms-of-service", "/privacy-policy", "/eula"].includes(pathname),
    id: "introduction",
    titleKey: "module.terms.of.service.tutorial.title",
    steps: [
        {
            highlightNext: true,
            id: "document",
            titleKey: "module.terms.of.service.tutorial.document.title",
            bodyKey: "module.terms.of.service.tutorial.document.body",
            effects: {
                callout: true,
                arrow: true,
                spotlight: true,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            target: "document",
        },
        {
            highlightNext: true,
            id: "navigation",
            titleKey: "module.terms.of.service.tutorial.navigation.title",
            bodyKey: "module.terms.of.service.tutorial.navigation.body",
            effects: {
                callout: true,
                arrow: true,
                spotlight: true,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            target: "navigation",
        },
    ],
};
