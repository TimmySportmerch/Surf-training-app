// Surf Gym Tracker — training plan & content data.

const UNITS_META = {
  'A1': {
    id: 'A1',
    block: 'A',
    code: 'A1',
    dayTitle: 'Einheit A1 · Zug & Schulter',
    title: 'Zug & Schultergesundheit',
    meta: 'ca. 40 min',
    note: 'RPE-Deckel 7',
    why: 'Gegengewicht zum Paddeln: Der Schultergürtel wird beim Surfen den ganzen Tag nach vorne gezogen — hier ziehst du ihn zurück.'
  },
  'A2': {
    id: 'A2',
    block: 'A',
    code: 'A2',
    dayTitle: 'Einheit A2 · Beine & Rumpf',
    title: 'Beine & Rumpf leicht',
    meta: 'ca. 40 min',
    note: 'RPE-Deckel 7',
    why: 'Stabile Beine und mobile Sprunggelenke für explosive Kompressionen und radikale Richtungswechsel auf der Welle.'
  },
  'A3': {
    id: 'A3',
    block: 'A',
    code: 'A3',
    dayTitle: 'Einheit A3 · Ganzkörper & Druck',
    title: 'Ganzkörper & Druck',
    meta: 'ca. 40 min',
    note: 'RPE-Deckel 7',
    why: 'Brust-, Trizeps- und Rumpfkraft für den blitzschnellen Pop-up und Duckdives durch schwere Sets.'
  },
  'B_mo': {
    id: 'B_mo',
    block: 'B',
    code: 'Mo',
    day: 'Montag',
    dayTitle: 'Montag · Oberkörper Zug',
    title: 'Oberkörper Zug',
    meta: '~70 min',
    note: 'RPE 8 · 25 Sätze',
    why: 'Maximale Zugkraft und Latissimus-Power für Ausdauer auf langen Paddelstrecken und in starker Strömung.'
  },
  'B_di': {
    id: 'B_di',
    block: 'B',
    code: 'Di',
    day: 'Dienstag',
    dayTitle: 'Dienstag · Beine & Explosivität',
    title: 'Beine & Explosivität',
    meta: '~70 min',
    note: 'RPE 8 · 25 Sätze',
    why: 'Explosive Sprungkraft und Standfestigkeit für kraftvolle Turns, Carves und sichere Landungen.'
  },
  'B_do': {
    id: 'B_do',
    block: 'B',
    code: 'Do',
    day: 'Donnerstag',
    dayTitle: 'Donnerstag · Oberkörper Druck',
    title: 'Oberkörper Druck',
    meta: '~65 min',
    note: 'RPE 8 · 25 Sätze',
    why: 'Drückende Muskelkette und Schultergesundheit für Pop-up, Dips und Ausbalancieren.'
  },
  'B_sa': {
    id: 'B_sa',
    block: 'B',
    code: 'Sa',
    day: 'Samstag',
    dayTitle: 'Samstag · Rotation & Pop-up',
    title: 'Rotation & Pop-up',
    meta: '~65 min',
    note: 'RPE 7–8 · 25 Sätze',
    why: 'Rotationspower im Rumpf und Reaktionsschnelligkeit für radikale Bottom- und Top-Turns.'
  }
};

