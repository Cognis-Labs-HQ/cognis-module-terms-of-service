# Öffentliche Rechtsdokumente ohne Anmelde-Shell

**Feature-Branch:** work

## Rechtsdokumente sind ohne Anmeldung verfügbar

Jede Rechtsroute verwendet weiterhin den Cognis-Seiten-Composer. Für Besucher ohne Anmeldesitzung unterdrücken Composer-Flags kontoabhängige globale Shell-Steuerelemente, erhalten jedoch Dokumentrahmen, lokalisierten Seitenkontext und Abschnittswerkzeugleiste. Jede rechtliche SPA-Route wird ausdrücklich mit der Host-Routen-Capability `public: true` registriert, sodass Cognis sie anonym ausliefern und aufrufen kann, ohne geschützte Routen abzuschwächen. Anmelde- und Registrierungsseiten laden ein eigenes Auth-Footer-Plugin, das jedes öffentliche Dokument unabhängig prüft und dessen lokalisierten Rechtsrouten-Link nur bei Veröffentlichung beiträgt; eine fehlgeschlagene Abfrage blockiert die anderen Links nicht. Für authentifizierte Benutzer bleiben die bestehende Dokumentansicht mit vollständiger Shell und der Änderungsvergleich erhalten.

## Ausstehender Status ist sichtbar rot

Ausstehende Zustimmungsstatus verwenden wieder die rote deaktivierte Status-Pill des Cores und bleiben dadurch klar von akzeptierten Status unterscheidbar.

## Authentifizierungs-Footer und öffentliches Layout

Der Authentifizierungs-Footer behält den Lizenz-Link des Hosts bei, entfernt den nur für authentifizierte Benutzer bestimmten Changelog-Link und zeigt die drei Rechtslinks. Öffentliche Rechtsseiten behalten nun ihr zusammengesetztes Dokumentlayout, statt randlos dargestellt zu werden.

## Commits

- [53ee39c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/53ee39c1c93dd3e7a75d08c08fa1117b79002240)
- [9498acb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/9498acb599c82fa207a9cee75ceaac031d1f992b)
- [c1b177e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c1b177e9259d9ece1cbed1645db76d8d80d27d3e)
- [11033bb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/11033bbe0ab028c2b32fca066e2a46719abf5738)
- [79912f9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/79912f9f68759309d0e0b71b4d53422cc93eab2f)
- [b8fcb15](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b8fcb1500ad700ed8aa6422148edf6539daee976)
- [f81a194](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f81a194a3d10e8663d31367aa1c9017094f476db)
- [0e7944f](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0e7944f94387695520604e30696097c06f192676)
