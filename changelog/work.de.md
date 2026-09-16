# Veröffentlichungsbewusster Footer auf Authentifizierungsseiten

**Feature-Branch:** work

## Keine Anfragen für unveröffentlichte Rechtsdokumente

Der Footer auf Authentifizierungsseiten lädt jetzt einmalig einen öffentlichen Veröffentlichungsindex und erstellt nur Links für die dort aufgeführten Dokumente. Er fragt nicht mehr jeden Rechtsdokument-Endpunkt ab, sodass eine unveröffentlichte EULA auf der Anmeldeseite keine erwartete 404-Anfrage mehr verursacht.

## Commits

- [2b32f5b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2b32f5bad98240e0eed42ac04836101fea74b631)
