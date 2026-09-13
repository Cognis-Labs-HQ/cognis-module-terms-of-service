# Restored Legal Document Saving and Layout

**Feature Branch:** work

## Restored saved document content

Maps the core version store's documented `content` field back to Markdown so newly published documents return correctly and the dirty tracker's Save action can complete successfully.

## Refined the Legal editor layout

Presents the three documents as compact, separated cards, reduces excessive composer height, and gives the full-width composer a more practical default grid size.

## Corrected the host integration contracts

Uses the authenticated claims returned by `auth:requireAuth` when attributing document publications, ensuring Save no longer submits an empty actor identifier. The Legal heading now renders its Markdown tooltip together with its content, document actions sit directly beside their headings, redundant disclosure arrows are removed, and explicit hidden-state styling reliably closes editors and switches Compose or Preview panes.

## Commits

- [2375f2c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2375f2cbe45c6ab21d7d93a70d94d2cc3c6e82a7)
- [e20d857](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/e20d857715e08f3656717ad55a5918fe236820ab)
