# Cognis-Modul für Nutzungsbedingungen

[English](README.en.md) · **Deutsch** · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Fügt der Cognis-Administration den Bereich **Rechtliches** hinzu. Administratoren veröffentlichen dort Nutzungsbedingungen, Datenschutzerklärung und Endbenutzer-Lizenzvertrag unter `/terms-of-service`, `/privacy-policy` und `/eula`.

## Unterstützung durch Cognis Core

Für Markdown oder die Administrationsregistrierung sind keine Core-Änderungen erforderlich. Wie benachbarte Module liest der Browser `globalThis[Symbol.for("cognis.uiCtx")]`, bezieht `ui:reuse` über `uiCtx.capabilities.get("ui:reuse")` und importiert damit `markdown-renderer.js`. Die moduleigenen Umschalter „Verfassen“ und „Vorschau“ verwenden die bereits vorhandene bereinigte `renderMarkdown()`-Implementierung. Toasts und Fehlerdialoge werden über die vorhandenen `uiCtx`-Capabilities bezogen. `createAdminSection({ i18n, apiFetch })` liefert den vorhandenen Administration-Sub-Composer-Vertrag.

## Sicherheit und Lebenszyklus

Nur Administratoren dürfen Dokumente verwalten. Öffentliche Leser können ausschließlich die drei festen Dokumente abrufen. Inhalte bleiben beim Deaktivieren erhalten und werden bei der Deinstallation nur mit `deleteContent` gelöscht.
