// Surf Gym Tracker — training plan & content data.
// Placeholder data carried over from the Claude Design prototype
// (project/Surf Gym Tracker.dc.html) — the original training-plan
// source file was unavailable when this was authored, so exercises,
// sets and dates were reconstructed from context. Replace with the
// real plan whenever it's available.

const EX = [
  { id: 'pull', name: 'Klimmzug / Latzug breit', target: '4 × 6–8 · RPE 7',
    youtube: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    note: 'Der stärkste Paddelzug kommt aus dem Latissimus. Hier baust du die Kraft, die dich durch die Impact Zone bringt.',
    last: 'Körper +5 kg · 4×7', alt: 'Latzug am Kabel',
    cues: ['Schulterblätter zuerst nach unten ziehen, dann erst die Arme beugen', 'Oben zwei Sekunden aushängen, das entlastet die Kapsel', 'Kein Schwung aus der Hüfte, lieber eine Wiederholung weniger'],
    why: 'Paddeln ist zu 80 % Zug. Wer nur drückt, bekommt eine nach vorne rotierte Schulter und paddelt mit halber Leistung.',
    sets: [{ w: 5, r: 8 }, { w: 5, r: 7 }, { w: 5, r: 7 }, { w: 5, r: 6 }] },
  { id: 'row', name: 'Langhantelrudern', target: '3 × 8–10 · RPE 7',
    youtube: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
    note: 'Horizontaler Zug für die mittlere Rückenmuskulatur — der Gegenspieler zur Paddelhaltung.',
    last: '55 kg · 3×9', alt: 'Kurzhantelrudern einarmig',
    cues: ['Rumpf bei etwa 45 Grad, Rücken neutral', 'Zum Bauchnabel ziehen, nicht zur Brust', 'Kein Rucken aus dem unteren Rücken'],
    why: 'Stabilisiert das Schulterblatt beim Aufstehen und beim Abstützen auf dem Board.',
    sets: [{ w: 55, r: 10 }, { w: 55, r: 9 }, { w: 55, r: 8 }] },
  { id: 'face', name: 'Face Pull', target: '3 × 12–15 · RPE 6',
    youtube: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
    note: 'Die Versicherung für die Paddelschulter. Wird nie gestrichen.',
    last: '25 kg · 3×15', alt: 'Band Pull-Apart',
    cues: ['Seil zur Stirn ziehen, Ellenbogen hoch', 'Am Endpunkt außenrotieren, kurz halten', 'Leicht bleiben, das ist kein Kraftwert'],
    why: 'Hintere Schulter und Außenrotatoren bremsen die Paddelbewegung ab. Schwach heißt Impingement.',
    sets: [{ w: 25, r: 15 }, { w: 25, r: 14 }, { w: 25, r: 12 }] },
  { id: 'ext', name: 'Außenrotation am Kabel', target: '2 × 15 · RPE 6',
    youtube: 'https://www.youtube.com/watch?v=b0G_gI27kG8',
    note: 'Kleine Muskeln, große Wirkung. Sauber und langsam.',
    last: '7,5 kg · 2×15', alt: 'Außenrotation mit Miniband',
    cues: ['Ellenbogen am Körper fixieren, Handtuch dazwischen klemmen', 'Nur der Unterarm bewegt sich', 'Drei Sekunden zurück'],
    why: 'Die Rotatorenmanschette hält den Oberarmkopf zentriert — sonst reibt die Sehne bei jedem Paddelzug.',
    sets: [{ w: 7.5, r: 15 }, { w: 7.5, r: 15 }] },
  { id: 'carry', name: 'Farmer Carry', target: '3 × 40 m · RPE 7',
    youtube: 'https://www.youtube.com/watch?v=p5MNNosenJc',
    note: 'Griffkraft und Rumpfstabilität am Stück — überträgt direkt aufs Duckdive.',
    last: '2 × 32 kg', alt: 'Koffergriff einseitig',
    cues: ['Brust auf, Schultern hinten unten', 'Ruhig atmen, nicht pressen', 'Kurze, kontrollierte Schritte'],
    why: 'Ein müder Griff kostet dich die letzten Wellen einer Session.',
    sets: [{ w: 32, r: 40 }, { w: 32, r: 40 }, { w: 32, r: 40 }] },
  { id: 'curl', name: 'Bizepscurl Kurzhantel', target: '2 × 10–12 · RPE 9',
    youtube: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    note: 'Abschlussübung. Als Supersatz, 45 Sekunden Pause.',
    last: '14 kg · 2×11', alt: 'Hammercurl',
    cues: ['Ellenbogen bleibt am Körper', 'Absenken drei Sekunden', 'Hier darf es brennen'],
    why: 'Steht bewusst am Ende der Einheit, wenn die wichtigen Züge schon im Kasten sind.',
    sets: [{ w: 14, r: 12 }, { w: 14, r: 10 }] }
];

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

