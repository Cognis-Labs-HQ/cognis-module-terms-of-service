import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("ui/app.js", "utf8");
const resources = readFileSync("ui/reuse/resources.js", "utf8");
const enforcement = readFileSync("ui/consent-enforcement.js", "utf8");
const registration = readFileSync("ui/registration-consent.js", "utf8");
const legalStyles = readFileSync("ui/styles/legal.css", "utf8");
const uiRegistration = readFileSync("api/ui.js", "utf8");
const authFooter = readFileSync("ui/auth-footer.js", "utf8");
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));

test("browser code imports the core Markdown renderer through ui:reuse", () => {
    assert.match(resources, /Symbol\.for\("cognis\.uiCtx"\)/);
    assert.match(resources, /capabilities\.get\("ui:reuse"\)/);
    assert.match(source, /importReuseModule\("markdown-renderer\.js"\)/);
    assert.match(source, /importReuseModule\("page-composer\/index\.js"\)/);
    assert.match(source, /importReuseModule\("side-menu\.js"\)/);
    assert.match(source, /renderMarkdown\(textarea\.value\)/);
    assert.doesNotMatch(source, /host\.reuse|markdownComposer/);
});

test("document comparison declares its host capability", () => {
    assert.ok(manifest.requiresCapabilities.includes("ui:documentDiff"));
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
        /createCollapsibleSectionComposer\(\{[\s\S]*detailsLabel: i18n\.t\("module\.terms_of_service\.action\.details"\)/,
    );
    assert.match(source, /renderInfoTooltip/);
    assert.match(
        source,
        /terms-of-service-document-action \$\{actionVariant\}/,
    );
    assert.match(source, /hasPublishedContent/);
    assert.match(source, /actionVariant/);
    assert.match(source, /actionKey = hasPublishedContent \? "remove" : "add"/);
    assert.match(source, /let editorActive = panel\.open/);
    assert.match(source, /actionKey = editorActive \? "remove" : "add"/);
    assert.match(
        source,
        /editorActive = false;[\s\S]*closeEditor\(\);[\s\S]*syncDocumentAction\(\)/,
    );
    assert.match(source, /classList\.toggle\("btn-cancel", editorActive\)/);
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
    assert.match(source, /editorActive/);
    assert.match(source, /syncDocumentAction/);
    assert.doesNotMatch(source, /panel\.addEventListener\("toggle"/);
    assert.match(source, /terms-of-service-mode-toggle btn-neutral/);
    assert.match(
        source,
        /terms-of-service-mode-toggle btn-neutral is-active[^>]+data-mode="compose"/,
    );
    assert.match(
        source,
        /composeButton\.classList\.toggle\("is-active", !previewSelected\)/,
    );
    assert.match(
        source,
        /previewButton\.classList\.toggle\("is-active", previewSelected\)/,
    );
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
    assert.match(
        enforcement,
        /id: "cancel",[\s\S]*module\.terms_of_service\.action\.cancel/,
    );
    assert.match(enforcement, /ui:footerLinks/);
    assert.match(enforcement, /footerLinks[\s\S]*\.list\?\.\(\)/);
    assert.match(enforcement, /cognis:route-will-change/);
    assert.match(enforcement, /function refreshFooterLinks/);
    assert.match(
        enforcement,
        /terms-of-service:refreshFooterLinks[\s\S]*refreshFooterLinks/,
    );
    assert.match(enforcement, /forceRender && footerRefreshPromise/);
    assert.match(enforcement, /forceRender && footerLinkDisposers\.has/);
    assert.match(enforcement, /footerRefreshPromise/);
    assert.match(enforcement, /operation: "refreshFooterLinks"/);
    assert.match(
        enforcement,
        /footerLinkDisposers\.has\(document\.slug\) && !registered/,
    );
    assert.doesNotMatch(source, /capabilities\.get\("ui:footerLinks"\)/);
    assert.match(enforcement, /response\.ok/);
    assert.match(enforcement, /validate-stored-token/);
    assert.match(enforcement, /apply-alternate-auth/);
    assert.match(enforcement, /response\.status === 404/);
    assert.doesNotMatch(enforcement, /consentEndpointAvailable/);
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
    assert.match(enforcement, /\?view=changes/);
    assert.match(enforcement, /class="choice-checkbox"/);
    assert.match(enforcement, /loadReuseStylesheet\("choice-checkbox\.css"\)/);
    assert.match(enforcement, /loadReuseStylesheet\("state-pill\.css"\)/);
    assert.match(enforcement, /loadModuleStylesheet\(\)/);
    assert.match(enforcement, /data-consent-document/);
    assert.match(enforcement, /submitButton\.disabled/);
    assert.match(enforcement, /checkbox\.addEventListener\("change"/);
    assert.match(enforcement, /consentCheckboxes\.every/);
    assert.match(enforcement, /acceptedVersions/);
    assert.match(enforcement, /capabilities\.get\("ui:showToast"\)/);
    assert.match(
        enforcement,
        /module\.terms_of_service\.consent\.select_all_error/,
    );
    assert.match(enforcement, /\{ variant: "error" \}/);
    assert.match(enforcement, /response\.status === 400/);
    assert.match(
        enforcement,
        /showToast\([\s\S]*select_all_error[\s\S]*return false/,
    );
    assert.match(enforcement, /status\.documents\.map/);
    assert.match(enforcement, /terms-of-service:consent-recorded/);
    assert.match(enforcement, /new CustomEvent/);
    assert.match(enforcement, /terms-of-service-consent-read/);
    assert.match(enforcement, /target="_blank" rel="noopener noreferrer"/);
    assert.match(enforcement, /event\.stopPropagation\(\)/);
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
    assert.match(enforcement, /consentEnforcementDisposed = true/);
    assert.match(
        enforcement,
        /if \(!consentEnforcementDisposed\) scheduleConsentRefresh\(\)/,
    );
    assert.match(enforcement, /export function teardownConsentEnforcement/);
    assert.match(
        enforcement,
        /if \(!event\.persisted\) teardownConsentEnforcement/,
    );
    assert.match(enforcement, /operation: "refreshConsentStatus"/);
});

test("authentication pages receive links to public legal routes", () => {
    assert.match(uiRegistration, /registerAuthFooterPlugin\(\{/);
    assert.match(uiRegistration, /auth-footer\.js/);
    assert.match(authFooter, /capabilities\.get\("ui:footerLinks"\)/);
    assert.match(authFooter, /footerLinks\.add\(\{/);
    assert.match(authFooter, /href: `\/\$\{document\.slug\}`/);
    assert.match(authFooter, /footerLinks\.remove\?\.\("core:changelogs"\)/);
    assert.match(authFooter, /public\/\$\{document\.slug\}/);
    assert.match(authFooter, /response\.status === 404/);
    assert.match(authFooter, /Promise\.allSettled/);
    assert.match(authFooter, /operation: "loadAuthFooterLink"/);
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
    assert.match(source, /loadReuseStylesheet\("document-diff\.css"\)/);
    assert.match(source, /URLSearchParams\(window\.location\.search\)/);
    assert.match(source, /capabilities\.get\("ui:documentDiff"\)/);
    assert.match(source, /renderMarkdownDocumentDiff/);
    assert.match(source, /consent-diff\/\$\{slug\}/);
    assert.match(
        source,
        /module\.terms_of_service\.consent\.changes_unavailable/,
    );
    assert.match(source, /toolbarScrollable: true/);
    assert.match(source, /querySelectorAll\("h2, h3"\)/);
    assert.match(source, /createSideMenu\(\{/);
    assert.match(source, /navigationMenu\.render\(\)/);
    assert.match(source, /navigationMenu\.mount\(navigation, \{ signal \}\)/);
    assert.match(source, /navigationMenu\.setActive\(sectionId\)/);
    assert.match(source, /targetId: id/);
    assert.match(source, /scrollBehavior: "smooth"/);
    assert.match(source, /terms-of-service:refreshFooterLinks/);
    assert.match(source, /refreshFooterLinks\(\{ forceRender: true \}\)/);
    assert.match(
        legalStyles,
        /terms-of-service-rendered h2,[\s\S]*scroll-margin-block-start: 5rem/,
    );
    assert.doesNotMatch(
        source,
        /root\.querySelector\(`#\$\{sectionId\}`\)\?\.scrollIntoView/,
    );
    assert.match(source, /data-legal-document-navigation/);
    assert.match(source, /publicPageComposers\.get\(root\)\?\.destroy/);
    assert.doesNotMatch(source, /openDocumentPopup/);
    assert.match(source, /beginPageLoading\(root\)/);
    assert.match(source, /mountWhenDirect/);
    assert.match(source, /ensureFullAccountSession\(\)/);
    assert.match(source, /showNavbar: authenticated/);
    assert.match(source, /applyDocumentTitle/);
    assert.match(
        source,
        /module\.terms_of_service\.public\.page_title\.\$\{definition\.titleKey\}/,
    );
    assert.match(source, /default: \[12, 1\]/);
    assert.match(source, /authenticated &&[\s\S]*get\("view"\) === "changes"/);
    assert.match(source, /pageContext: \{ title, subtitle: "" \}/);
    assert.match(source, /toolbar: \[/);
    assert.match(source, /showTopbar: authenticated/);
    assert.match(source, /showThemeToggle: authenticated/);
    assert.match(source, /showFooter: authenticated/);
    assert.match(source, /frameless: false/);
    assert.match(source, /persistLayoutPreferences: authenticated/);
    assert.match(source, /enableAccountEnhancements: authenticated/);
    assert.match(
        enforcement,
        /const status = await consentStatus\(\);[\s\S]*syncFooterLinks\(status\.documents, i18n\);[\s\S]*LEGAL_DOCUMENT_PATHS\.has\(location\.pathname\)/,
    );
    assert.match(
        enforcement,
        /await enforceAuthenticatedConsentOnce\(\)\.then/,
    );
    assert.match(
        enforcement,
        /LEGAL_DOCUMENT_PATHS\.has\(location\.pathname\)/,
    );
});

test("administration renders filterable paginated consent reports", () => {
    assert.match(source, /consent-report\/\$\{document\.slug\}/);
    assert.match(source, /data-consent-filter="\$\{filter\}"/);
    assert.match(source, /data-consent-search/);
    assert.match(source, /REPORT_PAGE_SIZE = 10/);
    assert.match(source, /capabilities\.get\("ui:pagination"\)/);
    assert.match(source, /paginationUi\.createPagination/);
    assert.match(source, /paginationUi\.renderPaginationControls/);
    assert.match(source, /paginationUi\.bindPaginationControls/);
    assert.doesNotMatch(source, /data-report-previous/);
    assert.doesNotMatch(source, /data-report-next/);
    assert.match(source, /activateConsentReport/);
    assert.match(source, /activeConsentReport\.render\(\)/);
    assert.match(source, /CONSENT_REPORT_REFRESH_INTERVAL_MS = 5_000/);
    assert.match(source, /async refresh\(\)/);
    assert.match(source, /consentByAccount/);
    assert.match(source, /consentUsers: \[\]/);
    assert.match(source, /operation: "loadConsentReportingData"/);
    assert.match(source, /onConsentReportCreated\?\.\(activeConsentReport\)/);
    assert.match(source, /consentReports\.push\(report\)/);
    assert.match(source, /terms-of-service:consent-recorded/);
    assert.match(source, /operation: "refreshConsentReports"/);
    assert.match(source, /clearInterval\(refreshTimer\)/);
    assert.match(
        source,
        /insertAdjacentHTML\("beforeend", consentReportMarkup\(i18n\)\)/,
    );
    assert.match(source, /Object\.assign\(document, publishedDocument\)/);
    assert.match(source, /user\.version === document\.version/);
    assert.match(
        source,
        /hasPublishedContent \? consentReportMarkup\(i18n\) : ""/,
    );
    assert.match(source, /user\.accepted \? "pill-active" : "pill-disabled"/);
    assert.match(source, /loadReuseStylesheet\("state-pill\.css"\)/);
    assert.match(legalStyles, /terms-of-service-report table/);
    assert.match(legalStyles, /terms-of-service-mode-toggle\.is-active/);
    assert.match(source, /module\.terms_of_service\.report\.latest_version/);
    assert.match(source, /module\.terms_of_service\.report\.consented_version/);
    assert.match(source, /module\.terms_of_service\.report\.not_consented/);
    assert.match(source, /<code>\$\{escapeHtml\(user\.version\)\}<\/code>/);
    assert.match(source, /<code>\$\{escapeHtml\(document\.version\)\}<\/code>/);
    assert.match(
        legalStyles,
        /terms-of-service-consent-card > \.choice-checkbox/,
    );
    assert.match(legalStyles, /block-size: 20rem/);
});
