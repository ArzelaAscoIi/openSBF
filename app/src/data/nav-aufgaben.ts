export type QTyp =
  | 'chart'      // read rwK / position / distance from chart
  | 'karte'      // "Tragen Sie in die Seekarte ein"
  | 'mgk'        // MgK = rwK − D − Mw
  | 'rwk'        // rwK = KK + D + Mw  (KK given on compass)
  | 'peilung'    // rwP = MgP + D + Mw (one or more bearings)
  | 'zeit'       // Zeit [min] = Distanz / Geschwindigkeit × 60
  | 'ankunft'    // Arrival time: start + Zeit
  | 'speed'      // Geschwindigkeit = Distanz / Zeit[h]
  | 'koppelort'  // dead-reckoning position
  | 'bv'         // Besteckversetzung
  | 'info';      // description / meaning / knowledge

export interface PeilungEntry {
  name: string;
  mgp: number;
  dev: number; // deviation for this bearing
  mw: number;
  rwp: number;
}

export interface NavQuestion {
  nr: number;
  frage: string;
  antwort: string;
  typ: QTyp;
  // Calculator pre-fill:
  rwk?: number;        // true course → for mgk calc
  kk?: number;         // compass course → for rwk calc
  dev?: number;        // deviation
  mw?: number;         // variation (Missweisung)
  distanz?: number;    // sm
  speed?: number;      // kn
  zeitMin?: number;    // minutes (pre-filled)
  startUhr?: string;   // "HH:MM"
  peilungen?: PeilungEntry[];
}

export interface NavAufgabe {
  id: number;
  datum: string;
  szenario: string;
  mw: number;           // Missweisung for this task (from chart, pre-computed)
  questions: NavQuestion[];
  youtubeUrl?: string;
}

