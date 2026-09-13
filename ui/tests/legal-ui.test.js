import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("ui/app.js", "utf8");
const resources = readFileSync("ui/reuse/resources.js", "utf8");
const enforcement = readFileSync("ui/consent-enforcement.js", "utf8");
const registration = readFileSync("ui/registration-consent.js", "utf8");
const legalStyles = readFileSync("ui/styles/legal.css", "utf8");
const uiRegistration = readFileSync("api/ui.js", "utf8");

test("browser code imports the core Markdown renderer through ui:reuse", () => {
    assert.match(resources, /Symbol\.for\("cognis\.uiCtx"\)/);
    assert.match(resources, /capabilities\.get\("ui:reuse"\)/);
    assert.match(source, /importReuseModule\("markdown-renderer\.js"\)/);
    assert.match(source, /importReuseModule\("page-composer\/index\.js"\)/);
    assert.match(source, /renderMarkdown\(textarea\.value\)/);
    assert.doesNotMatch(source, /host\.reuse|markdownComposer/);
});

test("legal editors use Cognis utilities and standard action variants", () => {
    assert.match(source, /importReuseModule\("unsaved-changes\.js"\)/);
    assert.match(source, /importReuseModule\("info-tooltip\.js"\)/);
    assert.match(
        source,
        /importReuseModule\("collapsible-section-composer\.js"\)/,
    );
    assert.match(source, /createUnsavedChangesBar/);
    assert.match(
        source,
        /createCollapsibleSectionComposer\(\{ escapeHtml \}\)/,
    );
    assert.match(source, /renderInfoTooltip/);
    assert.match(
        source,
        /terms-of-service-document-action \$\{actionVariant\}/,
    );
    assert.match(source, /hasPublishedContent/);
    assert.match(source, /actionVariant/);
    assert.match(source, /actionKey = hasPublishedContent \? "remove" : "add"/);
    assert.match(
        source,
        /classList\.toggle\("btn-cancel", hasStoredDocument\)/,
    );
    assert.match(source, /await openPopup\(\{/);
    assert.match(source, /controlsHtml:/);
    assert.match(source, /contentHtml:/);
    assert.match(source, /title: i18n\.t/);
    assert.doesNotMatch(source, /terms-of-service-tabs|collapseIconMarkup/);
    assert.match(source, /function documentsMarkup[\s\S]*renderInfoTooltip/);
    assert.match(legalStyles, /terms-of-service-compose-pane\[hidden\]/);
    assert.doesNotMatch(source, /data-action="publish"/);
});

test("dirty tracker save publishes updates and sends a success toast", () => {
    assert.match(source, /method: "PUT"/);
    assert.match(source, /message\.updated/);
    assert.match(source, /showToast/);
    assert.match(source, /data-floating-slot="admin-changes-bar"/);
    assert.match(source, /createUnsavedChangesBar\(slot/);
    assert.match(source, /if \(!savedMarkdown\) closeEditor\(\)/);
    assert.match(source, /function closeEditor\(\)[\s\S]*panel\.open = false/);
    assert.match(source, /confirmMessage:/);
    assert.match(source, /hasStoredDocument/);
    assert.match(source, /syncDocumentAction/);
    assert.doesNotMatch(source, /panel\.addEventListener\("toggle"/);
    assert.match(source, /terms-of-service-mode-toggle btn-neutral/);
    assert.match(
        source,
        /collapsible-section-action-row terms-of-service-mode-row/,
    );
    assert.match(legalStyles, /resize: none !important/);
    assert.match(source, /onUnmount\(\)[\s\S]*dirtyBar\?\.destroy/);
    assert.match(source, /if \(!slot\?\.isConnected\) return null/);
    assert.match(source, /if \(!section\?\.isConnected\) return null/);
    assert.match(source, /error: new Error\(message\)/);
});

test("consent is enforced during registration and authenticated sessions", () => {
    assert.match(registration, /createRegistrationField/);
    assert.match(registration, /completeRegistration/);
    assert.match(enforcement, /authenticate-session/);
    assert.match(enforcement, /enforce-setup-requirements/);
    assert.match(enforcement, /runFlow\("logout"/);
    assert.match(enforcement, /mandatory: true/);
    assert.match(enforcement, /\/api\/v1\/auth\/account-lifecycle/);
    assert.match(enforcement, /action: "delete"/);
    assert.match(enforcement, /ui:footerLinks/);
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
    assert.match(enforcement, /terms-of-service-consent-card/);
    assert.match(enforcement, /class="choice-checkbox"/);
    assert.match(enforcement, /loadReuseStylesheet\("choice-checkbox\.css"\)/);
    assert.match(enforcement, /loadReuseStylesheet\("state-pill\.css"\)/);
    assert.match(enforcement, /loadModuleStylesheet\(\)/);
    assert.match(enforcement, /data-consent-document/);
    assert.match(enforcement, /acceptedVersions/);
    assert.match(enforcement, /status\.documents\.map/);
    assert.match(enforcement, /terms-of-service-consent-read/);
    assert.match(
        enforcement,
        /if \(status\.accepted && !status\.required\) return true/,
    );
    assert.match(
        uiRegistration,
        /registerNavbarPlugin\([\s\S]*stylesheets: \["\/static\/modules\/terms-of-service\/styles\/legal\.css"\]/,
    );
    assert.match(legalStyles, /terms-of-service-consent-title \.state-pill/);
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

test("public legal documents use one naturally scrolling composed page", () => {
    assert.match(source, /createPageComposer\(root, \{/);
    assert.match(source, /contentScrolling: false/);
    assert.match(source, /requireAccountSession: authenticated/);
    assert.match(source, /toolbarScrollable: true/);
    assert.match(source, /querySelectorAll\("h2, h3"\)/);
    assert.match(source, /data-document-section/);
    assert.match(source, /publicPageComposers\.get\(root\)\?\.destroy/);
    assert.doesNotMatch(source, /openDocumentPopup/);
    assert.match(source, /beginPageLoading\(root\)/);
    assert.match(source, /ensureFullAccountSession\(\)/);
    assert.match(source, /showNavbar: authenticated/);
});

test("administration renders filterable paginated consent reports", () => {
    assert.match(source, /consent-report\/\$\{document\.slug\}/);
    assert.match(source, /data-consent-filter="\$\{filter\}"/);
    assert.match(source, /data-consent-search/);
    assert.match(source, /REPORT_PAGE_SIZE = 10/);
    assert.match(source, /data-report-previous/);
    assert.match(source, /data-report-next/);
    assert.match(source, /activateConsentReport/);
    assert.match(legalStyles, /terms-of-service-report table/);
    assert.match(legalStyles, /block-size: 20rem/);
});
