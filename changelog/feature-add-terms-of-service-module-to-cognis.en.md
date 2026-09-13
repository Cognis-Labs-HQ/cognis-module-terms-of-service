# Terms of Service module

**Feature branch:** `feature-add-terms-of-service-module-to-cognis`

## Legal document administration

Adds an Administration Legal section for composing and publishing Terms of Service, Privacy Policy, and EULA documents with the Cognis Markdown composer contract.

## Public legal pages

Publishes the three fixed public routes with sanitized Markdown rendering, persistent module-owned storage, authorization, localization, and lifecycle cleanup.

## Existing browser reuse contracts

Uses `cognis.uiCtx` and `ui:reuse.importModule()` like adjacent modules, imports the existing core Markdown renderer directly, and implements the established Administration sub-composer export without requiring a new core capability.

## Immutable legal versions and required consent

Every publication creates an immutable version through the core document-version capability. Signup records explicit agreement to the current Terms and Privacy Policy, while existing accounts receive an inescapable consent prompt whenever either document changes; declining logs the account out.

## External module structure and contributor guardrails

Aligns the repository with the maintained Jitsi Meet and Nextcloud Whiteboard module conventions: shared root changelogs, module-specific synchronized AI instructions, restored CLI integration, concise current-state standards, and standalone documentation and structural contract tests.

## Commits

- [d0e4701](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d0e4701b5dc43aa21efb59bcffcbc45f4504ec65) — Implement the legal document publishing module.
- [3f00993](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3f00993d648f17ac8b1fb0953747d9e36e684496) — Consume the existing host UI reuse contracts.
- [27b6605](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/27b66054102cba443e7b9d74213da0099697f695) — Add immutable versions and per-account legal consent enforcement.
- [361dac2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/361dac2396c03224fc407f79d400bb6c163c61ec) — Align external module structure and contributor guardrails.
