# Publication-Aware Authentication Footer

**Feature Branch:** work

## Avoid requests for unpublished legal documents

The authentication footer now loads one public publication index and creates links only for documents listed there. It no longer probes every legal-document endpoint, so an unpublished EULA does not produce an expected 404 request from the login page.

## Commits

- [2b32f5b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2b32f5bad98240e0eed42ac04836101fea74b631)
