# Modul an die Entwicklungsvorlage anpassen

**Feature-Branch:** feature-align-module-template

## Ladezustand bei Abbruch freigeben

1.5.47 — Eine abgebrochene direkte Seite gibt ihr gemeinsames Ladetoken sofort frei, auch bei ausstehender Übersetzungs-, Anbieter- oder Composer-Initialisierung. Die Ressourcenbereinigung bleibt an dasselbe Host-Signal gebunden.

## Paketziele und Entwicklerhinweise

Ausgabe 1.5.46 — Die Paketprüfung stellt sicher, dass Einstiegspunkte, Icons, Banner und Screenshots reguläre Dateien innerhalb des Checkouts sind, auch nach Pfadauflösung. Die Dokumentation beschreibt öffentliche Verträge und verweist für Veröffentlichungsmetadaten auf Manifeste; Änderungsprotokolle behalten die Herkunft der Veröffentlichung. Öffentliche Rechtsseiten verwenden das Lebenszyklussignal des direkten Host-Einstiegs. Abgebrochene Übersetzungs- oder Dokumentladevorgänge veröffentlichen keine veraltete UI. Composer werden beim Abbruch zerstört, und verspätete Initialisierung aktualisiert nicht die Fußzeile der Zielseite. Jedes Ladetoken wird bei Abschluss, Fehler oder Abbruch freigegeben.

## Standardstruktur und eigene Integration

Vorlagenrichtlinien, domänenspezifische Routenpfade, übersetzte Integrationsdokumentation, ausführbare Strukturprüfungen und endgültige Paket-Hashes synchronisieren. Öffentliche URLs und Modulidentität bleiben erhalten. Browserbeiträge folgen den Lebenszyklusverträgen des zuständigen Hosts.

## Bannerinhalt sichtbar halten

Das Terms-of-Service-Banner wird so angepasst, dass Logo, Titel, Dokument und Schild im beschnittenen Marketplace-Bereich vollständig sichtbar bleiben. Das vorhandene Dokument-Icon bleibt erhalten.

## Einheitliche Marketplace-Texte

Verwenden Sie kurze Aktionszusammenfassungen und konkrete Funktionsbeschreibungen in den Marketplace-Metadaten mit inhaltlich abgestimmten Übersetzungen.

## Commits

- [41d44fb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/41d44fb683efbe9206ebe78a32f4b9f78cef2bb9)
- [bf9b760](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/bf9b760ddc729dd30f1309013c186bdd11321308)
- [1fe6b25](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1fe6b25a95416e45b08cbf32600d2d3886b70452)
- [d2639c0](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d2639c08ce40c538932e1bdd938ba03e6a81ddfc)
