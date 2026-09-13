# Modernisierte Bearbeitung von Rechtsdokumenten

**Feature-Branch:** feature-update-legal-page-button-functionality

## Vereinfachte Dokumentsteuerung

Verschiebt jede Erstellen-Aktion neben die jeweilige Dokumentüberschrift und wandelt sie bei geöffnetem Editor in eine destruktive Entfernen-Aktion um. Das Entfernen eines Editors erfordert nun eine ausdrückliche Bestätigung.

## Cognis-Bearbeitungsutilities integriert

Verwendet die Cognis-Änderungsverfolgung für Speichern und Verwerfen, veröffentlicht Änderungen beim Speichern mit einer Erfolgsmeldung und zeigt die Markdown-Unterstützung über den Informations-Tooltip neben der Überschrift „Rechtliches“ an.

## Verbessertes Verfassen-Layout

Bietet einen nicht skalierbaren Editor in voller Breite mit gleich breiten, direkt unter der Bearbeitungsfläche verbundenen Schaltflächen für Verfassen und Vorschau.

## Mount-Fehler der Administrationsroute verhindert

Beschränkt das direkte Einbinden der Seite auf die drei öffentlichen Rechtsdokumentrouten, damit das Laden des Beitrags unter `/administration` keinen Fehler wegen einer nicht unterstützten Route auslösen kann.

## Commits

- [00eaced](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/00eaced82b2b476b53ddedb031a5d12214d69e61)
- [877d0ab](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/877d0abd97b345c5a95dbbff3c5ed12f90ee03f7)
