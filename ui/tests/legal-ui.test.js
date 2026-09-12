import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("ui/app.js", "utf8");

test("editor delegates Compose, Preview, and rendering to core reuse", () => {
    assert.match(source, /host\.reuse\.get\("markdown:composer"\)/);
    assert.match(source, /markdownComposer\.bind/);
    assert.match(source, /markdownComposer\.render/);
    assert.doesNotMatch(source, /innerHTML\s*=.*markdown/);
});

test("UI supplies all three fixed legal documents", () => {
    for (const slug of ["terms-of-service", "privacy-policy", "eula"]) {
        assert.match(source, new RegExp(`slug: "${slug}"`));
    }
});
