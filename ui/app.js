import { importReuseModule, uiCtx } from "./reuse/resources.js";

const [
    { apiFetch },
    { createI18n },
    { renderMarkdown, initializeMarkdownCodeCopy },
    { escapeHtml },
    { mountWhenDirect },
    { createUnsavedChangesBar },
    { renderInfoTooltip },
] = await Promise.all([
    importReuseModule("api-client.js"),
    importReuseModule("i18n.js"),
    importReuseModule("markdown-renderer.js"),
    importReuseModule("escape-html.js"),
    importReuseModule("page-entry.js"),
    importReuseModule("unsaved-changes.js"),
    importReuseModule("info-tooltip.js"),
]);

const API_PATH = "/api/v1/modules/terms-of-service";
const DOCUMENTS = [
    { slug: "terms-of-service", titleKey: "terms" },
    { slug: "privacy-policy", titleKey: "privacy" },
    { slug: "eula", titleKey: "eula" },
];

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

function editorMarkup(document, i18n) {
    const hasPublishedContent = Boolean(
        document.version && String(document.markdown ?? "").trim(),
    );
    const actionKey = hasPublishedContent ? "remove" : "add";
    const actionVariant = hasPublishedContent ? "btn-cancel" : "btn-confirm";
    return `<section class="terms-of-service-document" data-document="${document.slug}">
        <header class="terms-of-service-document-header">
            <h3>${escapeHtml(i18n.t(`module.terms_of_service.document.${document.titleKey}`))}</h3>
            <button class="terms-of-service-document-action ${actionVariant}" type="button"
                aria-label="${escapeHtml(i18n.t(`module.terms_of_service.action.${actionKey}`))}">${escapeHtml(i18n.t(`module.terms_of_service.action.${actionKey}`))}</button>
        </header>
        <div class="terms-of-service-editor"${hasPublishedContent ? "" : " hidden"}>
            <div class="terms-of-service-compose-pane">
                <textarea rows="16" aria-label="${escapeHtml(i18n.t("module.terms_of_service.editor.content"))}">${escapeHtml(document.markdown ?? "")}</textarea>
            </div>
            <div class="terms-of-service-preview-pane" hidden></div>
            <div class="terms-of-service-tabs">
                <button class="terms-of-service-mode-toggle" type="button" data-mode="compose" aria-pressed="true">${escapeHtml(i18n.t("module.terms_of_service.action.compose"))}</button>
                <button class="terms-of-service-mode-toggle" type="button" data-mode="preview" aria-pressed="false">${escapeHtml(i18n.t("module.terms_of_service.action.preview"))}</button>
            </div>
        </div>
    </section>`;
}

function activateEditor(
    panel,
    document,
    { apiFetch, dirtyBar, i18n, openPopup },
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
    let savedMarkdown = document.markdown ?? "";

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
        await readPayload(response);
        savedMarkdown = textarea.value;
    }

    function discard() {
        textarea.value = savedMarkdown;
        if (!savedMarkdown) closeEditor();
    }

    function closeEditor() {
        selectMode("compose");
        editor.hidden = true;
        documentAction.textContent = i18n.t(
            "module.terms_of_service.action.add",
        );
        documentAction.setAttribute(
            "aria-label",
            i18n.t("module.terms_of_service.action.add"),
        );
        documentAction.classList.remove("btn-cancel");
        documentAction.classList.add("btn-confirm");
    }

    function selectMode(mode) {
        const previewSelected = mode === "preview";
        composePane.hidden = previewSelected;
        previewPane.hidden = !previewSelected;
        composeButton.setAttribute("aria-pressed", String(!previewSelected));
        previewButton.setAttribute("aria-pressed", String(previewSelected));
        if (previewSelected) {
            previewPane.innerHTML = renderMarkdown(textarea.value);
            initializeMarkdownCodeCopy();
        } else {
            textarea.focus();
        }
    }

    textarea.addEventListener("input", () => {
        dirtyBar.markDirty(document.slug, textarea.value !== savedMarkdown);
    });
    documentAction.addEventListener("click", async (event) => {
        event.preventDefault();
        if (editor.hidden) {
            editor.hidden = false;
            documentAction.textContent = i18n.t(
                "module.terms_of_service.action.remove",
            );
            documentAction.setAttribute(
                "aria-label",
                i18n.t("module.terms_of_service.action.remove"),
            );
            documentAction.classList.remove("btn-confirm");
            documentAction.classList.add("btn-cancel");
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
        dirtyBar.markDirty(document.slug, false);
        closeEditor();
    });
    composeButton.addEventListener("click", () => selectMode("compose"));
    previewButton.addEventListener("click", () => selectMode("preview"));
    return { discard, save };
}

