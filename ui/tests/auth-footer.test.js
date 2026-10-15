import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const labels = new Map(
    [
        ...readFileSync(
            new URL("../languages/en/strings.xml", import.meta.url),
            "utf8",
        ).matchAll(/<string name="([^"]+)">([^<]*)<\/string>/g),
    ].map((match) => [match[1], match[2]]),
);
let published = ["terms-of-service", "eula"];
const requests = [];
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: {
        get: () => ({
            importModule: async (path) =>
                path === "api-client.js"
                    ? {
                          apiFetch: async (url, options) => {
                              requests.push({ url, options });
                              return Response.json({
                                  data: published.map((slug) => ({ slug })),
                              });
                          },
                      }
                    : {
                          createI18n: async (options) => {
                              assert.deepEqual(
                                  options.componentStringBaseUrls,
                                  [
                                      "/static/modules/terms-of-service/languages",
                                  ],
                              );
                              return {
                                  locale: "en",
                                  t: (key) => labels.get(key) ?? "",
                              };
                          },
                      },
        }),
    },
};
const { listAuthFooterLinks } = await import("../auth-footer.js");

test("anonymous footer descriptors contain localized published links with new-tab targets", async () => {
    const links = await listAuthFooterLinks();
    assert.deepEqual(
        links.map(({ href }) => href),
        ["/terms-of-service", "/eula"],
    );
    assert.equal(
        links[0].label,
        labels.get("module.terms-of-service.document.terms"),
    );
    assert.equal(
        links[1].label,
        labels.get("module.terms-of-service.document.eula"),
    );
    assert.ok(links.every(({ target }) => target === "_blank"));
    assert.equal(requests[0].url, "/api/v1/modules/terms-of-service/public");
    assert.equal(requests[0].options.suppressAccessDeniedEvent, true);
});

test("a later authentication mount refreshes its published document set", async () => {
    published = ["privacy-policy"];
    assert.deepEqual(
        (await listAuthFooterLinks()).map(({ href }) => href),
        ["/privacy-policy"],
    );
});
