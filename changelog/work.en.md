# Public Legal Documents Without a Login Shell

**Feature Branch:** work

## Legal documents are available without signing in

Every legal route continues to use the Cognis page composer. For visitors without a login session, composer flags suppress account-dependent global shell controls while retaining the document frame, localized page context, and section toolbar. Each legal SPA route is explicitly registered with the host’s `public: true` route capability, allowing Cognis to serve and route it anonymously without weakening protected routes. Login and registration pages load a dedicated auth-footer plugin that checks each public document independently and contributes its localized legal-route link only when the document is published; one failed lookup does not block other links. Authenticated users retain the existing full-shell document view and change comparison.

## Outstanding status is visibly red

Outstanding consent statuses again use the core red disabled-state pill so they remain visually distinct from accepted statuses.

## Authentication footer and public layout

The authentication footer keeps the host License link, removes the authenticated-only Changelogs link, and shows the three legal links. Public legal pages now retain their composed document layout instead of rendering edge-to-edge.

## Commits

- [53ee39c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/53ee39c1c93dd3e7a75d08c08fa1117b79002240)
- [9498acb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/9498acb599c82fa207a9cee75ceaac031d1f992b)
- [c1b177e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c1b177e9259d9ece1cbed1645db76d8d80d27d3e)
- [11033bb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/11033bbe0ab028c2b32fca066e2a46719abf5738)
- [79912f9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/79912f9f68759309d0e0b71b4d53422cc93eab2f)
- [b8fcb15](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b8fcb1500ad700ed8aa6422148edf6539daee976)
- [f81a194](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f81a194a3d10e8663d31367aa1c9017094f476db)
- [0e7944f](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0e7944f94387695520604e30696097c06f192676)
