# Subscription & Fixkosten Tracker

Eine Full-Stack-Webanwendung zur zentralen Verwaltung von Abonnements und monatlichen Fixkosten.

Mit dem **Subscription & Fixkosten Tracker** lassen sich wiederkehrende Kosten übersichtlich erfassen, verwalten und kontrollieren. Das Projekt wurde mit Angular im Frontend und Spring Boot im Backend umgesetzt.

[Live-Demo öffnen](https://subscription-tracker-lac-pi.vercel.app)

> **Hinweis zur Live-Demo:** Das Backend wird kostenlos über Render gehostet. Bei längerer Inaktivität wechselt der Server in den Standby-Modus. Deshalb kann der erste Aufruf des Backends etwa 30–50 Sekunden dauern.

---

## Features

- **Abonnementverwaltung:** Abonnements erstellen, anzeigen, bearbeiten und löschen.
- **Kostenübersicht:** Laufende monatliche und jährliche Fixkosten auf einen Blick.
- **Zentrale Verwaltung:** Wiederkehrende Ausgaben übersichtlich an einem Ort verwalten.
- **REST API:** Kommunikation zwischen Angular-Frontend und Spring-Boot-Backend über eine REST-Schnittstelle.

---

## Tech-Stack

### Frontend

- **Framework:** Angular
- **Programmiersprache:** TypeScript
- **Webtechnologien:** HTML5, CSS3
- **Hosting:** Vercel

### Backend

- **Framework:** Spring Boot 4
- **Programmiersprache:** Java 21
- **Datenbank:** H2 In-Memory Database
- **Persistenz:** Spring Data JPA / Hibernate
- **Build-Tool:** Maven
- **Containerisierung:** Docker
- **Hosting:** Render

---

## Architektur

Die Anwendung folgt einer klassischen Client-Server-Architektur:

```text
┌──────────────────────┐
│   Angular Frontend   │
│     (TypeScript)     │
└──────────┬───────────┘
           │
           │ HTTP / REST
           ▼
┌──────────────────────┐
│  Spring Boot Backend │
│       (Java 21)      │
└──────────┬───────────┘
           │
           │ Spring Data JPA
           ▼
┌──────────────────────┐
│    H2 In-Memory DB   │
└──────────────────────┘
```

Frontend und Backend sind getrennt entwickelt und kommunizieren über eine REST-Schnittstelle.

---

## Datenbank

Für die Datenhaltung wird eine H2 In-Memory Database verwendet. Die Datenbank wird beim Start der Anwendung im Arbeitsspeicher erzeugt.

**Wichtig:** Da es sich um eine In-Memory-Datenbank handelt, gehen gespeicherte Daten beim Neustart des Backends verloren.

---

## Deployment

| Komponente        | Plattform |
| ----------------- | --------- |
| Frontend          | Vercel    |
| Backend           | Render    |
| Containerisierung | Docker    |

---

## Mögliche zukünftige Erweiterungen

- Benutzerregistrierung und Login
- Auswertung der monatlichen Ausgaben
- Kategorien und Filter für Abonnements
- Erinnerungen vor anstehenden Verlängerungen
- Persistente Datenbank für dauerhafte Speicherung

---

## Projekt

Dieses Projekt wurde entwickelt, um praktische Erfahrungen in der Full-Stack-Webentwicklung mit Angular, Java und Spring Boot zu sammeln.
