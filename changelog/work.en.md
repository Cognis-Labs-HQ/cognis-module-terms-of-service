# Restored Legal Document Saving and Layout

**Feature Branch:** work

## Restored saved document content

Maps the core version store's returned `markdown` field into the module document response so newly published documents return correctly and the dirty tracker's Save action can complete successfully.

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

## Fixed persisted editor state and composition layout

Reads persisted Markdown from the version store’s actual response field, so refreshed editors never display `undefined`. Add/Remove state now depends only on whether a stored version exists. The Legal tooltip is grouped inside its heading, and neutral Compose/Preview actions share an equal-width row beneath the full-width, non-resizable editor.

## Added per-document consent enforcement

Tracks acknowledgements independently for every published Terms, Privacy, and EULA version. Persistent consent prompts now show checkbox cards only for new or updated documents, with exact-version submission, logout, and account-settings actions. The editor surface has a fixed mode height, full-width non-resizable input, and padded neutral controls below it.

## Integrated mandatory consent and legal navigation

Uses one mandatory consent popup, core-styled checkboxes, inline New/Update pills, a decline tooltip and host logout flow, plus the authenticated account-lifecycle deletion endpoint. Public document routes are truly public, render Markdown in a full-size popup, and published documents contribute right-aligned footer links through `ui:footerLinks`.

## Stabilized consent presentation and persistence

Loads the consent stylesheet with the authenticated navbar integration so refreshes and SPA navigation render identically. Keeps the core pill compact, places the document link on its own line, persists the complete published version set, and verifies the stored state before dismissing consent.

## Commits

- [2375f2c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2375f2cbe45c6ab21d7d93a70d94d2cc3c6e82a7)
- [e20d857](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/e20d857715e08f3656717ad55a5918fe236820ab)
- [3fcbc91](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3fcbc91f42e61309ef7bd56491ddcf4311f605fd)
- [cc4f1ba](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/cc4f1ba0582fd8d87b96c5e678e968467f86d988)
- [5ffec53](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5ffec53354d1e93bf49b3850c64a56b3ccb1cef9)
- [427af9d](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/427af9d50be3bde15cb3f2fe53f44e5a7b743965)
- [b9c93cc](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b9c93cc2de5693f69cdf63bb0d1d9419ef5c7ceb)
- [1adbdf7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1adbdf77939aa53f70f2fef75b93bce9841bd746)
- [0c9207e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0c9207e9a3c872266558207cc5a8d61f4c63ca12)
