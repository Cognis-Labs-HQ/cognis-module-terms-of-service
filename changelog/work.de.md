# Speichern und Layout von Rechtsdokumenten wiederhergestellt

**Feature-Branch:** work

## Gespeicherte Dokumentinhalte wiederhergestellt

Ordnet das dokumentierte Feld `content` des Core-Versionsspeichers wieder Markdown zu, damit neu veröffentlichte Dokumente korrekt zurückgegeben werden und die Speichern-Aktion der Änderungsverfolgung erfolgreich abgeschlossen werden kann.

## Layout des Rechtsdokument-Editors verbessert

Stellt die drei Dokumente als kompakte, getrennte Karten dar, reduziert die übermäßige Composer-Höhe und gibt dem Composer in voller Breite eine praktischere Standard-Rastergröße.

## Host-Integrationsverträge korrigiert

Verwendet die von `auth:requireAuth` zurückgegebenen authentifizierten Claims für die Zuordnung von Dokumentveröffentlichungen, sodass beim Speichern keine leere Akteurskennung mehr übermittelt wird. Die Überschrift „Rechtliches“ rendert ihren Markdown-Tooltip nun zusammen mit dessen Inhalt, Dokumentaktionen stehen direkt neben ihren Überschriften, überflüssige Aufklapppfeile wurden entfernt und eine explizite Ausblendungsdarstellung schließt Editoren sowie Verfassen- oder Vorschaufenster zuverlässig.

## Konkrete Dokumentrouten registriert

Registriert für jedes feste Rechtsdokument eine exakte PUT- und öffentliche GET-Route, da der Router für externe Cognis-Module Pfade exakt abgleicht. Verwerfen schließt nun einen unveröffentlichten Editor und setzt dessen Aktion auf Hinzufügen zurück; Editor und Modusbereiche belegen ausdrücklich die gesamte verfügbare Breite ohne Größenänderung im Browser.

## Veröffentlichte Editoren und Zustimmungsaktualisierung wiederhergestellt

Gespeicherte Dokumente werden nach dem Neuladen der Administration geöffnet mit ihrem gespeicherten Markdown und einer Entfernen-Aktion angezeigt. Sichtbare authentifizierte Sitzungen prüfen die Zustimmung alle fünf Sekunden erneut, führen Prüfungen nacheinander aus, um doppelte Popups zu vermeiden, und beenden den Aktualisierungs-Timer beim Entladen der Seite oder beim Verschwinden des Modulendpunkts.

## Einklappbare Host-Abschnitte übernommen

Rendert Deskriptoren für Rechtsdokumente über den einklappbaren Abschnitts-Composer des Hosts mit bereinigten lokalisierten Titeln, integrierten Aktionen zum Hinzufügen/Entfernen und Verfassen/Vorschau sowie Editorinhalten. Das Modul bindet sich nun ohne Fehler bei abgetrenntem Abschnitt an den schwebenden Administrations-Slot des Hosts, liefert die lokalisierte Navigationswarnung und zerstört seine Änderungsverfolgung beim Aushängen.

## Commits

- [2375f2c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2375f2cbe45c6ab21d7d93a70d94d2cc3c6e82a7)
- [e20d857](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/e20d857715e08f3656717ad55a5918fe236820ab)
- [3fcbc91](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3fcbc91f42e61309ef7bd56491ddcf4311f605fd)
- [cc4f1ba](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/cc4f1ba0582fd8d87b96c5e678e968467f86d988)
- [5ffec53](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5ffec53354d1e93bf49b3850c64a56b3ccb1cef9)
