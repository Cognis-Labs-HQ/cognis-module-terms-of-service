# Modul für Nutzungsbedingungen

**Feature-Branch:** `feature-add-terms-of-service-module-to-cognis`

## Verwaltung von Rechtsdokumenten

Fügt in der Administration den Bereich „Rechtliches“ hinzu, in dem Nutzungsbedingungen, Datenschutzerklärung und EULA mit dem Cognis-Markdown-Editor verfasst und veröffentlicht werden.

## Öffentliche Rechtsseiten

Veröffentlicht die drei festen öffentlichen Routen mit bereinigter Markdown-Darstellung, modulspezifischer dauerhafter Speicherung, Autorisierung, Lokalisierung und Lebenszyklusbereinigung.

## Vorhandene Browser-Wiederverwendungsverträge

Verwendet wie benachbarte Module `cognis.uiCtx` und `ui:reuse.importModule()`, importiert den vorhandenen Core-Markdown-Renderer direkt und implementiert den etablierten Administration-Sub-Composer-Export, ohne eine neue Core-Capability zu verlangen.

## Unveränderliche Rechtsversionen und erforderliche Zustimmung

Jede Veröffentlichung erzeugt über die Core-Capability für Dokumentversionen eine unveränderliche Version. Bei der Registrierung wird die ausdrückliche Zustimmung zu den aktuellen Bedingungen und der Datenschutzerklärung erfasst; bestehende Konten erhalten nach jeder Änderung eine unausweichliche Zustimmungsabfrage. Eine Ablehnung meldet das Konto ab.

## Struktur und Beitragsregeln für externe Module

Richtet das Repository an den gepflegten Konventionen der Module Jitsi Meet und Nextcloud Whiteboard aus: gemeinsames Changelog-Verzeichnis im Wurzelverzeichnis, synchronisierte modulspezifische KI-Anweisungen, wiederhergestellte CLI-Integration, prägnante Standards zum aktuellen Zustand sowie eigenständige Dokumentations- und Strukturvertragstests.

## Zustimmungspflicht erfasst jede authentifizierte Sitzung

Die Zustimmungsprüfung verwendet jetzt die Ergebnisse des Authentifizierungs-Flows statt ein lokales Token vorauszusetzen. Nach Ablehnung wird der lokale Zustand erst nach erfolgreicher Server-Abmeldung gelöscht; fehlerhafte, zu große, veraltete und interne Zustimmungsfehler erhalten unterschiedliche HTTP-Semantik.

## Commits

- [d0e4701](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d0e4701b5dc43aa21efb59bcffcbc45f4504ec65)
- [3f00993](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3f00993d648f17ac8b1fb0953747d9e36e684496)
- [27b6605](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/27b66054102cba443e7b9d74213da0099697f695)
- [361dac2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/361dac2396c03224fc407f79d400bb6c163c61ec)
- [cc866f7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/cc866f742cd4ff5a342cd37f6cd400e3ab0442fb)
