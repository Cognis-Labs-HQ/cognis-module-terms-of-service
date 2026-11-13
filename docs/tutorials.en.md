# Guided tutorial

This module binds its introductory play to its own page through `ui:tutorials`. The first permitted visit starts it automatically; the question-mark SVG beside the page title replays it. The host must provide the version-one page-bound tutorial contract.

## Usage Examples

The play introduces the legal document and its navigation without accepting or changing consent. It requires an authenticated online session.

## Technical Specification

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

The legal guide matches Terms of Service, Privacy Policy and EULA pages and stays on the document that the user opened.

The shared host provides queued floating actions. First visits offer Next/Finish without Cancel or Skip; replays offer Skip before the last visible step. Restart Tutorial appears after the first visible step. Completion survives content updates. Explicit highlightNext flags enable only a breathing animation for explanatory steps; reduced motion disables it. Each stage highlights a distinct rendered control in UI order. Guides stay bound to the current view, handle empty and optional states, and release their resources on navigation or owner removal.

Start with one legal document. For a new document, click Add; for a published document, use its existing editor. Type or revise Markdown, then click Preview to inspect the reader’s view. No tutorial action publishes the draft. Save and Discard become available through the queued changes menu after the guide yields. The compliance branch chooses a published document independently of the draft, opens its tracker, and explains account search, Accepted/Outstanding/All filters and accepted-versus-latest version columns. Empty matches and unpublished installations are handled without creating consent records.
