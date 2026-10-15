import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const english = new Map(
    [
        ...readFileSync(
            new URL("../languages/en/strings.xml", import.meta.url),
            "utf8",
        ).matchAll(/<string name="([^"]+)">([^<]*)<\/string>/g),
    ].map((match) => [match[1], match[2]]),
);
const logs = [];
const links = new Map();
const popups = [];
const flows = [];
let required = false;
let footerFailure = false;
let translationLoads = 0;
let popupAction = "decline";
let submitted;
const capabilities = new Map([
    ["ui:log", (...args) => logs.push(args)],
    [
        "ui:footerLinks",
        {
            list: () => [...links.values()],
            add(link) {
                assert.ok(
                    link.id && link.href && link.label,
                    "host requires complete descriptors",
                );
                if (footerFailure) throw new Error("footer_render_failed");
                links.set(link.id, link);
                return () => links.delete(link.id);
            },
        },
    ],
    [
        "ui:reuse",
        {
            loadStylesheet: async () => {},
            importModule: async () => ({
                apiFetch: async (_path, options) => {
                    if (options?.method === "POST") {
                        submitted = JSON.parse(options.body);
                        required = false;
                    }
                    return Response.json({
                        data: {
                            accepted: !required,
                            required,
                            documents: [
                                {
                                    slug: "terms-of-service",
                                    path: "/terms-of-service",
                                    version: "published",
                                    state: "new",
                                    accepted: !required,
                                },
                            ],
                        },
                    });
                },
                createI18n: async (options) => {
                    assert.deepEqual(options.componentStringBaseUrls, [
                        "/static/modules/terms-of-service/languages",
                    ]);
                    translationLoads++;
                    return {
                        locale: "fr",
                        t(key) {
                            const value = english.get(key);
                            if (value) return value;
                            throw new Error(`missing_translation:${key}`);
                        },
                    };
                },
                openPopup: async (options) => {
                    popups.push(options);
                    if (popupAction === "submit") {
                        assert.equal(
                            options.onAction("submit", {
                                querySelectorAll: () => [{ checked: true }],
                            }),
                            true,
                        );
                    }
                    return popupAction;
                },
                escapeHtml: String,
            }),
        },
    ],
]);
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: { get: (id) => capabilities.get(id) },
};
globalThis.window = new EventTarget();
globalThis.location = { pathname: "/calendar" };
globalThis.document = { visibilityState: "visible" };
globalThis.localStorage = { getItem: () => "" };
const { mountProvider } = await import("../consent-enforcement.js");

test("host-resolved labels are used and footer errors cannot block mandatory consent", async () => {
    const controller = new AbortController();
    let enforce;
    const dispose = await mountProvider({
        signal: controller.signal,
        capabilities: {
            get: (id) => capabilities.get(id),
            contribute: (id, value) => capabilities.set(id, value),
        },
        extendFlow: (_flow, _stage, _descriptor, handler) => {
            enforce = handler;
        },
        runFlow: async (...args) => flows.push(args),
    });
    try {
        await new Promise((resolve) => setImmediate(resolve));
        assert.ok(translationLoads > 0);
        assert.equal(
            links.get("terms-of-service:terms-of-service").label,
            "Terms of Service (ToS)",
        );
        assert.equal(popups.length, 0);
        links.clear();
        footerFailure = true;
        required = true;
        const result = await enforce({
            stageResults: { "validate-stored-token": [{ valid: true }] },
        });
        assert.equal(popups.length, 1);
        assert.equal(popups[0].mandatory, true);
        assert.equal(
            popups[0].title,
            english.get("module.terms-of-service.consent.title"),
        );
        assert.match(popups[0].body, /Terms of Service/);
        assert.ok(
            logs.some(
                ([, , details]) =>
                    details.operation === "registerFooterLink" &&
                    details.error === "footer_render_failed",
            ),
        );
        assert.deepEqual(flows, [["logout", { reason: "termsDeclined" }]]);
        assert.deepEqual(result, { requiresSetup: true, redirectTo: "/login" });
        globalThis.CustomEvent = class extends Event {};
        popupAction = "submit";
        const accepted = await enforce({
            stageResults: { "validate-stored-token": [{ valid: true }] },
        });
        assert.deepEqual(submitted, {
            accepted: true,
            versions: { "terms-of-service": "published" },
        });
        assert.deepEqual(accepted, { requiresSetup: false });
    } finally {
        controller.abort();
        dispose();
    }
});

