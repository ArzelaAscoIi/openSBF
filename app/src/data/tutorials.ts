export interface TutorialSection {
  id: string;
  title: string;
  content: string;
  exam: 'binnen' | 'see' | 'both';
}

export const tutorials: TutorialSection[] = [
  {
    id: 'lichter-grundlagen',
    title: 'Lichterführung – Grundlagen',
    exam: 'both',
    content: `## Grundprinzip der Lichterführung

Lichter müssen von **Sonnenuntergang bis Sonnenaufgang** und bei **verminderter Sicht** geführt werden.

Die Lichterführung zeigt anderen Fahrzeugen:
- Die **Fahrtrichtung** (welche Seite des Fahrzeugs man sieht)
- Die **Lage** des Fahrzeugs (Fahrt, Anker, manövrierunfähig)

---

## Die wichtigsten Lichter

### Topplicht (weiß)
- Sichtwinkel: **225°** (von vorne bis achterlicher als querab)
- Sichtbar von vorne und von den Seiten

### Seitenlichter
- **Backbord (links): Rot** – Sichtwinkel 112,5°
- **Steuerbord (rechts): Grün** – Sichtwinkel 112,5°
- Merkhilfe: **ROT = LINKS** (beide beginnen mit einem Konsonanten), **GRÜN = RECHTS**

### Hecklicht (weiß)
- Sichtwinkel: **135°** (nach hinten)

### Rundumlicht (360°)
- Wird von Ankerliegern, manövrierunfähigen Fahrzeugen u.a. geführt

---

## Maschinenfahrzeug in Fahrt

| Fahrzeuglänge | Lichter |
|---|---|
| Unter 50 m | **1 Topplicht** + Seitenlichter + Hecklicht |
| 50 m und mehr | **2 Topplichter** (achterliches höher) + Seitenlichter + Hecklicht |

---

## Segelfahrzeug in Fahrt

- Seitenlichter (rot/grün) + Hecklicht
- Alternative (unter 20 m): **Dreifarbenlaterne** an der Mastspitze
- **Wichtig:** Fährt das Segelfahrzeug zusätzlich mit Motor → gilt als **Maschinenfahrzeug** und führt zusätzlich **schwarzen Kegel (Spitze unten)** am Tage!

---

## Ankerlieger

- Unter 50 m: **1 weißes Rundumlicht** gut sichtbar
- 50 m und mehr: **2 weiße Rundumlichter** (vorn höher als achtern)`,
  },
  {
    id: 'lichter-see',
    title: 'Lichterführung nach KVR – See',
    exam: 'see',
    content: `## Manövrierunfähige Fahrzeuge

Ein Fahrzeug ist manövrierunfähig, wenn es wegen **außergewöhnlicher Umstände** (z. B. Ausfall von Ruder oder Maschine) nicht manövrieren kann.

**Lichter (ab 12 m Länge):**
- Ohne Fahrt durchs Wasser: **2 rote Rundumlichter** senkrecht übereinander
- Mit Fahrt durchs Wasser: **2 rote Rundumlichter** + Seitenlichter + Hecklicht
- Tag: **2 schwarze Bälle** senkrecht übereinander

---

## Manövrierbehindertes Fahrzeug

Ein Fahrzeug ist manövrierbehindert, wenn es wegen der **Art seines Einsatzes** behindert ist (z. B. beim Legen von Kabeln oder Baggerarbeiten).

**Lichter:**
- **Rot-Weiß-Rot** (drei Rundumlichter senkrecht übereinander)
- Mit Fahrt: zusätzlich Seitenlichter + Hecklicht
- Tag: **Rhombus-Ball-Rhombus** senkrecht übereinander

---

## Tiefgangbehindertes Fahrzeug (ab 50 m)

- **3 rote Rundumlichter** senkrecht übereinander (oder schwarzer Zylinder am Tag)
- Darf von Verkehrsvorschriften nicht behindern lassen

---

## Fischende Fahrzeuge

| Fahrzeugtyp | Lichter |
|---|---|
| Trawler (Schleppnetzfischer) | Grün-Weiß-Rundumlicht + ggf. Seitenlichter + Topplicht |
| Nicht-Trawler (z. B. Treibnetzfischer) | Rot-Weiß-Rundumlicht |
| Tag | Zwei schwarze Kegel, Spitzen zusammen |

---

## Schleppverbände

- Schleppverband > 200 m Länge: Jedes Fahrzeug führt **schwarzen Rhombus**
- Schleppendes Fahrzeug: 3 Topplichter (senkrecht)
- Geschlepptes Fahrzeug: Seitenlichter + Hecklicht

---

## Lotsenfahrzeug im Einsatz

- **Weiß-Rot-Rundumlicht** senkrecht übereinander (weiß oben)
- Zusätzlich Mastlicht und Seitenlichter wenn in Fahrt`,
  },
  {
    id: 'seezeichen',
    title: 'Seezeichen & IALA-Betonnung',
    exam: 'see',
    content: `## IALA-Betonnung System A (Europa)

Das IALA-System A gilt in **Europa, Afrika, Asien und Australien**.

---

## Fahrwasserseitenbezeichnung

### Steuerbordseite (rechts einlaufend von See)
- **Grüne Tonnen** mit spitzem Toppzeichen (Spitztonne)
- Lichter: grünes Blinklicht
- Diese Seite hat man an Steuerbord, wenn man **von See kommt**

### Backbordseite (links einlaufend von See)
- **Rote Tonnen** mit stumpfem Toppzeichen (Stumpftonne)
- Lichter: rotes Blinklicht
- Diese Seite hat man an Backbord, wenn man **von See kommt**

> **Merkhilfe:** ROT = BACKBORD = LINKS (wenn man von See kommt)

---

## Kardinaltonnen (nach den Himmelsrichtungen)

Kardinaltonnen zeigen an, auf welcher Seite das Hindernis liegt. Man passiert auf der Seite, nach der die Tonne zeigt.

| Tonne | Farbe | Toppzeichen | Licht |
|---|---|---|---|
| **Nord** | Schwarz über Gelb | ↑↑ (beide Spitzen oben) | Schnelles Blitzen |
| **Ost** | Schwarz, gelb, schwarz | ↑↓ (außen oben, innen unten) | 3 Blitze |
| **Süd** | Gelb über Schwarz | ↓↓ (beide Spitzen unten) | 6 Blitze + langer Blitz |
| **West** | Gelb, schwarz, gelb | ↓↑ (außen unten, innen oben) | 9 Blitze |

---

## Einzelgefahrentonnen

- **Schwarz-rote Streifen** mit zwei schwarzen Bällen oben
- Zeigen ein umgrenztes Hindernis an – man kann auf beiden Seiten vorbeifahren
- Licht: 2 weiße Blitze

---

## Freiwassertonnen

- **Rot-weiß senkrecht gestreift**
- Zeigen freies Wasser in der Nähe an
- Licht: weißes isophasendes oder Morse A Licht`,
  },
  {
    id: 'betonnung-binnen',
    title: 'Betonnung auf Binnenwasserstraßen',
    exam: 'binnen',
    content: `## Betonnung auf Binnenschifffahrtsstraßen

### Fahrrinnenbezeichnung

Die Fahrrinne ist der Teil der Wasserstraße, in dem bestimmte Breiten und Tiefen für den durchgehenden Verkehr **vorgehalten** werden.

Das **Fahrwasser** ist der Teil, der den örtlichen Umständen nach vom durchgehenden Schiffsverkehr **benutzt** wird.

---

## Bezeichnung der Fahrrinne

### Linkes Ufer (vom Bergfahrer aus)
- **Grüne Spitztonnen** oder grüne Schwimmstangen
- Bergfahrer hat diese Seite an **Steuerbord** (rechts)

### Rechtes Ufer (vom Bergfahrer aus)
- **Rote Stumpftonnen** oder rote Schwimmstangen
- Bergfahrer hat diese Seite an **Backbord** (links)

> **Bergfahrt** = Fahrt in Richtung Quelle (flussaufwärts)

---

## Hindernisbezeichnung

### Hindernisse auf der rechten Seite
- Rot-weiß gestreifte Schwimmstange mit **rotem Zylinder** oben
- Oder Stange mit rotem Kegel, Spitze nach unten

### Hindernisse auf der linken Seite
- Grün-weiß gestreifte Schwimmstange mit **grünem Kegel**, Spitze nach oben

### Fahrrinnenspaltung
- **Rot-grün gestreifte** Tonne oder Schwimmstange
- Vorbeifahrt an **beiden Seiten** möglich

---

## Badezonenkennzeichnung

- Geschützte Badezonen werden durch **gelbe Tonnen** gekennzeichnet`,
  },
  {
    id: 'ausweichregeln-kvr',
    title: 'Ausweichregeln nach KVR – See',
    exam: 'see',
    content: `## Rangfolge der Ausweichpflicht

Die KVR legen eine klare **Rangfolge** fest, wer wem ausweichen muss:

1. **Maschinenfahrzeug** weicht aus für alle anderen (außer Tiefgangsbehinderter)
2. **Segelfahrzeug** weicht aus für fischende Fahrzeuge, manövrierbehindertes und manövrierunfähiges Fahrzeug
3. **Fischendes Fahrzeug** weicht für manövrierbehindertes und manövrierunfähiges Fahrzeug aus
4. **Manövrierbehindertes Fahrzeug** weicht für manövrierunfähiges Fahrzeug aus

---

## Entgegenkommen (Gegenverkehr)

Zwei Maschinenfahrzeuge, die sich auf **entgegengesetzten Kursen** nähern:
- Beide ändern ihren Kurs nach **Steuerbord** (rechts)
- Sie passieren sich Backbord an Backbord

---

## Kreuzende Kurse

Zwei Maschinenfahrzeuge auf **kreuzenden Kursen**:
- Das Fahrzeug, das das andere an seiner **Steuerbordseite** sieht, ist **ausweichpflichtig**
- Merkhilfe: Das Fahrzeug, das "Grün" (Steuerbordlicht des anderen) sieht, muss ausweichen

---

## Überholen

- Das **überholende Fahrzeug** muss dem überholten ausweichen
- Auch wenn das Überholen durch Wenden abgeschlossen ist, bleibt die Ausweichpflicht bestehen

---

## Segelfahrzeuge untereinander

Zwei Segelfahrzeuge auf Kollisionskurs:
1. Verschiedene Seiten: **Backbord muss Steuerbord ausweichen** (Wind von Backbord → ausweichpflichtig)
2. Gleiche Seite: **Luvwärtig muss leewärtig ausweichen**

---

## Kurshalter & Ausweichpflichtiger

- Der **Kurshalter** muss Kurs und Geschwindigkeit beibehalten
- Der **Ausweichpflichtige** muss frühzeitig, durchgreifend und klar erkennbar ausweichen
- **Manöver des letzten Augenblicks:** Wenn Zusammenstoß droht, darf auch der Kurshalter manövrieren`,
  },
  {
    id: 'ausweichregeln-binnen',
    title: 'Ausweichregeln auf Binnenschifffahrtsstraßen',
    exam: 'binnen',
    content: `## Kleinfahrzeuge auf Binnenwasserstraßen

**Kleinfahrzeuge** sind Fahrzeuge mit einer Länge von **weniger als 20 m** (ohne Ruder und Bugspriet).

### Grundsatz: Kleinfahrzeug ist immer ausweichpflichtig gegenüber größeren Fahrzeugen!

---

## Ausweichregeln für Motorboote

**Entgegenkommen (Begegnung):**
- Beide Fahrzeuge halten sich so weit **rechts** (Steuerbord) wie möglich
- Bei normaler Begegnung: beide gehen nach Steuerbord

**Kreuzende Kurse:**
- Das Fahrzeug, das das andere an der **Steuerbordseite** hat, ist ausweichpflichtig

---

## Ausweichregeln für Segelfahrzeuge (Binnen)

1. Verschiedene Windseiten: **Backbord weicht Steuerbord** aus
2. Gleiche Windseite: **Luvseitiges weicht leeseitigem** aus
3. Wenn unklar: **Backbord weicht immer aus**

---

## Segelfahrzeug mit Motor

Fährt ein Segelboot gleichzeitig mit Motor → gilt als **Maschinenfahrzeug** und muss entsprechend ausweichen! Erkennbar am schwarzen Kegel (Spitze unten) am Tag.

---

## Ausweichmanöver – Wie?

Ausweichmanöver müssen:
- **Rechtzeitig** durchgeführt werden
- **Klar erkennbar** sein (keine kleinen Kursänderungen)
- **Entschlossen** durchgeführt werden

---

## Wann besteht Kollisionsgefahr?

Wenn sich zwei Fahrzeuge einander nähern und sich die **Peilung nicht oder nicht merklich ändert** → Kollisionsgefahr!`,
  },
  {
    id: 'schallzeichen-binnen',
    title: 'Schallzeichen auf Binnenschifffahrtsstraßen',
    exam: 'binnen',
    content: `## Schallzeichen – Bedeutungen

### Einzelne Töne

| Signal | Bedeutung |
|---|---|
| **1 langer Ton** | Achtung! |
| **4 kurze Töne** | Fahrzeug ist manövrierunfähig |
| **5 kurze Töne** | Überholen nicht möglich |

---

## Manöversignale

| Signal | Bedeutung |
|---|---|
| **1 kurzer Ton** | Kursänderung nach Steuerbord |
| **2 kurze Töne** | Kursänderung nach Backbord |
| **3 kurze Töne** | Maschine geht rückwärts |
| **1 langer + 1 kurzer Ton** | Wenden über Steuerbord |
| **1 langer + 2 kurze Töne** | Wenden über Backbord |

---

## Überholsignale

| Signal | Bedeutung |
|---|---|
| **2 lange + 1 kurzer Ton** | Überholen an Steuerbordseite |
| **2 lange + 2 kurze Töne** | Überholen an Backbordseite |

---

## Einfahrt in Häfen und Nebenwasserstraßen

| Signal | Bedeutung |
|---|---|
| **1 langer + 1 kurzer Ton** | Einfahrt mit Kursänderung nach Steuerbord |
| **1 langer + 2 kurze Töne** | Einfahrt mit Kursänderung nach Backbord |

---

## Gefahrensignale

| Signal | Bedeutung |
|---|---|
| **Folge sehr kurzer Töne** (≥6 Töne à ¼ Sek.) | Gefahr eines Zusammenstoßes |
| **5+ kurze Töne** | Gefahr/Notfall – sofort klarwerden! |

> **Kurzer Ton:** etwa **1 Sekunde**
> **Langer Ton:** etwa **4–6 Sekunden**`,
  },
  {
    id: 'schallzeichen-see',
    title: 'Schallzeichen nach KVR – See',
    exam: 'see',
    content: `## Manöversignale bei Sicht (KVR)

| Signal | Bedeutung |
|---|---|
| **1 kurzer Ton** | Ich ändere meinen Kurs nach Steuerbord |
| **2 kurze Töne** | Ich ändere meinen Kurs nach Backbord |
| **3 kurze Töne** | Ich arbeite mit Maschine rückwärts |
| **5+ kurze Töne** | Gefahr! Ich verstehe nicht / Warnsignal |

---

## Nebelsignale (bei verminderter Sicht)

| Fahrzeug | Signal | Intervall |
|---|---|---|
| Maschinenfahrzeug mit Fahrt durchs Wasser | **1 langer Ton** | alle 2 Minuten |
| Maschinenfahrzeug, Maschine gestoppt | **2 lange Töne** | alle 2 Minuten |
| Segelfahrzeug, manövrierunfähig, -behindert, fischend, schlepp. | **lang-kurz-kurz** | alle 2 Minuten |
| Geschlepptes Fahrzeug | **lang-kurz-kurz-kurz** | alle 2 Min (nach schleppendem) |
| Ankerlieger < 100 m | **Glocke ~5 Sek.** | jede Minute |
| Ankerlieger ≥ 100 m | **Glocke + Gong ~5 Sek.** | jede Minute |
| Grundsitzer | **3 Glockenanschlüge + Glocke + 3 Glockenanschläge** | jede Minute |

---

## Beim Einlaufen

Beim Einlaufen in Fahrwasser oder Häfen, wenn die Verkehrslage es erfordert:
→ **1 langer Ton**

---

## Allgemeines Gefahr- und Warnsignal (SeeSchStrO)

**2 Gruppen von je 1 langen + 4 kurzen Tönen**

Bedeutung: Ein Fahrzeug gefährdet ein anderes oder wird durch dieses gefährdet.`,
  },
  {
    id: 'navigation-grundlagen',
    title: 'Navigation – Grundlagen (SBF See)',
    exam: 'see',
    content: `## Kompass und Kurse

### Kompassarten
- **Magnetkompass:** Zeigt auf magnetischen Nordpol
- **Fluxgate-Kompass:** Elektronisch, präziser
- **Kreiselkompass:** Zeigt auf geografischen Nordpol (kein Fehler durch Metall)

---

## Korrekturen

**Missweisung (Mw):**
- Winkel zwischen **rechtsweisendem Norden** (geografisch) und **magnetischem Norden**
- In Deutschland meist **östlich** (positiv) von ca. 1–3°
- Ändert sich langsam über Jahre

**Deviation (Dev):**
- Ablenkung des Kompasses durch **metallische Gegenstände an Bord**
- Hängt vom Steuerkurs ab → eigene Deviationstabelle notwendig

**Gesamtkorrektur:**
\`\`\`
rwK = KK + Dev + Mw
\`\`\`
(Östliche Werte +, westliche Werte -)

---

## Kurs und Versatz

**Fahrt durchs Wasser (FdW):**
- Geschwindigkeit des Schiffes relativ zum Wasser (gemessen durch Log)

**Fahrt über Grund (FüG):**
- Tatsächliche Geschwindigkeit über den Meeresboden (GPS)
- Unterschied = Einfluss von Strom!

**Abdrift:**
- Seitliche Abweichung durch Wind (Winddrift)

**Stromversatz:**
- Seitliche Verschiebung durch Strömung

---

## Standortbestimmung

**Peilung:**
- Winkel zwischen Nordrichtung und der Richtung zu einem Objekt

**Standlinie:**
- Linie, auf der sich das Schiff befindet (z. B. eine Peilrichtung auf ein bekanntes Objekt)

**Kreuzpeilung:**
- Mindestens **2 Standlinien** kreuzen sich → ergibt den **Standort**

---

## Seekarte

- Tiefenangaben in **Metern** oder Faden (1 Faden = 1,83 m)
- Tiefenlinien (Isobathen) zeigen Wassertiefen
- Kartenmaßstab beachten für Entfernungsmessung
- 1 Seemeile (sm) = 1852 m
- 1 Knoten = 1 Seemeile pro Stunde`,
  },
  {
    id: 'wetter-grundlagen',
    title: 'Wetter & Meteorologie',
    exam: 'both',
    content: `## Grundlagen des Wettergeschehens

Das Wetter wird hauptsächlich bestimmt durch:
- **Luftdruckänderungen**
- **Luftfeuchtigkeit**
- **Temperatur**

---

## Hoch und Tief

**Hochdruckgebiet (Hoch/Antizyklone):**
- Absinken der Luft → Wolkenauflösung → gutes Wetter
- Winde drehen auf der Nordhalbkugel **im Uhrzeigersinn** um das Zentrum

**Tiefdruckgebiet (Tief/Zyklone):**
- Aufsteigen der Luft → Wolkenbildung → schlechtes Wetter
- Winde drehen auf der Nordhalbkugel **gegen den Uhrzeigersinn**

---

## Beaufortskala (Windstärke)

| Bft | Bezeichnung | Windgeschwindigkeit | Seegang |
|---|---|---|---|
| 0 | Windstille | < 1 km/h | Spiegelglatt |
| 1–3 | Leiser bis schwacher Wind | 1–19 km/h | Kleine Wellen |
| 4–5 | Mäßiger bis frischer Wind | 20–38 km/h | Mäßige Wellen |
| 6–7 | Starker bis steifer Wind | 39–61 km/h | Hochgehende See |
| 8–9 | Stürmischer bis stürmischer Wind | 62–88 km/h | Sehr hohe Wellen |
| 10–12 | Schwerer bis Orkan | > 89 km/h | Außerordentlicher Seegang |

---

## Wichtige Wetterregeln für Bootfahrer

- **Gewitterwarnung:** Gefährlichstes Phänomen für Kleinfahrzeuge – sofort Schutz aufsuchen!
- **Windsprung:** Plötzliche Windrichtungsänderung kann Wetterverschlechterung ankündigen
- **Bodenfrost am Morgen** → oft schöner Tag zu erwarten
- **Rote Abendröte** → in der Regel gutes Wetter
- **Rote Morgenröte** → oft schlechtes Wetter naht`,
  },
  {
    id: 'sicherheit-ausruestung',
    title: 'Sicherheit & Ausrüstung',
    exam: 'both',
    content: `## Rettungsmittel an Bord

### Rettungswesten
- Empfehlung: **immer anlegen** bei schlechtem Wetter und Nacht
- Aufblasbare Westen müssen **mindestens alle 2 Jahre** gewartet werden (Herstellerangabe beachten)
- Rettungswesten erhöhen Überlebenschancen im Wasser erheblich

### Rettungsring / Wurfleine
- Immer griffbereit an Deck
- Sofort werfen bei "Mann über Bord"-Manöver

---

## Feuerlöscher

- Empfohlen: **ABC-Pulver- oder Schaumlöscher**
- Überprüfung: **mindestens alle 2 Jahre**
- Anwendung: Luftzufuhr verhindern, erst am Brandherd einsetzen, Feuer von **unten** bekämpfen

---

## Flüssiggasanlage an Bord

**Propan und Butan sind schwerer als Luft** → sammelt sich in der Bilge → **Explosionsgefahr!**

Gasbehälter lagern:
- Möglichst an Deck, geschützt vor Sonneneinstrahlung
- Oder in einem **abgeschlossenen Raum mit Öffnung nach außen in Bodenhöhe**

Bei Gasaustritt:
1. Gaszuführung **absperren**
2. Für **Lüftung sorgen**
3. Keine elektrischen Schalter betätigen
4. Kein Funk, kein Mobiltelefon benutzen

---

## Tanken

1. **Motor abstellen**
2. Keine elektrischen Schalter betätigen
3. Kein offenes Feuer
4. Vorbereitung gegen Überlaufen treffen

---

## Nach einem Zusammenstoß

1. **Hilfe leisten** und am Unfallort bleiben bis Hilfe eintrifft
2. **Daten austauschen** (Name, Versicherung, Kennzeichen)
3. Wasserschutzpolizei verständigen wenn nötig`,
  },
  {
    id: 'seemannschaft',
    title: 'Seemannschaft & Manöver',
    exam: 'both',
    content: `## Anlegen

**Günstigster Anlaufwinkel:** möglichst **spitzer Winkel** (flach ansteuern)

**Empfohlene Anlegeseite** bei rechtsdrehendem Propeller: **Backbordseite**
- Beim Rückwärtseinlegen dreht das Heck nach Backbord → zieht das Boot an die Pier

**Gegen Strom und Wind anlegen**, weil:
- Das Fahrzeug ist besser manövrierbar
- Man kann mit der Maschine bremsen

---

## Ankern

**Der Anker hält wenn:**
- Beim Handauflegen auf die Ankerkette kein **Rucken** zu spüren ist
- Die **Ankerpeilung sich nicht ändert** (kein Vertreiben)

---

## Propellerwirkung

**Rechtsdrehender Propeller** (Uhrzeigersinn von achtern gesehen, Vorausfahrt):
- **Rückwärtsgang:** Heck dreht nach **Backbord**

**Radeffekt (indirekte Ruderwirkung):**
- Seitliches Versetzen des **Hecks** durch Propellerdrehung

---

## Bei engem Fahrwasser

- **Geschwindigkeit reduzieren** um Sog und Wellenschlag zu vermeiden
- Ausreichend **Passierabstand** halten
- Nicht zu dicht an große Fahrzeuge heranfahren → Sog und Wellenschlag!

---

## Motorüberwachung

Wichtige Kontrollpunkte während der Fahrt:
- **Motortemperatur**
- **Öldruck**
- **Ladekontrolle**

Ursachen für Überhitzung:
- Defektes Thermostat
- Defekte Impellerpumpe
- Geschlossenes Seeventil
- Zu niedriger Kühlwasserstand`,
  },
  {
    id: 'schleusen',
    title: 'Schleusen – Einfahrt und Signale',
    exam: 'binnen',
    content: `## Schleusensignale

### Lichtsignale vor der Schleuse

| Signal | Bedeutung |
|---|---|
| **Rot** oder **Rot + Grün** | Einfahrt verboten, Öffnen der Schleuse wird vorbereitet |
| **Grün + Weiß** | Einfahrt frei, Gegenverkehr gesperrt |
| **Rot-Weiß-Rot** | Brücke/Sperrwerk/Schleuse **geschlossen** |
| **Rot-Grün-Rot** | Anlage dauerhaft gesperrt |

---

## Einfahrtreihenfolge

1. Zuerst fahren **große Fahrzeuge** (nicht Kleinfahrzeuge) ein
2. Dann **Kleinfahrzeuge** nach Aufforderung durch Schleusenaufsicht

---

## Verhalten in der Schleuse

- Letztes Kleinfahrzeug muss so weit einfahren, dass es beim **Leeren der Schleuse nicht auf den Drempel aufsetzt**
- Festmacherleinen so bedienen, dass **Stöße gegen Schleusenwände** vermieden werden
- Leinen immer **sichern**, um beim Heben/Senken mitzugehen

---

## Schleusen im Nord-Ostsee-Kanal (NOK)

Einfahrt erlaubt bei:
- **Weißes unterbrochenes Licht** (am NOK)

Ankern verboten in den Zufahrten des NOK!

---

## Allgemeines Liegeverbot

Ohne besondere Bezeichnung gilt ein allgemeines Liegeverbot:
- Auf **Schifffahrtskanälen**
- Auf **Schleusenkanälen**`,
  },
];
