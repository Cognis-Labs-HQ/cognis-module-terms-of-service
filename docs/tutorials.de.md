# Geführtes Tutorial

Dieses Modul bindet seinen Einführungsablauf über `ui:tutorials` an seine eigene Seite. Beim ersten zulässigen Besuch startet er automatisch; das Fragezeichen-SVG neben dem Seitentitel wiederholt ihn. Der Host muss den seitengebundenen Tutorialvertrag der Version eins bereitstellen.

## Anwendungsbeispiele

Der Ablauf erklärt das Rechtsdokument und seine Navigation, ohne eine Einwilligung zu erteilen oder zu ändern. Er erfordert eine authentifizierte Online-Sitzung.

## Technische Spezifikation

Anbietertests prüfen den öffentlichen Vertrag, alle vier Übersetzungen, Verfügbarkeitsregeln, Fehlerbereinigung und die Ablehnung nicht unterstützter Host-Versionen.

Die Rechtsanleitung gilt für Nutzungsbedingungen, Datenschutz und EULA und bleibt beim geöffneten Dokument.

Der gemeinsame Host stellt schwebende Aktionen über seine Warteschlange bereit. Erstbesuche bieten Weiter/Fertig ohne Abbrechen oder Überspringen; Wiederholungen bieten Überspringen vor dem letzten sichtbaren Schritt. Neustart erscheint nach dem ersten sichtbaren Schritt. Abschlüsse bleiben nach Inhaltsänderungen gültig. Ausdrückliche highlightNext-Angaben aktivieren nur die Atemanimation für Erklärungen; reduzierte Bewegung deaktiviert sie. Jeder Schritt hebt ein anderes reales Bedienelement in UI-Reihenfolge hervor. Anleitungen bleiben an die aktuelle Ansicht gebunden, behandeln leere und optionale Zustände und räumen bei Navigation oder Besitzerentfernung auf.

Beginnen Sie mit einem Rechtsdokument. Klicken Sie bei einem neuen Dokument auf Hinzufügen; verwenden Sie bei einem veröffentlichten den vorhandenen Editor. Schreiben oder überarbeiten Sie Markdown und prüfen Sie die Leseransicht über Vorschau. Keine Tutorialaktion veröffentlicht den Entwurf. Speichern und Verwerfen stehen nach der Anleitung im wartenden Änderungsmenü bereit. Der Zustimmungszweig wählt unabhängig vom Entwurf ein veröffentlichtes Dokument, öffnet dessen Übersicht und erklärt Kontosuche, Akzeptiert/Ausstehend/Alle sowie akzeptierte und neueste Version. Leere Treffer und unveröffentlichte Installationen erzeugen keine Zustimmungsdatensätze.
