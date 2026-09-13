import { importReuseModule, uiCtx } from "./reuse/resources.js";

const [
    { apiFetch },
    { clearStoredAuthSession },
    { createI18n },
    { openPopup },
    { escapeHtml },
] = await Promise.all([
    importReuseModule("api-client.js"),
    importReuseModule("auth-session.js"),
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

async function logout() {
    try {
        const token = localStorage.getItem("cognis_access_token");
        const response = await fetch("/api/v1/auth/logout", {
            method: "POST",
            credentials: "same-origin",
            headers: token ? { authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) {
            throw new Error(`logout_http_${response.status}`);
        }
        clearStoredAuthSession();
        return true;
    } catch (error) {
        uiCtx.capabilities.get("ui:log")?.("error", "Logout request failed.", {
            component: "terms-of-service",
            operation: "declineConsentLogout",
            error: error instanceof Error ? error.message : String(error),
        });
        return false;
    }
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
                            <input type="checkbox" data-consent-document="${escapeHtml(document.slug)}">
                            <span><strong>${escapeHtml(i18n.t(`module.terms_of_service.document.${document.slug === "terms-of-service" ? "terms" : document.slug === "privacy-policy" ? "privacy" : "eula"}`))}</strong>
                            <span class="state-pill pill-active">${escapeHtml(i18n.t("module.terms_of_service.consent.updated"))}</span>
                            <span>${escapeHtml(i18n.t("module.terms_of_service.consent.read_latest"))} <a href="${escapeHtml(document.path)}" target="_blank" rel="noopener">${escapeHtml(i18n.t("module.terms_of_service.consent.here"))}</a></span></span>
                        </label>`,
                    )
                    .join("")}</div>`,
            variant: "warning",
            closeOnBackdrop: false,
            closeOnEscape: false,
            onAction(actionId, overlay) {
                if (actionId !== "submit") return true;
                const checked = Array.from(
                    overlay.querySelectorAll("[data-consent-document]"),
                ).filter((checkbox) => checkbox.checked);
                if (checked.length !== pendingDocuments.length) return false;
                acceptedVersions = Object.fromEntries(
                    pendingDocuments.map((document) => [
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
                    id: "logout",
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
        if (action === "logout") {
            if (await logout()) return false;
        }
        if (action === "delete") {
            const navigate = uiCtx.capabilities.get("ui:navigate");
            await navigate?.("/settings#account");
            return false;
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
    if (!status.required || status.accepted) return { requiresSetup: false };
    const i18n = await createI18n({
        componentStringBaseUrls: ["/static/modules/terms-of-service/languages"],
    });
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
