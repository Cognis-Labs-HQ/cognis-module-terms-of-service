# Guided tutorial

This module binds its introductory play to its own page through `ui:tutorials`. The first permitted visit starts it automatically; the question-mark SVG beside the page title replays it. The host must provide the version-one page-bound tutorial contract.

## Usage Examples

The play introduces the legal document and its navigation without accepting or changing consent. It requires an authenticated online session.

## Technical Specification

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

The legal guide matches Terms of Service, Privacy Policy and EULA pages and stays on the document that the user opened.

The public guide describes section headings within the current document and omits navigation when no section headings exist. The administrator guide opens one stable document editor, requires a real staged edit before its Preview branch, and explains publishing only after the draft preview is visible. Next bypasses unopened editing branches, unavailable consent reports are excluded, and no content is published or discarded automatically. The established `module.terms-of-service.offline` persistence key is retained so server-confirmed snapshots continue to permit offline access after upgrades.

The shared host provides queued floating actions. First visits offer Next/Finish without Cancel or Skip; replays offer Skip before the last visible step. Restart Tutorial appears after the first visible step. Completion survives content updates. Explicit highlightNext flags enable only a breathing animation for explanatory steps; reduced motion disables it. Each stage highlights a distinct rendered control in UI order. Guides stay bound to the current view, handle empty and optional states, and release their resources on navigation or owner removal.
