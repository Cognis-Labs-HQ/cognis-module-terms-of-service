import { consentVersions } from "./validation.js";

const PREPARE_FLOW = "terms-of-service:prepareOnboardingConsent";

export function registerOnboarding(ctx, onboarding, store, ready) {
    ctx.registerFlow({ id: PREPARE_FLOW, stages: ["validateConsent"] });
    ctx.flow.extend(
        PREPARE_FLOW,
        "validateConsent",
        { id: `${PREPARE_FLOW}:validate` },
        ({ input }) => consentVersions(input),
    );
    const run = async (context, action, operation) => {
        try {
            await context.assertCurrent();
            await ready;
            await context.assertCurrent();
            const result = await operation();
            await context.assertCurrent();
            return result;
        } catch (error) {
            ctx.log?.("error", "Onboarding consent operation failed.", {
                component: "terms-of-service",
                operation: action,
                accountId: context.accountId,
                errorName: error instanceof Error ? error.name : "Error",
            });
            if (
                error.message === "invalid_consent_versions" ||
                error.message === "incomplete_consent_versions"
            ) {
                throw { status: 400, code: error.message };
            }
            if (error.message === "stale_document_versions") {
                throw { status: 409, code: error.message };
            }
            throw error;
        }
    };
    onboarding.registerOperation({
        id: "terms-of-service:consent:status",
        execute: (context, input) =>
            run(context, "onboardingConsentStatus", async () => {
                if (
                    !input ||
                    typeof input !== "object" ||
                    Array.isArray(input) ||
                    Object.keys(input).length
                ) {
                    throw { status: 400, code: "invalid_onboarding_input" };
                }
                return store.consentStatus(context.accountId);
            }),
    });
    onboarding.registerOperation({
        id: "terms-of-service:consent:record",
        execute: (context, input) =>
            run(context, "onboardingRecordConsent", async () => {
                const versions = Object.freeze(consentVersions(input));
                await ctx.flow.run(PREPARE_FLOW, {
                    accepted: true,
                    versions,
                });
                await context.assertCurrent();
                const result = await store.recordConsent(
                    context.accountId,
                    versions,
                    context.assertCurrent,
                );
                ctx.log?.("info", "Onboarding legal consent recorded.", {
                    component: "terms-of-service",
                    operation: "onboardingRecordConsent",
                    accountId: context.accountId,
                    documentSlugs: Object.keys(versions),
                });
                return result;
            }),
    });
}
