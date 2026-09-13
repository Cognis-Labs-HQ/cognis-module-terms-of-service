import { importReuseModule, uiCtx } from "./reuse/resources.js";

const [{ apiFetch }, { createI18n }, { openPopup }, { escapeHtml }] =
    await Promise.all([
        importReuseModule("api-client.js"),
        importReuseModule("i18n.js"),
        importReuseModule("popup.js"),
        importReuseModule("escape-html.js"),
    ]);

const API_PATH = "/api/v1/modules/terms-of-service/consent";
const LOGIN_PATH = "/login";
const PUBLIC_PATHS = new Set([
    LOGIN_PATH,
    "/register",
    "/terms-of-service",
    "/privacy-policy",
    "/eula",
]);
const CONSENT_REFRESH_INTERVAL_MS = 5_000;
let consentEndpointAvailable = true;
let consentRefreshTimer;
let enforcementPromise;
const footerLinkDisposers = new Map();

function syncFooterLinks(documents, i18n) {
    const footerLinks = uiCtx.capabilities.get("ui:footerLinks");
    if (typeof footerLinks?.add !== "function") return;
    for (const document of documents) {
        if (footerLinkDisposers.has(document.slug)) continue;
        const titleKey =
            document.slug === "terms-of-service"
                ? "terms"
                : document.slug === "privacy-policy"
                  ? "privacy"
                  : "eula";
        footerLinkDisposers.set(
            document.slug,
            footerLinks.add({
                id: `terms-of-service:${document.slug}`,
                side: "right",
                href: document.path,
                label: i18n.t(`module.terms_of_service.document.${titleKey}`),
            }),
        );
    }
}

async function consentStatus() {
    if (!consentEndpointAvailable) return null;
    const response = await apiFetch(API_PATH, {
        suppressAccessDeniedEvent: true,
    });
    if (response.status === 404) {
        consentEndpointAvailable = false;
        uiCtx.capabilities.get("ui:log")?.(
            "info",
            "Consent enforcement skipped because the module endpoint is unavailable.",
            {
                component: "terms-of-service",
                operation: "loadConsentStatus",
                endpointStatus: response.status,
            },
        );
        return null;
    }
    if (!response.ok) throw new Error("consent_status_unavailable");
    return (await response.json()).data;
}

async function deleteCurrentAccount(i18n) {
    let password = "";
    const result = await openPopup({
        title: i18n.t("module.terms_of_service.consent.delete_account"),
        body: `<label>${escapeHtml(i18n.t("module.terms_of_service.consent.password"))}
            <input class="form-builder-input" type="password" autocomplete="current-password" data-delete-account-password>
        </label>`,
        variant: "danger",
        actions: [
            {
                id: "cancel",
                label: i18n.t("module.terms_of_service.action.keep"),
                variant: "neutral",
            },
            {
                id: "confirm",
                label: i18n.t("module.terms_of_service.consent.delete_account"),
                variant: "cancel",
            },
        ],
        onAction(actionId, overlay) {
            if (actionId !== "confirm") return true;
            password = overlay.querySelector(
                "[data-delete-account-password]",
            )?.value;
            return Boolean(password);
        },
    });
    if (result !== "confirm") return false;
    const response = await apiFetch("/api/v1/auth/account-lifecycle", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "delete", password }),
    });
    if (!response.ok) throw new Error("account_deletion_failed");
    await uiCtx.runFlow("logout", { reason: "accountDeleted" });
    return true;
}

