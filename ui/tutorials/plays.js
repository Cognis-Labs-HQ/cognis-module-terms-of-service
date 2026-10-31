export const definition = {
    version: 1,
    id: "introduction",
    titleKey: "module.terms-of-service.tutorial.title",
    steps: [
        {
            id: "welcome",
            titleKey: "module.terms-of-service.tutorial.welcome.title",
            bodyKey: "module.terms-of-service.tutorial.welcome.body",
            effects: {
                callout: true,
                arrow: false,
                spotlight: false,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            route: "/terms-of-service",
        },
        {
            id: "document",
            titleKey: "module.terms-of-service.tutorial.document.title",
            bodyKey: "module.terms-of-service.tutorial.document.body",
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
            id: "navigation",
            titleKey: "module.terms-of-service.tutorial.navigation.title",
            bodyKey: "module.terms-of-service.tutorial.navigation.body",
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
