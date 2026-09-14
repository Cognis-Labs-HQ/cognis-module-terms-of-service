import {
    importReuseModule,
    loadReuseStylesheet,
    uiCtx,
} from "./reuse/resources.js";

const [
    { apiFetch },
    { applyDocumentTitle, createI18n },
    { renderMarkdown, initializeMarkdownCodeCopy },
    { escapeHtml },
    { beginPageLoading, mountWhenDirect },
    { ensureFullAccountSession },
    { createUnsavedChangesBar },
    { renderInfoTooltip },
    { createCollapsibleSectionComposer },
    { createPageComposer },
    { createSideMenu },
] = await Promise.all([
    importReuseModule("api-client.js"),
    importReuseModule("i18n.js"),
    importReuseModule("markdown-renderer.js"),
    importReuseModule("escape-html.js"),
    importReuseModule("page-entry.js"),
    importReuseModule("auth-session.js"),
    importReuseModule("unsaved-changes.js"),
    importReuseModule("info-tooltip.js"),
    importReuseModule("collapsible-section-composer.js"),
    importReuseModule("page-composer/index.js"),
    importReuseModule("side-menu.js"),
]);

await loadReuseStylesheet("state-pill.css");

const API_PATH = "/api/v1/modules/terms-of-service";
const DOCUMENTS = [
    { slug: "terms-of-service", titleKey: "terms" },
    { slug: "privacy-policy", titleKey: "privacy" },
    { slug: "eula", titleKey: "eula" },
];
const publicPageComposers = new WeakMap();
const REPORT_PAGE_SIZE = 10;
const CONSENT_REPORT_REFRESH_INTERVAL_MS = 5_000;
const paginationUi = uiCtx.capabilities.get("ui:pagination");

if (
    typeof paginationUi?.createPagination !== "function" ||
    typeof paginationUi?.renderPaginationControls !== "function" ||
    typeof paginationUi?.bindPaginationControls !== "function"
) {
    throw new Error("Required UI capability unavailable: ui:pagination");
}

function showError(message) {
    const openErrorPopup = uiCtx.capabilities.get("ui:openErrorPopup");
    if (typeof openErrorPopup !== "function") {
        throw new Error(
            "Required UI capability unavailable: ui:openErrorPopup",
        );
    }
    openErrorPopup({
        error: new Error(message),
        context: "terms-of-service",
    });
}

function showToast(message) {
    const toast = uiCtx.capabilities.get("ui:showToast");
    if (typeof toast !== "function") {
        throw new Error("Required UI capability unavailable: ui:showToast");
    }
    toast(message, { variant: "success" });
}

async function readPayload(response) {
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error?.code ?? "request_failed");
    return payload.data;
}

function consentReportMarkup(i18n) {
    return `<section class="terms-of-service-report" data-consent-report>
        <div class="terms-of-service-report-toolbar">
            <input type="search" class="form-builder-input" data-consent-search placeholder="${escapeHtml(i18n.t("module.terms_of_service.report.search"))}">
            <div class="terms-of-service-report-filters">${[
                "all",
                "accepted",
                "outstanding",
            ]
                .map(
                    (filter) =>
                        `<button type="button" class="state-pill${filter === "all" ? " pill-active" : ""}" data-consent-filter="${filter}">${escapeHtml(i18n.t(`module.terms_of_service.report.${filter}`))}</button>`,
                )
                .join("")}</div>
        </div>
        <div data-consent-report-table></div>
    </section>`;
}

