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
let fallbackLoads = 0;
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
                createI18n: async () => ({ locale: "fr", t: () => "" }),
                extendI18n: async (base, paths) => {
                    assert.equal(base.locale, "en");
                    assert.deepEqual(paths, [
                        "/static/modules/terms-of-service/languages",
                    ]);
                    fallbackLoads++;
                    return { locale: "en", t: (key) => english.get(key) ?? "" };
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

test("missing selected-locale labels use module English; footer errors cannot block mandatory consent", async () => {
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
        assert.ok(fallbackLoads > 0);
        assert.equal(
            links.get("terms-of-service:terms-of-service").label,
            "Terms of Service (ToS)",
        );
        assert.ok(
            logs.some(
                ([, , details]) =>
                    details.operation === "translateLegalContent",
            ),
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
