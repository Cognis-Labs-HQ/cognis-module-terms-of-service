# Geführtes Tutorial

Dieses Modul bindet seinen Einführungsablauf über `ui:tutorials` an seine eigene Seite. Beim ersten zulässigen Besuch startet er automatisch; das Fragezeichen-SVG neben dem Seitentitel wiederholt ihn. Der Host muss den seitengebundenen Tutorialvertrag der Version eins bereitstellen.

## Anwendungsbeispiele

Der Ablauf erklärt das Rechtsdokument und seine Navigation, ohne eine Einwilligung zu erteilen oder zu ändern. Er erfordert eine authentifizierte Online-Sitzung.

## Technische Spezifikation

Der Host verwaltet Hinweise, Pfeile, Hervorhebung, Barrierefreiheit und das gemeinsame schwebende Aktionsmenü. Erstdurchläufe bieten stets Weiter, ohne Abbrechen oder Überspringen. Wiederholungen bieten Abbrechen mit `btn-cancel`. Der Abschluss wird im Browser pro Konto gespeichert. Navigation, Zugriffsverlust und Anbieterentfernung beenden die Sitzung; fehlgeschlagenes Mounten nimmt Registrierungen zurück.

Tutorial-Ziele und Weiter-Hinweise sind ausdrücklich festgelegt. Menüs folgen der gemeinsamen Host-Warteschlange und der Komponentenlebensdauer. Bei fehlenden Zielen stehen Weiter und Tutorial neu starten bereit; Wiederholungen bieten auch Abbrechen.

Anbietertests prüfen den öffentlichen Vertrag, alle vier Übersetzungen, Verfügbarkeitsregeln, Fehlerbereinigung und die Ablehnung nicht unterstützter Host-Versionen.

Die Rechtsanleitung gilt für Nutzungsbedingungen, Datenschutz und EULA und bleibt beim geöffneten Dokument.

Die Anleitung im sichtbaren Verwaltungsbereich für Rechtsdokumente erklärt versionierte Veröffentlichung und Zustimmungsberichte. Sie erfordert Administratorrechte und speichert keine Änderungen oder Zustimmungen.

Jeder Tutorial-Schritt legt `highlightNext` ausdrücklich fest: Erklärungen, die Weiter oder Fertig benötigen, aktivieren den Hinweis; interaktive und wartebasierte Übungen deaktivieren ihn. Bei reduzierter Bewegung bleibt eine statische Umrandung.

Die Dokumentanleitung hebt eine Dokumentüberschrift hervor; die Einwilligungsanleitung zeigt auf das Suchfeld eines verfügbaren Berichts für ein veröffentlichtes Dokument. Der erste nutzbare Treffer wird im Tutorial-Abschnitt gewählt; ohne passenden Treffer wird der Schritt übersprungen.
