# Übertragung und Zustimmung

**Feature-Zweig:** feature-offline-delivery

## Sicherer Einwilligungscache

Einwilligungssnapshots behalten bereits beobachtete Dokumente bei, die in einer älteren Antwort fehlen. Neu veröffentlichte, nicht akzeptierte Dokumente sperren Offline-Zugriff und Zustellung weiterhin, bis der Server die Annahme ihrer aktuellen Versionen bestätigt. Größenlimits und Speicherfehler entziehen die Offline-Berechtigung, ohne den aktuellen Online-Status zu verwerfen: verpflichtende Einwilligung, Online-Annahme und öffentliche Rechtsseiten funktionieren weiterhin. Gemeinsamer, kontogebundener Arbeitsspeicher erhält beobachtete Versionen bei Cachefehlern und verhindert, dass ein anderer Client derselben Seite veraltete gespeicherte Berechtigungen wiederherstellt. Die Offline-Berechtigung kehrt erst zurück, wenn ein vollständiger akzeptierter Snapshot erfolgreich gespeichert wurde.

## Übertragung und Zustimmung

Die Wiederherstellung aktualisiert Anbieter und führt `authenticate-session` aus, bevor die abschließende Phase `afterSession` Aktivitäten überträgt. Erforderliche Anbieter deklarieren `offlineAccessGuard` im Serverkatalog. Unbekannte Anforderungen oder fehlende Zustimmung sperren Offline-Zugriff. Terms of Service speichert zuletzt abgerufene Dokumentversionen und serverbestätigte Zustimmung je Konto. Neue nicht akzeptierte Versionen sperren Offline-Lesen, Navigation und Einträge sofort sowie die Übertragung bis zur Online-Zustimmung. Offline-Zustimmung ist nicht möglich. Private Inhalte bleiben tablokal; nur begrenzte Warteschlangen und Rechtstexte überstehen Neuladen.

Der Host stellt `offline:outbox`, `offline:state` und `offline:accessPolicy` über ctx bereit. Komponenten registrieren Übertragungshandler für ihre Anbieter-Lebensdauer und stabile IDs über `offline:enqueue`; `offline:flush` autorisiert und überträgt. Die dauerhafte kontogebundene Warteschlange umfasst höchstens 1.000 Einträge und 1 MB für sieben Tage, ohne Tokens. IDs und Zeitstempel bleiben erhalten; temporäre Fehler werden wiederholt, bestätigte oder dauerhaft abgelehnte Einträge entfernt. Eine lokalisierte Warnung meldet Ablehnungen. Abmelden leert die Konto-Warteschlange; andere Konten erhalten keine fremden Einträge. Deaktivieren stoppt neue Offline-Einträge. Vorhandene Einträge können online übertragen werden.

## Abfragelimits im Offline-Modus

Im Offline-Modus stoppen die Einwilligungsabfragen und normalen Wiederherstellungsabfragen. Nur eine kleine Server-Gesundheitsabfrage läuft alle fünfzehn Minuten, auch bei wiederholten Online-Ereignissen des Browsers. Fehlgeschlagene Online-Verbindungsprüfungen werden bis auf fünfzehn Minuten verlangsamt. Einwilligungsabfragen werden bei Fehlern bis auf fünf Minuten verlangsamt, offline vollständig gestoppt und nach Wiederverbindung fortgesetzt. Die erforderliche zwischengespeicherte Zustimmung bleibt Voraussetzung für Offline-Zugriff.

## Commits

- [2dba1c6](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2dba1c61ea1ba7b219e06c09036408d89503571b)
- [2492ad3](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2492ad306ac7458b8d8e27083116420f298bebc1)
- [3b245ac](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3b245ac3c4fd6d4c03551ec02a90deda5fd5549f)
