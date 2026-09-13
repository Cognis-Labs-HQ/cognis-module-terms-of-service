# Correct PNG store artwork integration

**Feature Branch:** feature-fix-usage-of-banner.png-and-icon.png

## Published the new icon and banner correctly

Uses `assets/icon.png` and `assets/banner.png` as the module's store icon and banner, while removing the stale reference to a deleted screenshot.

## Protected asset metadata

Validates that every declared manifest asset is a repository-relative regular file so missing or unsafe artwork paths fail packaging checks.

## Commits

- [df8b775](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/df8b77597cfefdd3dcfa94e0366f6808b8b0ec6b)
