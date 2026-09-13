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

## Navigation während Modulneustarts verfügbar gehalten

Erhält ein zuvor geladener Zustimmungs-Hook während einer Modulaktualisierung oder eines Neustarts die Antwort, dass der Endpunkt fehlt, protokolliert er nun den Lifecycle-Fallback, beendet nachfolgende Prüfungen und gibt die Verarbeitung frei, statt den Authentifizierungs-Flow abzulehnen und die Navigation zu blockieren.

## Bearbeitung an die Administration angepasst

Fasst alle Rechtsdokumente in einem durchgehenden Bereich in voller Breite mit einklappbaren SVG-Überschriften und integrierten Schaltflächen zum Hinzufügen oder Entfernen zusammen. Der Markdown-Tooltip wird nun direkt an die Überschrift „Rechtliches“ angefügt, Änderungen verwenden die schwebende Änderungsverfolgung des Hosts, Verfassen und Vorschau entsprechen den Nachrichten-Steuerelementen und Speicherfehler zeigen eine aussagekräftige lokalisierte Fehlermeldung.

## Commits

- [00eaced](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/00eaced82b2b476b53ddedb031a5d12214d69e61)
- [877d0ab](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/877d0abd97b345c5a95dbbff3c5ed12f90ee03f7)
- [2d2b595](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2d2b59547b04d5f9a1f34483f3ef264749b31c81)
- [4432dc8](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/4432dc8ee1a2d7887b99b0eeee70c8c030d40926)
- [a3ea3cd](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/a3ea3cd458906443f8316daa0304e48a0da5eb27)
- [1f11f9b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1f11f9b4e568e0f53dfeaa5900b333cc354a2e62)