function activateConsentReport(panel, document, i18n, apiFetch) {
    const report = panel.querySelector("[data-consent-report]");
    if (!report) return null;
    let filter = "all";
    let query = "";
    const pagination = paginationUi.createPagination({
        data: [],
        perPage: REPORT_PAGE_SIZE,
    });
    const render = () => {
        const users = (document.consentUsers ?? [])
            .map((user) => ({
                ...user,
                accepted:
                    Boolean(user.version) && user.version === document.version,
            }))
            .filter(
                (user) =>
                    (filter === "all" ||
                        (filter === "accepted"
                            ? user.accepted
                            : !user.accepted)) &&
                    user.label.toLowerCase().includes(query.toLowerCase()),
            );
        const page = pagination.updateData(users);
        const rows = page.items
            .map(
                (user) =>
                    `<tr><td>${escapeHtml(user.label)}</td><td><span class="state-pill ${user.accepted ? "pill-active" : "pill-required"}">${escapeHtml(i18n.t(`module.terms_of_service.report.${user.accepted ? "accepted" : "outstanding"}`))}</span></td><td>${user.version ? `<code>${escapeHtml(user.version)}</code>` : escapeHtml(i18n.t("module.terms_of_service.report.not_consented"))}</td><td><code>${escapeHtml(document.version)}</code></td></tr>`,
            )
            .join("");
        report.querySelector("[data-consent-report-table]").innerHTML =
            `<div class="terms-of-service-report-table-wrap"><table><thead><tr><th>${escapeHtml(i18n.t("module.terms_of_service.report.user"))}</th><th>${escapeHtml(i18n.t("module.terms_of_service.report.status"))}</th><th>${escapeHtml(i18n.t("module.terms_of_service.report.consented_version"))}</th><th>${escapeHtml(i18n.t("module.terms_of_service.report.latest_version"))}</th></tr></thead><tbody>${rows || `<tr><td colspan="4">${escapeHtml(i18n.t("module.terms_of_service.report.empty"))}</td></tr>`}</tbody></table></div>${paginationUi.renderPaginationControls(
                {
                    page,
                    labels: {
                        previous: i18n.t(
                            "module.terms_of_service.report.previous",
                        ),
                        next: i18n.t("module.terms_of_service.report.next"),
                        status: i18n.t("module.terms_of_service.report.page"),
                    },
                    ariaLabel: i18n.t("module.terms_of_service.report.pages"),
                    escapeHtml,
                },
            )}`;
        paginationUi.bindPaginationControls(report, pagination, {
            onChange: render,
        });
    };
    report.addEventListener("input", (event) => {
        if (!event.target.matches("[data-consent-search]")) return;
        query = event.target.value;
        pagination.setPage(0);
        render();
    });
    report.addEventListener("click", (event) => {
        const filterButton = event.target.closest("[data-consent-filter]");
        if (filterButton) {
            filter = filterButton.dataset.consentFilter;
            pagination.setPage(0);
            report
                .querySelectorAll("[data-consent-filter]")
                .forEach((button) =>
                    button.classList.toggle(
                        "pill-active",
                        button === filterButton,
                    ),
                );
        } else return;
        render();
    });
    render();
    return {
        render,
        async refresh() {
            const consentEntries = await apiFetch(
                `${API_PATH}/consent-report/${document.slug}`,
            ).then(readPayload);
            const consentByAccount = new Map(
                consentEntries.map((entry) => [entry.accountId, entry.version]),
            );
            document.consentUsers = (document.consentUsers ?? []).map(
                (user) => ({
                    ...user,
                    version: consentByAccount.get(user.accountId) ?? null,
                }),
            );
            render();
        },
    };
}

function documentDescriptor(document, i18n) {
    const hasPublishedContent = Boolean(
        document.version && String(document.markdown ?? "").trim(),
    );
    const actionKey = hasPublishedContent ? "remove" : "add";
    const actionVariant = hasPublishedContent ? "btn-cancel" : "btn-confirm";
    return {
        id: document.slug,
        title: i18n.t(`module.terms_of_service.document.${document.titleKey}`),
        className: "terms-of-service-document",
        contentClassName: "terms-of-service-document-content",
        open: hasPublishedContent,
        controlsHtml: `<button class="terms-of-service-document-action ${actionVariant}" type="button"
                aria-label="${escapeHtml(i18n.t(`module.terms_of_service.action.${actionKey}`))}">${escapeHtml(i18n.t(`module.terms_of_service.action.${actionKey}`))}</button>`,
        contentHtml: `<div class="terms-of-service-editor">
            <div class="terms-of-service-compose-pane">
                <textarea rows="16" aria-label="${escapeHtml(i18n.t("module.terms_of_service.editor.content"))}">${escapeHtml(document.markdown ?? "")}</textarea>
            </div>
            <div class="terms-of-service-preview-pane" hidden></div>
            <div class="collapsible-section-action-row terms-of-service-mode-row">
                <button class="terms-of-service-mode-toggle btn-neutral is-active" type="button" data-mode="compose" aria-pressed="true">${escapeHtml(i18n.t("module.terms_of_service.action.compose"))}</button>
                <button class="terms-of-service-mode-toggle btn-neutral" type="button" data-mode="preview" aria-pressed="false">${escapeHtml(i18n.t("module.terms_of_service.action.preview"))}</button>
            </div>
            ${hasPublishedContent ? consentReportMarkup(i18n) : ""}
        </div>`,
    };
}

