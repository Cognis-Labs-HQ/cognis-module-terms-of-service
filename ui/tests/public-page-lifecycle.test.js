import test from "node:test";
import assert from "node:assert/strict";

let translationWait;
let documentWait;
let composerWait;
const events = [];
const modules = {
    "api-client.js": {
        apiFetch: async () => {
            if (documentWait) await documentWait;
            return Response.json({ data: { markdown: "Document" } });
        },
    },
    "i18n.js": {
        createI18n: async () => {
            if (translationWait) await translationWait;
            return { t: (key) => key };
        },
        applyDocumentTitle: () => events.push("title"),
    },
    "markdown-renderer.js": {
        renderMarkdown: String,
        initializeMarkdownCodeCopy() {},
    },
    "escape-html.js": { escapeHtml: String },
    "page-entry.js": {
        beginPageLoading: () => () => events.push("finished"),
        async mountWhenDirect() {},
    },
    "auth-session.js": { ensureFullAccountSession: async () => {} },
    "unsaved-changes.js": {},
    "info-tooltip.js": {},
    "collapsible-section-composer.js": {},
    "side-menu.js": { createSideMenu: () => ({}) },
    "page-composer/index.js": {
        createPageComposer: () => {
            events.push("composer");
            return {
                init: async () => {
                    if (composerWait) await composerWait;
                },
                destroy: () => events.push("destroy"),
            };
        },
    },
};
globalThis.location = { pathname: "/terms-of-service" };
globalThis.localStorage = { getItem: () => null };
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: {
        get: (id) =>
            id === "ui:reuse"
                ? {
                      importModule: async (path) => modules[path],
                      loadStylesheet: async () => {},
                  }
                : id === "ui:pagination"
                  ? {
                        createPagination: () =>
                            assert.fail("No pagination expected"),
                        renderPaginationControls: () =>
                            assert.fail("No pagination expected"),
                        bindPaginationControls: () =>
                            assert.fail("No pagination expected"),
                    }
                  : undefined,
    },
};
const { mount } = await import("../app.js");

for (const phase of ["translations", "document", "composer"]) {
    test(`public legal page releases ${phase} work when its mount is aborted`, async () => {
        events.length = 0;
        let release;
        const pending = new Promise((resolve) => {
            release = resolve;
        });
        translationWait = phase === "translations" ? pending : null;
        documentWait = phase === "document" ? pending : null;
        composerWait = phase === "composer" ? pending : null;
        const controller = new AbortController();
        const operation = mount({}, { signal: controller.signal });
        await new Promise((resolve) => setImmediate(resolve));
        controller.abort();
        release();
        await operation;
        assert.equal(events.at(-1), "finished");
        assert.equal(
            events.filter((event) => event === "composer").length,
            phase === "composer" ? 1 : 0,
        );
        assert.equal(
            events.filter((event) => event === "destroy").length,
            phase === "composer" ? 1 : 0,
        );
    });
}
