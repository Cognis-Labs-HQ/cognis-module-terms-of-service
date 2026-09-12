# Terms of Service module

**Feature branch:** `feature-add-terms-of-service-module-to-cognis`

## Legal document administration

Adds an Administration Legal section for composing and publishing Terms of Service, Privacy Policy, and EULA documents with the Cognis Markdown composer contract.

## Public legal pages

Publishes the three fixed public routes with sanitized Markdown rendering, persistent module-owned storage, authorization, localization, and lifecycle cleanup.

## Existing browser reuse contracts

Uses `cognis.uiCtx` and `ui:reuse.importModule()` like adjacent modules, imports the existing core Markdown renderer directly, and implements the established Administration sub-composer export without requiring a new core capability.

## Commits

- [d0e4701](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d0e4701b5dc43aa21efb59bcffcbc45f4504ec65) — Implement the legal document publishing module.
- [3f00993](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3f00993d648f17ac8b1fb0953747d9e36e684496) — Consume the existing host UI reuse contracts.
