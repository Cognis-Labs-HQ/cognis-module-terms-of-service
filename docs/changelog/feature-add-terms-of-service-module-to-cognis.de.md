# Modul für Nutzungsbedingungen

**Feature-Branch:** `feature-add-terms-of-service-module-to-cognis`

## Verwaltung von Rechtsdokumenten

Fügt in der Administration den Bereich „Rechtliches“ hinzu, in dem Nutzungsbedingungen, Datenschutzerklärung und EULA mit dem Cognis-Markdown-Editor verfasst und veröffentlicht werden.

## Öffentliche Rechtsseiten

Veröffentlicht die drei festen öffentlichen Routen mit bereinigter Markdown-Darstellung, modulspezifischer dauerhafter Speicherung, Autorisierung, Lokalisierung und Lebenszyklusbereinigung.

## Vorhandene Browser-Wiederverwendungsverträge

Verwendet wie benachbarte Module `cognis.uiCtx` und `ui:reuse.importModule()`, importiert den vorhandenen Core-Markdown-Renderer direkt und implementiert den etablierten Administration-Sub-Composer-Export, ohne eine neue Core-Capability zu verlangen.

## Commits

- [d0e4701](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d0e4701b5dc43aa21efb59bcffcbc45f4504ec65) — Modul zur Veröffentlichung von Rechtsdokumenten implementiert.
- [3f00993](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3f00993d648f17ac8b1fb0953747d9e36e684496) — Vorhandene UI-Wiederverwendungsverträge des Hosts eingebunden.
