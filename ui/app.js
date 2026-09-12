import { importReuseModule, uiCtx } from "./reuse/resources.js";

const [
    { apiFetch },
    { createI18n },
    { renderMarkdown, initializeMarkdownCodeCopy },
    { escapeHtml },
    { mountWhenDirect },
] = await Promise.all([
    importReuseModule("api-client.js"),
    importReuseModule("i18n.js"),
    importReuseModule("markdown-renderer.js"),
    importReuseModule("escape-html.js"),
    importReuseModule("page-entry.js"),
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
            <button class="terms-of-service-add" type="button"
                aria-label="${escapeHtml(i18n.t("module.terms_of_service.action.create"))}">+</button>
        </header>
        <div class="terms-of-service-editor" hidden>
            <div class="terms-of-service-compose-pane">
                <label>${escapeHtml(i18n.t("module.terms_of_service.editor.label"))}
                    <textarea rows="16">${escapeHtml(document.markdown ?? "")}</textarea>
                </label>
            </div>
            <div class="terms-of-service-preview-pane" hidden></div>
            <div class="terms-of-service-tabs">
                <button type="button" data-mode="compose">${escapeHtml(i18n.t("module.terms_of_service.action.compose"))}</button>
                <button type="button" data-mode="preview">${escapeHtml(i18n.t("module.terms_of_service.action.preview"))}</button>
                <button type="button" data-action="publish">${escapeHtml(i18n.t("module.terms_of_service.action.publish"))}</button>
            </div>
        </div>
    </div>`;
}

function activateEditor(panel, document, { apiFetch, i18n }) {
    const editor = panel.querySelector(".terms-of-service-editor");
    const textarea = panel.querySelector("textarea");
    const composePane = panel.querySelector(".terms-of-service-compose-pane");
    const previewPane = panel.querySelector(".terms-of-service-preview-pane");
    panel
        .querySelector(".terms-of-service-add")
        .addEventListener("click", () => {
            editor.hidden = false;
            textarea.focus();
        });
    panel
        .querySelector('[data-mode="compose"]')
        .addEventListener("click", () => {
            composePane.hidden = false;
            previewPane.hidden = true;
            textarea.focus();
        });
    panel
        .querySelector('[data-mode="preview"]')
        .addEventListener("click", () => {
            previewPane.innerHTML = renderMarkdown(textarea.value);
            composePane.hidden = true;
            previewPane.hidden = false;
            initializeMarkdownCodeCopy();
        });
    panel
        .querySelector('[data-action="publish"]')
        .addEventListener("click", async () => {
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
                showToast(i18n.t("module.terms_of_service.message.published"));
            } catch {
                showError(i18n.t("module.terms_of_service.error.publish"));
            }
        });
}

export function createAdminSection({ i18n, apiFetch }) {
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
                for (const definition of documents) {
                    const panel = root.querySelector(
                        `[data-document="${definition.slug}"]`,
                    );
                    if (panel) {
                        activateEditor(panel, definition, { apiFetch, i18n });
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
