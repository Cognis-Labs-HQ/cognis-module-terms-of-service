# Unique Terms of Service module identity

**Feature Branch:** work

## Corrected the duplicate module UUID

Assigns the Terms of Service module its own permanent UUID so Cognis no longer rejects it as a duplicate of another module.

## Protected the module identity

Adds a structural regression assertion for the assigned UUID and synchronizes the module version and package digests.

## Commits

- [b35001c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b35001c9ef2e5df3cf5ad8f553809650ccfe45ea)
- [63e048f](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/63e048fd3416d400a6c2352724e6a37fe69c30f0)
