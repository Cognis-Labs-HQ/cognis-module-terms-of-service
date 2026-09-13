import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("ui/app.js", "utf8");
const resources = readFileSync("ui/reuse/resources.js", "utf8");
const enforcement = readFileSync("ui/consent-enforcement.js", "utf8");
const registration = readFileSync("ui/registration-consent.js", "utf8");
const legalStyles = readFileSync("ui/styles/legal.css", "utf8");

test("browser code imports the core Markdown renderer through ui:reuse", () => {
    assert.match(resources, /Symbol\.for\("cognis\.uiCtx"\)/);
    assert.match(resources, /capabilities\.get\("ui:reuse"\)/);
    assert.match(source, /importReuseModule\("markdown-renderer\.js"\)/);
    assert.match(source, /renderMarkdown\(textarea\.value\)/);
    assert.doesNotMatch(source, /host\.reuse|markdownComposer/);
});

test("legal editors use Cognis utilities and standard action variants", () => {
    assert.match(source, /importReuseModule\("unsaved-changes\.js"\)/);
    assert.match(source, /importReuseModule\("info-tooltip\.js"\)/);
    assert.match(source, /createUnsavedChangesBar/);
    assert.match(source, /renderInfoTooltip/);
    assert.match(
        source,
        /terms-of-service-document-action \$\{actionVariant\}/,
    );
    assert.match(source, /hasPublishedContent/);
    assert.match(source, /actionVariant/);
    assert.match(source, /module\.terms_of_service\.action\.add/);
    assert.match(source, /classList\.add\("btn-cancel"\)/);
    assert.match(source, /await openPopup\(\{/);
    assert.match(source, /<header class="terms-of-service-document-header">/);
    assert.doesNotMatch(source, /<details|<summary|collapseIconMarkup/);
    assert.match(source, /function documentsMarkup[\s\S]*renderInfoTooltip/);
    assert.match(legalStyles, /terms-of-service-editor\[hidden\]/);
    assert.doesNotMatch(source, /data-action="publish"/);
});

test("dirty tracker save publishes updates and sends a success toast", () => {
    assert.match(source, /data-action="save"/);
    assert.match(source, /method: "PUT"/);
    assert.match(source, /message\.updated/);
    assert.match(source, /showToast/);
    assert.match(source, /\.floating-toolbar/);
    assert.match(source, /createUnsavedChangesBar\(slot/);
    assert.match(source, /if \(!savedMarkdown\) closeEditor\(\)/);
    assert.match(
        source,
        /function closeEditor\(\)[\s\S]*editor\.hidden = true/,
    );
    assert.match(source, /error: new Error\(message\)/);
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
    assert.match(enforcement, /response\.status === 404/);
    assert.match(enforcement, /if \(!consentEndpointAvailable\) return null/);
    assert.match(enforcement, /consentEndpointAvailable = false/);
    assert.match(enforcement, /operation: "loadConsentStatus"/);
    assert.match(
        enforcement,
        /if \(!status\) return \{ requiresSetup: false \}/,
    );
    assert.doesNotMatch(
        enforcement,
        /!localStorage\.getItem\("cognis_access_token"\)/,
    );
    assert.match(enforcement, /while \(true\)/);
    assert.match(enforcement, /CONSENT_REFRESH_INTERVAL_MS = 5_000/);
    assert.match(enforcement, /enforceAuthenticatedConsentOnce/);
    assert.match(enforcement, /scheduleConsentRefresh/);
    assert.match(enforcement, /export function teardownConsentEnforcement/);
    assert.match(enforcement, /operation: "refreshConsentStatus"/);
});

test("admin contribution follows the Administration sub-composer contract", () => {
    assert.match(source, /export function createAdminSection/);
    assert.match(source, /subComposerOptions:/);
    assert.match(source, /dataReady/);
    assert.match(source, /onRender\(root\)/);
    assert.match(
        source,
        /DOCUMENTS\.some\(\(document\) => document\.slug === directRouteSlug\)/,
    );
});

test("UI supplies all three fixed legal documents", () => {
    for (const slug of ["terms-of-service", "privacy-policy", "eula"]) {
        assert.match(source, new RegExp(`slug: "${slug}"`));
    }
    assert.match(source, /id: "terms-of-service-documents"/);
    assert.match(source, /default: \[12, 6\]/);
    assert.match(source, /max: "full"/);
});
