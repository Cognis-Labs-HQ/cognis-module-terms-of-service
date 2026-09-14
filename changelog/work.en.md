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

## Unified public legal document pages

Removes the redundant popup from public legal routes and renders each document through the host page composer. The resulting full-shell page uses natural document scrolling and builds its side navigation from the rendered Markdown section headings.

## Corrected consent controls and storage

Uses Cognis's reusable choice-checkbox and state-pill styles, guarantees a separate document-link row, and waits for those styles before opening consent. Consent now uses the structured database INSERT conflict-update contract and verifies the stored result, preventing accepted versions from being requested again during navigation.

## Administration consent reports and complete page shells

Adds a searchable, ten-row paginated user consent table to every legal document with All, Accepted, and Outstanding filters. Public pages now follow the Jitsi page initialization sequence for loading and authenticated sessions, while fixed editor surfaces prevent resizing and layout jumps.

## Adopted host pagination and detached consent

Replaces the module's report paginator with the shared `ui:pagination` capability. Accepting one published document no longer writes nulls for unpublished Privacy or EULA documents, preserving independent consent checks and compatibility with existing non-null database columns.

## Made footer-link ownership idempotent

Removes public-page footer registration so consent enforcement is the only owner of legal footer links. It also checks the host registry before adding links, preventing duplicate IDs during page loading or a stale-script handover.

## Reliable consent persistence and external document links

Defines every consent version column through the `db:executor` schema contract as non-null with an explicit unpublished sentinel, and supplies that sentinel in structured inserts when a legal document is not published. Consent document links now bypass the host SPA router so their `_blank` target reliably opens a new tab, and the popup title is shortened to “Consent Required.”

## Corrected public legal document pages

Public Terms, Privacy, and EULA routes now remain exempt from consent enforcement throughout initial loading and asynchronous status checks. Their page composer reads the version store’s Markdown response field and sizes the document element to its content, eliminating the `undefined` output and oversized empty panel.

## Clearer editor and consent report states

Unpublished legal-document sections no longer show an empty consent table. Published reports use the shared status-pill stylesheet and show outstanding accounts with a red pill, while Compose and Preview now visibly track the selected mode alongside their accessible pressed state.

## Live version-aware consent reports

Aligns each consent checkbox with its document title. Consent reports now include the latest published version identifier, calculate every user pill against that live version, and redraw immediately after either an existing document update or a document’s first publication.

## Compared consented and latest versions

Adds separate Consented Version and Latest Version columns to each consent report. Each row shows the version accepted by that account alongside the current published version, with a localized Not consented value when no accepted version exists.

## Core side navigation and active legal footer links

Replaces the plain legal-document heading list with Cognis’s exported grouped, collapsible side-menu controller, including selected-section state and smooth scrolling. Public legal pages now contribute all three legal routes to the footer while mounted, allowing the core footer renderer to display them and apply its route-aware active state.

## Stable published footer links and page titles

Makes consent enforcement the sole footer-link owner again and loads publication status even on exempt legal routes, so only published links appear and remain registered across SPA navigation while the core controls their active state. Each public legal page now applies its localized browser title after authenticated shell setup on both hard refresh and SPA navigation.

## Error feedback for incomplete consent

Submitting the mandatory consent popup without selecting every required document now keeps the popup open and displays a localized error through the host toast capability, clearly explaining how to continue.

## Aligned with core side-menu scrolling

Uses the latest Cognis side-menu contract by supplying each rendered legal heading as an item `targetId` and configuring smooth scrolling on the controller. Core now owns target lookup and start-aligned scrolling, while the module only synchronizes selected-section state.

## Clear account deletion cancellation

Changes the neutral action in the account deletion confirmation from “Keep editing” to the direct “Cancel” label, without changing the separate editor-removal confirmation.

## Stable legal navigation

Legal section links now leave the selected heading visible beneath the fixed shell header. Published legal footer links are reconciled on every SPA route transition and recover if the host registry is remounted, so they remain visible when entering or switching between legal pages.

## Guarded consent submission

The consent popup now enables Submit only after every required document is selected. The API validates the submitted version map, returns HTTP 400 for malformed or incomplete published-document consent, and the popup displays a localized error toast when the server rejects such a request.

## Never expose the unpublished sentinel

Consent reports now translate the internal unpublished database sentinel to no recorded version, so the UI displays the localized Never Consented value or an actual published document version ID.

## Restored consent and editor actions

Consent payload validation now uses the keyed legal-document definition contract, preventing the runtime error that returned HTTP 500. Confirmed Remove actions now close an existing editor, restore its Add action, and preserve the immutable published document for later editing.

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

- [f193e16](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f193e1610daf5abc76d07510115605d396edf5f2)

- [f500db9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f500db9c46919a4e9bf2911751340eb515b3213e)

- [2c96447](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2c9644756b1f693cd711695eb9cf1083fe5c36d9)

- [1c0203a](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1c0203adde325888d4c31a628453f941b9a1ddab)

- [97517b6](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/97517b67ae09218a9179879151547a582008e83c)

- [bd907c3](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/bd907c37acc039a80e9128712d3ae89ec0f92fb4)

- [c8b8fa2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c8b8fa29f2a92ebf584669be39eb3c1ee76af0da)

- [0f3c337](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0f3c3375d1376ec0deb5309f401be3070b1fe556)

- [aca7aed](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/aca7aedb050d29fcafc1e1204d6cd0ec4649dda0)

- [51b169b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/51b169b61a9aba1c49b50d66a8444c16964b5348)

- [232a8c0](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/232a8c08a256f5f5cef3dca2200b3436cde4a6ea)

- [21e6522](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/21e652276d8b297ad9ddb617a78acad9f8157bc8)

- [4fd26a8](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/4fd26a801ce84802d77fd20e7ebdcffe13666e3d)

- [b65f77e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b65f77e1261e7785a2d04b60ae43d4a87c886529)

- [a3621a1](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/a3621a16e00739912d95772fbd73937a449fcd4e)

- [86a9d66](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/86a9d66bed8866d0f92caae634762c6534a89e3d)

- [3012d12](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3012d12222273a77467f224af6b1a3be9fe809aa)

- [ab70147](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/ab70147c3a8f72f4d7f35b0ecefaaea2ea9f930e)

- [b4701c9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b4701c9f9f3d31a9eaabb2db3563c49c7f163d9e)
