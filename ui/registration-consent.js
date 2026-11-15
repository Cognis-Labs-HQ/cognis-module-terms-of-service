const FIELD_NAME = "termsOfServiceConsent";

export function createRegistrationField({ i18n }) {
    return {
        id: "terms-of-service-consent",
        name: FIELD_NAME,
        type: "checkbox",
        required: true,
        label: `${i18n.t("module.terms.of.service.consent.signup.prefix")} ${i18n.t("module.terms.of.service.consent.signup.terms")}, ${i18n.t("module.terms.of.service.consent.signup.privacy")} ${i18n.t("module.terms.of.service.consent.signup.and")} ${i18n.t("module.terms.of.service.document.eula")}`,
    };
}

export function validateRegistration({ values, i18n }) {
    return values[FIELD_NAME] === true || values[FIELD_NAME] === "on"
        ? null
        : i18n.t("module.terms.of.service.consent.required");
}

export async function completeRegistration({ values, executeOnboarding }) {
    if (values?.[FIELD_NAME] !== true && values?.[FIELD_NAME] !== "on")
        throw new Error("consent_required");
    const status = await executeOnboarding(
        "terms-of-service:consent:status",
        {},
    );
    if (!status.required) return;
    const versions = Object.fromEntries(
        status.documents.map((document) => [document.slug, document.version]),
    );
    await executeOnboarding("terms-of-service:consent:record", {
        accepted: true,
        versions,
    });
}
