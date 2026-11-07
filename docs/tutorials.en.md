# Guided tutorial

This module binds its introductory play to its own page through `ui:tutorials`. The first permitted visit starts it automatically; the question-mark SVG beside the page title replays it. The host must provide the version-one page-bound tutorial contract.

## Usage Examples

The play introduces the legal document and its navigation without accepting or changing consent. It requires an authenticated online session.

## Technical Specification

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

The legal guide matches Terms of Service, Privacy Policy and EULA pages and stays on the document that the user opened.

The administrator guide covers versioned publishing and consent reports in the visible Legal section. It requires administrator access and never saves changes or accepts consent.

Document guidance highlights a document header, and consent guidance highlights the search field of an available published-document consent report. The first usable target is selected inside the tutorial section and the step is skipped when no matching control is available.

The shared host provides queued floating actions. First visits offer Next/Finish without Cancel or Skip; replays offer Skip before the last visible step. Restart Tutorial appears after the first visible step. Completion survives content updates. Explicit highlightNext flags enable only a breathing animation for explanatory steps; reduced motion disables it. Each stage highlights a distinct rendered control in UI order. Guides stay bound to the current view, handle empty and optional states, and release their resources on navigation or owner removal.
