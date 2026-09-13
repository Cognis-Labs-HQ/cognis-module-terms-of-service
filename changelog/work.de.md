# Speichern und Layout von Rechtsdokumenten wiederhergestellt

**Feature-Branch:** work

## Gespeicherte Dokumentinhalte wiederhergestellt

Ordnet das dokumentierte Feld `content` des Core-Versionsspeichers wieder Markdown zu, damit neu veröffentlichte Dokumente korrekt zurückgegeben werden und die Speichern-Aktion der Änderungsverfolgung erfolgreich abgeschlossen werden kann.

## Layout des Rechtsdokument-Editors verbessert

Stellt die drei Dokumente als kompakte, getrennte Karten dar, reduziert die übermäßige Composer-Höhe und gibt dem Composer in voller Breite eine praktischere Standard-Rastergröße.

## Host-Integrationsverträge korrigiert

Verwendet die von `auth:requireAuth` zurückgegebenen authentifizierten Claims für die Zuordnung von Dokumentveröffentlichungen, sodass beim Speichern keine leere Akteurskennung mehr übermittelt wird. Die Überschrift „Rechtliches“ rendert ihren Markdown-Tooltip nun zusammen mit dessen Inhalt, Dokumentaktionen stehen direkt neben ihren Überschriften, überflüssige Aufklapppfeile wurden entfernt und eine explizite Ausblendungsdarstellung schließt Editoren sowie Verfassen- oder Vorschaufenster zuverlässig.

## Commits

- [2375f2c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2375f2cbe45c6ab21d7d93a70d94d2cc3c6e82a7)
- [e20d857](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/e20d857715e08f3656717ad55a5918fe236820ab)
