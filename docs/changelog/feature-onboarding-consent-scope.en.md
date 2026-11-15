# Scoped registration consent

**Feature Branch:** feature-onboarding-consent-scope

## Scoped registration consent

Registration uses the version-one auth:onboarding contract. The canonical constructRegistrationUi contribution declares only terms-of-service:consent:status and terms-of-service:consent:record. The browser completion callback receives executeOnboarding and refuses to proceed without an explicitly selected consent checkbox. It submits exactly the current published document versions; missing acceptance or malformed/incomplete versions fail, and changed or already accepted versions return a conflict rather than silently recording another acceptance.

Auth supplies the verified onboarding account and owns credential expiry, revocation, operation availability and contributor lifetime. The module never accepts an account ID from onboarding input. Its preparation flow validates only; direct flow invocation cannot record consent. Current authority is checked after initialization and immediately before persistence following asynchronous document reads. Ordinary consent, reporting and publishing routes retain their existing session and role guards.

Install the Cognis host with auth:onboarding and the scoped Registration callback contract before enabling this module release, then update the module before reopening registration. Treat the host and module as a coordinated release: older callbacks expecting authenticated apiFetch cannot run with restricted onboarding credentials. Missing auth:onboarding rejects module bootstrap; there is no broad-token fallback or legacy flow alias. Existing documents and accepted versions remain unchanged.

A consent write and Auth credential revocation are separate operations. An in-flight database write cannot be rolled back by a later cancellation, and a successful write may precede a failed response or subsequent revocation check. Reopen normal login to inspect current consent; never infer acceptance from a transport failure. Registration sends no legal acceptance unless the user explicitly selects it.

## Commits

- [c57bfd2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c57bfd265cba82e573273e41313de8bfbdf07120)
