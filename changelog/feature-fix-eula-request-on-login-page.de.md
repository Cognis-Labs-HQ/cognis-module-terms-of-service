# Veröffentlichungsbewusster Footer auf Authentifizierungsseiten

**Feature-Branch:** feature-fix-eula-request-on-login-page

## Keine Anfragen für unveröffentlichte Rechtsdokumente

Der Footer auf Authentifizierungsseiten lädt jetzt einmalig einen öffentlichen Veröffentlichungsindex und erstellt nur Links für die dort aufgeführten Dokumente. Er fragt nicht mehr jeden Rechtsdokument-Endpunkt ab, sodass eine unveröffentlichte EULA auf der Anmeldeseite keine erwartete 404-Anfrage mehr verursacht.

## Commits

- [271120b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/271120b069085e88096ef06ca91ef01557c18b58)
