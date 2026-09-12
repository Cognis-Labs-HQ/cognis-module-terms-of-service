const FIELD_NAME = "termsOfServiceConsent";

export function createRegistrationField({ i18n }) {
    return {
        id: "terms-of-service-consent",
        name: FIELD_NAME,
        type: "checkbox",
        required: true,
        labelHtml: `${i18n.t("module.terms_of_service.consent.signup.prefix")} <a href="/terms-of-service" target="_blank" rel="noopener">${i18n.t("module.terms_of_service.consent.signup.terms")}</a> ${i18n.t("module.terms_of_service.consent.signup.and")} <a href="/privacy-policy" target="_blank" rel="noopener">${i18n.t("module.terms_of_service.consent.signup.privacy")}</a>`,
    };
}

export function validateRegistration({ values, i18n }) {
    return values[FIELD_NAME] === true || values[FIELD_NAME] === "on"
        ? null
        : i18n.t("module.terms_of_service.consent.required");
}

export async function completeRegistration({ apiFetch }) {
    const statusResponse = await apiFetch(
        "/api/v1/modules/terms-of-service/consent",
    );
    if (!statusResponse.ok) throw new Error("consent_status_unavailable");
    const status = (await statusResponse.json()).data;
    if (!status.required) return;
    const response = await apiFetch(
        "/api/v1/modules/terms-of-service/consent",
        {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                accepted: true,
                termsVersion: status.termsVersion,
                privacyVersion: status.privacyVersion,
            }),
        },
    );
    if (!response.ok) throw new Error("consent_recording_failed");
}