test("missing or empty English keys reject mounting and leave no refresh listeners", async () => {
    for (const key of [
        "module.terms-of-service.document.terms",
        "module.terms-of-service.consent.title",
    ]) {
        const original = english.get(key);
        for (const missing of [undefined, ""]) {
            if (missing === undefined) english.delete(key);
            else english.set(key, missing);
            required = true;
            const controller = new AbortController();
            const promptCount = popups.length;
            const loads = translationLoads;
            try {
                await assert.rejects(
                    mountProvider({
                        signal: controller.signal,
                        capabilities: {
                            get: (id) => capabilities.get(id),
                            contribute: (id, value) =>
                                capabilities.set(id, value),
                        },
                        extendFlow() {},
                    }),
                    { message: `missing_translation:${key}` },
                );
                assert.equal(popups.length, promptCount);
                assert.equal(links.size, 0);
                window.dispatchEvent(new Event("popstate"));
                await new Promise((resolve) => setImmediate(resolve));
                assert.equal(translationLoads, loads + 1);
            } finally {
                controller.abort();
                english.set(key, original);
                required = false;
            }
        }
    }
});

test("periodic missing translations propagate and stop subsequent refreshes", async () => {
    const originalSetTimeout = globalThis.setTimeout;
    const originalClearTimeout = globalThis.clearTimeout;
    const originalKey = english.get("module.terms-of-service.consent.title");
    const originalGetItem = localStorage.getItem;
    const controller = new AbortController();
    let refresh;
    let schedules = 0;
    globalThis.setTimeout = (callback) => {
        refresh = callback;
        schedules++;
        return schedules;
    };
    globalThis.clearTimeout = () => {};
    localStorage.getItem = () => "token";
    let dispose;
    try {
        required = false;
        dispose = await mountProvider({
            signal: controller.signal,
            capabilities: {
                get: (id) => capabilities.get(id),
                contribute: (id, value) => capabilities.set(id, value),
            },
            extendFlow() {},
        });
        assert.equal(schedules, 1);
        required = true;
        english.delete("module.terms-of-service.consent.title");
        await assert.rejects(
            refresh(),
            /missing_translation:module.terms-of-service.consent.title/,
        );
        assert.equal(schedules, 1);
        assert.equal(links.size, 0);
    } finally {
        globalThis.setTimeout = originalSetTimeout;
        globalThis.clearTimeout = originalClearTimeout;
        localStorage.getItem = originalGetItem;
        english.set("module.terms-of-service.consent.title", originalKey);
        required = false;
        controller.abort();
        dispose?.();
    }
});

test("initial consent decline releases mounting before navigation finishes", async () => {
    const controller = new AbortController();
    let destination;
    let settleNavigation;
    const navigation = new Promise((resolve) => {
        settleNavigation = resolve;
    });
    capabilities.set("ui:navigate", (path) => {
        destination = path;
        return navigation;
    });
    const previousFooterFailure = footerFailure;
    footerFailure = false;
    popupAction = "decline";
    required = true;
    let dispose;
    try {
        dispose = await mountProvider({
            signal: controller.signal,
            capabilities: {
                get: (id) => capabilities.get(id),
                contribute: (id, value) => capabilities.set(id, value),
            },
            extendFlow() {},
            runFlow: async (...args) => flows.push(args),
        });
        assert.equal(destination, "/login");
        assert.equal(typeof dispose, "function");
    } finally {
        settleNavigation();
        controller.abort();
        dispose?.();
        capabilities.delete("ui:navigate");
        footerFailure = previousFooterFailure;
        required = false;
    }
});
