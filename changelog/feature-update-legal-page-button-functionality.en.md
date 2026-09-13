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

## Commits

- [00eaced](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/00eaced82b2b476b53ddedb031a5d12214d69e61)
- [877d0ab](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/877d0abd97b345c5a95dbbff3c5ed12f90ee03f7)
