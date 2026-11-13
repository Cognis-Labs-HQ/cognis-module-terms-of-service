import assert from "node:assert/strict";
import test from "node:test";
import { guides } from "../tutorials/admin.js";

let barOptions;
const dirty = new Map();
const modules = {
    "page-styles.js": { ensurePageStylesheet: async () => {} },
    "api-client.js": {},
    "i18n.js": {},
    "markdown-renderer.js": {
        renderMarkdown: (value) => `Preview: ${value}`,
        initializeMarkdownCodeCopy() {},
    },
    "escape-html.js": { escapeHtml: String },
    "page-entry.js": { mountWhenDirect: async () => {} },
    "auth-session.js": {},
    "unsaved-changes.js": {
        createUnsavedChangesBar: (slot, options) => {
            barOptions = options;
            return {
                markDirty: (id, value) => {
                    dirty.set(id, value);
                    slot.hidden = ![...dirty.values()].some(Boolean);
                },
                destroy() {},
            };
        },
    },
    "info-tooltip.js": {},
    "collapsible-section-composer.js": {},
    "page-composer/index.js": {},
    "side-menu.js": {},
};
globalThis.window = new EventTarget();
globalThis.location = { pathname: "/administration" };
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: {
        get(id) {
            if (id === "ui:reuse")
                return {
                    importModule: async (name) => modules[name],
                    loadStylesheet: async () => {},
                };
            if (id === "ui:pagination")
                return {
                    createPagination: () =>
                        assert.fail(
                            "An unpublished document has no consent report",
                        ),
                    renderPaginationControls() {},
                    bindPaginationControls() {},
                };
            return () => {};
        },
    },
};
const { createAdminSection } = await import("../app.js");

class Element extends EventTarget {
    dataset = {};
    value = "";
    hidden = false;
    open = false;
    isConnected = true;
    attributes = new Map();
    classList = { toggle() {} };
    setAttribute(key, value) {
        this.attributes.set(key, value);
    }
    getAttribute(key) {
        return this.attributes.get(key);
    }
    click() {
        this.dispatchEvent(new Event("click", { cancelable: true }));
    }
    focus() {}
}

async function fixture(context) {
    dirty.clear();
    const panel = new Element();
    const summary = new Element();
    const textarea = new Element();
    const compose = new Element();
    const preview = new Element();
    const action = new Element();
    const composePane = new Element();
    const previewPane = new Element();
    previewPane.hidden = true;
    const controls = new Map([
        [".terms-of-service-editor", new Element()],
        ["textarea", textarea],
        [".terms-of-service-compose-pane", composePane],
        [".terms-of-service-preview-pane", previewPane],
        [".terms-of-service-document-action", action],
        ['[data-mode="compose"]', compose],
        ['[data-mode="preview"]', preview],
    ]);
    panel.querySelector = (selector) => controls.get(selector);
    for (const element of [summary, textarea, compose, preview, action])
        element.closest = () => panel;
    preview.closest = () => preview;
    const slot = new Element();
    const root = {
        querySelector: (selector) =>
            selector === "#terms-of-service-legal"
                ? new Element()
                : selector === '[data-floating-slot="admin-changes-bar"]'
                  ? slot
                  : selector === '[data-collapsible-section="terms-of-service"]'
                    ? panel
                    : null,
    };
    const requests = [];
    const section = createAdminSection({
        i18n: { t: (key) => key },
        apiFetch: async (path, options) => {
            requests.push({ path, options });
            return Response.json({ data: [] });
        },
        openPopup: async () =>
            assert.fail("The guide does not remove legal documents"),
    });
    await section.dataReady;
    section.subComposerOptions.onRender(root);
    context.after(() => section.subComposerOptions.onUnmount());
    const steps = Object.fromEntries(
        guides[0].definitions[0].steps.map((step) => [step.id, step]),
    );
    return {
        panel,
        summary,
        textarea,
        compose,
        preview,
        previewPane,
        action,
        slot,
        requests,
        steps,
    };
}

test("the publishing branch opens an editor and requires real staged changes before preview and Save guidance", async (context) => {
    const state = await fixture(context);
    state.steps.documents.enter({ target: state.summary });
    assert.equal(state.panel.open, false);
    assert.equal(state.panel.dataset.legalEditor, "false");
    assert.equal(
        state.steps.add.advance.accept({ target: state.action }),
        false,
    );
    state.action.click();
    assert.equal(state.panel.open, true);
    assert.equal(state.panel.dataset.legalEditor, "true");
    assert.equal(
        state.steps.add.advance.accept({ target: state.action }),
        true,
    );
    assert.equal(
        state.steps.edit.advance.accept({ target: state.textarea }),
        false,
    );
    state.textarea.value = "# A reviewed draft";
    state.textarea.dispatchEvent(new Event("input"));
    assert.equal(dirty.get("terms-of-service"), true);
    assert.equal(state.panel.dataset.legalDraft, "true");
    assert.equal(
        state.steps.edit.advance.accept({ target: state.textarea }),
        true,
    );
    assert.deepEqual(state.steps.preview.dependsOn, ["edit"]);
    assert.deepEqual(state.steps.publish.dependsOn, ["preview"]);
    assert.equal(
        state.steps.preview.advance.accept({ target: state.preview }),
        false,
    );
    state.preview.click();
    assert.equal(
        state.steps.preview.advance.accept({ target: state.preview }),
        true,
    );
    assert.equal(state.previewPane.hidden, false);
    assert.match(state.previewPane.innerHTML, /A reviewed draft/);
    assert.ok(state.requests.every(({ options }) => !options?.method));
});

test("Next can bypass unedited branches and unpublished documents omit consent guidance", async (context) => {
    const state = await fixture(context);
    assert.equal(state.steps.publish.when({ targetAvailable: false }), false);
    assert.equal(state.steps.consent.when({ targetAvailable: false }), false);
    assert.equal(state.steps.consent.when({ targetAvailable: true }), true);
    assert.equal(state.panel.dataset.legalDraft, "false");
    assert.deepEqual(state.steps.preview.dependsOn, ["edit"]);
    assert.equal(
        new Set(Object.values(state.steps).map(({ selector }) => selector))
            .size,
        Object.keys(state.steps).length,
    );
    assert.ok(state.requests.every(({ options }) => !options?.method));
});

test("discarding a real draft clears the owner marker and preserves the stored document", async (context) => {
    const state = await fixture(context);
    state.textarea.value = "# Draft";
    state.textarea.dispatchEvent(new Event("input"));
    barOptions.onDiscard();
    assert.equal(state.textarea.value, "");
    assert.equal(state.panel.dataset.legalDraft, "false");
    assert.ok(state.requests.every(({ options }) => !options?.method));
});

test("compliance search and filter progression require the user's matching action", async (context) => {
    const { steps } = await fixture(context);
    assert.equal(
        steps.consent.advance.accept({ target: { value: " " } }),
        false,
    );
    assert.equal(
        steps.consent.advance.accept({ target: { value: "Alex" } }),
        true,
    );
    const filter = new Element();
    filter.closest = () => filter;
    filter.setAttribute("aria-pressed", "false");
    assert.equal(
        steps["compliance-filter"].advance.accept({ target: filter }),
        false,
    );
    filter.setAttribute("aria-pressed", "true");
    assert.equal(
        steps["compliance-filter"].advance.accept({ target: filter }),
        true,
    );
    for (const id of [
        "compliance-document",
        "consent",
        "compliance-filter",
        "compliance-versions",
    ]) {
        assert.equal(steps[id].when({ targetAvailable: false }), false);
        assert.equal(steps[id].when({ targetAvailable: true }), true);
    }
});
