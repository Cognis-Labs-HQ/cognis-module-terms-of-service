# Modul an die Entwicklungsvorlage anpassen

**Feature-Branch:** feature-align-module-template

## Zustimmungsberichte an der Ablaufgrenze autorisieren

Zustimmungsberichte erfordern eine geprüfte Administratoranfrage, auch bei direkten ctx-Aufrufen. HTTP-Handler übergeben den Anfragekontext an dieselbe Autorisierungsphase, bevor Zustimmungsdaten gelesen werden.

## Übersetzungsfehler der Zustimmungsprüfung weitergeben

Das Einbinden wartet auf die erste Prüfung und scheitert bei fehlenden englischen Ersatzschlüsseln. Fehlgeschlagene Anbieter entfernen eigene Footer-Links und Listener; periodische Übersetzungsfehler werden weitergegeben und stoppen weitere Abfragen.

## Rechtliche Änderungen im Ablauf protokollieren

Veröffentlichungen und gespeicherte Zustimmungen erzeugen genau einen erfolgreichen Info-Audit-Eintrag im ausführenden Ablauf mit geprüftem Bearbeiter und betroffenem Dokument oder Konto. HTTP-Routen duplizieren diese Einträge nicht mehr.

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

## Marktplatznamen und breite Rechtstexteditoren wiederherstellen

Veröffentlichte Übersetzungskennungen für den Marktplatz bleiben über Veröffentlichungskanäle hinweg erhalten. Das moduleigene Stylesheet für Rechtstexte wird über die UI-Wiederverwendungsfunktion des Hosts geladen, damit die Texteditoren in der Administration die verfügbare Breite ausfüllen.

## Rechtstextänderungen autorisieren

Veröffentlichungs- und Zustimmungsabläufe authentifizieren die Anfrage in ihrer Autorisierungsphase. Die Veröffentlichung erfordert Administratorrechte; Bearbeiter und Zustimmungskonto stammen ausschließlich aus geprüften Angaben. Tests prüfen direkte Ablaufaufrufe und gefälschte Identitäten. Die Dokumentation des Authentifizierungsfooters beschreibt jetzt den Deskriptoranbieter-Vertrag.

## Laden des Rechtsbereichs reparieren

Moduleigenes CSS wird über die öffentliche Hilfsfunktion page-styles geladen. Der gemeinsame Stylesheet-Katalog akzeptiert nur relative Namen seiner Wiederverwendungsdateien; eine Modul-URL verhinderte den UI-Import und blendete den Rechtsbereich aus. Tests prüfen diese Grenze und die Erkennung des Administrationsbereichs.

## Modul-IDs in Übersetzungen erhalten

Übersetzungsschlüssel verwenden `module.<manifest.id>.<feature>.<label>`. Eine mehrteilige Modul-ID bleibt mit ihren Bindestrichen erhalten; für `terms-of-service` lautet ein Schlüssel `module.terms-of-service.admin.title`. Der Suffix nach der Modul-ID verwendet kleingeschriebene, durch Punkte getrennte Wörter. Manifest-Metadaten, XML-Dateien und Codeverweise müssen denselben Namensraum verwenden.

## Rechtstextlinks im Footer erhalten

Alle Browserclients verwenden die Footer-Registrierung von `ctx`, auch getrennt geladene statische Skripte und Bundles. Footer-Deskriptoren können `target: "_blank"` anfordern; die Darstellung ergänzt `noopener noreferrer`. Authentifizierungsanbieter liefern übersetzte Beschriftungen und Authentifizierungskontexte, während Rechtstextlinks angemeldeter Sitzungen ausdrücklich zum Anwendungskontext gehören. Verlauf und Browser-Cache-Wiederherstellung aktualisieren veröffentlichte Rechtstextlinks, ohne die Core-Links für Lizenz oder Änderungen zu ersetzen.

## Einwilligung unabhängig von der Fußzeile durchsetzen

Fehlende Übersetzungen verwenden die englischen Modultexte, ohne die Spracheinstellungen des Benutzers zu ändern. Fehlende Übersetzungen und fehlgeschlagene Fußzeilenbeiträge werden mit sicheren Diagnosefeldern protokolliert. Fehler der Fußzeile unterbrechen weder die verpflichtende Einwilligung noch deren Übermittlung oder Ablehnung mit Abmeldung.

## Sprachschlüssel ohne wörtliche Ersatztexte verlangen

Die KI-Anweisungen verbieten fest kodierte englische Benutzertexte in allen Abläufen. Fehlende Werte der bevorzugten Sprache dürfen dieselben Schlüssel der englischen XML-Ressourcen verwenden. Fehlende oder leere englische Ersatzwerte müssen ausdrücklich einen Fehler auslösen, statt englische Literale, rohe Schlüssel oder leeren Text anzuzeigen. Fehler wegen fehlender Übersetzungen dürfen nicht unterdrückt werden.

## Den gemeinsamen Core-Resolver verwenden

Öffentliche Rechtsseiten, Fußzeilenbeiträge und Einwilligungsprüfung verwenden `createI18n` des Hosts mit den Ressourcen-URLs des Moduls. Core übernimmt den Ersatz durch englische XML-Werte und ausdrückliche Fehler bei fehlenden Schlüsseln. Übersetzungsfehler werden bei der Einwilligungsprüfung weitergegeben und nicht durch die Fehlerisolierung der Fußzeilendarstellung unterdrückt.

## Commits

- [41d44fb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/41d44fb683efbe9206ebe78a32f4b9f78cef2bb9)
- [bf9b760](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/bf9b760ddc729dd30f1309013c186bdd11321308)
- [1fe6b25](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1fe6b25a95416e45b08cbf32600d2d3886b70452)
- [d2639c0](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d2639c08ce40c538932e1bdd938ba03e6a81ddfc)
- [7655c5f](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/7655c5f9319158ba37f93d2918704cd23a378526)
- [74202d2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/74202d2bc56373bbce9fbd0c3cc3d271eb74e32f)
- [146fc39](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/146fc39fdefd6b3715d1b0a34a65fa102e05157f)
- [48dde68](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/48dde68726c5009893be9c1ea54e9799653fd655)
- [f4f4598](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f4f45988a7cc220ff43b22f16fae7adfd860148f)
- [1f1e4fe](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1f1e4feca4db7886c52dd4f71b5ef923a99a4ec3)
- [0d94f22](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0d94f22c51bbe460e3339c5f43966d7f348fcc90)
- [004a9ec](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/004a9ec8e4dfa237d669e140245dc65cd4bf88b3)
- [52478e56](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/52478e56b28c8c70339d24fb134f3d471a4bebaa)
