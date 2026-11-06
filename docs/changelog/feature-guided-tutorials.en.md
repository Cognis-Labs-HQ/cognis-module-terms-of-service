# Guided tutorial

**Feature Branch:** feature-guided-tutorials

## Technical Specification

The play introduces the legal document and its navigation without accepting or changing consent. It requires an authenticated online session.

The module registers its own play and localized strings through ctx. The host owns the catalog, callouts, arrows, spotlight, keyboard and pointer controls, guarded SPA navigation and accessibility. Closing a tutorial, navigating away, losing access or disabling the module releases the session. Failed provider mounting rolls back its registrations.

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

## Page-bound First Visits

The host owns callouts, arrows, spotlight, accessibility and the shared floating action menu. First-time runs offer Next throughout, without Cancel or Skip. Replays offer Cancel with `btn-cancel`. Completion is stored per account in the browser. Navigation, access loss and provider removal release the session; failed mounts roll back registrations.

## Page Guides

The legal guide matches Terms of Service, Privacy Policy and EULA pages and stays on the document that the user opened.

## Administrator Legal Guide

A restricted guide on the visible Legal administration section explains versioned publishing and consent reports without changing documents or accepting consent.

## Actionable Tutorial Copy

Tutorial steps focus on the controls and tasks available on the page, without unrelated reassurances about permissions or actions the guide does not perform.

## Author Next cues per step

Each tutorial step now explicitly declares `highlightNext`: explanations that require Next or Finish enable it, while interaction- and wait-driven exercises disable it. The cue retains a static outline for reduced motion.

Tutorial coverage is required for every UI-facing component. Contributor guidance requires user-first, task-focused walkthroughs and a review of existing tutorials whenever features or UI behavior change.

## Specific targets and branch replay

Document guidance highlights a document header, and consent guidance highlights the search field of an available published-document consent report. The first usable target is selected inside the tutorial section and the step is skipped when no matching control is available.

## Commits

- [5c18cc7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5c18cc77ee2ea8a0629214557234304abab94ab8)
- [16412de](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/16412de6ffeaa1dbf3f5fc759e3b5dba57affa0f)
- [76a5028](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/76a5028bf65622ee5102df8ae30e241e7e059ec5)
- [c61b252](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c61b2522ce21c069eff5106a637926da90567d55)
- [8831fd7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/8831fd774be8df97f89e50e30f27cd9b04757f73)
- [50559bd](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/50559bde9f2021065a433e64f87563e18d35edee)
- [65032ae](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/65032aee78c1abd7007732ec97fee081a436aa14)
- [5613809](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/56138097d74e38bd34f0c05c024d9770d59adedf)