const DEFAULT_UNITS = {
  'A1': [
    {
      id: 'a1_pull',
      name: 'Klimmzug / Latzug breit',
      target: '4 × 6–8 · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
      note: 'Der stärkste Paddelzug kommt aus dem Latissimus. Hier baust du die Kraft, die dich durch die Impact Zone bringt.',
      last: 'Körper +5 kg · 4×7',
      alt: 'Latzug am Kabel',
      cues: ['Schulterblätter zuerst nach unten ziehen, dann erst die Arme beugen', 'Oben zwei Sekunden aushängen, das entlastet die Kapsel', 'Kein Schwung aus der Hüfte, lieber eine Wiederholung weniger'],
      why: 'Paddeln ist zu 80 % Zug. Wer nur drückt, bekommt eine nach vorne rotierte Schulter und paddelt mit halber Leistung.',
      sets: [{ w: 5, r: 8 }, { w: 5, r: 7 }, { w: 5, r: 7 }, { w: 5, r: 6 }]
    },
    {
      id: 'a1_row',
      name: 'Langhantelrudern',
      target: '3 × 8–10 · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
      note: 'Horizontaler Zug für die mittlere Rückenmuskulatur — der Gegenspieler zur Paddelhaltung.',
      last: '55 kg · 3×9',
      alt: 'Kurzhantelrudern einarmig',
      cues: ['Rumpf bei etwa 45 Grad, Rücken neutral', 'Zum Bauchnabel ziehen, nicht zur Brust', 'Kein Rucken aus dem unteren Rücken'],
      why: 'Stabilisiert das Schulterblatt beim Aufstehen und beim Abstützen auf dem Board.',
      sets: [{ w: 55, r: 10 }, { w: 55, r: 9 }, { w: 55, r: 8 }]
    },
    {
      id: 'a1_face',
      name: 'Face Pull',
      target: '3 × 12–15 · RPE 6',
      youtube: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
      note: 'Die Versicherung für die Paddelschulter. Wird nie gestrichen.',
      last: '25 kg · 3×15',
      alt: 'Band Pull-Apart',
      cues: ['Seil zur Stirn ziehen, Ellenbogen hoch', 'Am Endpunkt außenrotieren, kurz halten', 'Leicht bleiben, das ist kein Kraftwert'],
      why: 'Hintere Schulter und Außenrotatoren bremsen die Paddelbewegung ab. Schwach heißt Impingement.',
      sets: [{ w: 25, r: 15 }, { w: 25, r: 14 }, { w: 25, r: 12 }]
    },
    {
      id: 'a1_ext',
      name: 'Außenrotation am Kabel',
      target: '2 × 15 · RPE 6',
      youtube: 'https://www.youtube.com/watch?v=b0G_gI27kG8',
      note: 'Kleine Muskeln, große Wirkung. Sauber und langsam.',
      last: '7,5 kg · 2×15',
      alt: 'Außenrotation mit Miniband',
      cues: ['Ellenbogen am Körper fixieren, Handtuch dazwischen klemmen', 'Nur der Unterarm bewegt sich', 'Drei Sekunden zurück'],
      why: 'Die Rotatorenmanschette hält den Oberarmkopf zentriert — sonst reibt die Sehne bei jedem Paddelzug.',
      sets: [{ w: 7.5, r: 15 }, { w: 7.5, r: 15 }]
    },
    {
      id: 'a1_carry',
      name: 'Farmer Carry',
      target: '3 × 40 m · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=p5MNNosenJc',
      note: 'Griffkraft und Rumpfstabilität am Stück — überträgt direkt aufs Duckdive.',
      last: '2 × 32 kg',
      alt: 'Koffergriff einseitig',
      cues: ['Brust auf, Schultern hinten unten', 'Ruhig atmen, nicht pressen', 'Kurze, kontrollierte Schritte'],
      why: 'Ein müder Griff kostet dich die letzten Wellen einer Session.',
      sets: [{ w: 32, r: 40 }, { w: 32, r: 40 }, { w: 32, r: 40 }]
    },
    {
      id: 'a1_curl',
      name: 'Bizepscurl Kurzhantel',
      target: '2 × 10–12 · RPE 9',
      youtube: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
      note: 'Abschlussübung. Als Supersatz, 45 Sekunden Pause.',
      last: '14 kg · 2×11',
      alt: 'Hammercurl',
      cues: ['Ellenbogen bleibt am Körper', 'Absenken drei Sekunden', 'Hier darf es brennen'],
      why: 'Steht bewusst am Ende der Einheit, wenn die wichtigen Züge schon im Kasten sind.',
      sets: [{ w: 14, r: 12 }, { w: 14, r: 10 }]
    }
  ],

  'A2': [
    {
      id: 'a2_squat',
      name: 'Goblet Squat',
      target: '3 × 8–10 · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=MeIiIdhvXT4',
      note: 'Tiefe Hocke mit aufrechtem Rumpf für Beweglichkeit in Sprunggelenk und Hüfte.',
      last: '28 kg · 3×10',
      alt: 'Frontkniebeuge mit Kurzhanteln',
      cues: ['Ellenbogen zeigen nach unten', 'Knie schieben aktiv in Richtung Fußspitzen', 'Fersen fest auf dem Boden verankern'],
      why: 'Grundlage für tiefen Schwerpunkt und Kompression bei Bottom Turns.',
      sets: [{ w: 24, r: 10 }, { w: 24, r: 10 }, { w: 24, r: 8 }]
    },
    {
      id: 'a2_rdl',
      name: 'Rumänisches Kreuzheben',
      target: '3 × 8 · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=jEy_czb3RKA',
      note: 'Hintere Kette stärken: Beinbeuger und Gesäß stabilisieren Knie und Lendenwirbelsäule.',
      last: '55 kg · 3×8',
      alt: 'Kurzhantel RDL',
      cues: ['Hüfte weit nach hinten schieben', 'Stange eng an den Beinen führen', 'Rücken absolut neutral halten'],
      why: 'Schützt den unteren Rücken vor Ermüdung und Schmerzen im Hohlkreuz beim stundenlangen Paddeln.',
      sets: [{ w: 50, r: 8 }, { w: 50, r: 8 }, { w: 50, r: 8 }]
    },
    {
      id: 'a2_lunge',
      name: 'Ausfallschritt rückwärts',
      target: '3 × 10/Seite · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
      note: 'Einbeinige Stabilität und Gleichgewichtskontrolle unter Last.',
      last: '2 × 14 kg · 3×10',
      alt: 'Walking Lunges',
      cues: ['Großer Schritt zurück', 'Vorderes Knie stabil über dem Sprunggelenk', 'Rumpf leicht nach vorne geneigt'],
      why: 'Auf dem Surfboard stehst du versetzt. Einbeinige Kraft verhindert Dysbalancen.',
      sets: [{ w: 14, r: 10 }, { w: 14, r: 10 }, { w: 14, r: 10 }]
    },
    {
      id: 'a2_pallof',
      name: 'Pallof Press',
      target: '3 × 12 · RPE 6',
      youtube: 'https://www.youtube.com/watch?v=AH_QZLm_0-s',
      note: 'Anti-Rotation am Kabel oder Widerstandsband. Rumpf bombenfest halten.',
      last: '12,5 kg · 3×12',
      alt: 'Band Anti-Rotation',
      cues: ['Hüfte und Schultern parallel halten', '2 Sekunden vorne halten', 'Gleichmäßig atmen'],
      why: 'Widersteht unberechenbaren Rotationskräften bei unruhigen Wellen und Chop.',
      sets: [{ w: 12.5, r: 12 }, { w: 12.5, r: 12 }, { w: 12.5, r: 12 }]
    },
    {
      id: 'a2_calf',
      name: 'Wadenheben stehend',
      target: '3 × 15 · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
      note: 'Volle Dehnung an der Kante unten, 1 Sekunde Pause oben auf den Zehenspitzen.',
      last: '35 kg · 3×15',
      alt: 'Einbeiniges Wadenheben mit Kurzhantel',
      cues: ['Voller Bewegungsumfang', 'Kein Wippen mit Schwung', 'Oben maximal kontrahieren'],
      why: 'Füße und Sprunggelenke übertragen jede Millimeter-Gewichtsverlagerung auf die Finnen.',
      sets: [{ w: 30, r: 15 }, { w: 30, r: 15 }, { w: 30, r: 15 }]
    }
  ],

  'A3': [
    {
      id: 'a3_incline',
      name: 'Schrägbankdrücken KH',
      target: '3 × 8–10 · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
      note: 'Bank auf ca. 30 Grad. Drückbewegung schont die Schultergelenke und aktiviert die obere Brust.',
      last: '2 × 22 kg · 3×9',
      alt: 'Liegestütze mit Zusatzgewicht',
      cues: ['Schulterblätter fest auf die Bank ziehen', 'Ellenbogen im 45-Grad-Winkel führen', 'Kontrolliertes Ablassen'],
      why: 'Direkte Kraft für den Pop-up: Explosives Wegdrücken vom Board.',
      sets: [{ w: 20, r: 10 }, { w: 20, r: 9 }, { w: 20, r: 8 }]
    },
    {
      id: 'a3_dbrow',
      name: 'Einarmiges Rudern KH',
      target: '3 × 10/Seite · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=dFzUjzfih7k',
      note: 'Auf Bank abgestützt, Hantel in weitem Bogen zur Hüfte führen.',
      last: '24 kg · 3×10',
      alt: 'Kabelrudern einarmig',
      cues: ['Schulterblatt zuerst bewegen', 'Rumpf parallel zur Bank halten', 'Nicht mit Schwung aufdrehen'],
      why: 'Einarmiger Zug gleicht Asymmetrien im Paddelmuster aus.',
      sets: [{ w: 22, r: 10 }, { w: 22, r: 10 }, { w: 22, r: 10 }]
    },
    {
      id: 'a3_lateral',
      name: 'Seitheben KH',
      target: '3 × 12–15 · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=3VcKaXpzqRo`',
      youtube: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
      note: 'Leicht vorgebeugt stehen, Ellenbogen führen die Aufwärtsbewegung an.',
      last: '2 × 9 kg · 3×13',
      alt: 'Seitheben am Kabelzug',
      cues: ['Ellenbogen leicht angewinkelt', 'Nicht über Schulterhöhe heben', 'Drei Sekunden langsam absenken'],
      why: 'Seitliche Deltoiden stabilisieren das Schultergelenk bei Stürzen und Wipeouts.',
      sets: [{ w: 8, r: 14 }, { w: 8, r: 13 }, { w: 8, r: 12 }]
    },
    {
      id: 'a3_face',
      name: 'Face Pull',
      target: '3 × 15 · RPE 6',
      youtube: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
      note: 'Die tägliche Dosis Schultergesundheit für Surfer.',
      last: '25 kg · 3×15',
      alt: 'Band Pull-Apart',
      cues: ['Seil zur Stirn ziehen', 'Ellenbogen hoch und weit nach hinten', 'Halten am Endpunkt'],
      why: 'Hält die Schulterkapsel gesund und verhindert Impingement.',
      sets: [{ w: 25, r: 15 }, { w: 25, r: 15 }, { w: 25, r: 15 }]
    },
    {
      id: 'a3_tri',
      name: 'Trizeps Pushdown am Kabel',
      target: '2 × 12 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
      note: 'Seilzug oben, Ellenbogen bleiben fest am Rippenbogen.',
      last: '22,5 kg · 2×12',
      alt: 'Dips an der Bank',
      cues: ['Nur die Unterarme bewegen', 'Unten Seilenden auseinanderziehen', 'Volle Streckung spüren'],
      why: 'Letzte Streckung der Arme beim Pop-up und Duckdive-Eintauchen.',
      sets: [{ w: 20, r: 12 }, { w: 20, r: 12 }]
    }
  ],

  'B_mo': [
    {
      id: 'b_mo_pull',
      name: 'Klimmzug beschwert',
      target: '4 × 5–7 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
      note: 'Zusatzgewicht am Gürtel. Maximale Paddelkraft für große Wellen.',
      last: '+10 kg · 4×6',
      alt: 'Schwerer Latzug breit',
      cues: ['Voller Bewegungsumfang', 'Oben Brust zur Stange', 'Kontrolliertes Absenken'],
      why: 'Maximale Zugkraft für schnelles Paddeln gegen die Strömung.',
      sets: [{ w: 10, r: 6 }, { w: 10, r: 6 }, { w: 10, r: 5 }, { w: 10, r: 5 }]
    },
    {
      id: 'b_mo_row',
      name: 'Langhantelrudern',
      target: '4 × 6–8 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
      note: 'Schwere Wiederholungen für den oberen Rücken und Latissimus.',
      last: '60 kg · 4×7',
      alt: 'T-Bar Rudern',
      cues: ['Stabile Rumpfspannung', 'Zur Hüfte ziehen', 'Ellenbogen eng am Körper'],
      why: 'Verleiht dem Rücken die nötige Dichte für lange Sessions.',
      sets: [{ w: 60, r: 7 }, { w: 60, r: 7 }, { w: 60, r: 6 }, { w: 60, r: 6 }]
    },
    {
      id: 'b_mo_latclose',
      name: 'Latzug eng im Untergriff',
      target: '3 × 10 · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=apZ_n54p-wU',
      note: 'Untergriff dehnt den Latissimus maximal vor.',
      last: '55 kg · 3×10',
      alt: 'Klimmzüge im Untergriff',
      cues: ['Volle Dehnung oben', 'Zur oberen Brust ziehen', 'Kurz halten'],
      why: 'Beansprucht den unteren Latissimus für die Paddelendphase.',
      sets: [{ w: 55, r: 10 }, { w: 55, r: 10 }, { w: 55, r: 9 }]
    },
    {
      id: 'b_mo_face',
      name: 'Face Pull',
      target: '4 × 15 · RPE 6',
      youtube: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
      note: 'Vier Sätze für maximale Schulterprävention.',
      last: '27,5 kg · 4×15',
      alt: 'Kabelaußenrotation',
      cues: ['Saubere Außenrotation', 'Kein Schwung aus den Beinen', 'Brennen spüren'],
      why: 'Schützt vor Überlastung durch das hohe Volumen in Block B.',
      sets: [{ w: 27.5, r: 15 }, { w: 27.5, r: 15 }, { w: 27.5, r: 14 }, { w: 27.5, r: 14 }]
    },
    {
      id: 'b_mo_biceps',
      name: 'Bizeps Supersatz',
      target: '5 × 10–12 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
      note: 'Kurzhantel-Curls und Hammercurls im Wechsel mit kurzen Pausen.',
      last: '14 kg · 5×11',
      alt: 'Kabelcurls mit Stange',
      cues: ['Saubere Form bis zum Schluss', 'Ellenbogen bleiben fixiert', '45 s Pause'],
      why: 'Stärkt Bizeps und Brachialis für Beugung unter Wasser.',
      sets: [{ w: 14, r: 12 }, { w: 14, r: 11 }, { w: 14, r: 10 }, { w: 14, r: 10 }, { w: 14, r: 10 }]
    }
  ],

  'B_di': [
    {
      id: 'b_di_squat',
      name: 'Kniebeuge mit Langhantel',
      target: '4 × 5 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=gcNh17Ckjgg',
      note: 'Schwere Kniebeugen für maximale Beinkraft.',
      last: '70 kg · 4×5',
      alt: 'Beinpresse schwer',
      cues: ['Tief in die Hocke', 'Brust stolz halten', 'Explosiv hochdrücken'],
      why: 'Kraft für radikale Kompressionen auf steilen Wellenwänden.',
      sets: [{ w: 70, r: 5 }, { w: 70, r: 5 }, { w: 70, r: 5 }, { w: 70, r: 5 }]
    },
    {
      id: 'b_di_boxjump',
      name: 'Box Jump explosiv',
      target: '4 × 3',
      youtube: 'https://www.youtube.com/watch?v=52r_Ul5k03g',
      note: 'Explosiver Sprung auf Box, sanfte Landung.',
      last: 'Box 60 cm · 4×3',
      alt: 'Strecksprung aus der Hocke',
      cues: ['Vollkommene Streckung in Hüfte und Knien', 'Weich wie eine Katze landen', 'Kurze Bodenkontaktzeit'],
      why: 'Schult die Schnellkraft der Beinmuskeln für den Pop-up.',
      sets: [{ w: 0, r: 3 }, { w: 0, r: 3 }, { w: 0, r: 3 }, { w: 0, r: 3 }]
    },
    {
      id: 'b_di_rdl',
      name: 'Rumänisches Kreuzheben',
      target: '3 × 8 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=jEy_czb3RKA',
      note: 'Schwere RDLs für die Beinbeuger.',
      last: '65 kg · 3×8',
      alt: 'Beinbeuger-Maschine',
      cues: ['Maximale Dehnung im Beinbeuger', 'Rücken gerade wie ein Brett', 'Gesäß anspannen'],
      why: 'Gegengewicht zur Oberschenkelvorderseite, schützt das Knie.',
      sets: [{ w: 65, r: 8 }, { w: 65, r: 8 }, { w: 65, r: 8 }]
    },
    {
      id: 'b_di_bulgarian',
      name: 'Bulgarian Split Squat',
      target: '4 × 8/Seite · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
      note: 'Hinterer Fuß erhöht auf der Bank abgelegt.',
      last: '2 × 16 kg · 4×8',
      alt: 'Ausfallschritte mit KH',
      cues: ['Tief absenken', 'Vorderer Fuß fest verankert', 'Balance halten'],
      why: 'Baut einbeinige Power und Gleichgewicht im Surf-Stance auf.',
      sets: [{ w: 16, r: 8 }, { w: 16, r: 8 }, { w: 16, r: 8 }, { w: 16, r: 8 }]
    },
    {
      id: 'b_di_calf',
      name: 'Waden Supersatz',
      target: '5 × 15 · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
      note: 'Stehend und sitzend im Wechsel für Soleus und Gastrocnemius.',
      last: '35 kg · 5×15',
      alt: 'Wadenheben an der Beinpresse',
      cues: ['Langsame exzentrische Phase', 'Oben halten', 'Voller Bewegungsumfang'],
      why: 'Stabile Sprunggelenke verhindern Umknicken auf unruhigem Board.',
      sets: [{ w: 35, r: 15 }, { w: 35, r: 15 }, { w: 35, r: 15 }, { w: 35, r: 15 }, { w: 35, r: 15 }]
    }
  ],

  'B_do': [
    {
      id: 'b_do_incline',
      name: 'Schrägbankdrücken Langhantel',
      target: '4 × 6–8 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
      note: 'Schwere Drückübung für obere Brust und vordere Schulter.',
      last: '55 kg · 4×7',
      alt: 'Schrägbankdrücken mit Kurzhanteln',
      cues: ['Schulterblätter zusammengezogen', 'Stange zur oberen Brust führen', 'Kraftvoll nach oben stoßen'],
      why: 'Hauptkraft für das Wegstoßen vom Board im Wellental.',
      sets: [{ w: 55, r: 8 }, { w: 55, r: 7 }, { w: 55, r: 6 }, { w: 55, r: 6 }]
    },
    {
      id: 'b_do_ohp',
      name: 'Schulterdrücken KH sitzend',
      target: '3 × 8–10 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
      note: 'Aufrechte Rückenlehne, Hanteln über Kopf drücken.',
      last: '2 × 18 kg · 3×9',
      alt: 'Military Press stehend',
      cues: ['Unterarme vertikal führen', 'Rumpf angespannt lassen', 'Nicht ins Hohlkreuz kippen'],
      why: 'Überkopf-Stabilität bei Waschgängen und Duckdives.',
      sets: [{ w: 18, r: 10 }, { w: 18, r: 9 }, { w: 18, r: 8 }]
    },
    {
      id: 'b_do_dips',
      name: 'Dips am Barren',
      target: '3 × 8 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
      note: 'Körpergewicht oder mit Zusatzgewicht. Brust leicht vorgebeugt.',
      last: 'Körper · 3×8',
      alt: 'Dips an der Maschine / Bank',
      cues: ['Bis 90 Grad im Ellenbogen absenken', 'Schultern tief lassen', 'Kontrolliert hochdrücken'],
      why: 'Trizeps- und Brustkraft für den tiefen Duckdive-Eintauchimpuls.',
      sets: [{ w: 0, r: 8 }, { w: 0, r: 8 }, { w: 0, r: 7 }]
    },
    {
      id: 'b_do_ext',
      name: 'Außenrotation am Kabel',
      target: '3 × 15 · RPE 6',
      youtube: 'https://www.youtube.com/watch?v=b0G_gI27kG8',
      note: 'Präzise Rotatorenmanschetten-Stärkung.',
      last: '7,5 kg · 3×15',
      alt: 'Miniband Außenrotation',
      cues: ['Ellenbogen 90 Grad angewinkelt', 'Handtuch an die Rippen klemmen', 'Kein Mitschwingen'],
      why: 'Schützt die Sehne des Supraspinatus vor Entzündungen.',
      sets: [{ w: 7.5, r: 15 }, { w: 7.5, r: 15 }, { w: 7.5, r: 15 }]
    },
    {
      id: 'b_do_super',
      name: 'Trizeps & Seitheben Supersatz',
      target: '5 × 12 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
      note: 'Kabel-Pushdowns und Kurzhantel-Seitheben im direkten Wechsel.',
      last: '15 kg / 8 kg · 5×12',
      alt: 'Trizeps Kickbacks & Seitheben',
      cues: ['Brennen aushalten', 'Saubere Technik ohne Schwung', '45 s Pause nach dem Paar'],
      why: 'Volles Arm- und Schultervolumen für die Belastungen in Block B.',
      sets: [{ w: 15, r: 12 }, { w: 15, r: 12 }, { w: 15, r: 12 }, { w: 15, r: 11 }, { w: 15, r: 10 }]
    }
  ],

  'B_sa': [
    {
      id: 'b_sa_landmine',
      name: 'Landmine Press mit Rotation',
      target: '4 × 8/Seite · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=1b57vH8bXW8',
      note: 'Langhantel in Landmine-Halterung. Diagonale Drück- und Rotationsbewegung.',
      last: '+15 kg · 4×8',
      alt: 'Kabeldrücken mit Rumpfdrehung',
      cues: ['Kraft startet aus den Beinen und der Hüfte', 'Rumpf dreht dynamisch mit', 'Endstreckung im Arm'],
      why: '1:1 Übertrag auf die Drehung der Schultern und Arme bei Carves und Cutbacks.',
      sets: [{ w: 15, r: 8 }, { w: 15, r: 8 }, { w: 15, r: 8 }, { w: 15, r: 8 }]
    },
    {
      id: 'b_sa_medball',
      name: 'Medizinball-Wurf rotierend',
      target: '4 × 6/Seite',
      youtube: 'https://www.youtube.com/watch?v=P3mQ5s0i2yI',
      note: 'Seitlich zur Wand stehen und Ball explosiv aus der Hüfte werfen.',
      last: '6 kg Ball · 4×6',
      alt: 'Kabel-Woodchopper explosiv',
      cues: ['Maximale Beschleunigung', 'Hinteren Fuß eindrehen', 'Sicher fangen und wiederholen'],
      why: 'Entwickelt Schnellkraft für den explosiven Snap am Wellenkamm.',
      sets: [{ w: 6, r: 6 }, { w: 6, r: 6 }, { w: 6, r: 6 }, { w: 6, r: 6 }]
    },
    {
      id: 'b_sa_tgu',
      name: 'Türkisch Aufstehen (TGU)',
      target: '3 × 4/Seite · RPE 7',
      youtube: 'https://www.youtube.com/watch?v=0bWRPC49-KI',
      note: 'Kettlebell oder Kurzhantel senkrecht über Kopf balancieren beim Aufstehen.',
      last: '12 kg · 3×4',
      alt: 'Halber TGU bis zur Brücke',
      cues: ['Blick bleibt immer auf der Hantel', 'Arm bleibt durchgestreckt verriegelt', 'Jede Position bewusst halten'],
      why: 'Perfektioniert Körperbeherrschung, Schulterstabilität und Aufstehmuster.',
      sets: [{ w: 12, r: 4 }, { w: 12, r: 4 }, { w: 12, r: 4 }]
    },
    {
      id: 'b_sa_legraise',
      name: 'Hanging Leg Raise',
      target: '4 × 10 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=hdng3Nm1x_E',
      note: 'An der Klimmzugstange hängend Beine gestreckt oder gebeugt anheben.',
      last: 'Körper · 4×10',
      alt: 'Liegendes Beinheben',
      cues: ['Kein Schwung aus den Schultern', 'Becken aktiv einrollen', 'Kontrolliertes Ablassen'],
      why: 'Hüftbeuger und untere Bauchmuskeln ziehen die Beine im Pop-up nach vorne.',
      sets: [{ w: 0, r: 10 }, { w: 0, r: 10 }, { w: 0, r: 9 }, { w: 0, r: 8 }]
    },
    {
      id: 'b_sa_forearms',
      name: 'Unterarme & Griffkraft Supersatz',
      target: '5 × 15 · RPE 8',
      youtube: 'https://www.youtube.com/watch?v=p5MNNosenJc',
      note: 'Wrist Curls und Dead Hangs an der Stange.',
      last: '12 kg · 5×15',
      alt: 'Farmer Carry mit dicken Griffen',
      cues: ['Volle Kontraktion in den Handgelenken', 'Letzter Satz Hang auf Zeit', 'Griff fest schließen'],
      why: 'Eiserner Grip verhindert, dass dir das Board im Weißwasser aus den Händen gerissen wird.',
      sets: [{ w: 12, r: 15 }, { w: 12, r: 15 }, { w: 12, r: 15 }, { w: 12, r: 14 }, { w: 12, r: 12 }]
    }
  ]
};

