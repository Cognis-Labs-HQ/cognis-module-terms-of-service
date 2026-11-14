# Begrenzte Registrierung

**Feature-Zweig:** feature-onboarding-consent-scope

## Begrenzte Registrierung

Die Registrierung verwendet den Vertrag auth:onboarding in Version eins. Der Beitrag zu constructRegistrationUi deklariert ausschließlich terms-of-service:consent:status und terms-of-service:consent:record. Der Abschluss erhält executeOnboarding und wird ohne ausdrücklich ausgewähltes Zustimmungsfeld abgelehnt. Er übermittelt genau die aktuellen veröffentlichten Dokumentversionen. Fehlende Zustimmung sowie fehlerhafte oder unvollständige Versionen werden abgelehnt; geänderte oder bereits akzeptierte Versionen erzeugen einen Konflikt statt einer stillen erneuten Zustimmung.

Auth liefert das verifizierte Registrierungskonto und verwaltet Ablauf, Widerruf, Verfügbarkeit und Lebensdauer der Operationen. Das Modul übernimmt keine Konto-ID aus Eingabedaten. Sein Vorbereitungsablauf validiert lediglich; ein direkter Aufruf kann keine Zustimmung speichern. Nach der Initialisierung und unmittelbar vor dem Speichern nach asynchronen Dokumentabfragen wird die Berechtigung erneut geprüft. Reguläre Zustimmungs-, Berichts- und Veröffentlichungsrouten behalten ihre Sitzungs- und Rollenprüfung.

Installieren Sie zuerst den Cognis-Host mit auth:onboarding und dem begrenzten Registrierungsvertrag. Aktualisieren Sie anschließend dieses Modul, bevor Sie die Registrierung wieder öffnen. Host und Modul bilden eine abgestimmte Veröffentlichung: ältere Rückrufe mit authentifiziertem apiFetch funktionieren nicht mit begrenzten Zugangsdaten. Ohne auth:onboarding wird der Modulstart abgelehnt. Es gibt weder eine Rückfalllösung mit umfassenden Tokens noch einen alten Ablaufalias. Vorhandene Dokumente und akzeptierte Versionen bleiben erhalten.

Zustimmungsspeicherung und Widerruf der Zugangsdaten sind getrennte Vorgänge. Eine laufende Datenbankschreibung kann durch späteren Abbruch nicht zurückgenommen werden; eine erfolgreiche Speicherung kann einer fehlgeschlagenen Antwort oder Widerrufsprüfung vorausgehen. Prüfen Sie den aktuellen Zustand nach normaler Anmeldung; ein Übertragungsfehler beweist keine Zustimmung. Die Registrierung übermittelt eine Zustimmung nur nach ausdrücklicher Auswahl.

## Commits

- [8fbf3b5](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/8fbf3b5818dac34e8f466b250b43ddac8b9e46be)