async function requestConsent(status, i18n) {
    while (true) {
        const pendingDocuments = status.documents.filter(
            (document) => !document.accepted,
        );
        let acceptedVersions;
        const action = await openPopup({
            title: i18n.t("module.terms_of_service.consent.title"),
            body: `<p>${escapeHtml(i18n.t("module.terms_of_service.consent.prompt"))}</p>
                <div class="terms-of-service-consent-cards">${pendingDocuments
                    .map(
                        (
                            document,
                        ) => `<label class="terms-of-service-consent-card">
                            <input class="form-builder-input" type="checkbox" data-consent-document="${escapeHtml(document.slug)}">
                            <span><span class="terms-of-service-consent-title"><strong>${escapeHtml(i18n.t(`module.terms_of_service.document.${document.slug === "terms-of-service" ? "terms" : document.slug === "privacy-policy" ? "privacy" : "eula"}`))}</strong>
                            <span class="state-pill pill-active">${escapeHtml(i18n.t(`module.terms_of_service.consent.${document.state}`))}</span></span>
                            <span class="terms-of-service-consent-read">${escapeHtml(i18n.t("module.terms_of_service.consent.read_latest"))} <a href="${escapeHtml(document.path)}" target="_blank" rel="noopener">${escapeHtml(i18n.t("module.terms_of_service.consent.here"))}</a></span></span>
                        </label>`,
                    )
                    .join("")}</div>`,
            variant: "warning",
            mandatory: true,
            onOpen(overlay) {
                overlay
                    .querySelector('[data-popup-action="decline"]')
                    ?.setAttribute(
                        "title",
                        i18n.t("module.terms_of_service.consent.decline_hint"),
                    );
            },
            onAction(actionId, overlay) {
                if (actionId !== "submit") return true;
                const checked = Array.from(
                    overlay.querySelectorAll("[data-consent-document]"),
                ).filter((checkbox) => checkbox.checked);
                if (checked.length !== pendingDocuments.length) return false;
                acceptedVersions = Object.fromEntries(
                    status.documents.map((document) => [
                        document.slug,
                        document.version,
                    ]),
                );
                return true;
            },
            actions: [
                {
                    id: "delete",
                    label: i18n.t(
                        "module.terms_of_service.consent.delete_account",
                    ),
                    variant: "cancel",
                },
                {
                    id: "decline",
                    label: i18n.t("module.terms_of_service.consent.decline"),
                    variant: "cancel",
                },
                {
                    id: "submit",
                    label: i18n.t("module.terms_of_service.consent.submit"),
                    variant: "confirm",
                },
            ],
        });
        if (action === "submit") {
            const response = await apiFetch(API_PATH, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    accepted: true,
                    versions: acceptedVersions,
                }),
            });
            if (response.ok) return true;
            status = await consentStatus();
            continue;
        }
        if (action === "decline") {
            await uiCtx.runFlow("logout", { reason: "termsDeclined" });
            return false;
        }
        if (action === "delete") {
            if (await deleteCurrentAccount(i18n)) return false;
        }
    }
}

function firstStageResult(stageCtx, stageId) {
    const results = stageCtx?.stageResults?.[stageId];
    return Array.isArray(results) ? results.find(Boolean) : results;
}

async function enforceConsent(stageCtx) {
    if (PUBLIC_PATHS.has(location.pathname)) {
        return { requiresSetup: false };
    }
    const storedSession = firstStageResult(stageCtx, "validate-stored-token");
    const alternateSession = firstStageResult(stageCtx, "apply-alternate-auth");
    if (!storedSession?.valid && !alternateSession?.authenticated) {
        return { requiresSetup: false };
    }
    return enforceAuthenticatedConsentOnce();
}

async function enforceAuthenticatedConsent() {
    const status = await consentStatus();
    if (!status) return { requiresSetup: false };
    const i18n = await createI18n({
        componentStringBaseUrls: ["/static/modules/terms-of-service/languages"],
    });
    syncFooterLinks(status.documents, i18n);
    if (!status.required || status.accepted) return { requiresSetup: false };
    const accepted = await requestConsent(status, i18n);
    return accepted
        ? { requiresSetup: false }
        : { requiresSetup: true, redirectTo: LOGIN_PATH };
}

function enforceAuthenticatedConsentOnce() {
    if (!enforcementPromise) {
        enforcementPromise = enforceAuthenticatedConsent().finally(() => {
            enforcementPromise = undefined;
        });
    }
    return enforcementPromise;
}

function scheduleConsentRefresh() {
    clearTimeout(consentRefreshTimer);
    if (!consentEndpointAvailable) return;
    consentRefreshTimer = setTimeout(async () => {
        try {
            if (
                document.visibilityState === "visible" &&
                !PUBLIC_PATHS.has(location.pathname) &&
                localStorage.getItem("cognis_access_token")
            ) {
                await enforceAuthenticatedConsentOnce();
            }
        } catch (error) {
            uiCtx.capabilities.get("ui:log")?.(
                "error",
                "Periodic consent enforcement failed.",
                {
                    component: "terms-of-service",
                    operation: "refreshConsentStatus",
                    error:
                        error instanceof Error ? error.message : String(error),
                },
            );
        } finally {
            scheduleConsentRefresh();
        }
    }, CONSENT_REFRESH_INTERVAL_MS);
}

export function teardownConsentEnforcement() {
    clearTimeout(consentRefreshTimer);
    consentRefreshTimer = undefined;
    footerLinkDisposers.forEach((dispose) => dispose());
    footerLinkDisposers.clear();
}

window.addEventListener("pagehide", teardownConsentEnforcement, { once: true });

uiCtx.extendFlow(
    "authenticate-session",
    "enforce-setup-requirements",
    { id: "terms-of-service:enforce-consent" },
    enforceConsent,
);

await enforceAuthenticatedConsentOnce().then((result) => {
    if (result.redirectTo) {
        const navigate = uiCtx.capabilities.get("ui:navigate");
        if (typeof navigate !== "function") {
            throw new Error("Required UI capability unavailable: ui:navigate");
        }
        return navigate(result.redirectTo);
    }
});
scheduleConsentRefresh();
