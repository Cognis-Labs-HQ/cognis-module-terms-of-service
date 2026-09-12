# Cognis Terms of Service module

**English** · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Adds a **Legal** section to Cognis Administration. Administrators can create and publish Terms of Service, Privacy Policy, and End User License Agreement Markdown documents at `/terms-of-service`, `/privacy-policy`, and `/eula`.

## Required Cognis core support

This module deliberately does not copy or import Cognis' private message-composer code. Cognis core must:

1. expose `ui:reuse` on the module `ctx`;
2. register a browser reuse entry named `markdown:composer`;
3. make `host.reuse.get("markdown:composer")` return an object with `bind(options)` and `render(element, markdown)` methods; and
4. expose `ctx.registerAdminSection(options)` as a scoped registration removed when the module is disabled.

`bind` receives the textarea, Compose and Preview buttons, and both panes. It must use the same sanitized renderer, toolbar behavior, keyboard and accessibility behavior as the core message composer. `render` must sanitize untrusted Markdown before placing it in the supplied module-owned element. The host should pass its router, i18n, toast, error-popup, focus, and reuse clients to the exported `mount(root, host)` function. The registration and reuse handles must be lifecycle-scoped.

## Security and lifecycle

Only administrators may list or publish documents. Public readers can only retrieve one of the three fixed document slugs. Content is retained across disable/re-enable and removed on uninstall only when `deleteContent` is true.
