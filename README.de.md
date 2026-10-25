# Cognis-Modul für Nutzungsbedingungen

[English](README.en.md) · **Deutsch** · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Fügt der Cognis-Administration den Bereich **Rechtliches** hinzu. Administratoren veröffentlichen dort Nutzungsbedingungen, Datenschutzerklärung und Endbenutzer-Lizenzvertrag unter `/terms-of-service`, `/privacy-policy` und `/eula`.

## Erforderliche Unterstützung in Cognis Core

Die vorhandenen Browser-Verträge reichen für Markdown, Feedback, Navigation und Administration aus. Core muss zusätzlich den append-only Speicher der Dokumentations- und Changelog-Archivierung als Capability `docs:versionStore` mit `createStore({ namespace, database, documents })` und den Operationen `ensureSchema()`, `getLatest(slug)`, `publish({ slug, content, actorId })` und `deleteAll()` bereitstellen. `publish` erzeugt immer eine kryptografisch identifizierte, unveränderliche Version. Außerdem muss der Core-eigene Flow `construct-registration-ui` mit der Stage `compose-form` Integrationen auf `/register` laden, deren Feld validieren und `completeRegistration({ apiFetch })` nach Aufbau der authentifizierten Sitzung ausführen. Die Durchsetzung für bestehende Konten verwendet bereits vorhandene `authenticate-session`-, Popup-, Logout-, Router- und `uiCtx`-Verträge.

## Sicherheit und Lebenszyklus

Nur Administratoren dürfen Dokumente verwalten. Öffentliche Leser können ausschließlich die drei festen Dokumente abrufen. Inhalte bleiben beim Deaktivieren erhalten und werden bei der Deinstallation nur mit `deleteContent` gelöscht.

## Abfragelimits im Offline-Modus

Im Offline-Modus stoppen die Einwilligungsabfragen und normalen Wiederherstellungsabfragen. Nur eine kleine Server-Gesundheitsabfrage läuft alle fünfzehn Minuten, auch bei wiederholten Online-Ereignissen des Browsers. Fehlgeschlagene Online-Verbindungsprüfungen werden bis auf fünfzehn Minuten verlangsamt. Einwilligungsabfragen werden bei Fehlern bis auf fünf Minuten verlangsamt, offline vollständig gestoppt und nach Wiederverbindung fortgesetzt. Die erforderliche zwischengespeicherte Zustimmung bleibt Voraussetzung für Offline-Zugriff.
