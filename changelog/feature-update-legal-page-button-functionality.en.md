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

## Commits

- [00eaced](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/00eaced82b2b476b53ddedb031a5d12214d69e61)
- [877d0ab](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/877d0abd97b345c5a95dbbff3c5ed12f90ee03f7)
- [2d2b595](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2d2b59547b04d5f9a1f34483f3ef264749b31c81)
- [4432dc8](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/4432dc8ee1a2d7887b99b0eeee70c8c030d40926)
- [a3ea3cd](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/a3ea3cd458906443f8316daa0304e48a0da5eb27)
- [1f11f9b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1f11f9b4e568e0f53dfeaa5900b333cc354a2e62)
