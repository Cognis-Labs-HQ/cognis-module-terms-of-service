import { importReuseModule, uiCtx } from "./reuse/resources.js";

const [
    { apiFetch },
    { clearStoredAuthSession },
    { createI18n },
    { openPopup },
] = await Promise.all([
    importReuseModule("api-client.js"),
    importReuseModule("auth-session.js"),
    importReuseModule("i18n.js"),
    importReuseModule("popup.js"),
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

async function consentStatus() {
    const response = await apiFetch(API_PATH, {
        suppressAccessDeniedEvent: true,
    });
    if (!response.ok) throw new Error("consent_status_unavailable");
    return (await response.json()).data;
}

async function logout() {
    await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: localStorage.getItem("cognis_access_token")
            ? {
                  authorization: `Bearer ${localStorage.getItem("cognis_access_token")}`,
              }
            : {},
    }).catch((error) => {
        uiCtx.capabilities.get("ui:log")?.("error", "Logout request failed.", {
            component: "terms-of-service",
            operation: "declineConsentLogout",
            error: error instanceof Error ? error.message : String(error),
        });
    });
    clearStoredAuthSession();
}

async function requestConsent(status, i18n) {
    while (true) {
        const action = await openPopup({
            title: i18n.t("module.terms_of_service.consent.title"),
            body: `<p>${i18n.t("module.terms_of_service.consent.prompt")}</p>
                <p><a href="/terms-of-service" target="_blank" rel="noopener">${i18n.t("module.terms_of_service.document.terms")}</a><br>
                <a href="/privacy-policy" target="_blank" rel="noopener">${i18n.t("module.terms_of_service.document.privacy")}</a></p>`,
            variant: "warning",
            actions: [
                {
                    id: "accept",
                    label: i18n.t("module.terms_of_service.consent.accept"),
                    variant: "confirm",
                },
                {
                    id: "decline",
                    label: i18n.t("module.terms_of_service.consent.decline"),
                    variant: "neutral",
                },
            ],
        });
        if (action === "accept") {
            const response = await apiFetch(API_PATH, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    accepted: true,
                    termsVersion: status.termsVersion,
                    privacyVersion: status.privacyVersion,
                }),
            });
            if (response.ok) return true;
            status = await consentStatus();
            continue;
        }
        if (action === "decline") {
            await logout();
            return false;
        }
    }
}

async function enforceConsent() {
    if (
        PUBLIC_PATHS.has(location.pathname) ||
        !localStorage.getItem("cognis_access_token")
    ) {
        return { requiresSetup: false };
    }
    const status = await consentStatus();
    if (!status.required || status.accepted) return { requiresSetup: false };
    const i18n = await createI18n({
        componentStringBaseUrls: ["/static/modules/terms-of-service/languages"],
    });
    const accepted = await requestConsent(status, i18n);
    return accepted
        ? { requiresSetup: false }
        : { requiresSetup: true, redirectTo: LOGIN_PATH };
}

uiCtx.extendFlow(
    "authenticate-session",
    "enforce-setup-requirements",
    { id: "terms-of-service:enforce-consent" },
    enforceConsent,
);

await enforceConsent().then((result) => {
    if (result.redirectTo) {
        const navigate = uiCtx.capabilities.get("ui:navigate");
        if (typeof navigate !== "function") {
            throw new Error("Required UI capability unavailable: ui:navigate");
        }
        return navigate(result.redirectTo);
    }
});
