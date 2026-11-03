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
                        id: "documents",
                        selector: ".terms-of-service-documents",
                        titleKey:
                            "module.terms-of-service.tutorial.admin.documents.title",
                        bodyKey:
                            "module.terms-of-service.tutorial.admin.documents.body",
                    },
                    {
                        id: "consent",
                        selector: "#terms-of-service-legal",
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
