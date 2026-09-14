# Speichern und Layout von Rechtsdokumenten wiederhergestellt

**Feature-Branch:** work

## Gespeicherte Dokumentinhalte wiederhergestellt

Ordnet das zurückgegebene Feld `markdown` des Core-Versionsspeichers der Modulantwort zu, damit neu veröffentlichte Dokumente korrekt zurückgegeben werden und die Speichern-Aktion der Änderungsverfolgung erfolgreich abgeschlossen werden kann.

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

## Persistierten Editorzustand und Composer-Layout korrigiert

Liest gespeichertes Markdown aus dem tatsächlichen Antwortfeld des Versionsspeichers, sodass neu geladene Editoren nie `undefined` anzeigen. Der Zustand Hinzufügen/Entfernen hängt nur davon ab, ob eine gespeicherte Version vorhanden ist. Der Tooltip „Rechtliches“ ist in seiner Überschrift gruppiert, und neutrale Aktionen für Verfassen/Vorschau teilen sich unter dem nicht skalierbaren Editor in voller Breite eine Zeile zu gleichen Teilen.

## Zustimmung pro Dokument hinzugefügt

Verfolgt Bestätigungen unabhängig für jede veröffentlichte Version von Bedingungen, Datenschutzerklärung und EULA. Dauerhafte Zustimmungsaufforderungen zeigen Kontrollkästchenkarten nur für neue oder aktualisierte Dokumente mit Übermittlung der exakten Version sowie Aktionen für Abmeldung und Kontoeinstellungen. Die Editorfläche besitzt eine feste Modushöhe, ein nicht skalierbares Eingabefeld in voller Breite und darunter gepolsterte neutrale Steuerelemente.

## Obligatorische Zustimmung und Rechtsnavigation integriert

Verwendet ein einziges obligatorisches Zustimmungspopup, Kontrollkästchen im Core-Stil, integrierte Neu-/Aktualisierungsmarken, einen Ablehnungs-Tooltip und den Host-Abmelde-Flow sowie den authentifizierten Endpunkt zur Kontolöschung. Öffentliche Dokumentrouten sind wirklich öffentlich, zeigen Markdown in einem großformatigen Popup und veröffentlichte Dokumente tragen über `ui:footerLinks` rechtsbündige Footer-Links bei.

## Darstellung und Speicherung der Zustimmung stabilisiert

Lädt das Zustimmungs-Stylesheet mit der authentifizierten Navbar-Integration, damit Aktualisierungen und SPA-Navigation identisch dargestellt werden. Hält die Core-Pill kompakt, setzt den Dokumentlink in eine eigene Zeile, speichert den vollständigen veröffentlichten Versionssatz und prüft den gespeicherten Status vor dem Schließen der Zustimmung.

## Öffentliche Rechtsdokumentseiten vereinheitlicht

Entfernt das redundante Popup aus öffentlichen Rechtsrouten und stellt jedes Dokument über den Seiten-Composer des Hosts dar. Die resultierende Seite mit vollständiger Shell verwendet natürliches Dokument-Scrolling und erstellt ihre Seitennavigation aus den gerenderten Markdown-Abschnittsüberschriften.

## Zustimmungselemente und Speicherung korrigiert

Verwendet die wiederverwendbaren Choice-Checkbox- und State-Pill-Stile von Cognis, garantiert eine separate Dokumentlinkzeile und wartet vor dem Öffnen der Zustimmung auf diese Stile. Die Zustimmung verwendet jetzt den strukturierten Datenbankvertrag für INSERT mit Konfliktaktualisierung und prüft das gespeicherte Ergebnis, damit akzeptierte Versionen bei der Navigation nicht erneut angefordert werden.

## Zustimmungsberichte und vollständige Seiten-Shells

