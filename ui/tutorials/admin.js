export const guides = [
    {
        owner: "module.terms-of-service.admin",
        minRole: "admin",
        definitions: [
            {
                id: "publishing",
                page: "/administration",
                scope: "#terms-of-service-legal",
                titleKey: "module.terms.of.service.tutorial.admin.title",
                steps: [
                    {
                        highlightNext: true,
                        id: "documents",
                        selector: ".terms-of-service-document>summary",
                        targetMatch: "first",
                        targetScope: ".terms-of-service-document",
                        group: "draft",
                        enter: ({ target }) => {
                            const panel = target.closest(
                                ".terms-of-service-document",
                            );
                            if (panel.dataset.legalEditor !== "true") return;
                            panel.open = true;
                            panel
                                .querySelector('[data-mode="compose"]')
                                .click();
                        },
                        titleKey:
                            "module.terms.of.service.tutorial.admin.documents.title",
                        bodyKey:
                            "module.terms.of.service.tutorial.admin.documents.body",
                    },
                    {
                        highlightNext: false,
                        id: "add",
                        group: "draft",
                        selector:
                            '.terms-of-service-document-action[data-legal-action="add"]',
                        targetScope: ".terms-of-service-document",
                        when: ({ targetAvailable }) => targetAvailable,
                        interaction: "target",
                        advance: {
                            event: "click",
                            accept: (event) =>
                                event.target.closest(
                                    ".terms-of-service-document",
                                )?.dataset.legalEditor === "true",
                        },
                        titleKey:
                            "module.terms.of.service.tutorial.admin.add.title",
                        bodyKey:
                            "module.terms.of.service.tutorial.admin.add.body",
                    },
                    {
                        highlightNext: false,
                        id: "edit",
                        group: "draft",
                        selector:
                            '.terms-of-service-document[data-legal-editor="true"] .terms-of-service-compose-pane textarea',
                        when: ({ targetAvailable }) => targetAvailable,
                        targetScope: ".terms-of-service-document",
                        interaction: "target",
                        advance: {
                            event: "input",
                            accept: (event) =>
                                event.target.closest(
                                    ".terms-of-service-document",
                                ).dataset.legalDraft === "true",
                        },
                        titleKey:
                            "module.terms.of.service.tutorial.admin.edit.title",
                        bodyKey:
                            "module.terms.of.service.tutorial.admin.edit.body",
                    },
                    {
                        highlightNext: false,
                        id: "preview",
                        group: "draft",
                        dependsOn: ["edit"],
                        selector: '[data-mode="preview"]',
                        targetScope: ".terms-of-service-document",
                        interaction: "target",
                        advance: {
                            event: "click",
                            accept: (event) =>
                                event.target
                                    .closest('[data-mode="preview"]')
                                    ?.getAttribute("aria-pressed") === "true",
                        },
                        titleKey:
                            "module.terms.of.service.tutorial.admin.preview.title",
                        bodyKey:
                            "module.terms.of.service.tutorial.admin.preview.body",
                    },
                    {
                        highlightNext: true,
                        id: "publish",
                        group: "draft",
                        dependsOn: ["preview"],
                        selector:
                            '.terms-of-service-document[data-legal-draft="true"] .terms-of-service-preview-pane:not([hidden])',
                        targetScope: ".terms-of-service-document",
                        when: ({ targetAvailable }) => targetAvailable,
                        titleKey:
                            "module.terms.of.service.tutorial.admin.publish.title",
                        bodyKey:
                            "module.terms.of.service.tutorial.admin.publish.body",
                    },
                    {
                        highlightNext: true,
                        id: "compliance-document",
                        group: "compliance",
                        selector: "[data-consent-report]",
                        targetMatch: "first",
                        targetScope:
                            ".terms-of-service-document:has([data-consent-report])",
                        when: ({ targetAvailable }) => targetAvailable,
                        titleKey:
                            "module.terms.of.service.tutorial.admin.compliance.title",
                        bodyKey:
                            "module.terms.of.service.tutorial.admin.compliance.body",
                    },
                    {
                        highlightNext: false,
                        id: "consent",
                        group: "compliance",
                        selector: "[data-consent-search]",
                        targetScope:
                            ".terms-of-service-document:has([data-consent-report])",
                        when: ({ targetAvailable }) => targetAvailable,
                        interaction: "target",
                        advance: {
                            event: "input",
                            accept: (event) =>
                                Boolean(event.target.value.trim()),
                        },
                        titleKey:
                            "module.terms.of.service.tutorial.admin.consent.title",
                        bodyKey:
                            "module.terms.of.service.tutorial.admin.consent.body",
                    },
                    {
                        highlightNext: false,
                        id: "compliance-filter",
                        group: "compliance",
                        selector: ".terms-of-service-report-filters",
                        targetScope:
                            ".terms-of-service-document:has([data-consent-report])",
                        when: ({ targetAvailable }) => targetAvailable,
                        interaction: "target",
                        advance: {
                            event: "click",
                            accept: (event) =>
                                event.target
                                    .closest("[data-consent-filter]")
                                    ?.getAttribute("aria-pressed") === "true",
                        },
                        titleKey:
                            "module.terms.of.service.tutorial.admin.filter.title",
                        bodyKey:
                            "module.terms.of.service.tutorial.admin.filter.body",
                    },
                    {
                        highlightNext: true,
                        id: "compliance-versions",
                        group: "compliance",
                        selector: ".terms-of-service-report-table-wrap",
                        targetScope:
                            ".terms-of-service-document:has([data-consent-report])",
                        when: ({ targetAvailable }) => targetAvailable,
                        titleKey:
                            "module.terms.of.service.tutorial.admin.versions.title",
                        bodyKey:
                            "module.terms.of.service.tutorial.admin.versions.body",
                    },
                ],
            },
        ],
    },
];