// Days with a `code` (A1/A2/A3) show a set count computed from EX / BLOCK_A
// at render time, so the number can never drift out of sync with the plan.
const WEEK = [
  { dow: 'Mo', num: 8, state: 'done', title: 'Gym A1 · Zug & Schulter', code: 'A1', note: 'RPE 7', badge: '✓' },
  { dow: 'Di', num: 9, state: 'done', title: 'Surf + Core B', sub: 'Anti-Rotation · 10 min', badge: '✓' },
  { dow: 'Mi', num: 10, state: 'done', title: 'Gym A2 · Beine & Rumpf', code: 'A2', note: 'RPE 7', badge: '✓' },
  { dow: 'Do', num: 11, state: 'today', title: 'Gym A1 · Zug & Schulter', code: 'A1', note: 'heute fällig', badge: 'Start' },
  { dow: 'Fr', num: 12, state: 'open', title: 'Surf + Mobility', sub: 'nur morgens & abends', badge: '—' },
  { dow: 'Sa', num: 13, state: 'open', title: 'Gym A3 · Ganzkörper', code: 'A3', note: 'RPE 7', badge: '—' },
  { dow: 'So', num: 14, state: 'open', title: 'Surf frei', sub: 'Core C · 10 min', badge: '—' }
];

const BLOCK_A = [
  { code: 'A1', meta: 'ca. 40 min', title: 'Zug & Schultergesundheit',
    items: [['Klimmzug / Latzug', '4 × 6–8'], ['Langhantelrudern', '3 × 8–10'], ['Face Pull', '3 × 12–15'], ['Außenrotation', '2 × 15'], ['Farmer Carry', '3 × 40 m'], ['Bizepscurl', '2 × 10–12']] },
  { code: 'A2', meta: 'ca. 40 min', title: 'Beine & Rumpf leicht',
    items: [['Goblet Squat', '3 × 8–10'], ['Rumänisches Kreuzheben', '3 × 8'], ['Ausfallschritt', '3 × 10/Seite'], ['Pallof Press', '3 × 12'], ['Wadenheben', '3 × 15']] },
  { code: 'A3', meta: 'ca. 40 min', title: 'Ganzkörper & Druck',
    items: [['Schrägbankdrücken KH', '3 × 8–10'], ['Einarmiges Rudern', '3 × 10/Seite'], ['Seitheben', '3 × 12–15'], ['Face Pull', '3 × 15'], ['Trizeps Pushdown', '2 × 12']] }
];

const BLOCK_B = [
  { day: 'Montag', title: 'Oberkörper Zug', meta: '~70 min',
    items: [['Klimmzug beschwert', '4 × 5–7'], ['Langhantelrudern', '4 × 6–8'], ['Latzug eng', '3 × 10'], ['Face Pull', '4 × 15'], ['Bizeps Supersatz', '5 × 10–12']] },
  { day: 'Dienstag', title: 'Beine & Explosivität', meta: '~70 min',
    items: [['Kniebeuge', '4 × 5'], ['Box Jump', '4 × 3'], ['Rumänisches Kreuzheben', '3 × 8'], ['Bulgarian Split Squat', '4 × 8/Seite'], ['Waden Supersatz', '5 × 15']] },
  { day: 'Donnerstag', title: 'Oberkörper Druck', meta: '~65 min',
    items: [['Schrägbankdrücken', '4 × 6–8'], ['Schulterdrücken KH', '3 × 8–10'], ['Dips', '3 × 8'], ['Außenrotation', '3 × 15'], ['Trizeps & Seitheben', '5 × 12']] },
  { day: 'Samstag', title: 'Rotation & Pop-up', meta: '~65 min',
    items: [['Landmine Press', '4 × 8/Seite'], ['Medizinball-Wurf', '4 × 6/Seite'], ['Türkisch Aufstehen', '3 × 4/Seite'], ['Hanging Leg Raise', '4 × 10'], ['Unterarme Supersatz', '5 × 15']] }
];

const RECORDS = [
  { name: 'Klimmzug beschwert', when: 'Mo 8.9.', value: '+5 kg × 7', delta: '+1 Wdh.' },
  { name: 'Langhantelrudern', when: 'Mo 8.9.', value: '55 kg × 9', delta: '+2,5 kg' },
  { name: 'Goblet Squat', when: 'Mi 10.9.', value: '32 kg × 10', delta: '+2 Wdh.' },
  { name: 'Farmer Carry', when: 'Mo 8.9.', value: '2 × 32 kg', delta: '+40 m' }
];

// weekly logged working-set volume (KW = Kalenderwoche)
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

// Sums the leading "N ×" set count out of each [name, "N × reps"] item —
// keeps set totals derived from the plan instead of hand-typed anywhere.
function countSetsInItems(items) {
  return items.reduce((sum, [, spec]) => {
    const m = /^(\d+)/.exec(spec);
    return sum + (m ? parseInt(m[1], 10) : 0);
  }, 0);
}

function totalSetsForCode(code) {
  if (code === 'A1') return EX.reduce((sum, ex) => sum + ex.sets.length, 0);
  const block = BLOCK_A.find(b => b.code === code);
  return block ? countSetsInItems(block.items) : 0;
}
