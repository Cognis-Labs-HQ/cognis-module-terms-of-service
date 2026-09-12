# Cognis-Modul für Nutzungsbedingungen

[English](README.en.md) · **Deutsch** · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Fügt der Cognis-Administration den Bereich **Rechtliches** hinzu. Administratoren veröffentlichen dort Nutzungsbedingungen, Datenschutzerklärung und Endbenutzer-Lizenzvertrag unter `/terms-of-service`, `/privacy-policy` und `/eula`.

## Erforderliche Unterstützung in Cognis Core

Core muss `ui:reuse` über `ctx`, den Browser-Baustein `markdown:composer` mit `bind(options)` und `render(element, markdown)` sowie die lebenszyklusgebundene Methode `ctx.registerAdminSection(options)` bereitstellen. Der Host übergibt Router-, Übersetzungs-, Toast-, Fehlerdialog-, Fokus- und Wiederverwendungsclients an `mount(root, host)`. Renderer und Vorschau müssen dieselbe bereinigte Markdown-Implementierung wie der Nachrichten-Composer verwenden.

## Sicherheit und Lebenszyklus

Nur Administratoren dürfen Dokumente verwalten. Öffentliche Leser können ausschließlich die drei festen Dokumente abrufen. Inhalte bleiben beim Deaktivieren erhalten und werden bei der Deinstallation nur mit `deleteContent` gelöscht.
