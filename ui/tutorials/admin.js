export const guides = [
    {
        owner: "module.terms-of-service.admin",
        minRole: "admin",
        definitions: [
            {
                id: "publishing",
                page: "/administration",
                scope: "#terms-of-service-legal",
                titleKey: "module.terms-of-service.tutorial.admin.title",
                steps: [
                    {
                        highlightNext: true,
                        id: "documents",
                        selector: ".terms-of-service-document>summary",
                        targetMatch: "first",
                        titleKey:
                            "module.terms-of-service.tutorial.admin.documents.title",
                        bodyKey:
                            "module.terms-of-service.tutorial.admin.documents.body",
                    },
                    {
                        highlightNext: true,
                        id: "consent",
                        selector: "[data-consent-search]",
                        targetMatch: "first",
                        titleKey:
                            "module.terms-of-service.tutorial.admin.consent.title",
                        bodyKey:
                            "module.terms-of-service.tutorial.admin.consent.body",
                    },
                ],
            },
        ],
    },
];
