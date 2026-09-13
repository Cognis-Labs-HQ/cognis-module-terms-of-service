# Terms of Service Module Standard

This document defines the supported architecture of the Cognis Terms of Service external module.

## Public Contract

The module registers the public `/terms-of-service`, `/privacy-policy`, and `/eula` SPA routes. Its browser entry mounts directly only on those public paths, while Administration receives one localized Legal section through `registerAdminSection`; authenticated API routes require the least privileged applicable role.

Published legal content is Markdown rendered by Cognis through `ui:reuse`. Each save appends an immutable version through `docs:versionStore`. The module never imports Cognis internals or a concrete database driver.

Legal editors use the host collapsible-section composer for one full-width group of document descriptors. Localized titles are plain text, while sanitized Add/Remove and Compose/Preview controls and editor content use the composer’s trusted HTML fields. The stored document version alone determines Add or Remove state, independent of disclosure state. Compose and Preview use neutral host action-row buttons below the full-width, non-resizable editor, and the module uses the Cognis information-tooltip and floating dirty-tracker utilities. Adding an editor exposes a padded, non-resizable Markdown composer with message-composer-style Compose and Preview controls; the dirty tracker's Save action publishes updates through one exact API route per fixed document and reports success through the host toast. Published editors reopen with their saved Markdown after a page refresh. Discard restores published content, or closes an unsaved new editor and returns its action to Add; removing an editor requires confirmation.

## Consent and Lifecycle

The module records the exact Terms and Privacy versions accepted by each account. Registration must require explicit consent. The authenticated-session flow and a five-second foreground refresh check promptly block accounts whose recorded versions are not current; acceptance records both versions and declining logs the account out. Public legal pages remain available during enforcement. Consent status is evaluated independently for every published Terms, Privacy, and EULA version; the persistent popup lists only unacknowledged documents as checkbox cards and submits their exact versions.

Scoped registrations are removed when the module is disabled. If an already-loaded browser hook observes that the module consent endpoint has been removed during an update or restart, it logs the unavailable endpoint, stops making subsequent consent requests, and yields without blocking navigation. Documents and consent survive disable and restart; uninstall removes them only when `deleteContent` is true. Browser resources use `cognis.uiCtx`, host feedback, navigation, API, popup, i18n, and page-entry contracts.

## Repository Quality

Root manifest, package, lockfile, and route metadata remain synchronized. Server code lives in `api/`, browser code in `ui/`, operational commands in `cli/`, localized documentation in `docs/`, release metadata in `changelog/`, and artwork in `assets/`. Tests use local capability fakes and cover routes, persistence, flows, lifecycle, localization, and packaging.
