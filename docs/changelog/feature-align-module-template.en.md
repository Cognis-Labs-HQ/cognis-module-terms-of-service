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

## Restore marketplace names and full-width legal editors

Preserve published marketplace translation identifiers across release channels. Load the module-owned Legal stylesheet through the host UI reuse capability so administration text editors fill their available width.

## Authorize legal mutations

Publish and consent flows authenticate the request inside their authorization stage. Publishing requires an administrator; actor and consent account identities come only from verified claims. Tests cover direct flow calls and forged identities. Authentication footer documentation now describes its descriptor-provider contract.

## Restore Legal section loading

Load module-owned CSS through the public page-styles helper. The shared stylesheet catalog accepts only reuse-relative names; passing a module URL rejected the UI import and hid the Legal section. Tests enforce this boundary and verify administration discovery.

## Preserve module IDs in locale keys

Locale keys use `module.<manifest.id>.<feature>.<label>`. Keep a multiword module ID intact with its hyphens; for `terms-of-service`, use `module.terms-of-service.admin.title`. The suffix after the module ID uses lowercase period-delimited words. Manifest metadata, XML bundles and code references must use the same namespace.

## Keep legal footer links available

All browser clients use the footer registry owned by `ctx`, including separately loaded static and bundled scripts. Footer descriptors may request `target: "_blank"`; the renderer adds `noopener noreferrer`. Authentication providers supply translated labels and authentication contexts, while signed-in legal links explicitly belong to the application context. History and browser-cache restoration refresh published legal links without replacing core License or Changelogs links.

## Commits

- [41d44fb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/41d44fb683efbe9206ebe78a32f4b9f78cef2bb9)
- [bf9b760](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/bf9b760ddc729dd30f1309013c186bdd11321308)
- [1fe6b25](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1fe6b25a95416e45b08cbf32600d2d3886b70452)
- [d2639c0](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d2639c08ce40c538932e1bdd938ba03e6a81ddfc)
- [7655c5f](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/7655c5f9319158ba37f93d2918704cd23a378526)
- [74202d2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/74202d2bc56373bbce9fbd0c3cc3d271eb74e32f)
- [146fc39](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/146fc39fdefd6b3715d1b0a34a65fa102e05157f)
- [48dde68](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/48dde68726c5009893be9c1ea54e9799653fd655)
- [f4f4598](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f4f45988a7cc220ff43b22f16fae7adfd860148f)
