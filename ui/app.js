const API_PATH = "/api/v1/modules/terms-of-service";
const DOCUMENTS = [
    { slug: "terms-of-service", titleKey: "terms" },
    { slug: "privacy-policy", titleKey: "privacy" },
    { slug: "eula", titleKey: "eula" },
];

function string(host, key) {
    return host.i18n?.t?.(`module.terms_of_service.${key}`) ?? key;
}

function showError(host, key) {
    host.errorPopup?.show?.({ message: string(host, key) });
}

async function request(path, options) {
    const response = await fetch(path, {
        credentials: "same-origin",
        ...options,
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error?.code ?? "request_failed");
    return payload.data;
}

function documentPanel(document, host, markdownComposer) {
    const definition = DOCUMENTS.find((item) => item.slug === document.slug);
    const panel = window.document.createElement("section");
    panel.className = "terms-of-service-document card-elevated";
    panel.innerHTML = `
        <header class="terms-of-service-document-header">
            <h2>${string(host, `document.${definition.titleKey}`)}</h2>
            <button class="terms-of-service-add" type="button"
                aria-label="${string(host, "action.create")}">+</button>
        </header>
        <div class="terms-of-service-editor" hidden>
            <div class="terms-of-service-compose-pane">
                <label>${string(host, "editor.label")}
                    <textarea rows="16"></textarea>
                </label>
            </div>
            <div class="terms-of-service-preview-pane" hidden></div>
            <div class="terms-of-service-tabs">
                <button type="button" data-mode="compose">${string(host, "action.compose")}</button>
                <button type="button" data-mode="preview">${string(host, "action.preview")}</button>
                <button type="button" data-action="publish">${string(host, "action.publish")}</button>
            </div>
        </div>`;
    const editor = panel.querySelector(".terms-of-service-editor");
    const textarea = panel.querySelector("textarea");
    textarea.value = document.markdown ?? "";
    panel
        .querySelector(".terms-of-service-add")
        .addEventListener("click", () => {
            editor.hidden = false;
            textarea.focus();
        });
    markdownComposer.bind({
        root: editor,
        textarea,
        composeButton: panel.querySelector('[data-mode="compose"]'),
        previewButton: panel.querySelector('[data-mode="preview"]'),
        composePane: panel.querySelector(".terms-of-service-compose-pane"),
        previewPane: panel.querySelector(".terms-of-service-preview-pane"),
    });
    panel
        .querySelector('[data-action="publish"]')
        .addEventListener("click", async () => {
            try {
                await request(`${API_PATH}/documents/${document.slug}`, {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ markdown: textarea.value }),
                });
                host.toast?.show?.({
                    variant: "success",
                    message: string(host, "message.published"),
                });
            } catch {
                showError(host, "error.publish");
            }
        });
    return panel;
}

async function mountAdministration(root, host, markdownComposer) {
    root.innerHTML = `<main class="terms-of-service-admin">
        <h1>${string(host, "admin.title")}</h1>
        <p>${string(host, "admin.description")}</p>
        <div class="terms-of-service-documents"></div>
    </main>`;
    try {
        const documents = await request(`${API_PATH}/documents`);
        const container = root.querySelector(".terms-of-service-documents");
        for (const document of documents) {
            container.append(documentPanel(document, host, markdownComposer));
        }
    } catch {
        showError(host, "error.load");
    }
}

async function mountPublic(root, host, markdownComposer, slug) {
    const definition = DOCUMENTS.find((item) => item.slug === slug);
    root.innerHTML = `<main class="terms-of-service-public card-elevated">
        <h1>${string(host, `document.${definition.titleKey}`)}</h1>
        <article class="terms-of-service-rendered"></article>
    </main>`;
    try {
        const document = await request(`${API_PATH}/public/${slug}`);
        await markdownComposer.render(
            root.querySelector(".terms-of-service-rendered"),
            document.markdown,
        );
    } catch {
        root.querySelector(".terms-of-service-rendered").textContent = string(
            host,
            "public.unavailable",
        );
    }
}

export async function mount(root, host) {
    const markdownComposer = await host.reuse.get("markdown:composer");
    const slug = location.pathname.slice(1);
    if (DOCUMENTS.some((item) => item.slug === slug)) {
        await mountPublic(root, host, markdownComposer, slug);
        return;
    }
    await mountAdministration(root, host, markdownComposer);
}

export function unmount(root) {
    root.replaceChildren();
}
