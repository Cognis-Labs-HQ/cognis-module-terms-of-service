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

## Klarere Zustände für Editor und Zustimmungsbericht

Abschnitte unveröffentlichter Rechtsdokumente zeigen keine leere Zustimmungstabelle mehr. Berichte veröffentlichter Dokumente verwenden das gemeinsame Status-Pill-Stylesheet und kennzeichnen ausstehende Konten mit einer roten Pill; Verfassen und Vorschau zeigen nun zusätzlich zu ihrem barrierefreien gedrückten Zustand sichtbar den ausgewählten Modus.

## Live aktualisierte, versionsbezogene Zustimmungsberichte

Richtet jedes Zustimmungskontrollkästchen am Dokumenttitel aus. Zustimmungsberichte enthalten nun die Kennung der neuesten veröffentlichten Version, berechnen jede Benutzer-Pill anhand dieser aktuellen Version und werden unmittelbar nach der Aktualisierung eines bestehenden Dokuments oder der ersten Veröffentlichung eines Dokuments neu dargestellt.

## Akzeptierte und neueste Version verglichen

Fügt jedem Zustimmungsbericht getrennte Spalten für die akzeptierte und die neueste Version hinzu. Jede Zeile zeigt die vom Konto akzeptierte Version neben der aktuell veröffentlichten Version; ohne akzeptierte Version erscheint ein lokalisierter Wert „Nicht akzeptiert“.

## Core-Seitennavigation und aktive Rechtslinks im Footer

Ersetzt die einfache Überschriftenliste der Rechtsdokumente durch Cognis’ exportierten Controller für gruppierte, einklappbare Seitenmenüs, einschließlich Zustand des ausgewählten Abschnitts und sanftem Scrollen. Öffentliche Rechtsseiten tragen während ihrer Einbindung alle drei Rechtsrouten zum Footer bei, sodass der Core-Footer sie anzeigen und seinen routenabhängigen Aktivzustand anwenden kann.

## Stabile Footer-Links für veröffentlichte Dokumente und Seitentitel

Macht die Zustimmungserzwingung wieder zur alleinigen Eigentümerin der Footer-Links und lädt den Veröffentlichungsstatus auch auf ausgenommenen Rechtsrouten. Dadurch erscheinen nur veröffentlichte Links und bleiben über SPA-Seitenwechsel hinweg registriert, während der Core ihren Aktivzustand steuert. Jede öffentliche Rechtsseite setzt ihren lokalisierten Browser-Titel nach dem Aufbau der authentifizierten Shell sowohl beim vollständigen Neuladen als auch bei der SPA-Navigation.

## Fehlermeldung bei unvollständiger Zustimmung

Wird das obligatorische Zustimmungs-Popup abgesendet, ohne jedes erforderliche Dokument auszuwählen, bleibt es nun geöffnet und zeigt über die Toast-Capability des Hosts einen lokalisierten Fehler mit einem klaren Hinweis zum Fortfahren.

## An das Scrollen des Core-Side-Menüs angepasst

Verwendet den neuesten Cognis-Side-Menu-Vertrag, indem jede dargestellte Rechtsüberschrift als `targetId` eines Eintrags übergeben und sanftes Scrollen am Controller konfiguriert wird. Der Core übernimmt nun Zielsuche und am Anfang ausgerichtetes Scrollen; das Modul synchronisiert nur noch den ausgewählten Abschnitt.

## Eindeutiges Abbrechen der Kontolöschung

Ändert die neutrale Aktion in der Bestätigung zur Kontolöschung von „Weiter bearbeiten“ in das eindeutige „Abbrechen“, ohne die separate Bestätigung zum Entfernen des Editors zu verändern.

## Stabile Navigation auf Rechtsseiten

Links zu Abschnitten von Rechtsdokumenten lassen die ausgewählte Überschrift nun unterhalb der festen Kopfzeile sichtbar. Veröffentlichte Links im Footer werden bei jedem SPA-Routenwechsel abgeglichen und nach einer erneuten Einbindung der Host-Registrierung wiederhergestellt, sodass sie beim Öffnen und Wechseln von Rechtsseiten sichtbar bleiben.

## Abgesichertes Absenden der Zustimmung

Das Zustimmungs-Popup aktiviert Absenden erst, nachdem alle erforderlichen Dokumente ausgewählt wurden. Die API validiert die übermittelte Versionszuordnung, antwortet bei fehlerhafter oder unvollständiger Zustimmung zu veröffentlichten Dokumenten mit HTTP 400 und das Popup zeigt bei einer solchen Ablehnung einen lokalisierten Fehler-Toast.

