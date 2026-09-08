# AI instructions for Cognis external modules

These instructions apply to this entire repository and define the safe defaults that forks of this template should retain.

## Session startup

Run `npm install` before exploration or development. Use `rg` rather than recursive `grep` for searches. Read every applicable `AGENTS.md` and `.github/copilot-instructions.md` before editing files.

## External module contract

One repository delivers exactly one module. Keep `manifest.json`, `package.json`, `routes.json`, and `bootstrap.js` at the repository root. Preserve the module UUID permanently; IDs are readable labels, but UUIDs are lifecycle and dependency identities. Use UUIDs in `requires`. Synchronize the versions in the manifest, package, and lockfile for every code, schema, API, or contract change, retain `"type": "module"`, and keep `routes.json` as an array, including when it is empty.

Always set `ui.stringsBaseUrl` in `manifest.json` to the module-owned locale bundle base URL; this is essential so Cognis can resolve localized manifest metadata before the module UI loads. Every entrypoint, asset, screenshot, and `manifest.files` item must be a regular repository-relative file with exact filename casing and must remain inside the checkout. Declare only capabilities and routes that the module actually needs, keep protected access least-privileged, and document why each requirement exists.

After the final file change, run `npm run manifest:hashes`. The digest inventory contains only regular packaged files: exclude `manifest.json` because it cannot hash itself, `docs/changelog/` because changelogs are host-discovered release metadata, the optional root `README.md` compatibility alias because the host resolves localized README files directly, and every symbolic link, directory, socket, or other non-regular filesystem entry. Never replace those exclusions with hashes of symlink targets. Changelog SHA-256 sums must never be added to `manifest.json`. Keep publisher, repository, homepage, support, license, categories, tags, and localized README metadata accurate. Never commit generated secrets, credentials, private repository tokens, or personal data.

## Component isolation, capabilities, and flows

`bootstrap.js` is the sole host integration entrypoint and should contain orchestration rather than business logic. Treat `ctx` as the complete cross-component bus. Obtain behavior through capabilities, contribute public behavior through neutral capabilities and named flow stages, and detect optional components by capability. Use camel case inside each colon-delimited capability or flow-name segment. Keep capability contracts use-case-neutral: callers provide feature-specific labels, icons, and action identifiers.

Never import Cognis internals, sibling components, database drivers, auth implementations, gateways, adapters, or private package implementations. Pass authentication, authorization, persistence, request, logging, and UI behavior into handlers through a `ctx`-derived context. Route handlers validate and orchestrate; the owning capability executes provider-specific work. Browser consumers use gateway-owned UI clients rather than calling another gateway's API endpoints directly.

Create meaningful orchestration as named flows with stable, ordered stage IDs. Extend a flow with removable stages instead of branching on a known component or editing its internals. A module may create a flow only when it owns that operation. Register everything through the scoped context so the host can track it.

Return a disposer from `bootstrapModule` or export `teardownModule(ctx)` for resources scoped registration cannot remove. Export `uninstallModule(ctx, { deleteContent })` when the module persists content outside its checkout; preserve content unless `deleteContent` is true. Test install, enable-disable-enable, and uninstall paths. No route, static directory, UI contribution, capability, flow, stage, timer, listener, socket, or runtime script may survive teardown.

## Structure and reuse

Keep server code in `api/`, browser code in `ui/`, CLI code in `cli/`, localized documentation in `docs/`, datasets in `data/`, tooling in `scripts/` or `tooling/`, and artwork in `assets/`. Put tests beside their layer or in `tests/`, according to the repository's established layout. Module-specific operational controls belong in a `cognisctl` extension under `cli/`; they should call public contracts rather than bypassing them.

Put genuinely reusable layer-local code in `reuse/`; do not create `shared`, `utils`, `helpers`, or `common` directories. Promote a reusable abstraction when adjacent work reveals duplicated, parameterizable behavior, but keep feature-specific code beside its feature. Avoid redundant filenames when the containing directory already supplies the context.

Keep source files at or below 1000 lines. Prefer cohesive modules, early returns, and descriptive names over dense expressions. Avoid ambiguous one- or two-letter names except conventional coordinates, counters, row/column names, `_`, and `id`. Comments explain non-obvious intent, constraints, or alternate control flow—not syntax or edit history. Do not add compatibility shims for obsolete contracts or tests whose only purpose is asserting that deleted legacy artifacts remain absent.

## UI and localization

