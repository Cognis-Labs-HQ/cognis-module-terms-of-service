# Public Legal Documents Without a Login Shell

**Feature Branch:** work

## Legal documents are available without signing in

Every legal route continues to use the Cognis page composer. For visitors without a login session, composer flags suppress the top bar, navigation, theme toggle, footer, page context, toolbar, layout persistence, and account enhancements so only the published Markdown-rendered document is visible. Each legal SPA route is explicitly registered with the host’s `public: true` route capability, allowing Cognis to serve and route it anonymously without weakening protected routes. Login and registration pages load a dedicated auth-footer plugin that contributes all three localized public legal-route links synchronously through the shared footer registry, without waiting for document API requests. Authenticated users retain the existing full-shell document view and change comparison.

## Outstanding status is visibly red

Outstanding consent statuses again use the core red disabled-state pill so they remain visually distinct from accepted statuses.

## Commits

- [53ee39c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/53ee39c1c93dd3e7a75d08c08fa1117b79002240)
- [9498acb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/9498acb599c82fa207a9cee75ceaac031d1f992b)
- [c1b177e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c1b177e9259d9ece1cbed1645db76d8d80d27d3e)
- [11033bb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/11033bbe0ab028c2b32fca066e2a46719abf5738)
- [79912f9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/79912f9f68759309d0e0b71b4d53422cc93eab2f)
- [b8fcb15](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b8fcb1500ad700ed8aa6422148edf6539daee976)