## Platzhalter für unveröffentlichte Dokumente nie anzeigen

Zustimmungsberichte wandeln den internen Datenbankplatzhalter für unveröffentlichte Dokumente nun in eine nicht erfasste Version um, sodass die Oberfläche den lokalisierten Wert für Nie zugestimmt oder eine tatsächliche veröffentlichte Dokumentversions-ID anzeigt.

## Zustimmungs- und Editoraktionen wiederhergestellt

Die Validierung der Zustimmungsdaten verwendet nun den schlüsselbasierten Vertrag der Rechtsdokumentdefinitionen und verhindert damit den Laufzeitfehler, der HTTP 500 zurückgab. Bestätigte Entfernen-Aktionen schließen nun einen vorhandenen Editor, stellen seine Hinzufügen-Aktion wieder her und bewahren das unveränderliche veröffentlichte Dokument für spätere Bearbeitung auf.

## Footer-Links nach dem Einbinden einer Rechtsseite neu zeichnen

Rechtsseiten fordern nun eine erzwungene Benachrichtigung der Footer-Link-Registry an, nachdem ihr Cognis-Seiten-Composer vollständig eingebunden wurde. Dadurch wird die zeitliche Lücke beim Shell-Wechsel geschlossen, durch die bereits registrierte Links nach der Navigation von einem frisch geladenen Dashboard fehlen konnten.

## Live-Aktualisierung der Zustimmungsberichte

Eine erfolgreiche Zustimmung löst nun sofort ein Browser-Ereignis aus, das alle eingebundenen Administrationsberichte über die API aktualisiert. Sichtbare Berichte fragen außerdem alle fünf Sekunden Zustimmungen aus anderen Sitzungen ab; beim Entfernen des Administrationsbereichs werden sämtliche Listener und Timer bereinigt. Commit-Listen enthalten keine Leerzeilen mehr zwischen den Einträgen.

## Überprüfung des Zustimmungslebenszyklus abgeschlossen

Behandelt den Platzhalter für unveröffentlichte Dokumente als fehlende vorherige Zustimmung, verhindert einen Neustart des Aktualisierungs-Timers nach dem Abbau und registriert bei der Erstveröffentlichung erstellte Berichte für Live-Aktualisierungen. Das überholte TODO zu Registrierungskarten wurde entfernt, nachdem bestätigt wurde, dass der aktuelle Registrierungsablauf bereits den vollständigen veröffentlichten Versionssatz speichert. Sämtliche Inhalte und Commits des Arbeits-Changelogs befinden sich nun ausschließlich in diesem Feature-Changelog.

## Commits

- [00eaced](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/00eaced82b2b476b53ddedb031a5d12214d69e61)
- [877d0ab](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/877d0abd97b345c5a95dbbff3c5ed12f90ee03f7)
- [2d2b595](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2d2b59547b04d5f9a1f34483f3ef264749b31c81)
- [4432dc8](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/4432dc8ee1a2d7887b99b0eeee70c8c030d40926)
- [a3ea3cd](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/a3ea3cd458906443f8316daa0304e48a0da5eb27)
- [1f11f9b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1f11f9b4e568e0f53dfeaa5900b333cc354a2e62)
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
- [0f3c337](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0f3c3375d1376ec0deb5309f401be3070b1fe556)
- [aca7aed](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/aca7aedb050d29fcafc1e1204d6cd0ec4649dda0)
- [51b169b](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/51b169b61a9aba1c49b50d66a8444c16964b5348)
- [232a8c0](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/232a8c08a256f5f5cef3dca2200b3436cde4a6ea)
- [21e6522](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/21e652276d8b297ad9ddb617a78acad9f8157bc8)
- [4fd26a8](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/4fd26a801ce84802d77fd20e7ebdcffe13666e3d)
- [b65f77e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b65f77e1261e7785a2d04b60ae43d4a87c886529)
- [a3621a1](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/a3621a16e00739912d95772fbd73937a449fcd4e)
- [86a9d66](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/86a9d66bed8866d0f92caae634762c6534a89e3d)
- [3012d12](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3012d12222273a77467f224af6b1a3be9fe809aa)
- [ab70147](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/ab70147c3a8f72f4d7f35b0ecefaaea2ea9f930e)
- [b4701c9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b4701c9f9f3d31a9eaabb2db3563c49c7f163d9e)
- [a008192](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/a0081922d9a38bedb422ecb53fb32c2b28202ee0)
- [611f637](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/611f637d7272196cbdb2c20276588412de5fe558)
- [c26254a](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c26254a2483d2e4fd05d8ffd2a5545a44c49b90c)
