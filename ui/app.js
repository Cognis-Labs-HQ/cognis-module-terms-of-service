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
    openErrorPopup({ message });
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
    return `<div class="terms-of-service-document" data-document="${document.slug}">
        <header class="terms-of-service-document-header">
            <h3>${escapeHtml(i18n.t(`module.terms_of_service.document.${document.titleKey}`))}</h3>
            <button class="terms-of-service-document-action btn-confirm" type="button"
                aria-label="${escapeHtml(i18n.t("module.terms_of_service.action.create"))}">+</button>
        </header>
        <div class="terms-of-service-editor" hidden>
            <div class="terms-of-service-compose-pane">
                <textarea rows="16" aria-label="${escapeHtml(i18n.t("module.terms_of_service.editor.content"))}">${escapeHtml(document.markdown ?? "")}</textarea>
            </div>
            <div class="terms-of-service-preview-pane" hidden></div>
            <div class="terms-of-service-tabs">
                <button type="button" data-mode="compose" aria-pressed="true">${escapeHtml(i18n.t("module.terms_of_service.action.compose"))}</button>
                <button type="button" data-mode="preview" aria-pressed="false">${escapeHtml(i18n.t("module.terms_of_service.action.preview"))}</button>
            </div>
            <div class="terms-of-service-dirty-bar" hidden>
                <span>${escapeHtml(i18n.t("module.terms_of_service.editor.unsaved"))}</span>
                <button class="btn-cancel btn-animated" type="button" data-action="discard">${escapeHtml(i18n.t("module.terms_of_service.action.discard"))}</button>
                <button class="btn-confirm btn-animated" type="button" data-action="save">${escapeHtml(i18n.t("module.terms_of_service.action.save"))}</button>
            </div>
        </div>
    </div>`;
}

function activateEditor(panel, document, { apiFetch, i18n, openPopup }) {
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
    const dirtyBar = createUnsavedChangesBar(
        panel.querySelector(".terms-of-service-dirty-bar"),
        {
            onSave: async () => {
                try {
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
                    showToast(
                        i18n.t("module.terms_of_service.message.updated"),
                    );
                } catch {
                    showError(i18n.t("module.terms_of_service.error.save"));
                    throw new Error("legal_document_save_failed");
                }
            },
            onDiscard: () => {
                textarea.value = savedMarkdown;
            },
        },
    );

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
    documentAction.addEventListener("click", async () => {
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
        selectMode("compose");
        editor.hidden = true;
        documentAction.textContent = "+";
        documentAction.setAttribute(
            "aria-label",
            i18n.t("module.terms_of_service.action.create"),
        );
        documentAction.classList.remove("btn-cancel");
        documentAction.classList.add("btn-confirm");
    });
    composeButton.addEventListener("click", () => selectMode("compose"));
    previewButton.addEventListener("click", () => selectMode("preview"));
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
            heading: i18n.t("module.terms_of_service.admin.title"),
            onRender(root) {
                const firstPanel = root.querySelector(
                    ".terms-of-service-document",
                );
                const heading = firstPanel
                    ?.closest(".sub-composer-inner")
                    ?.parentElement?.querySelector(".sub-composer-heading");
                if (heading && !heading.querySelector(".info-tooltip")) {
                    heading.insertAdjacentHTML(
                        "beforeend",
                        renderInfoTooltip(
                            i18n.t(
                                "module.terms_of_service.editor.markdown_hint",
                            ),
                            i18n.t(
                                "module.terms_of_service.editor.more_information",
                            ),
                            "terms-of-service-markdown",
                        ),
                    );
                }
                for (const definition of documents) {
                    const panel = root.querySelector(
                        `[data-document="${definition.slug}"]`,
                    );
                    if (panel) {
                        activateEditor(panel, definition, {
                            apiFetch,
                            i18n,
                            openPopup,
                        });
                    }
                }
            },
            elements: DOCUMENTS.map((definition) => ({
                id: `terms-of-service-${definition.slug}`,
                label: i18n.t(
                    `module.terms_of_service.document.${definition.titleKey}`,
                ),
                pinned: true,
                render: () =>
                    editorMarkup(
                        documents.find(
                            (document) => document.slug === definition.slug,
                        ) ?? definition,
                        i18n,
                    ),
            })),
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

await mountWhenDirect((root) => {
    const mountController = new AbortController();
    return mount(root, { signal: mountController.signal });
}).catch((error) => {
    showError(error instanceof Error ? error.message : String(error));
});