function activateEditor(
    panel,
    document,
    { apiFetch, consentReport, dirtyBar, i18n, openPopup },
) {
    const editor = panel.querySelector(".terms-of-service-editor");
    const textarea = panel.querySelector("textarea");
    const composePane = panel.querySelector(".terms-of-service-compose-pane");
    const previewPane = panel.querySelector(".terms-of-service-preview-pane");
    const documentAction = panel.querySelector(
        ".terms-of-service-document-action",
    );
    const composeButton = panel.querySelector('[data-mode="compose"]');
    const previewButton = panel.querySelector('[data-mode="preview"]');
    let activeConsentReport = consentReport;
    let savedMarkdown = document.markdown ?? "";
    let editorActive = panel.open;

    async function save() {
        if (textarea.value === savedMarkdown) return;
        const response = await apiFetch(
            `${API_PATH}/documents/${document.slug}`,
            {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ markdown: textarea.value }),
            },
        );
        const publishedDocument = await readPayload(response);
        Object.assign(document, publishedDocument);
        savedMarkdown = textarea.value;
        editorActive = true;
        syncDocumentAction();
        if (!activeConsentReport) {
            editor.insertAdjacentHTML("beforeend", consentReportMarkup(i18n));
            activeConsentReport = activateConsentReport(panel, document, i18n);
        } else {
            activeConsentReport.render();
        }
    }

    function discard() {
        textarea.value = savedMarkdown;
        if (!savedMarkdown) closeEditor();
    }

    function closeEditor() {
        selectMode("compose");
        panel.open = false;
    }

    function syncDocumentAction() {
        const actionKey = editorActive ? "remove" : "add";
        documentAction.textContent = i18n.t(
            `module.terms_of_service.action.${actionKey}`,
        );
        documentAction.setAttribute(
            "aria-label",
            i18n.t(`module.terms_of_service.action.${actionKey}`),
        );
        documentAction.classList.toggle("btn-cancel", editorActive);
        documentAction.classList.toggle("btn-confirm", !editorActive);
    }

    function selectMode(mode) {
        const previewSelected = mode === "preview";
        composePane.hidden = previewSelected;
        previewPane.hidden = !previewSelected;
        composeButton.setAttribute("aria-pressed", String(!previewSelected));
        previewButton.setAttribute("aria-pressed", String(previewSelected));
        composeButton.classList.toggle("is-active", !previewSelected);
        previewButton.classList.toggle("is-active", previewSelected);
        if (previewSelected) {
            previewPane.innerHTML = renderMarkdown(textarea.value);
            initializeMarkdownCodeCopy();
        } else {
            textarea.focus();
        }
    }

    textarea.addEventListener("input", () => {
        dirtyBar?.markDirty(document.slug, textarea.value !== savedMarkdown);
    });
    documentAction.addEventListener("click", async (event) => {
        event.preventDefault();
        if (!editorActive) {
            editorActive = true;
            panel.open = true;
            syncDocumentAction();
            textarea.focus();
            return;
        }
        const result = await openPopup({
            title: i18n.t("module.terms_of_service.remove.title"),
            body: `<p>${escapeHtml(i18n.t("module.terms_of_service.remove.prompt"))}</p>`,
            variant: "warning",
            actions: [
                {
                    id: "remove",
                    label: i18n.t("module.terms_of_service.action.remove"),
                    variant: "cancel",
                },
                {
                    id: "keep",
                    label: i18n.t("module.terms_of_service.action.keep"),
                    variant: "confirm",
                },
            ],
        });
        if (result !== "remove") return;
        textarea.value = savedMarkdown;
        dirtyBar?.markDirty(document.slug, false);
        editorActive = false;
        closeEditor();
        syncDocumentAction();
    });
    composeButton.addEventListener("click", (event) => {
        event.preventDefault();
        selectMode("compose");
    });
    previewButton.addEventListener("click", (event) => {
        event.preventDefault();
        selectMode("preview");
    });
    return { discard, save };
}

function mountFloatingDirtyTracker(root, i18n, controllers) {
    const section = root.querySelector("#terms-of-service-legal");
    if (!section?.isConnected) return null;
    const slot = root.querySelector('[data-floating-slot="admin-changes-bar"]');
    if (!slot?.isConnected) return null;
    const dirtyBar = createUnsavedChangesBar(slot, {
        confirmMessage: i18n.t("module.terms_of_service.editor.unsaved"),
        onSave: async () => {
            try {
                await Promise.all(
                    controllers.map((controller) => controller.save()),
                );
                showToast(i18n.t("module.terms_of_service.message.updated"));
            } catch (error) {
                showError(i18n.t("module.terms_of_service.error.save"));
                throw error;
            }
        },
        onDiscard: () => {
            controllers.forEach((controller) => controller.discard());
        },
    });
    return dirtyBar;
}

