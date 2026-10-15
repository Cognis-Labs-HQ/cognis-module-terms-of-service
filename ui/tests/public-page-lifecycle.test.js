import test from "node:test";
import assert from "node:assert/strict";

let translationWait;
let documentWait;
let composerWait;
const events = [];
const modules = {
    "page-styles.js": {
        ensurePageStylesheet: async (url) => {
            assert.ok(url.endsWith("/ui/styles/legal.css"));
            events.push("legal-styles");
        },
    },
    "api-client.js": {
        apiFetch: async () => {
            if (documentWait) await documentWait;
            return Response.json({ data: { markdown: "Document" } });
        },
    },
    "i18n.js": {
        createI18n: async () => {
            if (translationWait) await translationWait;
            return { locale: "en", t: (key) => key };
        },
        applyDocumentTitle: () => events.push("title"),
    },
    "markdown-renderer.js": {
        renderMarkdown: String,
        initializeMarkdownCodeCopy() {},
    },
    "escape-html.js": { escapeHtml: String },
    "page-entry.js": {
        beginPageLoading: () => {
            let finished = false;
            return () => {
                if (finished) return;
                finished = true;
                events.push("finished");
            };
        },
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
                      loadStylesheet: async (path) => {
                          assert.match(path, /^[a-z0-9-]+\.css$/);
                      },
                      loadStylesheets: async () =>
                          assert.fail("Module CSS must use page-styles.js"),
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
const { mount, createAdminSection } = await import("../app.js");

test("Legal administration remains discoverable after module styles load", async () => {
    assert.ok(events.includes("legal-styles"));
    const section = createAdminSection({
        i18n: { t: (key) => key },
        apiFetch: async () => Response.json({ data: [] }),
    });
    await section.dataReady;
    assert.equal(section.id, "terms-of-service-legal");
    assert.equal(
        section.subComposerOptions.elements[0].id,
        "terms-of-service-documents",
    );
});

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
        assert.ok(events.includes("finished"));
        release();
        await operation;
        assert.equal(events.filter((event) => event === "finished").length, 1);
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
