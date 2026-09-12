# Cognis Terms of Service module

**English** · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Adds a **Legal** section to Cognis Administration. Administrators can create and publish Terms of Service, Privacy Policy, and End User License Agreement Markdown documents at `/terms-of-service`, `/privacy-policy`, and `/eula`.

## Required Cognis core support

The existing browser contracts remain sufficient for Markdown rendering, feedback, navigation, and Administration registration. Two supporting core changes are required for consent integration and version persistence:

1. **Version-store capability:** expose the append-only storage behind the Docs and Changelog archive as `docs:versionStore`. Its `createStore({ namespace, database, documents })` method must return scoped `ensureSchema()`, `getLatest(slug)`, `publish({ slug, content, actorId })`, and `deleteAll()` operations. `publish` must always append a cryptographically identified immutable version and never update or delete an existing version. This module uses that capability rather than importing Cognis internals.
2. **Registration UI flow:** add the host-owned `construct-registration-ui` flow with a `compose-form` stage. Load returned integration descriptors on `/register`; for this module, call `createRegistrationField({ i18n })`, block submission when `validateRegistration()` returns an error, and call `completeRegistration({ apiFetch })` after the authenticated account session is established. If completion fails, registration must not navigate into the application.

Existing-account enforcement needs no additional core contract. A lifecycle-scoped navbar plugin extends the existing browser `authenticate-session` flow at `enforce-setup-requirements`; the module uses the existing popup, authenticated fetch, logout, router, and `uiCtx` capability contracts. The Terms and Privacy routes remain public so they can be reviewed before consent.

## Security and lifecycle

Only administrators may list or publish documents. Public readers can only retrieve one of the three fixed document slugs. Content is retained across disable/re-enable and removed on uninstall only when `deleteContent` is true.
