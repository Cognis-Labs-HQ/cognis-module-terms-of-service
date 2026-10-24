import { createOfflineConsent } from "./offline-consent.js";
import { importReuseModule, loadReuseStylesheet } from "./reuse/resources.js";

const [{ apiFetch }, { createI18n }, { openPopup }, { escapeHtml }] =
    await Promise.all([
        importReuseModule("api-client.js"),
        importReuseModule("i18n.js"),
        importReuseModule("popup.js"),
        importReuseModule("escape-html.js"),
    ]);

export async function mountProvider(uiCtx) {
    const policy = uiCtx.capabilities.get("offline:accessPolicy");
    const connectivity = uiCtx.capabilities.get("offline:state");
    if (!policy || !connectivity)
        throw new Error("offline_contract_unavailable");
    const offlineConsent = createOfflineConsent({
        policy,
        log: uiCtx.capabilities.get("ui:log"),
    });
    offlineConsent.restore();
    await Promise.all([
        loadReuseStylesheet("choice-checkbox.css"),
        loadReuseStylesheet("state-pill.css"),
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
    const LEGAL_DOCUMENT_PATHS = new Set([
        "/terms-of-service",
        "/privacy-policy",
        "/eula",
    ]);
    const CONSENT_REFRESH_INTERVAL_MS = 5_000;
    let consentRefreshTimer;
    let enforcementPromise;
    let footerRefreshPromise;
    let consentEnforcementDisposed = false;
    const footerLinkDisposers = new Map();

    function propagateMissingTranslation(error) {
        if (
            error?.code === "missing_translation" ||
            error?.message?.startsWith("missing_translation:")
        ) {
            teardownConsentEnforcement();
            throw error;
        }
    }

    function syncFooterLinks(documents, i18n, { forceRender = false } = {}) {
        if (uiCtx.signal.aborted) return;
        const footerLinks = uiCtx.capabilities.get("ui:footerLinks");
        if (typeof footerLinks?.add !== "function") return;
        for (const document of documents) {
            const linkId = `terms-of-service:${document.slug}`;
            let registered = footerLinks
                .list?.()
                .some((link) => link.id === linkId);
            if (forceRender && footerLinkDisposers.has(document.slug)) {
                footerLinkDisposers.get(document.slug)?.();
                footerLinkDisposers.delete(document.slug);
                registered = false;
            }
            if (footerLinkDisposers.has(document.slug) && registered) continue;
            if (footerLinkDisposers.has(document.slug) && !registered) {
                footerLinkDisposers.delete(document.slug);
            }
            if (registered) continue;
            const titleKey =
                document.slug === "terms-of-service"
                    ? "terms"
                    : document.slug === "privacy-policy"
                      ? "privacy"
                      : "eula";
            const label = i18n.t(
                `module.terms-of-service.document.${titleKey}`,
            );
            try {
                footerLinkDisposers.set(
                    document.slug,
                    footerLinks.add({
                        id: linkId,
                        side: "right",
                        href: document.path,
                        target: "_blank",
                        contexts: ["application"],
                        label,
                    }),
                );
            } catch (error) {
                uiCtx.capabilities.get("ui:log")?.(
                    "error",
                    "Legal footer link registration failed; consent enforcement will continue.",
                    {
                        component: "terms-of-service",
                        operation: "registerFooterLink",
                        slug: document.slug,
                        hasHref: Boolean(document.path),
                        hasLabel: Boolean(label),
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    },
                );
            }
        }
    }

    async function consentStatus() {
        if (connectivity.isOffline()) {
            if (!offlineConsent.allowed())
                throw new Error("offline_access_denied");
            return offlineConsent.load();
        }
        const response = await apiFetch(API_PATH, {
            suppressAccessDeniedEvent: true,
            signal: uiCtx.signal,
        });
        if (response.status === 404) {
            policy.update("terms-of-service", {
                allowed: false,
                revision: "unavailable",
            });
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
        return offlineConsent.record((await response.json()).data);
    }

    async function refreshFooterLinks({ forceRender = false } = {}) {
        if (forceRender && footerRefreshPromise) {
            await footerRefreshPromise;
        }
        if (!footerRefreshPromise) {
            footerRefreshPromise = (async () => {
                const status = await consentStatus();
                if (!status) return;
                const i18n = await createI18n({
                    componentStringBaseUrls: [
                        "/static/modules/terms-of-service/languages",
                    ],
                });
                syncFooterLinks(status.documents, i18n, { forceRender });
            })().finally(() => {
                footerRefreshPromise = undefined;
            });
        }
        return footerRefreshPromise;
    }

    uiCtx.capabilities.contribute(
        "terms-of-service:refreshFooterLinks",
        refreshFooterLinks,
    );

    function refreshFooterLinksAfterNavigation() {
        void refreshFooterLinks().catch((error) => {
            uiCtx.capabilities.get("ui:log")?.(
                "error",
                "Legal footer link refresh failed.",
                {
                    component: "terms-of-service",
                    operation: "refreshFooterLinks",
                    error:
                        error instanceof Error ? error.message : String(error),
                },
            );
            propagateMissingTranslation(error);
        });
    }

    async function deleteCurrentAccount(i18n) {
        let password = "";
        const result = await openPopup({
            title: i18n.t("module.terms-of-service.consent.delete.account"),
            body: `<label>${escapeHtml(i18n.t("module.terms-of-service.consent.password"))}
            <input class="form-builder-input" type="password" autocomplete="current-password" data-delete-account-password>
        </label>`,
            variant: "danger",
            actions: [
                {
                    id: "cancel",
                    label: i18n.t("module.terms-of-service.action.cancel"),
                    variant: "neutral",
                },
                {
                    id: "confirm",
                    label: i18n.t(
                        "module.terms-of-service.consent.delete.account",
                    ),
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
        while (!uiCtx.signal.aborted) {
            const pendingDocuments = status.documents.filter(
                (document) => !document.accepted,
            );
            let acceptedVersions;
            const action = await openPopup({
                title: i18n.t("module.terms-of-service.consent.title"),
                body: `<p>${escapeHtml(i18n.t("module.terms-of-service.consent.prompt"))}</p>
                <div class="terms-of-service-consent-cards">${pendingDocuments
                    .map(
                        (
                            document,
                        ) => `<label class="terms-of-service-consent-card">
                            <input class="choice-checkbox" type="checkbox" data-consent-document="${escapeHtml(document.slug)}">
                            <div class="terms-of-service-consent-content">
                                <div class="terms-of-service-consent-title"><strong>${escapeHtml(i18n.t(`module.terms-of-service.document.${document.slug === "terms-of-service" ? "terms" : document.slug === "privacy-policy" ? "privacy" : "eula"}`))}</strong>
                                <span class="state-pill pill-active">${escapeHtml(i18n.t(`module.terms-of-service.consent.${document.state}`))}</span></div>
                                <div class="terms-of-service-consent-read">${escapeHtml(i18n.t("module.terms-of-service.consent.read.latest"))} <a href="${escapeHtml(`${document.path}${document.consentedVersion ? "?view=changes" : ""}`)}" target="_blank" rel="noopener noreferrer">${escapeHtml(i18n.t("module.terms-of-service.consent.here"))}</a></div>
                            </div>
                        </label>`,
                    )
                    .join("")}</div>`,
                variant: "warning",
                mandatory: true,
                onOpen(overlay, dismiss) {
                    uiCtx.signal.addEventListener("abort", dismiss, {
                        once: true,
                    });
                    const consentCheckboxes = Array.from(
                        overlay.querySelectorAll("[data-consent-document]"),
                    );
                    const submitButton = overlay.querySelector(
                        '[data-popup-action="submit"]',
                    );
                    const updateSubmitState = () => {
                        if (submitButton) {
                            submitButton.disabled = !consentCheckboxes.every(
                                (checkbox) => checkbox.checked,
                            );
                        }
                    };
                    consentCheckboxes.forEach((checkbox) => {
                        checkbox.addEventListener("change", updateSubmitState);
                    });
                    updateSubmitState();
                    overlay
                        .querySelectorAll(
                            '.terms-of-service-consent-read a[target="_blank"]',
                        )
                        .forEach((link) => {
                            link.addEventListener("click", (event) => {
                                event.stopPropagation();
                            });
                        });
                    overlay
                        .querySelector('[data-popup-action="decline"]')
                        ?.setAttribute(
                            "title",
                            i18n.t(
                                "module.terms-of-service.consent.decline.hint",
                            ),
                        );
                },
                onAction(actionId, overlay) {
                    if (actionId !== "submit") return true;
                    const checked = Array.from(
                        overlay.querySelectorAll("[data-consent-document]"),
                    ).filter((checkbox) => checkbox.checked);
                    if (checked.length !== pendingDocuments.length) {
                        const showToast =
                            uiCtx.capabilities.get("ui:showToast");
                        if (typeof showToast !== "function") {
                            throw new Error(
                                "Required UI capability unavailable: ui:showToast",
                            );
                        }
                        showToast(
                            i18n.t(
                                "module.terms-of-service.consent.select.all.error",
                            ),
                            { variant: "error" },
                        );
                        return false;
                    }
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
                            "module.terms-of-service.consent.delete.account",
                        ),
                        variant: "cancel",
                    },
                    {
                        id: "decline",
                        label: i18n.t(
                            "module.terms-of-service.consent.decline",
                        ),
                        variant: "cancel",
                    },
                    {
                        id: "submit",
                        label: i18n.t("module.terms-of-service.consent.submit"),
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
                if (response.ok) {
                    status = offlineConsent.record(
                        (await response.json()).data,
                    );
                    window.dispatchEvent(
                        new CustomEvent("terms-of-service:consent-recorded"),
                    );
                    if (status.accepted && !status.required) return true;
                } else {
                    if (response.status === 400) {
                        const showToast =
                            uiCtx.capabilities.get("ui:showToast");
                        if (typeof showToast !== "function") {
                            throw new Error(
                                "Required UI capability unavailable: ui:showToast",
                            );
                        }
                        showToast(
                            i18n.t(
                                "module.terms-of-service.consent.select.all.error",
                            ),
                            { variant: "error" },
                        );
                    }
                    status = await consentStatus();
                }
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
        const storedSession = firstStageResult(
            stageCtx,
            "validate-stored-token",
        );
        const alternateSession = firstStageResult(
            stageCtx,
            "apply-alternate-auth",
        );
        if (!storedSession?.valid && !alternateSession?.authenticated) {
            return { requiresSetup: false };
        }
        return enforceAuthenticatedConsentOnce();
    }

    async function enforceAuthenticatedConsent() {
        const status = await consentStatus();
        if (!status) return { requiresSetup: false };
        const i18n = await createI18n({
            componentStringBaseUrls: [
                "/static/modules/terms-of-service/languages",
            ],
        });
        syncFooterLinks(status.documents, i18n);
        if (
            LEGAL_DOCUMENT_PATHS.has(location.pathname) ||
            !status.required ||
            status.accepted
        ) {
            return { requiresSetup: false };
        }
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
        if (consentEnforcementDisposed) return;
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
                            error instanceof Error
                                ? error.message
                                : String(error),
                    },
                );
                propagateMissingTranslation(error);
            } finally {
                if (!consentEnforcementDisposed) scheduleConsentRefresh();
            }
        }, CONSENT_REFRESH_INTERVAL_MS);
    }

    function teardownConsentEnforcement() {
        consentEnforcementDisposed = true;
        clearTimeout(consentRefreshTimer);
        consentRefreshTimer = undefined;
        for (const event of [
            "cognis:route-will-change",
            "popstate",
            "pageshow",
        ])
            window.removeEventListener(
                event,
                refreshFooterLinksAfterNavigation,
            );
        window.removeEventListener("pagehide", handlePageHide);
        footerLinkDisposers.forEach((dispose) => dispose());
        footerLinkDisposers.clear();
    }

    function handlePageHide(event) {
        if (!event.persisted) teardownConsentEnforcement();
    }

    window.addEventListener("pagehide", handlePageHide, {
        signal: uiCtx.signal,
    });
    for (const event of ["cognis:route-will-change", "popstate", "pageshow"])
        window.addEventListener(event, refreshFooterLinksAfterNavigation, {
            signal: uiCtx.signal,
        });

    uiCtx.extendFlow(
        "authenticate-session",
        "enforce-setup-requirements",
        { id: "terms-of-service:enforce-consent" },
        enforceConsent,
    );

    await enforceAuthenticatedConsentOnce()
        .then((result) => {
            if (uiCtx.signal.aborted) return;
            if (result.redirectTo) {
                const navigate = uiCtx.capabilities.get("ui:navigate");
                if (typeof navigate !== "function") {
                    throw new Error(
                        "Required UI capability unavailable: ui:navigate",
                    );
                }
                void navigate(result.redirectTo).catch((error) => {
                    uiCtx.capabilities.get("ui:log")?.(
                        "error",
                        "Legal consent navigation failed.",
                        {
                            component: "terms-of-service",
                            operation: "navigateAfterConsent",
                            error:
                                error instanceof Error
                                    ? error.message
                                    : String(error),
                        },
                    );
                    propagateMissingTranslation(error);
                });
            }
        })
        .catch((error) => {
            if (uiCtx.signal.aborted) return;
            uiCtx.capabilities.get("ui:log")?.(
                "error",
                "Consent enforcement failed.",
                {
                    component: "terms-of-service",
                    operation: "enforceConsent",
                    errorName: error.name,
                    error: error.message,
                },
            );
            propagateMissingTranslation(error);
        });
    scheduleConsentRefresh();

    return teardownConsentEnforcement;
}
