# Standard des Nutzungsbedingungen-Moduls

Dieses Dokument definiert die unterstützte Architektur des externen Cognis-Moduls für Nutzungsbedingungen.

## Öffentlicher Vertrag

Das Modul registriert die öffentlichen SPA-Routen `/terms-of-service`, `/privacy-policy` und `/eula`. Die Administration erhält über `registerAdminSection` einen lokalisierten Bereich „Rechtliches“; authentifizierte API-Routen verlangen die jeweils geringsten erforderlichen Rechte.

Veröffentlichte Rechtsinhalte sind Markdown, das Cognis über `ui:reuse` darstellt. Jede Speicherung fügt über `docs:versionStore` eine unveränderliche Version hinzu. Das Modul importiert weder Cognis-Interna noch einen konkreten Datenbanktreiber.

## Zustimmung und Lebenszyklus

Das Modul speichert die genauen Versionen von Bedingungen und Datenschutzerklärung, denen jedes Konto zugestimmt hat. Die Registrierung verlangt eine ausdrückliche Zustimmung. Der Flow für authentifizierte Sitzungen sperrt Konten ohne aktuelle Zustimmung; Zustimmung speichert beide Versionen, Ablehnung meldet das Konto ab. Öffentliche Rechtsseiten bleiben dabei erreichbar.

Bereichsgebundene Registrierungen werden beim Deaktivieren entfernt. Dokumente und Zustimmungen überdauern Deaktivierung und Neustart; die Deinstallation entfernt sie nur mit `deleteContent`. Browser-Ressourcen verwenden `cognis.uiCtx` sowie die Host-Verträge für Feedback, Navigation, API, Popup, Lokalisierung und Seiteneinstieg.

## Repository-Qualität

Manifest, Paket, Lockdatei und Routenmetadaten im Wurzelverzeichnis bleiben synchron. Servercode liegt in `api/`, Browsercode in `ui/`, Betriebsbefehle in `cli/`, lokalisierte Dokumentation in `docs/`, Veröffentlichungsmetadaten in `changelog/` und Grafiken in `assets/`. Tests verwenden lokale Capability-Fakes und decken Routen, Persistenz, Flows, Lebenszyklus, Lokalisierung und Paketierung ab.
