# Restored Legal Document Saving and Layout

**Feature Branch:** work

## Restored saved document content

Maps the core version store's documented `content` field back to Markdown so newly published documents return correctly and the dirty tracker's Save action can complete successfully.

## Refined the Legal editor layout

Presents the three documents as compact, separated cards, reduces excessive composer height, and gives the full-width composer a more practical default grid size.

## Corrected the host integration contracts

Uses the authenticated claims returned by `auth:requireAuth` when attributing document publications, ensuring Save no longer submits an empty actor identifier. The Legal heading now renders its Markdown tooltip together with its content, document actions sit directly beside their headings, redundant disclosure arrows are removed, and explicit hidden-state styling reliably closes editors and switches Compose or Preview panes.

## Registered concrete document routes

Registers one exact PUT and public GET route for each fixed legal document because the Cognis external-module router performs exact-path matching. Discard now closes an unpublished editor and returns its action to Add, while the editor and mode panes explicitly occupy the full available width without browser resizing.

## Restored published editors and prompt refreshes

Saved documents now render open with their persisted Markdown and a Remove action when Administration is refreshed. Visible authenticated sessions recheck consent every five seconds, serializing checks to prevent duplicate popups and stopping the refresh timer when the page unloads or the module endpoint disappears.

## Adopted host collapsible sections

Renders legal document descriptors through the host collapsible-section composer with sanitized localized titles, inline Add/Remove and Compose/Preview controls, and editor content. The module now attaches to the host Administration floating slot without failing when detached, supplies the localized navigation warning, and destroys its unsaved-changes tracker on unmount.

## Commits

- [2375f2c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2375f2cbe45c6ab21d7d93a70d94d2cc3c6e82a7)
- [e20d857](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/e20d857715e08f3656717ad55a5918fe236820ab)
- [3fcbc91](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3fcbc91f42e61309ef7bd56491ddcf4311f605fd)
- [cc4f1ba](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/cc4f1ba0582fd8d87b96c5e678e968467f86d988)
- [5ffec53](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5ffec53354d1e93bf49b3850c64a56b3ccb1cef9)
