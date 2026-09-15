# Öffentliche Rechtsdokumente ohne Anmelde-Shell

**Feature-Branch:** work

## Rechtsdokumente sind ohne Anmeldung verfügbar

Jede Rechtsroute verwendet weiterhin den Cognis-Seiten-Composer. Für Besucher ohne Anmeldesitzung unterdrücken Composer-Flags Kopfleiste, Navigation, Theme-Umschalter, Footer, Seitenkontext, Werkzeugleiste, Layout-Speicherung und Kontoerweiterungen, sodass nur das veröffentlichte, aus Markdown gerenderte Dokument sichtbar ist. Jede rechtliche SPA-Route wird ausdrücklich mit der Host-Routen-Capability `public: true` registriert, sodass Cognis sie anonym ausliefern und aufrufen kann, ohne geschützte Routen abzuschwächen. Anmelde- und Registrierungsseiten laden ein eigenes Auth-Footer-Plugin, das alle drei lokalisierten Links zu öffentlichen Rechtsrouten synchron über die gemeinsame Footer-Registry beiträgt, ohne auf Dokument-API-Anfragen zu warten. Für authentifizierte Benutzer bleiben die bestehende Dokumentansicht mit vollständiger Shell und der Änderungsvergleich erhalten.

## Ausstehender Status ist sichtbar rot

Ausstehende Zustimmungsstatus verwenden wieder die rote deaktivierte Status-Pill des Cores und bleiben dadurch klar von akzeptierten Status unterscheidbar.

## Commits

- [53ee39c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/53ee39c1c93dd3e7a75d08c08fa1117b79002240)
- [9498acb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/9498acb599c82fa207a9cee75ceaac031d1f992b)
- [c1b177e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c1b177e9259d9ece1cbed1645db76d8d80d27d3e)
- [11033bb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/11033bbe0ab028c2b32fca066e2a46719abf5738)
- [79912f9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/79912f9f68759309d0e0b71b4d53422cc93eab2f)
- [b8fcb15](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b8fcb1500ad700ed8aa6422148edf6539daee976)