Build dashboard content with host page-composer and client-side router contracts. The module owns only descendants rendered into the content root passed to `mount()`. Never manipulate or style the dashboard shell, `document.body`, `document.head`, or host-owned classes. End selectors at a module-namespaced class or ID; a host theme selector may appear only as an ancestor. Obtain host reusable modules and common styles through `ui:reuse`, and load third-party runtime scripts through `ui:resourceLoader`; dispose resource handles on unmount instead of appending scripts directly.

Never navigate with `window.location.href`, `window.location.replace`, or `window.location.reload`. Use links for navigation and buttons for actions. Destructive actions use the host's destructive styling; cancellation is not destructive. Use host router, toast, error-popup, decision-popup, timestamp, theme, font, avatar, and focus contracts. Do not use `alert`, `confirm`, or `prompt`, write transient status into arbitrary DOM nodes, depend on browser console output for operational failures, copy host CSS, add CSS comments, or use emoji/platform glyphs where a themeable SVG is appropriate.

Put every user-facing string in the German, English, Indonesian, and Japanese XML locale files with matching keys and genuine translations. Namespace keys to the module and use lowercase period-delimited words (for example `module.example.canvas.label`); do not use underscores or kebab-case between words. Localize manifest metadata, page titles, subtitles, labels, errors, empty states, accessibility text, and CLI-facing output where the host contract supports it.

## API, persistence, configuration, and security

Validate, bound, sanitize, and normalize at API boundaries. Authenticate and authorize before business logic, use least privilege and secure defaults, and return stable public errors without internal details. Do not impose an arbitrary result limit when the caller did not request one; validate an explicit limit without silently clamping or substituting it.

Keep persistence behind `ctx` capabilities and module-owned stores. Parameterize queries, keep schema/table names module-namespaced, and never bind the module to a concrete database driver. State-changing activity is logged at `info`. Caught failures are logged at `error` with safe structured metadata including component, operation, and relevant non-secret identifiers; uncaught runtime failures are fatal. Do not leave silent catches; log an intentional fallback before continuing.

Use manifest `ui.preferences` and the module-owned `GET`/`PUT /api/v1/modules/<id>/config` contract for administrator configuration rather than building a second settings UI. Persist configuration across disable and restart; clear it only through uninstall semantics. Never return stored passwords. User-specific secrets belong in the host keyring and configuration secrets must use the host's concealed-value contract. Use Web Crypto or Node Crypto—not `Math.random()`—for identifiers, tokens, keys, and generated values.

Declare hard dependencies sparingly and prefer capability requirements or soft dependencies for optional integrations. Disabled modules must not run their normal bootstrap. Use a declared `disabledApi` entrypoint only when configuration must work while disabled, and register only routes explicitly allowed in that state.

## Tests and quality

Tests must run in this standalone repository with local fakes for host capabilities. Test public route, capability, flow, lifecycle, authorization, localization, and manifest contracts rather than Cognis or sibling implementations. Every behavior change requires tests, safe logging, and synchronized documentation. Keep localized documentation variants structurally and semantically synchronized.

Run all of the following before committing:

```sh
npm install
npm run lint
npm test
npm run manifest:hashes
npm run check:manifest
git diff --check
```

Use the repository Prettier configuration: four-space indentation, double quotes in JavaScript, and trailing commas in multiline structures. Avoid tabs and trailing whitespace. Never wrap imports in `try`/`catch`. Do not add AI reasoning, session notes, or process commentary to product-facing files.

## Changelog entries

Store changelog entries in the shared `docs/changelog/` directory; do not create a root `CHANGELOG.md` or component-local changelog directories. Every pull request must add one entry in each supported language (`de`, `en`, `id`, and `ja`) using `<branch-name-without-copilot-prefix>.<lang>.md` filenames.

This template repository is the sole exception: do not create changelog entries for changes made to the template itself. The requirement above applies to external modules created from this template and must remain in these inherited instructions.

Each localized entry must contain, in this order, a level-one localized title, a localized bold feature-branch label, one or more level-two change headings with explanatory body text, and a localized level-two commit section. Use one change point per level-two heading because Cognis uses those headings as release-popup summaries. Translate the prose and provenance labels rather than copying English into other languages.

List implementation provenance as Markdown links whose targets use the module repository's full `/commit/<full-sha>` URL; the visible label may use the seven-character short reference. Before finishing, ensure the commit list records the immediately preceding implementation commit. If this requires a final bookkeeping commit, restrict it to the localized changelog files; because changelogs are excluded from the digest inventory, this bookkeeping step must not modify `manifest.json`. Existing changelog entries are immutable except for factual corrections.

## Review discipline

Treat human and automated review comments as actionable engineering feedback unless they conflict with higher-priority instructions. Record deliberately deferred work in root `TODO.md` with a concrete technical reason. Keep changes focused while leaving directly touched areas cleaner than you found them.
