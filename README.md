# openSBF

> **[English version below](#english-version)**

---

## Deutsch

**openSBF** ist eine kostenlose, offene Lernplattform zur Vorbereitung auf den **Sportbootführerschein See (SBF See)** und den **Sportbootführerschein Binnen (SBF Binnen)** – ohne Abogebühren, ohne versteckte Kosten, ohne Anmeldepflicht.

Das Projekt entstand aus der Überzeugung, dass Prüfungsvorbereitung nicht teuer sein muss. Statt für Online-Kurse zu bezahlen, bietet openSBF denselben Lernstoff frei und community-getrieben an.

### 🌐 Live-Version

[opensbf.de](opensbf.de)

### 📚 Inhalte

- Vollständiger Fragenkatalog für **SBF See** (Stand: August 2023)
- Vollständiger Fragenkatalog für **SBF Binnen** (Stand: August 2023)
- Lernmodus und Prüfungssimulation
- Kostenlos und ohne Registrierung nutzbar

Die Inhalte basieren auf den offiziellen Fragen- und Antwortkatalogen des Bundesministeriums für Digitales und Verkehr (BMDV), veröffentlicht auf [ELWIS](https://www.elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine/Sportbootfuehrerscheine-node.html).

> ⚠️ **KI-Hinweis:** Teile dieser Anwendung wurden mithilfe von KI generiert, die auf Inhalten der offiziellen ELWIS-Website basiert. Die Inhalte wurden nach bestem Wissen aufbereitet, ersetzen jedoch nicht die offizielle Prüfungsvorbereitung oder rechtliche Beratung. Für die Richtigkeit aller Inhalte wird keine Gewähr übernommen.

### ⚠️ Einschränkungen

- **Kein Backend, kein Nutzerkonto:** Der Lernfortschritt wird ausschließlich im **lokalen Speicher (localStorage) des Browsers** gespeichert. Beim Löschen des Browser-Caches oder beim Wechsel des Geräts gehen alle Daten verloren.
- **Keine Cloud-Synchronisation** zwischen Geräten.
- Für die Nutzung auf mehreren Geräten wird der Fortschritt nicht übertragen.

### 📋 Weitere Prüfungsvoraussetzungen

Der Führerschein selbst ist nur ein Teil der Anforderungen. Für den SBF See und SBF Binnen sind zusätzlich erforderlich:

- **Tauglichkeitsnachweis:** Ärztliches Attest über die gesundheitliche Eignung (Sehvermögen, Hörvermögen etc.) gemäß den Kriterien der Sportbootführerscheinverordnung (SpFV).
- **Praktische Prüfung:** Neben der Theorieprüfung ist eine praktische Prüfung auf dem Wasser abzulegen.
- **Prüfungsgebühren:** Für die offizielle Prüfung bei DMYV oder DSV fallen Gebühren an.
- **Mindestalter:** 16 Jahre (SBF Binnen), 16 Jahre (SBF See).

Alle aktuellen Anforderungen findest du auf der offiziellen ELWIS-Seite: [elwis.de](https://www.elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine/Sportbootfuehrerscheine-node.html)

### 🚀 Lokale Entwicklung

**Voraussetzungen:** [uv](https://github.com/astral-sh/uv) ist nicht erforderlich – das Projekt ist ein reines Next.js-Frontend. Node.js >= 18 wird benötigt.

```bash
cd app
npm install
npm run dev
```

Die App läuft dann unter [http://localhost:3000](http://localhost:3000).

### 🤝 Mitmachen

Dieses Projekt lebt von der Community. Fehler gefunden, Frage falsch oder veraltet? Pull Requests und Issues sind herzlich willkommen.

---

## English Version

**openSBF** is a free, open learning platform for preparing for the German **Sportbootführerschein See (SBF See)** and **Sportbootführerschein Binnen (SBF Binnen)** boating licenses – no subscription fees, no hidden costs, no registration required.

The project exists because exam preparation shouldn't cost money. Instead of paying for online courses at various boating schools, openSBF offers the same learning content for free, community-driven.

### 🌐 Live Version

[https://open-rha56srt8-kristofs-projects-03cd34cf.vercel.app](https://open-rha56srt8-kristofs-projects-03cd34cf.vercel.app?_vercel_share=g0tfmtkfnYeq0PcKYcIBw4b5CyDIwVxY)

### 📚 Content

- Full question catalog for **SBF See** (as of August 2023)
- Full question catalog for **SBF Binnen** (as of August 2023)
- Study mode and exam simulation
- Free to use, no account needed

Content is based on the official question and answer catalogs published by the German Federal Ministry for Digital and Transport (BMDV) via [ELWIS](https://www.elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine/Sportbootfuehrerscheine-node.html).

> ⚠️ **AI Disclaimer:** Parts of this application were generated with the help of AI based on content from the official ELWIS website. While content has been prepared to the best of our knowledge, it does not replace official exam preparation or legal advice. No guarantee is made for the accuracy of all content.

### ⚠️ Limitations

- **No backend, no user account:** Learning progress is stored exclusively in the **browser's localStorage**. Clearing browser data or switching devices will result in loss of all progress.
- **No cloud sync** between devices.

### 📋 Additional License Requirements

The license exam itself is only part of the requirements. For SBF See and SBF Binnen you also need:

- **Medical fitness certificate (Tauglichkeitsnachweis):** A doctor's certificate confirming fitness to operate a boat (eyesight, hearing, etc.) per the SpFV.
- **Practical exam:** In addition to the theory exam, a practical on-water test must be passed.
- **Exam fees:** Official exams administered by DMYV or DSV incur fees.
- **Minimum age:** 16 years (both SBF See and SBF Binnen).

See the official ELWIS page for full up-to-date requirements: [elwis.de](https://www.elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine/Sportbootfuehrerscheine-node.html)

### 🚀 Running Locally

**Prerequisites:** Node.js >= 18

```bash
cd app
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 🤝 Contributing

This project thrives on community contributions. Found an error or an outdated question? Pull requests and issues are very welcome.

---

*Built with Next.js · Hosted on Vercel · Content sourced from ELWIS (BMDV)*
