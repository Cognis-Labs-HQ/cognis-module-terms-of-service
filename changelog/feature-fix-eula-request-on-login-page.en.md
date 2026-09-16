# Publication-Aware Authentication Footer

**Feature Branch:** feature-fix-eula-request-on-login-page

## Avoid requests for unpublished legal documents

The authentication footer now loads one public publication index and creates links only for documents listed there. It no longer probes every legal-document endpoint, so an unpublished EULA does not produce an expected 404 request from the login page.

## Commits

- [271120b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/271120b069085e88096ef06ca91ef01557c18b58)