function documentsMarkup(documents, i18n) {
    const sectionComposer = createCollapsibleSectionComposer({ escapeHtml });
    return `<div class="terms-of-service-heading">
        <h2>${escapeHtml(i18n.t("module.terms_of_service.admin.title"))}
            ${renderInfoTooltip(
                i18n.t("module.terms_of_service.editor.markdown_hint"),
                i18n.t("module.terms_of_service.editor.more_information"),
                "terms-of-service-markdown",
            )}
        </h2>
    </div>
    <div class="terms-of-service-documents">
        ${sectionComposer.render(documents.map((document) => documentDescriptor(document, i18n)))}
    </div>`;
}

export function createAdminSection({ i18n, apiFetch, openPopup }) {
    let documents = DOCUMENTS;
    let dirtyBar;
    let stopConsentReportUpdates;
    const dataReady = Promise.all([
        apiFetch(`${API_PATH}/documents`).then(readPayload),
        apiFetch("/api/v1/users").then(readPayload),
        ...DOCUMENTS.map((document) =>
            apiFetch(`${API_PATH}/consent-report/${document.slug}`).then(
                readPayload,
            ),
        ),
    ])
        .then(([storedDocuments, users, ...reports]) => {
            documents = DOCUMENTS.map((definition) => ({
                ...definition,
                ...storedDocuments.find(
                    (document) => document.slug === definition.slug,
                ),
                consentUsers: users.map((user) => {
                    const accountId = String(
                        user.accountId ??
                            user.id ??
                            user.username ??
                            user.handle,
                    );
                    const consent = reports[DOCUMENTS.indexOf(definition)].find(
                        (entry) => entry.accountId === accountId,
                    );
                    return {
                        accountId,
                        label: String(
                            user.displayName ??
                                user.username ??
                                user.handle ??
                                accountId,
                        ),
                        version: consent?.version ?? null,
                    };
                }),
            }));
        })
        .catch((error) => {
            uiCtx.capabilities.get("ui:log")?.(
                "error",
                "Legal administration data loading failed.",
                {
                    component: "terms-of-service",
                    operation: "loadAdministrationData",
                    error:
                        error instanceof Error ? error.message : String(error),
                },
            );
            showError(i18n.t("module.terms_of_service.error.load"));
        });

    return {
        id: "terms-of-service-legal",
        label: i18n.t("module.terms_of_service.admin.title"),
        dataReady,
        subComposerOptions: {
            allowCustomization: false,
            preferenceKey: "terms-of-service-legal",
            heading: "",
            onRender(root) {
                const controllers = [];
                const consentReports = [];
                dirtyBar?.destroy?.();
                stopConsentReportUpdates?.();
                dirtyBar = mountFloatingDirtyTracker(root, i18n, controllers);
                for (const definition of documents) {
                    const panel = root.querySelector(
                        `[data-collapsible-section="${definition.slug}"]`,
                    );
                    if (panel) {
                        const consentReport = activateConsentReport(
                            panel,
                            definition,
                            i18n,
                            apiFetch,
                        );
                        if (consentReport) consentReports.push(consentReport);
                        controllers.push(
                            activateEditor(panel, definition, {
                                apiFetch,
                                consentReport,
                                dirtyBar,
                                i18n,
                                openPopup,
                            }),
                        );
                    }
                }
                const refreshConsentReports = () => {
                    void Promise.all(
                        consentReports.map((report) => report.refresh()),
                    ).catch((error) => {
                        uiCtx.capabilities.get("ui:log")?.(
                            "error",
                            "Consent report refresh failed.",
                            {
                                component: "terms-of-service",
                                operation: "refreshConsentReports",
                                error:
                                    error instanceof Error
                                        ? error.message
                                        : String(error),
                            },
                        );
                    });
                };
                const refreshTimer = setInterval(() => {
                    if (document.visibilityState === "visible") {
                        refreshConsentReports();
                    }
                }, CONSENT_REPORT_REFRESH_INTERVAL_MS);
                window.addEventListener(
                    "terms-of-service:consent-recorded",
                    refreshConsentReports,
                );
                stopConsentReportUpdates = () => {
                    clearInterval(refreshTimer);
                    window.removeEventListener(
                        "terms-of-service:consent-recorded",
                        refreshConsentReports,
                    );
                };
            },
            onUnmount() {
                dirtyBar?.destroy?.();
                dirtyBar = undefined;
                stopConsentReportUpdates?.();
                stopConsentReportUpdates = undefined;
            },
            elements: [
                {
                    id: "terms-of-service-documents",
                    label: i18n.t("module.terms_of_service.admin.title"),
                    pinned: true,
                    gridSize: { default: [12, 6], min: [6, 4], max: "full" },
                    render: () => documentsMarkup(documents, i18n),
                },
            ],
        },
    };
}

