import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("ui/app.js", "utf8");
const resources = readFileSync("ui/reuse/resources.js", "utf8");
const enforcement = readFileSync("ui/consent-enforcement.js", "utf8");
const registration = readFileSync("ui/registration-consent.js", "utf8");

test("browser code imports the core Markdown renderer through ui:reuse", () => {
    assert.match(resources, /Symbol\.for\("cognis\.uiCtx"\)/);
    assert.match(resources, /capabilities\.get\("ui:reuse"\)/);
    assert.match(source, /importReuseModule\("markdown-renderer\.js"\)/);
    assert.match(source, /renderMarkdown\(textarea\.value\)/);
    assert.doesNotMatch(source, /host\.reuse|markdownComposer/);
});

test("consent is enforced during registration and authenticated sessions", () => {
    assert.match(registration, /createRegistrationField/);
    assert.match(registration, /completeRegistration/);
    assert.match(enforcement, /authenticate-session/);
    assert.match(enforcement, /enforce-setup-requirements/);
    assert.match(enforcement, /\/api\/v1\/auth\/logout/);
    assert.match(enforcement, /response\.ok/);
    assert.match(enforcement, /validate-stored-token/);
    assert.match(enforcement, /apply-alternate-auth/);
    assert.doesNotMatch(
        enforcement,
        /!localStorage\.getItem\("cognis_access_token"\)/,
    );
    assert.match(enforcement, /while \(true\)/);
});

test("admin contribution follows the Administration sub-composer contract", () => {
    assert.match(source, /export function createAdminSection/);
    assert.match(source, /subComposerOptions:/);
    assert.match(source, /dataReady/);
    assert.match(source, /onRender\(root\)/);
});

test("UI supplies all three fixed legal documents", () => {
    for (const slug of ["terms-of-service", "privacy-policy", "eula"]) {
        assert.match(source, new RegExp(`slug: "${slug}"`));
    }
});
