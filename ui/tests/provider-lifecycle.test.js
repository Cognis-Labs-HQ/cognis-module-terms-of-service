import assert from "node:assert/strict";
import test from "node:test";

const links = new Map();
const capabilities = new Map();
const requests = [];
const footer = {
    list: () => [...links.values()],
    add(link) {
        links.set(link.id, {
            ...link,
            contexts: link.contexts ?? ["authentication"],
        });
        return () => links.delete(link.id);
    },
};
capabilities.set("ui:footerLinks", footer);
capabilities.set("ui:reuse", {
    loadStylesheet: async () => {},
    importModule: async () => ({
        apiFetch: async (path, options) => {
            requests.push({ path, options });
            return {
                ok: true,
                json: async () => ({
                    data: {
                        accepted: true,
                        required: false,
                        documents: [
                            {
                                slug: "terms-of-service",
                                path: "/terms-of-service",
                            },
                        ],
                    },
                }),
            };
        },
        createI18n: async () => ({ t: (key) => key }),
        openPopup: () => assert.fail("Accepted consent must not prompt"),
        escapeHtml: String,
    }),
});
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: { get: (id) => capabilities.get(id) },
};
globalThis.window = new EventTarget();
globalThis.location = { pathname: "/login" };
globalThis.document = { visibilityState: "visible" };
globalThis.localStorage = { getItem: () => "" };
const { mountProvider } = await import("../consent-enforcement.js");

test("import is inert and cached providers remount with owned cleanup", async () => {
    assert.equal(requests.length, 0);
    assert.equal(links.size, 0);
    for (let cycle = 0; cycle < 2; cycle++) {
        const controller = new AbortController();
        const hooks = [];
        const ctx = {
            signal: controller.signal,
            capabilities: {
                get: (id) => capabilities.get(id),
                contribute: (id, value) => capabilities.set(id, value),
            },
            extendFlow: (...args) => hooks.push(args),
        };
        const dispose = await mountProvider(ctx);
        await new Promise((resolve) => setImmediate(resolve));
        assert.equal(hooks.length, 1);
        assert.equal(links.size, 1);
        assert.equal([...links.values()][0].target, "_blank");
        assert.deepEqual([...links.values()][0].contexts, ["application"]);
        for (const event of ["popstate", "pageshow"]) {
            links.clear();
            window.dispatchEvent(new Event(event));
            await new Promise((resolve) => setImmediate(resolve));
            assert.equal(links.size, 1, event);
            assert.deepEqual([...links.values()][0].contexts, ["application"]);
        }
        assert.equal(
            typeof capabilities.get("terms-of-service:refreshFooterLinks"),
            "function",
        );
        controller.abort();
        dispose();
        capabilities.delete("terms-of-service:refreshFooterLinks");
        assert.equal(links.size, 0);
        const count = requests.length;
        window.dispatchEvent(new Event("cognis:route-will-change"));
        await new Promise((resolve) => setImmediate(resolve));
        assert.equal(requests.length, count);
    }
});