export const navAufgaben: NavAufgabe[] = [
  {
    id: 1,
    datum: '05.05.2012',
    szenario: 'Ein Sportboot befindet sich am 05.05.2012 in der Deutschen Bucht auf der Reise von Borkum nach Cuxhaven. Die Fahrt über Grund beträgt 8 kn.\n\nUm 10:00 Uhr wird die Leuchttonne "TG19/Weser 2" nahebei passiert. Von dieser Tonne wird der Kurs auf die Ansteuerungstonne der alten Weser "ST" abgesetzt.',
    mw: 1,
    youtubeUrl: 'https://www.youtube.com/watch?v=jYWMqmiAeuc',
    questions: [
      { nr: 1, frage: 'Wie lautet der rwK?', antwort: 'rwK = 079°', typ: 'chart' },
      { nr: 2, frage: 'Die Ablenkung beträgt +4°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 074°', typ: 'mgk', rwk: 79, dev: 4, mw: 1 },
      { nr: 3, frage: 'Wie groß ist die Distanz zwischen der Tonne "TG19/Weser 2" und der Tonne "ST"?', antwort: '6,1 sm', typ: 'chart' },
      { nr: 4, frage: 'In welcher Zeit wird die Distanz zwischen der Tonne "TG19/Weser 2" und der Tonne "ST" zurückgelegt?', antwort: '45,75 min, also 46 min (ca. ¾ Stunde)', typ: 'zeit', distanz: 6.1, speed: 8 },
      { nr: 5, frage: 'Auf welcher Position befindet sich das Schiff nach Koppelort um 10:30 Uhr?', antwort: '53° 55,8\' N 007° 51,3\' E', typ: 'koppelort', rwk: 79, speed: 8, zeitMin: 30, startUhr: '10:00' },
      { nr: 6, frage: 'Um 10:30 Uhr werden nachfolgende Schifffahrtszeichen mit dem Hand-Peilkompass gepeilt. Die Ablenkung beträgt dabei 0°, die Mw ist der Seekarte zu entnehmen.\nNeue Weser, Leuchttonne "4a", MgP = 169°\nAlte Weser, Leuchttonne "ST", MgP = 064°\nWie lauten die rw-Peilungen?', antwort: 'Leuchttonne "4a": rwP = 170°\nLeuchttonne "ST": rwP = 065°', typ: 'peilung', peilungen: [{ name: 'Leuchttonne "4a"', mgp: 169, dev: 0, mw: 1, rwp: 170 }, { name: 'Leuchttonne "ST"', mgp: 64, dev: 0, mw: 1, rwp: 65 }] },
      { nr: 7, frage: 'Tragen Sie die rechtweisenden Peilungen in die Seekarte ein.', antwort: 'Peilungen gemäß Frage 6 in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 8, frage: 'Wie lautet die Besteckversetzung?', antwort: 'BV = 103° − 0,8 sm', typ: 'bv' },
      { nr: 9, frage: 'Beschreiben Sie Farbe, Kennung und Toppzeichen der Leuchttonne "ST".', antwort: 'Farbe: rot/weiß senkrecht gestreift\nKennung: weißes Gleichtaktfeuer mit 8 Sekunden Wiederkehr\nToppzeichen: roter Ball', typ: 'info' },
    ],
  },
  {
    id: 2,
    datum: '10.06.2011',
    szenario: 'Ein Sportboot befindet sich am 10.06.2011 in der Deutschen Bucht auf der Reise von Helgoland nach Cuxhaven. Die Fahrt über Grund beträgt 10 kn.\n\nUm 11:00 Uhr wird 1,2 sm südlich von Helgoland die Tonne "Helgoland-O" nahebei passiert.',
    mw: 1,
    youtubeUrl: 'https://www.youtube.com/watch?v=cQA6Me1A8Mw',
    questions: [
      { nr: 1, frage: 'Entnehmen Sie der Seekarte die geographische Position des Sportbootes um 11:00 Uhr.', antwort: '54° 09,0\' N 007° 53,5\' E', typ: 'chart' },
      { nr: 2, frage: 'Im Abstand von ca. 0,6 sm südwestlich der Tonne "Helgoland-O" befindet sich eine Eintragung. Was bedeutet diese Eintragung in der Seekarte?', antwort: 'Wrack, Kartentiefe 53,6 m', typ: 'info' },
      { nr: 3, frage: 'Von der Tonne "Helgoland-O" aus wird ein MgK von 116° gesteuert. Die Ablenkung beträgt +3°, die Mw ist der Seekarte zu entnehmen. Wie lautet der rwK?', antwort: 'rwK = 120°', typ: 'rwk', kk: 116, dev: 3, mw: 1 },
      { nr: 4, frage: 'Tragen Sie den rechtweisenden Kurs in die Seekarte ein.', antwort: 'Kurs rwK = 120° in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 5, frage: 'Nach 11,1 sm Distanz wird die Tonne "Außenelbe-Reede 4" nahebei passiert. Beschreiben Sie Farbe, Kennung und Toppzeichen des Schifffahrtszeichens.', antwort: 'Farbe: gelb\nKennung: gelbes Blitzfeuer mit 4 Sekunden Wiederkehr\nToppzeichen: keines', typ: 'info' },
      { nr: 6, frage: 'In welcher Zeit wird die in Frage 5 genannte Distanz zurückgelegt?', antwort: '67 min', typ: 'zeit', distanz: 11.1, speed: 10 },
      { nr: 7, frage: 'Auf welcher Position befindet sich das Schiff nach Koppelort um 11:54 Uhr?', antwort: '54° 04,5\' N 008° 06,7\' E', typ: 'koppelort', rwk: 120, speed: 10, zeitMin: 54, startUhr: '11:00' },
      { nr: 8, frage: 'Um 11:54 Uhr wird die Leuchttonne "Außenelbe-Reede 4" mit dem Hand-Peilkompass gepeilt: MgP = 146°. Die Ablenkung beträgt 0°, die Mw ist der Seekarte zu entnehmen. Wie lautet die rw-Peilung?', antwort: 'rwP = 147°', typ: 'peilung', peilungen: [{ name: 'Leuchttonne "Außenelbe-Reede 4"', mgp: 146, dev: 0, mw: 1, rwp: 147 }] },
      { nr: 9, frage: 'Das Schiff befindet sich zeitgleich zur Peilung auf der 20-Meter-Linie. Wie lautet die Besteckversetzung?', antwort: 'BV = 007° − 1,6 sm', typ: 'bv' },
    ],
  },
  {
    id: 3,
    datum: '23.05.2011',
    szenario: 'Ein Sportboot befindet sich am 23.05.2011 in der Deutschen Bucht auf der Fahrt aus der Jade nach Langeoog.\n\nUm 13:30 Uhr wird die Tonne "1b/Jade 1" nahebei passiert. Die Fahrt über Grund wird mit 6 kn angenommen.',
    mw: 0,
    youtubeUrl: 'https://www.youtube.com/watch?v=z_VmXaaK4K0',
    questions: [
      { nr: 1, frage: 'Entnehmen Sie der Seekarte die geographische Position des Sportbootes um 13:30 Uhr.', antwort: '53° 52,4\' N 007° 44,0\' E', typ: 'chart' },
      { nr: 2, frage: 'Von dieser Tonne aus wird der Kurs auf die Tonne "Accumer Ee" abgesetzt. Tragen Sie den Kurs in die Seekarte ein.', antwort: 'Kurs in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 3, frage: 'Wie lautet der rwK?', antwort: 'rwK = 240°', typ: 'chart' },
      { nr: 4, frage: 'Die Ablenkung beträgt −2°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 242°', typ: 'mgk', rwk: 240, dev: -2, mw: 0 },
      { nr: 5, frage: 'Wann wird die Tonne "Accumer Ee" voraussichtlich erreicht? (Distanz ca. 10,2 sm)', antwort: 'um 15:12 Uhr', typ: 'ankunft', distanz: 10.2, speed: 6, startUhr: '13:30' },
      { nr: 6, frage: 'Auf Position 53° 49,5\' N 007° 36,8\' E (ca. 1,9 sm nordwestlich der Ansteuerungstonne "Otzumer Balje") finden Sie einen roten Eintrag mit einem "A". Was bedeutet diese Eintragung in der Seekarte?', antwort: 'Position der Gezeitenstromangabe (Stromraute)', typ: 'info' },
      { nr: 7, frage: 'Um 14:30 Uhr wird mit dem Peilaufsatz des Magnetkompasses eine Kreuzpeilung durchgeführt. Ablenkung −2°, Mw aus Seekarte.\nTonne "TG15": MgP = 292°\nTonne "TG17/Weser1": MgP = 347°\nTonne "Accumer Ee": MgP = 234°\nWie lauten die rw-Peilungen?', antwort: 'Tonne "TG15": rwP = 290°\nTonne "TG17/Weser1": rwP = 345°\nTonne "Accumer Ee": rwP = 232°', typ: 'peilung', peilungen: [{ name: 'Tonne "TG15"', mgp: 292, dev: -2, mw: 0, rwp: 290 }, { name: 'Tonne "TG17/Weser1"', mgp: 347, dev: -2, mw: 0, rwp: 345 }, { name: 'Tonne "Accumer Ee"', mgp: 234, dev: -2, mw: 0, rwp: 232 }] },
      { nr: 8, frage: 'Tragen Sie die rechtweisenden Peilungen in die Seekarte ein.', antwort: 'Peilungen in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 9, frage: 'Beschreiben Sie Farbe, Kennung und Toppzeichen der Tonne "Accumer Ee".', antwort: 'Farbe: rot-weiß senkrecht gestreift\nKennung: weißes Gleichtaktfeuer mit 8 Sekunden Wiederkehr\nToppzeichen: roter Ball', typ: 'info' },
    ],
  },
  {
    id: 4,
    datum: '18.04.2014',
    szenario: 'Ein aus Langeoog auslaufendes Sportboot befindet sich am 18.04.2014 um 09:00 Uhr nahe bei der Tonne "Accumer Ee".',
    mw: 0,
    youtubeUrl: 'https://www.youtube.com/watch?v=ef6lf9r9im4',
    questions: [
      { nr: 1, frage: 'Entnehmen Sie der Seekarte die geographische Position des Bootes um 09:00 Uhr.', antwort: '53° 47,2\' N 007° 29,1\' E', typ: 'chart' },
      { nr: 2, frage: 'Von der Tonne "Accumer Ee" aus wird der Kurs auf die Tonne "Otzumer Balje" abgesetzt. Tragen Sie den Kurs in die Seekarte ein.', antwort: 'Kurs in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 3, frage: 'Wie lautet der rwK?', antwort: 'rwK = 081°', typ: 'chart' },
      { nr: 4, frage: 'Die Ablenkung beträgt +7°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 074°', typ: 'mgk', rwk: 81, dev: 7, mw: 0 },
      { nr: 5, frage: 'Beschreiben Sie Farbe, Kennung und Toppzeichen der Tonne "Otzumer Balje".', antwort: 'Farbe: rot-weiß senkrecht gestreift\nKennung: weißes Gleichtaktfeuer mit 4 Sekunden Wiederkehr\nToppzeichen: roter Ball', typ: 'info' },
      { nr: 6, frage: 'Es ist 10:00 Uhr. Die durchschnittliche Fahrt über Grund betrug in der letzten Stunde 6 kn. Auf welcher Position befindet sich das Schiff nach Koppelort?', antwort: '53° 48,2\' N 007° 39,2\' E', typ: 'koppelort', rwk: 81, speed: 6, zeitMin: 60, startUhr: '09:00' },
      { nr: 7, frage: 'Ca. 1,2 sm südwestlich der Tonne "Otzumer Balje" finden Sie zwei ähnliche Einträge. Was bedeuten diese Eintragungen in der Seekarte?', antwort: 'Wracks mit 3,7 m bzw. 1,4 m Tiefe', typ: 'info' },
      { nr: 8, frage: 'Um 10:15 Uhr peilen Sie mit dem Peilaufsatz am Magnetkompass:\nWestlichste Kirche auf Spiekeroog: MgP = 110°\nTonne "Otzumer Balje": MgP = 030°\nAblenkung +5°, Mw aus Karte.\nWie lauten die rw-Peilungen?', antwort: 'Kirche: rwP = 115°\nTonne "Otzumer Balje": rwP = 035°', typ: 'peilung', peilungen: [{ name: 'Kirche Spiekeroog', mgp: 110, dev: 5, mw: 0, rwp: 115 }, { name: 'Tonne "Otzumer Balje"', mgp: 30, dev: 5, mw: 0, rwp: 35 }] },
      { nr: 9, frage: 'Tragen Sie die rechtweisenden Peilungen in die Karte ein.', antwort: 'Peilungen in die Seekarte eingetragen.', typ: 'karte' },
    ],
  },
  {
    id: 5,
    datum: '29.07.2011',
    szenario: 'Ein Motorboot befindet sich am 29.07.2011 in der Küstenverkehrszone und möchte in die Jade einlaufen.',
    mw: 0,
    youtubeUrl: 'https://www.youtube.com/watch?v=r2rmB_CXVAs',
    questions: [
      { nr: 1, frage: 'Zur Standortbestimmung werden um 14:00 Uhr mit dem Peilaufsatz am Magnetkompass gepeilt. Ablenkung −4°, Mw aus Seekarte.\nWasserturm Langeoog: MgP = 225°\nTonne "Otzumer Balje": MgP = 131°\nWie lauten die rw-Peilungen?', antwort: 'Wasserturm Langeoog: rwP = 221°\nTonne "Otzumer Balje": rwP = 127°', typ: 'peilung', peilungen: [{ name: 'Wasserturm Langeoog', mgp: 225, dev: -4, mw: 0, rwp: 221 }, { name: 'Tonne "Otzumer Balje"', mgp: 131, dev: -4, mw: 0, rwp: 127 }] },
      { nr: 2, frage: 'Tragen Sie die rechtweisenden Peilungen in die Seekarte ein.', antwort: 'Peilungen in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 3, frage: 'Entnehmen Sie der Seekarte die geographische Position des ermittelten Standortes.', antwort: '53° 49,7\' N 007° 35,8\' E', typ: 'chart' },
      { nr: 4, frage: 'Von diesem Ort aus wird der Kurs auf die Tonne "1b/Jade1" abgesetzt. Tragen Sie den Kurs in die Seekarte ein.', antwort: 'Kurs in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 5, frage: 'Wie lautet der rwK?', antwort: 'rwK = 061°', typ: 'chart' },
      { nr: 6, frage: 'Die Ablenkung beträgt −2°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 063°', typ: 'mgk', rwk: 61, dev: -2, mw: 0 },
      { nr: 7, frage: 'Das Motorboot macht 11 kn Fahrt über Grund. Zu welcher Uhrzeit wird die Tonne "1b/Jade1" voraussichtlich erreicht? (Distanz ca. 5,5 sm)', antwort: 'um 14:30 Uhr', typ: 'ankunft', distanz: 5.5, speed: 11, startUhr: '14:00' },
      { nr: 8, frage: 'Beschreiben Sie Farbe, Kennung und Toppzeichen der Tonne "1b/Jade1".', antwort: 'Farbe: grün\nKennung: grünes unterbrochenes Feuer mit 4 Sekunden Wiederkehr\nToppzeichen: keines', typ: 'info' },
      { nr: 9, frage: 'Das Motorboot macht weiterhin 11 kn Fahrt über Grund, als um 14:06 Uhr ein Maschinenschaden eintritt. Auf welcher Position befindet sich das Schiff zu diesem Zeitpunkt nach Koppelort?', antwort: '53° 50,2\' N 007° 37,4\' E', typ: 'koppelort', rwk: 61, speed: 11, zeitMin: 6, startUhr: '14:00' },
    ],
  },
  {
    id: 6,
    datum: '30.06.2012',
    szenario: 'Ein aus der Alten Weser auslaufendes Motorboot befindet sich am 30.06.2012 auf dem Weg in die Elbe und steht um 09:00 Uhr nahebei der Tonne "A2".',
    mw: 1,
    youtubeUrl: 'https://www.youtube.com/watch?v=Ev3ORQwvMD0',
    questions: [
      { nr: 1, frage: 'Entnehmen Sie der Seekarte die geographische Position des Motorbootes.', antwort: '53° 55,3\' N 007° 58,8\' E', typ: 'chart' },
      { nr: 2, frage: 'Von der Tonne "A2" aus setzt das Boot seinen Kurs auf die Tonne "Westertill-N" ab. Tragen Sie den Kurs in die Seekarte ein.', antwort: 'Kurs in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 3, frage: 'Wie lautet der rwK?', antwort: 'rwK = 059°', typ: 'chart' },
      { nr: 4, frage: 'Die Ablenkung beträgt −2°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 060°', typ: 'mgk', rwk: 59, dev: -2, mw: 1 },
      { nr: 5, frage: 'Nach einiger Zeit wird die Tonne "NGN" an Backbordseite passiert. Beschreiben Sie Farbe, Kennung und Toppzeichen des Schifffahrtszeichens.', antwort: 'Farbe: oben schwarz und unten gelb\nKennung: weißes schnelles Funkelfeuer\nToppzeichen: zwei Kegel – beide "Spitze oben" – senkrecht übereinander', typ: 'info' },
      { nr: 6, frage: 'Im weiteren Fahrtverlauf werden mit dem Peilaufsatz am Magnetkompass gepeilt. Ablenkung −2°, Mw aus Seekarte.\nLeuchtturm "Alte Weser": MgP = 160°\nTonne "Westertill-N": MgP = 056°\nWie lauten die rw-Peilungen?', antwort: 'Leuchtturm "Alte Weser": rwP = 159°\nTonne "Westertill-N": rwP = 055°', typ: 'peilung', peilungen: [{ name: 'Leuchtturm "Alte Weser"', mgp: 160, dev: -2, mw: 1, rwp: 159 }, { name: 'Tonne "Westertill-N"', mgp: 56, dev: -2, mw: 1, rwp: 55 }] },
      { nr: 7, frage: 'Tragen Sie die rechtweisenden Peilungen in die Seekarte ein.', antwort: 'Peilungen in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 8, frage: 'Um 09:54 Uhr wird die Tonne "Westertill-N" passiert. Wie groß ist die Geschwindigkeit seit 09:00 Uhr? (Distanz: 5,4 sm)', antwort: 'FüG = 6 kn', typ: 'speed', distanz: 5.4, zeitMin: 54 },
      { nr: 9, frage: 'Unmittelbar südlich der Tonne "Westertill-N" befindet sich eine Eintragung. Was bedeutet diese Eintragung in der Seekarte?', antwort: 'Kartentiefe 24 m', typ: 'info' },
    ],
  },
  {
    id: 7,
    datum: '22.10.2010',
    szenario: 'Ein aus der Elbe auslaufendes Motorboot steht am 22.10.2010 um 11:00 Uhr nahebei der Tonne "Außenelbe-Reede 2". Die Fahrt über Grund beträgt 8 kn.',
    mw: 1,
    youtubeUrl: 'https://www.youtube.com/watch?v=HoodX3bO9CQ',
    questions: [
      { nr: 1, frage: 'Entnehmen Sie der Seekarte die geographische Position des Motorbootes um 11:00 Uhr.', antwort: '54° 03,5\' N 008° 06,9\' E', typ: 'chart' },
      { nr: 2, frage: 'Beschreiben Sie Farbe, Kennung und Toppzeichen der Tonne "Außenelbe-Reede 2".', antwort: 'Farbe: gelb\nKennung: gelbes unterbrochenes Feuer in 3er Gruppen, Wiederkehr 12 Sekunden\nToppzeichen: keines', typ: 'info' },
      { nr: 3, frage: 'Von der angegebenen Position aus wird am Magnetkompasskurs von 218° gesteuert. Die Ablenkung beträgt −3°, die Mw ist der Seekarte zu entnehmen. Wie lautet der rwK?', antwort: 'rwK = 216°', typ: 'rwk', kk: 218, dev: -3, mw: 1 },
      { nr: 4, frage: 'Tragen Sie den rechtweisenden Kurs in die Seekarte ein.', antwort: 'Kurs rwK = 216° in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 5, frage: 'Wann erreichen Sie die Tonne "NGN"? (Distanz ca. 7,6 sm)', antwort: 'um 11:57 Uhr', typ: 'ankunft', distanz: 7.6, speed: 8, startUhr: '11:00' },
      { nr: 6, frage: 'Welche Bedeutung hat die Tonne "NGN"?', antwort: 'Nord-Kardinal-Zeichen. Zeigt an, dass die Gefahrenstelle nördlich der Tonne sicher umfahren werden kann.', typ: 'info' },
      { nr: 7, frage: 'Um 12:00 Uhr werden mit dem Hand-Peilkompass folgende Tonnen gepeilt. Ablenkung 0°, Mw aus Seekarte.\nTonne "ST": MgP = 240°\nTonne "A2": MgP = 150°\nWie lauten die rw-Peilungen?', antwort: 'Tonne "ST": rwP = 241°\nTonne "A2": rwP = 151°', typ: 'peilung', peilungen: [{ name: 'Tonne "ST"', mgp: 240, dev: 0, mw: 1, rwp: 241 }, { name: 'Tonne "A2"', mgp: 150, dev: 0, mw: 1, rwp: 151 }] },
      { nr: 8, frage: 'Tragen Sie die rechtweisenden Peilungen in die Seekarte ein.', antwort: 'Peilungen in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 9, frage: 'Wie lautet die Besteckversetzung?', antwort: 'BV = 273° − 1,1 sm', typ: 'bv' },
    ],
  },
  {
    id: 8,
    datum: '28.05.2012',
    szenario: 'Ein Motorboot steht am 28.05.2012 um 10:00 Uhr in der Deutschen Bucht. Die Fahrt über Grund wird mit 9 kn angenommen.',
    mw: 1,
    youtubeUrl: 'https://www.youtube.com/watch?v=6ADVwbnjyTg',
    questions: [
      { nr: 1, frage: 'Durch Peilung und Abstandsmessung wird eine Standortbestimmung durchgeführt. Die Tonne "E2" wird gepeilt: rwP = 084°, Distanz 1,6 sm. Tragen Sie die rw-Peilung in die Seekarte ein.', antwort: 'rwP = 084° in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 2, frage: 'Entnehmen Sie der Seekarte die geographische Position.', antwort: '54° 07,0\' N 007° 41,0\' E', typ: 'chart' },
      { nr: 3, frage: 'An dem ermittelten Ort befindet sich ein Eintrag. Was bedeutet diese Eintragung in der Seekarte?', antwort: 'Kartentiefe 37 m', typ: 'info' },
      { nr: 4, frage: 'Von dem ermittelten Ort wird das Verkehrstrennungsgebiet Jade Approach auf rwK = 232° angesteuert. Tragen Sie den Kurs in die Seekarte ein.', antwort: 'Kurs rwK = 232° in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 5, frage: 'Wie groß ist die Distanz zum Verkehrstrennungsgebiet?', antwort: '3,8 sm', typ: 'chart' },
      { nr: 6, frage: 'Die Ablenkung beträgt +2°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 229°', typ: 'mgk', rwk: 232, dev: 2, mw: 1 },
      { nr: 7, frage: 'Bei Erreichen des Verkehrstrennungsgebietes wird der Kurs geändert, um das Gebiet rechtwinklig zu queren. Wie lautet der rwK?', antwort: 'rwK = 242°', typ: 'chart' },
      { nr: 8, frage: 'Welcher Zeitraum wird für das Queren des Verkehrstrennungsgebietes Jade Approach voraussichtlich benötigt? (Breite ca. 3,0 sm)', antwort: 'ca. 20 min', typ: 'zeit', distanz: 3.0, speed: 9 },
      { nr: 9, frage: 'Nach einiger Zeit wird die Tonne "TG16/Reede" querab an Backbord passiert. Beschreiben Sie Farbe, Kennung und Toppzeichen des Schifffahrtszeichens.', antwort: 'Farbe: rot\nKennung: rotes unterbrochenes Feuer in 3er Gruppen, Wiederkehr 12 Sekunden\nToppzeichen: keines', typ: 'info' },
    ],
  },
  {
    id: 9,
    datum: '23.06.2011',
    szenario: 'Ein Sportboot befährt am 23.06.2011 nördlich des roten Tonnenstrichs die Elbe seewärts. Gegen 12:00 Uhr wird die Tonne "14" nahebei passiert. Die Fahrt über Grund beträgt 5,8 kn.',
    mw: 0,
    youtubeUrl: 'https://www.youtube.com/watch?v=sIw6i0hGbLo',
    questions: [
      { nr: 1, frage: 'Wann erreicht das Boot voraussichtlich die Tonne "6"? (Distanz ca. 5,8 sm)', antwort: 'gegen 13:00 Uhr', typ: 'ankunft', distanz: 5.8, speed: 5.8, startUhr: '12:00' },
      { nr: 2, frage: 'Gut südlich des grünen Tonnenstrichs geht es elbabwärts bis gegen 13:50 Uhr, als Tonne "1" an Steuerbord querab ist. Nun wird rwK 206° auf den Leuchtturm "Alte Weser" abgesetzt. Ablenkung +4°, Mw aus Seekarte. Wie lautet der MgK?', antwort: 'MgK = 202°', typ: 'mgk', rwk: 206, dev: 4, mw: 0 },
      { nr: 3, frage: 'Beschreiben Sie das Feuer des Leuchtturms "Alte Weser" anhand der Eintragung in der Karte.', antwort: 'Festfeuer in Sektoren in den Farben weiß, rot und grün.\nFeuerhöhe 33 m, Tragweiten 23 sm bis 18 sm.', typ: 'info' },
      { nr: 4, frage: 'Was bedeutet der Zusatz "Horn Mo(AL)60s"?', antwort: 'Nebelhorn in den Morsebuchstaben A und L alle 60 Sekunden.', typ: 'info' },
      { nr: 5, frage: 'Um 14:20 Uhr zeigt das GPS folgende Position: 53° 56,0\' N 008° 11,0\' E. Tragen Sie diese in die Karte ein.', antwort: 'Position in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 6, frage: 'Die GPS-Position soll anhand von Peilungen kontrolliert werden. Wie lauten von dieser Position aus die rw-Peilungen auf Leuchtturm "Neuwerk" und Leuchtturm "Alte Weser"?', antwort: 'Leuchtturm Neuwerk: rwP = 096°\nLeuchtturm Alte Weser: rwP = 205°', typ: 'chart' },
      { nr: 7, frage: 'Tragen Sie die rw-Peilungen in die Seekarte ein.', antwort: 'Peilungen in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 8, frage: 'Wie groß ist die Distanz zum Leuchtturm "Alte Weser"?', antwort: '4,6 sm', typ: 'chart' },
      { nr: 9, frage: 'Gegen 15:20 Uhr sind Sie am Leuchtturm "Alte Weser". Wie groß ist die Geschwindigkeit der letzten Stunde? (Distanz 4,6 sm, Zeit 60 min)', antwort: '4,6 kn', typ: 'speed', distanz: 4.6, zeitMin: 60 },
    ],
  },
  {
    id: 10,
    datum: '14.07.2010',
    szenario: 'Ein am 14.07.2010 aus der "Alten Weser" auslaufendes Fahrzeug hat den Leuchtturm "Alte Weser" passiert und steht um 12:00 Uhr nahebei der Tonne "A10".',
    mw: 1,
    youtubeUrl: 'https://www.youtube.com/watch?v=XouLDmrqqK4',
    questions: [
      { nr: 1, frage: 'Entnehmen Sie der Seekarte die geographische Position dieser Tonne.', antwort: '53° 52,6\' N 008° 06,4\' E', typ: 'chart' },
      { nr: 2, frage: 'Beschreiben Sie das Feuer des Leuchtturms "Alte Weser".', antwort: 'Festfeuer mit weißen, roten und grünen Sektoren.\nFeuerhöhe 33 m, Nenntragweite 23 sm bis 18 sm.', typ: 'info' },
      { nr: 3, frage: 'Vom angegebenen Standort aus wird der Kurs auf die Tonne "A2" abgesetzt. Tragen Sie den Kurs in die Seekarte ein.', antwort: 'Kurs in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 4, frage: 'Wie lautet der rwK?', antwort: 'rwK = 301°', typ: 'chart' },
      { nr: 5, frage: 'Die Ablenkung beträgt −4°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 304°', typ: 'mgk', rwk: 301, dev: -4, mw: 1 },
      { nr: 6, frage: 'Um 12:26 Uhr wird die Tonne "A2" querab passiert. Wie groß ist die Geschwindigkeit über Grund seit Passage der Tonne "A10"? (Distanz: 5,2 sm)', antwort: 'FüG = 12,0 kn', typ: 'speed', distanz: 5.2, zeitMin: 26 },
      { nr: 7, frage: 'Nach Passage der Tonne "A2" wird die Tonne "ST" passiert. Welche Bedeutung hat dieses Schifffahrtszeichen?', antwort: 'Kennzeichnung der Zufahrt zu Fahrwassern und der Mitte von Schifffahrtswegen', typ: 'info' },
      { nr: 8, frage: 'Zur Standortbestimmung werden mit dem Peilaufsatz am Magnetkompass gepeilt. Ablenkung +1°, Mw aus Seekarte.\nTonne "NGN": MgP = 110°\nTonne "ST": MgP = 225°\nWie lauten die rw-Peilungen?', antwort: 'Tonne "NGN": rwP = 112°\nTonne "ST": rwP = 227°', typ: 'peilung', peilungen: [{ name: 'Tonne "NGN"', mgp: 110, dev: 1, mw: 1, rwp: 112 }, { name: 'Tonne "ST"', mgp: 225, dev: 1, mw: 1, rwp: 227 }] },
      { nr: 9, frage: 'Tragen Sie die rechtweisenden Peilungen in die Seekarte ein.', antwort: 'Peilungen in die Seekarte eingetragen.', typ: 'karte' },
    ],
  },
  {
    id: 11,
    datum: '05.08.2013',
    szenario: 'Ein Sportboot steht am 05.08.2013 um 09:00 Uhr in der Deutschen Bucht auf Position 53° 54,2\' N und 007° 53,8\' E und möchte in die Neue Weser einlaufen.',
    mw: 1,
    youtubeUrl: 'https://www.youtube.com/watch?v=ypERrnNVsyk',
    questions: [
      { nr: 1, frage: 'Tragen Sie die Position in die Karte ein.', antwort: '53° 54,2\' N 007° 53,8\' E in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 2, frage: 'Auf der o. g. Position befindet sich ein Eintrag. Was bedeutet diese Eintragung in der Seekarte?', antwort: 'Kartentiefe 18,5 m', typ: 'info' },
      { nr: 3, frage: 'Von der o. g. Position wird der Kurs auf die Tonne "5" des Fahrwassers der Neuen Weser abgesetzt. Wie lautet der rwK?', antwort: 'rwK = 148°', typ: 'chart' },
      { nr: 4, frage: 'Tragen Sie den rechtweisenden Kurs in die Seekarte ein.', antwort: 'Kurs rwK = 148° in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 5, frage: 'Die Ablenkung beträgt −5°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 152°', typ: 'mgk', rwk: 148, dev: -5, mw: 1 },
      { nr: 6, frage: 'Beschreiben Sie Farbe, Kennung und Toppzeichen der Tonne "5" der Neuen Weser.', antwort: 'Farbe: grün\nKennung: grünes unterbrochenes Feuer in 2er Gruppen, Wiederkehr 9 Sekunden\nToppzeichen: keines', typ: 'info' },
      { nr: 7, frage: 'Wann wird die Tonne "5" voraussichtlich passiert, wenn das Boot eine Fahrt über Grund von 6 kn macht? (Distanz ca. 3,7 sm)', antwort: 'um 09:37 Uhr', typ: 'ankunft', distanz: 3.7, speed: 6, startUhr: '09:00' },
      { nr: 8, frage: 'Im weiteren Verlauf werden mit dem Hand-Peilkompass gepeilt. Ablenkung 0°, Mw aus Seekarte.\nLeuchtturm "Alte Weser": MgP = 011°\nLeuchtturm "Tegeler Plate": MgP = 102°\nWie lauten die rw-Peilungen?', antwort: 'Leuchtturm "Alte Weser": rwP = 012°\nLeuchtturm "Tegeler Plate": rwP = 103°', typ: 'peilung', peilungen: [{ name: 'Leuchtturm "Alte Weser"', mgp: 11, dev: 0, mw: 1, rwp: 12 }, { name: 'Leuchtturm "Tegeler Plate"', mgp: 102, dev: 0, mw: 1, rwp: 103 }] },
      { nr: 9, frage: 'Tragen Sie die rwP in die Karte ein.', antwort: 'Peilungen in die Seekarte eingetragen.', typ: 'karte' },
    ],
  },
  {
    id: 12,
    datum: '02.05.2012',
    szenario: 'Ein am 02.05.2012 aus der Jade auslaufendes Sportboot steht um 08:00 Uhr nahebei der Tonne "10" des Wangerooger Fahrwassers und möchte in nördlicher Richtung ablaufen. Die Fahrt über Grund wird mit 8 kn angenommen.',
    mw: 1,
    youtubeUrl: 'https://www.youtube.com/watch?v=iAmmbx4PDxk',
    questions: [
      { nr: 1, frage: 'Entnehmen Sie der Seekarte die geographische Position des Bootes.', antwort: '53° 50,0\' N 007° 53,4\' E', typ: 'chart' },
      { nr: 2, frage: 'Von der angegebenen Position wird der Kurs auf die Tonne "ST" abgesetzt. Tragen Sie den Kurs in die Seekarte ein.', antwort: 'Kurs in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 3, frage: 'Wie lautet der rwK?', antwort: 'rwK = 007°', typ: 'chart' },
      { nr: 4, frage: 'Die Ablenkung beträgt −3°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 009°', typ: 'mgk', rwk: 7, dev: -3, mw: 1 },
      { nr: 5, frage: 'Die Tonne "4a" der "Neuen Weser" wird passiert. Beschreiben Sie Farbe, Kennung und Toppzeichen des Schifffahrtszeichens.', antwort: 'Farbe: rot\nKennung: rotes unterbrochenes Funkelfeuer mit 13 Sekunden Wiederkehr\nToppzeichen: roter Zylinder', typ: 'info' },
      { nr: 6, frage: 'Um 08:30 Uhr wird ein treibendes und leckendes Ölfass nahebei passiert und an die Verkehrszentrale gemeldet. Auf welcher Position befindet sich das Schiff nach Koppelort zu diesem Zeitpunkt?', antwort: '53° 54,0\' N 007° 54,3\' E', typ: 'koppelort', rwk: 7, speed: 8, zeitMin: 30, startUhr: '08:00' },
      { nr: 7, frage: 'Um 09:00 Uhr wird die Tonne "ST" gepeilt: rwP = 168°. Als Distanz werden 2,0 sm ermittelt. Tragen Sie die rw-Peilung in die Seekarte ein.', antwort: 'rwP = 168°, Distanz 2,0 sm in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 8, frage: 'Wie lautet die Besteckversetzung?', antwort: 'BV = 296° − 0,7 sm', typ: 'bv' },
      { nr: 9, frage: 'Welche Bedeutung hat die Tonne "ST"?', antwort: 'Kennzeichnung der Zufahrt zu Fahrwassern und der Mitte von Schifffahrtswegen (hier: "Alte Weser")', typ: 'info' },
    ],
  },
  {
    id: 13,
    datum: '02.07.2014',
    szenario: 'Ein aus Helgoland ausgelaufenes Sportboot befindet sich am 02.07.2014 auf dem Weg nach Bremerhaven.',
    mw: 1,
    youtubeUrl: 'https://www.youtube.com/watch?v=C2k1ITI2aJg',
    questions: [
      { nr: 1, frage: 'Um 09:00 Uhr werden mit dem Hand-Peilkompass gepeilt. Ablenkung 0°, Mw aus Seekarte.\nTonne "Helgoland-O": MgP = 284°\nTonne "Düne-S": MgP = 008°\nWie lauten die rw-Peilungen?', antwort: 'Tonne "Helgoland-O": rwP = 285°\nTonne "Düne-S": rwP = 009°', typ: 'peilung', peilungen: [{ name: 'Tonne "Helgoland-O"', mgp: 284, dev: 0, mw: 1, rwp: 285 }, { name: 'Tonne "Düne-S"', mgp: 8, dev: 0, mw: 1, rwp: 9 }] },
      { nr: 2, frage: 'Tragen Sie die rechtweisenden Peilungen in die Seekarte ein.', antwort: 'Peilungen in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 3, frage: 'Entnehmen Sie der Seekarte die geographische Position des durch Peilung ermittelten Standortes.', antwort: '54° 08,6\' N 007° 55,7\' E', typ: 'chart' },
      { nr: 4, frage: 'Welche Bedeutung hat die Tonne "Helgoland-O"?', antwort: 'Ost-Kardinal-Zeichen. Zeigt an, dass die Gefahrenstelle im Osten sicher umfahren werden kann.', typ: 'info' },
      { nr: 5, frage: 'Von dem durch Peilung ermittelten Standort wird der Kurs auf die Tonne "ST" abgesetzt. Tragen Sie den Kurs in die Seekarte ein.', antwort: 'Kurs in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 6, frage: 'Wie lautet der rwK?', antwort: 'rwK = 182°', typ: 'chart' },
      { nr: 7, frage: 'Die Ablenkung beträgt +4°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 177°', typ: 'mgk', rwk: 182, dev: 4, mw: 1 },
      { nr: 8, frage: 'Um 09:40 Uhr wird die Tonne "E3" querab passiert. Wie groß ist die Geschwindigkeit des Bootes seit dem durch Peilung bestimmten Standort? (Distanz: 5,0 sm)', antwort: 'FüG = 7,5 kn', typ: 'speed', distanz: 5.0, zeitMin: 40 },
      { nr: 9, frage: 'Beschreiben Sie Farbe, Kennung und Toppzeichen der Tonne "ST".', antwort: 'Farbe: rot-weiß senkrecht gestreift\nKennung: weißes Gleichtaktfeuer mit 8 Sekunden Wiederkehr\nToppzeichen: roter Ball', typ: 'info' },
    ],
  },
  {
    id: 14,
    datum: '31.08.2013',
    szenario: 'Ein Sportboot verlässt am frühen Morgen des 31.08.2013 die Insel Neuwerk mit dem Ziel Husum. Die Fahrt über Grund wird mit 6 kn angegeben.',
    mw: 1,
    youtubeUrl: 'https://www.youtube.com/watch?v=rDwapPdrokQ',
    questions: [
      { nr: 1, frage: 'Beschreiben Sie das Feuer des Leuchtturms Neuwerk.', antwort: 'Blink in 3er Gruppen, weiß-rot-grün. 20 Sekunden Wiederkehr. Feuerträger 38 m hoch. Nenntragweite 16 sm bis 11 sm.', typ: 'info' },
      { nr: 2, frage: 'Erläutern Sie die Bedeutung folgender Hintergrundfarben in der Seekarte: weiß, hellblau, hellgrün und hellgelb.', antwort: 'Weiß: tiefes Wasser\nHellblau: flaches Wasser\nHellgrün: Watt\nHellgelb: Land', typ: 'info' },
      { nr: 3, frage: 'Gegen 07:00 Uhr wird die Tonne "13/Neuwerk-Reede1" nahebei passiert. Entnehmen Sie der Seekarte die geographische Position dieser Tonne.', antwort: '53° 58,4\' N 008° 28,2\' E', typ: 'chart' },
      { nr: 4, frage: 'Von der Tonne "8" wird der Kurs auf die Tonne "Norderelbe" abgesetzt. Tragen Sie den Kurs ab Tonne "8" in die Seekarte ein.', antwort: 'Kurs in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 5, frage: 'Wie lautet der rwK?', antwort: 'rwK = 038°', typ: 'chart' },
      { nr: 6, frage: 'Die Ablenkung beträgt +4°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 033°', typ: 'mgk', rwk: 38, dev: 4, mw: 1 },
      { nr: 7, frage: 'Wie groß ist die Distanz zwischen den Tonnen "8" und "Norderelbe"?', antwort: '3,6 sm', typ: 'chart' },
      { nr: 8, frage: 'Um 08:30 Uhr werden mit dem Peilaufsatz am Magnetkompass gepeilt. Ablenkung +1°, Mw aus Seekarte.\nTonne "Süderpiep": MgP = 020°\nTonne "Norderelbe": MgP = 098°\nWie lauten die rw-Peilungen?', antwort: 'Tonne "Süderpiep": rwP = 022°\nTonne "Norderelbe": rwP = 100°', typ: 'peilung', peilungen: [{ name: 'Tonne "Süderpiep"', mgp: 20, dev: 1, mw: 1, rwp: 22 }, { name: 'Tonne "Norderelbe"', mgp: 98, dev: 1, mw: 1, rwp: 100 }] },
      { nr: 9, frage: 'Tragen Sie die rechtweisenden Peilungen in die Seekarte ein.', antwort: 'Peilungen in die Seekarte eingetragen.', typ: 'karte' },
    ],
  },
  {
    id: 15,
    datum: '20.08.2011',
    szenario: 'Ein Sportboot läuft am 20.08.2011 von der Weser kommend in die Elbmündung.',
    mw: 0,
    youtubeUrl: 'https://www.youtube.com/watch?v=5HojecpCsos',
    questions: [
      { nr: 1, frage: 'Um 09:00 Uhr werden folgende Peilungen ermittelt. Ablenkung +5°, Mw aus Seekarte.\nLeuchtturm "Alte Weser": MgP = 175°\nLeuchtturm "Neuwerk": MgP = 085°\nWie lauten die rw-Peilungen?', antwort: 'Leuchtturm "Alte Weser": rwP = 180°\nLeuchtturm "Neuwerk": rwP = 090°', typ: 'peilung', peilungen: [{ name: 'Leuchtturm "Alte Weser"', mgp: 175, dev: 5, mw: 0, rwp: 180 }, { name: 'Leuchtturm "Neuwerk"', mgp: 85, dev: 5, mw: 0, rwp: 90 }] },
      { nr: 2, frage: 'Tragen Sie die rwP in die Karte ein.', antwort: 'Peilungen in die Seekarte eingetragen.', typ: 'karte' },
      { nr: 3, frage: 'Geben Sie die ermittelte Position nach geographischer Breite und Länge an.', antwort: '53° 54,9\' N 008° 07,6\' E', typ: 'chart' },
      { nr: 4, frage: 'Von dieser Position aus setzen Sie Kurs auf die Tonne "1" des Elbe-Fahrwassers. Wie lautet der rwK?', antwort: 'rwK = 037°', typ: 'chart' },
      { nr: 5, frage: 'Die Ablenkung beträgt −2°, die Mw ist der Seekarte zu entnehmen. Wie lautet der MgK?', antwort: 'MgK = 039°', typ: 'mgk', rwk: 37, dev: -2, mw: 0 },
      { nr: 6, frage: 'Wie groß ist die Distanz zur Tonne "1"?', antwort: '5,4 sm', typ: 'chart' },
      { nr: 7, frage: 'Nach 1,8 sm kreuzt Ihr Kurs eine Eintragung in der Seekarte, die mit "Obstn" beschriftet ist. Was bedeutet diese Eintragung in der Seekarte?', antwort: 'Schifffahrtshindernis mit einer Kartentiefe von 9,7 m', typ: 'info' },
      { nr: 8, frage: 'Beschreiben Sie Farbe, Kennung und Toppzeichen der Tonne "1" des Elbe-Fahrwassers.', antwort: 'Farbe: grün\nKennung: grünes Funkelfeuer\nToppzeichen: grüner Kegel, Spitze oben', typ: 'info' },
      { nr: 9, frage: 'Die Revierzentrale "Cuxhaven Elbe Traffic" meldet drei über Bord gefallene Container in Position 53° 59,6\' N und 008° 23,2\' E. Tragen Sie die Position in die Seekarte ein.', antwort: 'Position 53° 59,6\' N 008° 23,2\' E in die Seekarte eingetragen.', typ: 'karte' },
    ],
  },
];