function mountFloatingDirtyTracker(root, i18n, controllers) {
    const floatingToolbar = root.querySelector(".floating-toolbar");
    if (!floatingToolbar) {
        throw new Error("Required floating toolbar unavailable.");
    }
    floatingToolbar
        .querySelector('[data-floating-slot="terms-of-service-changes"]')
        ?.remove();
    const slot = document.createElement("div");
    slot.dataset.floatingSlot = "terms-of-service-changes";
    slot.hidden = true;
    slot.innerHTML = `<span>${escapeHtml(i18n.t("module.terms_of_service.editor.unsaved"))}</span>
        <button class="btn-cancel btn-animated" type="button" data-action="discard">${escapeHtml(i18n.t("module.terms_of_service.action.discard"))}</button>
        <button class="btn-confirm btn-animated" type="button" data-action="save">${escapeHtml(i18n.t("module.terms_of_service.action.save"))}</button>`;
    floatingToolbar.appendChild(slot);
    const syncToolbar = () => {
        floatingToolbar.hidden = !Array.from(
            floatingToolbar.querySelectorAll("[data-floating-slot]"),
        ).some((candidate) => !candidate.hidden);
    };
    new MutationObserver(syncToolbar).observe(slot, {
        attributes: true,
        attributeFilter: ["hidden"],
    });
    const dirtyBar = createUnsavedChangesBar(slot, {
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
    syncToolbar();
    return dirtyBar;
}

function documentsMarkup(documents, i18n) {
    return `<div class="terms-of-service-heading">
        <h2>${escapeHtml(i18n.t("module.terms_of_service.admin.title"))}</h2>
        ${renderInfoTooltip(
            i18n.t("module.terms_of_service.editor.markdown_hint"),
            i18n.t("module.terms_of_service.editor.more_information"),
            "terms-of-service-markdown",
        )}
    </div>
    <div class="terms-of-service-documents">
        ${documents.map((document) => editorMarkup(document, i18n)).join("")}
    </div>`;
}

export function createAdminSection({ i18n, apiFetch, openPopup }) {
    let documents = DOCUMENTS;
    const dataReady = apiFetch(`${API_PATH}/documents`)
        .then(readPayload)
        .then((storedDocuments) => {
            documents = DOCUMENTS.map((definition) => ({
                ...definition,
                ...storedDocuments.find(
                    (document) => document.slug === definition.slug,
                ),
            }));
        })
        .catch(() => {
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
                const dirtyBar = mountFloatingDirtyTracker(
                    root,
                    i18n,
                    controllers,
                );
                for (const definition of documents) {
                    const panel = root.querySelector(
                        `[data-document="${definition.slug}"]`,
                    );
                    if (panel) {
                        controllers.push(
                            activateEditor(panel, definition, {
                                apiFetch,
                                dirtyBar,
                                i18n,
                                openPopup,
                            }),
                        );
                    }
                }
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
    const i18n = await createI18n({
        componentStringBaseUrls: ["/static/modules/terms-of-service/languages"],
    });
    const slug = location.pathname.slice(1);
    const definition = DOCUMENTS.find((document) => document.slug === slug);
    if (!definition) throw new Error("Unsupported legal document route.");
    root.innerHTML = `<main class="terms-of-service-public card-elevated">
        <h1>${escapeHtml(i18n.t(`module.terms_of_service.document.${definition.titleKey}`))}</h1>
        <article class="terms-of-service-rendered"></article>
    </main>`;
    try {
        const response = await apiFetch(`${API_PATH}/public/${slug}`, {
            signal,
        });
        const document = await readPayload(response);
        root.querySelector(".terms-of-service-rendered").innerHTML =
            renderMarkdown(document.markdown);
        initializeMarkdownCodeCopy();
    } catch {
        root.querySelector(".terms-of-service-rendered").textContent = i18n.t(
            "module.terms_of_service.public.unavailable",
        );
    }
}

export function unmount(root) {
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
