# Cognis Terms of Service module

**English** · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Adds a **Legal** section to Cognis Administration. Administrators can create and publish Terms of Service, Privacy Policy, and End User License Agreement Markdown documents at `/terms-of-service`, `/privacy-policy`, and `/eula`.

## Cognis core support

No additional core change is required for Markdown rendering or Administration registration. The module follows the same contracts as adjacent external modules:

1. browser code reads `globalThis[Symbol.for("cognis.uiCtx")]`;
2. it resolves `ui:reuse` through `uiCtx.capabilities.get("ui:reuse")`;
3. it imports the existing `markdown-renderer.js` with `ui:reuse.importModule()`; and
4. its `createAdminSection({ i18n, apiFetch })` export supplies the existing Administration sub-composer contract.

The Compose and Preview controls are module-owned UI state, while preview and public output use core's existing sanitized `renderMarkdown()` implementation. Toasts and error popups are resolved from their existing `uiCtx` capabilities.

## Security and lifecycle

Only administrators may list or publish documents. Public readers can only retrieve one of the three fixed document slugs. Content is retained across disable/re-enable and removed on uninstall only when `deleteContent` is true.
