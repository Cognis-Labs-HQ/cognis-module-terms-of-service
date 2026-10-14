# Align module with the contributor template

**Feature Branch:** feature-align-module-template

## Release loading on cancellation

1.5.47 — A cancelled direct page releases its shared loading token immediately, even while translation, provider or composer initialization is pending. Resource cleanup remains bound to the same host signal.

## Package targets and developer guidance

Release 1.5.46 — Package validation checks that entrypoints, icons, banners and screenshots are regular files inside the checkout, including resolved paths. Documentation describes public contracts and refers to manifests for release metadata; changelogs retain release provenance. Public legal pages consume the host direct-entry lifecycle signal. Cancelled translation or document loads cannot publish stale UI, composers are destroyed on abort, and late initialization cannot refresh the destination page footer. Every loading token is released on completion, failure or cancellation.

## Standard structure and owned integration

Synchronize template guidance, domain route paths, localized integration documentation, executable structure checks and final package digests. Keep existing public URLs and module identity. Browser contributions follow their owning host lifecycle contracts.

## Keep the banner artwork visible

Rework the Terms of Service banner so the logo, title, document and shield remain fully visible within the marketplace hero crop. Preserve the existing document icon.

## Consistent marketplace descriptions

Use short action summaries and concrete feature descriptions across marketplace metadata, keeping localized meanings aligned.

## Commits

- [41d44fb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/41d44fb683efbe9206ebe78a32f4b9f78cef2bb9)
- [bf9b760](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/bf9b760ddc729dd30f1309013c186bdd11321308)
- [1fe6b25](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1fe6b25a95416e45b08cbf32600d2d3886b70452)
- [d2639c0](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d2639c08ce40c538932e1bdd938ba03e6a81ddfc)

- [7655c5f](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/7655c5f9319158ba37f93d2918704cd23a378526)
