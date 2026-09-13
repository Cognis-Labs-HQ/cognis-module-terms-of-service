# Korrekte Einbindung der PNG-Shopgrafiken

**Feature-Branch:** work

## Neues Symbol und Banner korrekt veröffentlicht

Verwendet `assets/icon.png` und `assets/banner.png` als Shop-Symbol und -Banner des Moduls und entfernt gleichzeitig den veralteten Verweis auf einen gelöschten Screenshot.

## Asset-Metadaten abgesichert

Prüft, dass jedes im Manifest angegebene Asset eine reguläre, repository-relative Datei ist, damit fehlende oder unsichere Grafikpfade bei den Paketprüfungen fehlschlagen.

## Commits

- [df8b775](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/df8b77597cfefdd3dcfa94e0366f6808b8b0ec6b)