Fügt jedem Rechtsdokument eine durchsuchbare, auf zehn Zeilen paginierte Benutzer-Zustimmungstabelle mit den Filtern Alle, Akzeptiert und Ausstehend hinzu. Öffentliche Seiten folgen nun der Jitsi-Initialisierungsreihenfolge für Laden und authentifizierte Sitzungen; feste Editorflächen verhindern Größenänderungen und Layoutsprünge.

## Host-Seitennavigation und unabhängige Zustimmung übernommen

Ersetzt die modulseitige Berichtsseitennavigation durch die gemeinsame Fähigkeit `ui:pagination`. Beim Akzeptieren eines einzelnen veröffentlichten Dokuments werden für unveröffentlichte Datenschutz- oder EULA-Dokumente keine Nullwerte mehr geschrieben; dadurch bleiben Zustimmungen unabhängig und bestehende Nicht-Null-Datenbankspalten kompatibel.

## Eigentümerschaft der Footer-Links idempotent gemacht

Entfernt die Footer-Registrierung von öffentlichen Seiten, sodass die Zustimmungserzwingung alleinige Eigentümerin der Rechtslinks ist. Vor dem Hinzufügen wird außerdem die Host-Registry geprüft, wodurch doppelte IDs beim Seitenladen oder beim Wechsel von veralteten Skripten vermieden werden.

## Zuverlässige Speicherung der Zustimmung und externe Dokumentlinks

Definiert jede Zustimmungsversion über den Schemakontrakt von `db:executor` als nicht null mit einem ausdrücklichen Platzhalter für unveröffentlichte Dokumente und übergibt diesen Platzhalter bei strukturierten Einfügungen, wenn ein Rechtsdokument nicht veröffentlicht ist. Links zu Zustimmungsdokumenten umgehen nun den SPA-Router des Hosts, sodass ihr `_blank`-Ziel zuverlässig einen neuen Tab öffnet; der Popup-Titel lautet kürzer „Zustimmung erforderlich“.

## Öffentliche Seiten für Rechtsdokumente korrigiert

Die öffentlichen Routen für Nutzungsbedingungen, Datenschutz und EULA bleiben nun sowohl beim ersten Laden als auch während asynchroner Statusprüfungen von der Zustimmungserzwingung ausgenommen. Ihr Seiten-Composer liest das Markdown-Antwortfeld des Versionsspeichers und passt das Dokumentelement an seinen Inhalt an; dadurch entfallen die Ausgabe `undefined` und die übergroße leere Fläche.

## Commits

- [2375f2c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2375f2cbe45c6ab21d7d93a70d94d2cc3c6e82a7)
- [e20d857](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/e20d857715e08f3656717ad55a5918fe236820ab)
- [3fcbc91](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3fcbc91f42e61309ef7bd56491ddcf4311f605fd)
- [cc4f1ba](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/cc4f1ba0582fd8d87b96c5e678e968467f86d988)
- [5ffec53](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5ffec53354d1e93bf49b3850c64a56b3ccb1cef9)
- [427af9d](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/427af9d50be3bde15cb3f2fe53f44e5a7b743965)
- [b9c93cc](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b9c93cc2de5693f69cdf63bb0d1d9419ef5c7ceb)
- [1adbdf7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1adbdf77939aa53f70f2fef75b93bce9841bd746)
- [0c9207e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0c9207e9a3c872266558207cc5a8d61f4c63ca12)

- [f193e16](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f193e1610daf5abc76d07510115605d396edf5f2)

- [f500db9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f500db9c46919a4e9bf2911751340eb515b3213e)

- [2c96447](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2c9644756b1f693cd711695eb9cf1083fe5c36d9)

- [1c0203a](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1c0203adde325888d4c31a628453f941b9a1ddab)

- [97517b6](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/97517b67ae09218a9179879151547a582008e83c)

- [bd907c3](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/bd907c37acc039a80e9128712d3ae89ec0f92fb4)

- [c8b8fa2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c8b8fa29f2a92ebf584669be39eb3c1ee76af0da)