// Legacy compatibility aliases
const EX = DEFAULT_UNITS.A1;

const CYCLES = [
  { eyebrow: 'Zyklus A · heute', title: 'Anti-Extension', today: true,
    items: [['Plank', '3 × 45 s'], ['Dead Bug', '3 × 10/Seite'], ['Hollow Hold', '3 × 20 s']] },
  { eyebrow: 'Zyklus B · morgen', title: 'Anti-Rotation', today: false,
    items: [['Pallof Press', '3 × 12/Seite'], ['Side Plank', '3 × 30 s/Seite'], ['Bird Dog', '3 × 10/Seite']] },
  { eyebrow: 'Zyklus C · übermorgen', title: 'Beugung & Hüfte', today: false,
    items: [['Hanging Knee Raise', '3 × 12'], ['Reverse Crunch', '3 × 15'], ['Hip Bridge', '3 × 15']] }
];

const MOB = [
  { eyebrow: 'Morgens · 5 min', title: 'Aufwachen',
    items: [['Katze-Kuh', '8 Wdh.'], ['Weltbeste Dehnung', '5 / Seite'], ['Hüftbeuger-Lunge', '30 s / Seite'], ['Brustwirbel-Rotation', '8 / Seite'], ['Schulterkreisen', '10 Wdh.']] },
  { eyebrow: 'Abends · 8 min', title: 'Runterkommen',
    items: [['Kindhaltung mit Reach', '60 s'], ['Brustöffner Türrahmen', '45 s / Seite'], ['Taubenhaltung', '60 s / Seite'], ['Sleeper Stretch', '30 s / Seite'], ['Waden an der Wand', '45 s / Seite']] }
];