export async function mount(root, { signal } = {}) {
    const finishLoading = beginPageLoading(root);
    const i18n = await createI18n({
        componentStringBaseUrls: ["/static/modules/terms-of-service/languages"],
    });
    const slug = location.pathname.slice(1);
    const definition = DOCUMENTS.find((document) => document.slug === slug);
    if (!definition) throw new Error("Unsupported legal document route.");
    const title = i18n.t(
        `module.terms_of_service.document.${definition.titleKey}`,
    );
    let renderedMarkdown = "";
    try {
        const response = await apiFetch(`${API_PATH}/public/${slug}`, {
            signal,
        });
        const document = await readPayload(response);
        renderedMarkdown = renderMarkdown(document.markdown);
    } catch (error) {
        uiCtx.capabilities.get("ui:log")?.(
            "error",
            "Public legal document rendering failed.",
            {
                component: "terms-of-service",
                operation: "renderPublicDocument",
                slug,
                error: error instanceof Error ? error.message : String(error),
            },
        );
        renderedMarkdown = `<p>${escapeHtml(
            i18n.t("module.terms_of_service.public.unavailable"),
        )}</p>`;
    }

    const authenticated = Boolean(localStorage.getItem("cognis_access_token"));
    if (authenticated) await ensureFullAccountSession();
    applyDocumentTitle(
        i18n,
        `module.terms_of_service.public.page_title.${definition.titleKey}`,
    );
    let navigationMenu = createSideMenu({
        groups: [],
        storageKeyPrefix: "terms-of-service-sections",
    });
    const selectDocumentSection = (sectionId) => {
        navigationMenu.setActive(sectionId);
    };
    const composer = createPageComposer(root, {
        allowCustomization: false,
        elements: [
            {
                id: `${slug}-document`,
                label: title,
                pinned: true,
                gridSize: { default: [12, 1], min: [6, 1], max: "full" },
                render: () =>
                    `<article class="terms-of-service-rendered content-panel">${renderedMarkdown}</article>`,
            },
        ],
        preferenceKey: `terms-of-service-public-${slug}`,
        i18n,
        pageContext: { title, subtitle: "" },
        toolbar: [
            {
                id: "document-sections",
                label: i18n.t("module.terms_of_service.public.navigation"),
                render: () =>
                    `<div data-legal-document-navigation>${navigationMenu.render()}</div>`,
            },
        ],
        toolbarScrollable: true,
        contentScrolling: false,
        showNavbar: authenticated,
        requireAccountSession: authenticated,
        onRender() {
            const article = root.querySelector(".terms-of-service-rendered");
            const navigationItems = [];
            article?.querySelectorAll("h2, h3").forEach((heading, index) => {
                const id = `${slug}-section-${index + 1}`;
                heading.id = id;
                navigationItems.push({
                    id,
                    label: heading.textContent,
                    targetId: id,
                });
            });
            const navigation = root.querySelector(
                "[data-legal-document-navigation]",
            );
            navigationMenu = createSideMenu({
                groups: [
                    {
                        id: slug,
                        label: title,
                        items: navigationItems,
                    },
                ],
                storageKeyPrefix: "terms-of-service-sections",
                activeId: navigationItems[0]?.id,
                onSelect: selectDocumentSection,
                scrollBehavior: "smooth",
            });
            if (navigation) {
                navigation.innerHTML = navigationMenu.render();
                navigationMenu.mount(navigation, { signal });
            }
            initializeMarkdownCodeCopy();
        },
    });
    publicPageComposers.get(root)?.destroy?.();
    publicPageComposers.set(root, composer);
    await composer.init();
    const refreshFooterLinks = uiCtx.capabilities.get(
        "terms-of-service:refreshFooterLinks",
    );
    if (typeof refreshFooterLinks === "function") {
        await refreshFooterLinks({ forceRender: true });
    }
    finishLoading();
}

export function unmount(root) {
    publicPageComposers.get(root)?.destroy?.();
    publicPageComposers.delete(root);
    root.replaceChildren();
}

const directRouteSlug = location.pathname.slice(1);
if (DOCUMENTS.some((document) => document.slug === directRouteSlug)) {
    await mountWhenDirect((root) => {
        const mountController = new AbortController();
        return mount(root, { signal: mountController.signal });
    }).catch((error) => {
        showError(error instanceof Error ? error.message : String(error));
    });
}
