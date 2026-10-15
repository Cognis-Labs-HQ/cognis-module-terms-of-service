# Modernized Legal document editing

**Feature Branch:** feature-update-legal-page-button-functionality

## Streamlined document controls

Moves each create action beside its document heading and changes it into a destructive Remove action while the editor is open. Removing an editor now requires explicit confirmation.

## Integrated Cognis editing utilities

Uses the Cognis dirty tracker for Save and Discard actions, publishes changes from Save with a success toast, and presents Markdown support through the Legal heading's information tooltip.

## Improved composition layout

Provides a full-width, fixed-size editor with equal Compose and Preview controls attached beneath the editing surface.

## Prevented Administration route mounting errors

Restricts direct page mounting to the three public legal-document routes so loading the contribution on `/administration` cannot trigger an unsupported-route error.

## Kept navigation available during module restarts

When a previously loaded consent hook receives a missing-endpoint response while the module is updating or restarting, it now records the lifecycle fallback, disables subsequent checks, and yields instead of rejecting the authentication flow and blocking navigation.

## Matched the Administration editing experience

Combines all legal documents into one full-width section with collapsible SVG headings and inline Add or Remove buttons. The Markdown tooltip now attaches directly to the Legal heading, edits use the host floating dirty tracker, Compose and Preview match the Messages controls, and save failures provide a meaningful localized error.

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

## Redraw footer links after legal page mount

Legal pages now request a forced footer-link registry notification after their Cognis page composer finishes mounting. This closes the shell-transition timing gap that could leave an already-registered link set absent after navigating from a freshly loaded Dashboard.

## Live consent report updates

Successful consent now emits an immediate browser event that refreshes every mounted administration report from the API. Visible reports also poll every five seconds for consent recorded in other sessions, and all listeners and timers are removed when the administration section unmounts. Commit lists no longer contain blank lines between entries.

## Completed consent lifecycle review

Treats the unpublished sentinel as no prior consent, prevents the refresh timer from restarting after teardown, and registers reports created by first publication for live updates. The obsolete registration-card TODO was removed after confirming the current registration flow already records the complete published version set. All work changelog content and commits now live in this feature changelog only.

## Show policy changes before renewed consent

Returning users now see a structured line-by-line comparison between the version they previously consented to and the latest published policy. The authenticated module route delegates comparison to `docs:versionStore`, while the consent popup renders additions, removals, and replacements through the host `ui:documentDiff` capability.

## Moved comparisons to full legal pages

Declares `ui:documentDiff` as a required host capability and changes updated-policy links to open the normal legal route with `?view=changes`, while footer links retain plain routes. The full-size page renders Markdown-aware comparisons with the dedicated host stylesheet and shows a localized unavailable explanation when historical pre-migration content cannot be compared.

## Recovered consent lifecycle state

Consent endpoint 404 responses are now retried periodically so enforcement resumes after module recovery, back-forward cache restores preserve the active hook, and legal document loading completes before ancillary reporting requests. Reporting failures can no longer replace published editor content with blank definitions.

## Commits

- [00eaced](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/00eaced82b2b476b53ddedb031a5d12214d69e61)
- [877d0ab](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/877d0abd97b345c5a95dbbff3c5ed12f90ee03f7)
- [2d2b595](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2d2b59547b04d5f9a1f34483f3ef264749b31c81)
- [4432dc8](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/4432dc8ee1a2d7887b99b0eeee70c8c030d40926)
- [a3ea3cd](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/a3ea3cd458906443f8316daa0304e48a0da5eb27)
- [1f11f9b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1f11f9b4e568e0f53dfeaa5900b333cc354a2e62)
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
- [a008192](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/a0081922d9a38bedb422ecb53fb32c2b28202ee0)
- [611f637](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/611f637d7272196cbdb2c20276588412de5fe558)
- [c26254a](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c26254a2483d2e4fd05d8ffd2a5545a44c49b90c)
- [5628abb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5628abb5aee3e080e5046835d094b40d67380a41)
- [43ee0a3](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/43ee0a3ccd9d6cc51f4eb28ece4c9d76aaedc465)
- [a40166e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/a40166ec47aac44d7b755af8e98e48e1df7142a6)
