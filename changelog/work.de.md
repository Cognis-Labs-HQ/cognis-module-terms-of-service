# Öffentliche Rechtsdokumente ohne Anmelde-Shell

**Feature-Branch:** work

## Rechtsdokumente sind ohne Anmeldung verfügbar

Jede Rechtsroute verwendet weiterhin den Cognis-Seiten-Composer. Für Besucher ohne Anmeldesitzung unterdrücken Composer-Flags Kopfleiste, Navigation, Theme-Umschalter, Footer, Seitenkontext, Werkzeugleiste, Layout-Speicherung und Kontoerweiterungen, sodass nur das veröffentlichte, aus Markdown gerenderte Dokument sichtbar ist. Direkte URL-Aufrufe initialisieren nun die UI-Provider des Hosts und binden den Composer ein, ohne den authentifizierungserzwingenden Seitenlade-Flow zu starten; eine Sitzungsprüfung ohne Weiterleitung bestimmt dabei die passende Ansicht. Für authentifizierte Benutzer bleiben die bestehende Dokumentansicht mit vollständiger Shell und der Änderungsvergleich erhalten.

## Commits

- [53ee39c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/53ee39c1c93dd3e7a75d08c08fa1117b79002240)
- [9498acb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/9498acb599c82fa207a9cee75ceaac031d1f992b)
- [c1b177e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c1b177e9259d9ece1cbed1645db76d8d80d27d3e)