const WEEK = [
  { dow: 'Mo', num: 8, state: 'done', title: 'Gym A1 · Zug & Schulter', code: 'A1', note: 'RPE 7', badge: '✓' },
  { dow: 'Di', num: 9, state: 'done', title: 'Surf + Core B', sub: 'Anti-Rotation · 10 min', badge: '✓' },
  { dow: 'Mi', num: 10, state: 'done', title: 'Gym A2 · Beine & Rumpf', code: 'A2', note: 'RPE 7', badge: '✓' },
  { dow: 'Do', num: 11, state: 'today', title: 'Gym A1 · Zug & Schulter', code: 'A1', note: 'heute fällig', badge: 'Start' },
  { dow: 'Fr', num: 12, state: 'open', title: 'Surf + Mobility', sub: 'nur morgens & abends', badge: '—' },
  { dow: 'Sa', num: 13, state: 'open', title: 'Gym A3 · Ganzkörper', code: 'A3', note: 'RPE 7', badge: '—' },
  { dow: 'So', num: 14, state: 'open', title: 'Surf frei', sub: 'Core C · 10 min', badge: '—' }
];

const BLOCK_A_META = [
  { code: 'A1', meta: 'ca. 40 min', title: 'Zug & Schultergesundheit', unitId: 'A1' },
  { code: 'A2', meta: 'ca. 40 min', title: 'Beine & Rumpf leicht', unitId: 'A2' },
  { code: 'A3', meta: 'ca. 40 min', title: 'Ganzkörper & Druck', unitId: 'A3' }
];

