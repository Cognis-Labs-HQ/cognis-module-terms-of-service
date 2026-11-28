# Dokumentation und Hostverträge

**Feature-Zweig:** feature-documentation-core-alignment

## Strukturierte Dokumentation

Info, Anwendung und Technik bilden vollständige lokalisierte Dokumentfamilien im Modulmanifest. Einführung, praktische Abläufe und aktuelle API-/Konfigurationsverträge besitzen eigene Ansichten. Strikte Gliederungs-, Verweis- und Dateinamenprüfungen laufen in eigenständigen Tests und CI. Quelldateilinks folgen dem Standardzweig; Änderungslinks behalten kurze Commitbezeichnungen.

## Gatewaydiagnosen

Laufzeitdiagnosen verwenden das Logging-Gateway des Hosts und dessen Ausgaberichtlinie. Befehlsberichte nutzen Terminalausgaben. Die Prüfung nativer Konsole umfasst Modul-JavaScript einschließlich Aliasen und berechneter Zugriffe. Anbieterlebenszyklen, Berechtigungen und Anleitungsabschluss-IDs bleiben erhalten.

## Aussagekräftige Bindungsnamen

Die Syntaxbaumprüfung erfasst JavaScript- und TypeScript-Quelltext, Werkzeuge, Tests und Testdaten ohne Altbestands- oder Dateiausnahmen. Sie prüft Laufzeitbindungen, Signaturparameter, private Mitglieder sowie eigene zusammengesetzte Typ- und Methodennamen. Übliche Kurzformen bleiben als direkte Namen wie `db`, `this.db`, `args` und LDAP-`dn` zulässig. Zusammengesetzte Namen schreiben andere Kurzformen als Maßeinheiten aus, auch bei übernommenen Bezeichnern: `DatabaseExecutor`, `KeyringDatabaseExecutor`, `createDatabaseExecutor`, `baseDistinguishedName` und `registerStaticDirectory`. Undurchsichtige Kurzformen, nummerierte Platzhalter und verwendete ignorierte Bindungen lassen die Prüfung fehlschlagen. Ein ungenutztes, nicht exportiertes `_`, `id` und arithmetische `i`/`j`/`k`-Zähler behalten ihre festgelegten Rollen. Generische Typparameter, kanonische Abhängigkeits- und Plattformnamen sowie öffentliche Nutzdatenschlüssel behalten ihre Verträge. Eigene API-Deklarationen, Importe, Exporte und Aufrufer verwenden denselben Namen; reine Umbenennungsaliase einschließlich Typaliasen schlagen fehl. Regressionstestfälle sichern die Unterscheidung direkter und zusammengesetzter Namen sowie kanonische Plattform-APIs. Lokalisierte Handbücher, Beitragsrichtlinien, Modulversionen, Sperrdateien und Paketprüfsummen sind synchronisiert. Maßeinheiten wie `ms`, `sec`, `px`, `rad` und `deg` bleiben in zusammengesetzten Namen abgekürzt. Zeit- und Pixelangaben verwenden wieder Formen wie `INVITE_EXPIRY_MS`, `timeoutMs` und `widthPx`. Regressionstestfälle sichern die Einheitenausnahme, ohne undurchsichtige benachbarte Wörter zuzulassen.

## Commits

- [c9a4fd5](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c9a4fd5465026bd64703dc4203e50be347204f72)
- [bb97b11](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/bb97b11a9e404d6e6ae371276e26300984c068b7)
- [1afd987](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1afd987ea2619d325592284ad3c767de8de11fec)
- [fb8b2c4](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/fb8b2c4f834613cff0b840c880e0e9051cf1e005)
- [3195902](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/31959026c4ee832b9aff777c853ca41babbc0a81)
