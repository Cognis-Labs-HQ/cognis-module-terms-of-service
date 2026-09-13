# Terms of Service Module Standard

This document defines the supported architecture of the Cognis Terms of Service external module.

## Public Contract

The module registers the public `/terms-of-service`, `/privacy-policy`, and `/eula` SPA routes. Administration receives one localized Legal section through `registerAdminSection`; authenticated API routes require the least privileged applicable role.

Published legal content is Markdown rendered by Cognis through `ui:reuse`. Each save appends an immutable version through `docs:versionStore`. The module never imports Cognis internals or a concrete database driver.

Legal editors use the Cognis information-tooltip and dirty-tracker utilities. Creating an editor exposes a full-width Markdown composer with attached Compose and Preview controls; the dirty tracker's Save action publishes updates and reports success through the host toast, while removing an editor requires confirmation.

## Consent and Lifecycle

The module records the exact Terms and Privacy versions accepted by each account. Registration must require explicit consent. The authenticated-session flow blocks accounts whose recorded versions are not current; acceptance records both versions and declining logs the account out. Public legal pages remain available during enforcement.

Scoped registrations are removed when the module is disabled. Documents and consent survive disable and restart; uninstall removes them only when `deleteContent` is true. Browser resources use `cognis.uiCtx`, host feedback, navigation, API, popup, i18n, and page-entry contracts.

## Repository Quality

Root manifest, package, lockfile, and route metadata remain synchronized. Server code lives in `api/`, browser code in `ui/`, operational commands in `cli/`, localized documentation in `docs/`, release metadata in `changelog/`, and artwork in `assets/`. Tests use local capability fakes and cover routes, persistence, flows, lifecycle, localization, and packaging.