const BLOCK_B_META = [
  { day: 'Montag', title: 'Oberkörper Zug', meta: '~70 min', unitId: 'B_mo' },
  { day: 'Dienstag', title: 'Beine & Explosivität', meta: '~70 min', unitId: 'B_di' },
  { day: 'Donnerstag', title: 'Oberkörper Druck', meta: '~65 min', unitId: 'B_do' },
  { day: 'Samstag', title: 'Rotation & Pop-up', meta: '~65 min', unitId: 'B_sa' }
];

const RECORDS = [
  { name: 'Klimmzug beschwert', when: 'Mo 8.9.', value: '+5 kg × 7', delta: '+1 Wdh.' },
  { name: 'Langhantelrudern', when: 'Mo 8.9.', value: '55 kg × 9', delta: '+2,5 kg' },
  { name: 'Goblet Squat', when: 'Mi 10.9.', value: '32 kg × 10', delta: '+2 Wdh.' },
  { name: 'Farmer Carry', when: 'Mo 8.9.', value: '2 × 32 kg', delta: '+40 m' }
];

const BARS = [
  { label: 'KW31', total: 30 }, { label: 'KW32', total: 38 }, { label: 'KW33', total: 34 },
  { label: 'KW34', total: 46 }, { label: 'KW35', total: 42 }, { label: 'KW36', total: 28 }
];

const GEAR = ['Langhantel', 'Kurzhanteln bis 40 kg', 'Kabelzug', 'Klimmzugstange', 'Latzug', 'Beinpresse', 'Medizinball', 'Bänder'];

const SETTINGS_DEF = [
  { label: 'Pausentimer vorschlagen', hint: '90 s nach jedem Satz, manuell starten' },
  { label: 'RPE abfragen', hint: 'pro Satz, Deckel bei 8 in Block A' },
  { label: 'Kilogramm in 1-kg-Schritten', hint: 'sonst 2,5 kg Oberkörper / 5 kg Beine' },
  { label: 'Erinnerung Mobility abends', hint: 'täglich 21:00 Uhr' }
];
