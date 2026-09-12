// Surf Gym Tracker — app logic & rendering (vanilla JS, no build step).

const STORAGE_KEY = 'surfGymTracker.v1';

function defaultState() {
  return {
    screen: 'home', planTab: 'w', coreTab: 'core', detailId: 'pull',
    sets: {}, coreDone: false, mobDone: { 0: true, 1: false },
    settings: { 0: true, 1: true, 2: false, 3: true },
    rest: null, restLeft: 0, restRunning: false
  };
}

function loadState() {
  const defaults = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    // never resume a running timer across a reload — user restarts it explicitly
    return { ...defaults, ...saved, restRunning: false };
  } catch {
    return defaults;
  }
}

let state = loadState();
let restInterval = null;

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function setState(patch) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p };
  saveState();
  renderAll();
}

function currentExercise() {
  return EX.find(e => e.id === state.detailId) || EX[0];
}

/* ---------- set tracking ---------- */

function getSet(exId, i, base) {
  const v = state.sets[exId + '-' + i] || {};
  return {
    w: v.w !== undefined ? v.w : base.w,
    r: v.r !== undefined ? v.r : base.r,
    rpe: v.rpe !== undefined ? v.rpe : 7,
    done: !!v.done
  };
}

function setKey(exId, i, patch) {
  const k = exId + '-' + i;
  setState(s => {
    const cur = s.sets[k] || {};
    return { sets: { ...s.sets, [k]: { ...cur, ...patch } } };
  });
}

function onWUp(exId, i, v) {
  const step = exId === 'carry' ? 4 : 2.5;
  setKey(exId, i, { w: +(v.w + step).toFixed(1) });
}
function onWDown(exId, i, v) {
  const step = exId === 'carry' ? 4 : 2.5;
  setKey(exId, i, { w: Math.max(0, +(v.w - step).toFixed(1)) });
}
function onReps(exId, i, v) {
  const max = exId === 'carry' ? 60 : 20;
  const min = exId === 'carry' ? 20 : 4;
  const step = exId === 'carry' ? 10 : 1;
  setKey(exId, i, { r: v.r >= max ? min : v.r + step });
}
function onRpe(exId, i, v) {
  setKey(exId, i, { rpe: v.rpe >= 10 ? 6 : v.rpe + 1 });
}
function onToggle(exId, i, v) {
  setKey(exId, i, { done: !v.done });
  if (!v.done) setState({ rest: 90, restLeft: 90, restRunning: false });
}

function sessionProgress() {
  let done = 0, total = 0;
  EX.forEach(ex => ex.sets.forEach((b, i) => {
    total++;
    if (getSet(ex.id, i, b).done) done++;
  }));
  return { done, total };
}

/* ---------- rest timer ---------- */

function tick() {
  clearInterval(restInterval);
  restInterval = setInterval(() => {
    if (!state.restRunning) return;
    if (state.restLeft <= 1) {
      clearInterval(restInterval);
      setState({ restLeft: 0, restRunning: false });
      return;
    }
    setState({ restLeft: state.restLeft - 1 });
  }, 1000);
}

function restPrimary() {
  if (state.restRunning) {
    clearInterval(restInterval);
    setState({ restRunning: false });
  } else {
    setState(s => ({ restRunning: true, restLeft: s.restLeft === 0 ? 90 : s.restLeft }));
    tick();
  }
}
function restDismiss() {
  clearInterval(restInterval);
  setState({ rest: null, restRunning: false, restLeft: 0 });
}

/* ---------- navigation ---------- */

function go(screen) { setState({ screen }); }
function back() {
  setState(s => ({ screen: s.screen === 'detail' ? 'session' : 'home' }));
}

/* ---------- header ---------- */

const HEAD_MAP = {
  session: ['Freitag 11.9. · Block A', 'Einheit A1'],
  plan: ['Trainingsplan', 'Plan'],
  core: ['Täglich · 10 Minuten', 'Core & Mobility'],
  verlauf: ['Seit KW 31', 'Fortschritt'],
  profil: ['Konto', 'Profil & Einstellungen']
};

function renderHeader() {
  if (state.screen === 'home') {
    return `
      <div class="header">
        <div class="header-top">
          <div class="header-titles">
            <div class="eyebrow eyebrow-yellow">Block A · Wasserphase · Woche 1</div>
            <div class="page-title">Freitag 11.9.</div>
          </div>
          <button class="avatar-btn" data-action="nav" data-screen="profil">JS</button>
        </div>
        <div class="header-stats">
          <div class="stat-box"><div class="stat-label">Bis Block B</div><div class="stat-value">17 Tage</div></div>
          <div class="stat-box"><div class="stat-label">Gym diese Woche</div><div class="stat-value">1 / 3</div></div>
        </div>
      </div>`;
  }
  const [eyebrow, title] = state.screen === 'detail'
    ? ['Übungsdetail', currentExercise().name]
    : (HEAD_MAP[state.screen] || ['', '']);
  return `
    <div class="header header-sub">
      <button class="back-btn" data-action="back">‹</button>
      <div class="header-titles">
        <div class="eyebrow eyebrow-yellow eyebrow-sm">${eyebrow}</div>
        <div class="page-title page-title-sm">${title}</div>
      </div>
    </div>`;
}

/* ---------- content ---------- */

function renderContent() {
  switch (state.screen) {
    case 'session': return renderSession();
    case 'detail': return renderDetail();
    case 'plan': return renderPlan();
    case 'core': return renderCore();
    case 'verlauf': return renderVerlauf();
    case 'profil': return renderProfil();
    default: return renderHome();
  }
}

function renderRecordRow(r) {
  return `
    <div class="record-row">
      <div style="flex:1;min-width:0">
        <div class="record-name">${r.name}</div>
        <div class="record-when">${r.when}</div>
      </div>
      <div>
        <div class="record-value">${r.value}</div>
        <div class="record-delta">${r.delta}</div>
      </div>
    </div>`;
}

function renderHome() {
  const totalSets = totalSetsForCode('A1');
  const { done } = sessionProgress();
  const startLabel = done > 0 ? 'Einheit fortsetzen' : 'Einheit starten';
  return `
    <div class="stack">
      <div class="card-emphasis">
        <div class="cmd-body">
          <div class="cmd-tags">
            <span class="cmd-badge">Heute · A1</span>
            <span class="cmd-meta">ca. 40 min · ${totalSets} Sätze</span>
          </div>
          <div class="cmd-title">Zug &amp; Schulter&shy;gesundheit</div>
          <p class="cmd-note">Gegengewicht zum Paddeln: Der Schultergürtel wird beim Surfen den ganzen Tag nach vorne gezogen — hier ziehst du ihn zurück.</p>
          <div class="cmd-foot"><span>RPE-Deckel 7</span><span>6 Übungen</span></div>
        </div>
        <button class="btn-block-red" data-action="start-session">${startLabel}</button>
      </div>

      <div class="card">
        <div class="card-head">
          <div class="card-title">Wochenraster</div>
          <button class="link-btn" data-action="nav" data-screen="plan">Ganze Woche ›</button>
        </div>
        <div class="week-grid">
          ${WEEK.map(d => `
            <div class="day-cell ${d.state}">
              <div class="dow">${d.dow}</div>
              <div class="num">${d.num}</div>
              <div class="dot" style="background:${d.state === 'done' ? 'var(--success)' : d.state === 'today' ? '#fff' : 'var(--sm-grey-400)'}"></div>
            </div>`).join('')}
        </div>
        <div class="legend">
          <span><i style="background:var(--success)"></i>erledigt</span>
          <span><i style="background:var(--sm-red)"></i>heute</span>
          <span><i style="background:var(--sm-grey-400)"></i>offen</span>
        </div>
      </div>

      <div class="card-yellow">
        <div class="card-head">
          <div class="card-title-inv">Täglich-Streak</div>
          <button class="pill-btn" data-action="nav" data-screen="core">Öffnen</button>
        </div>
        <div class="streak-row">
          <div class="streak-box">
            <div class="streak-label">Core · Zyklus A</div>
            <div class="streak-value">${state.coreDone ? 5 : 4} Tage</div>
            <div class="streak-sub">${state.coreDone ? 'heute erledigt' : 'heute noch offen'}</div>
          </div>
          <div class="streak-box">
            <div class="streak-label">Mobility</div>
            <div class="streak-value">6 Tage</div>
            <div class="streak-sub">${state.mobDone[1] ? 'komplett erledigt' : 'abends offen'}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <div class="card-title">Letzte Bestwerte</div>
          <button class="link-btn" data-action="nav" data-screen="verlauf">Verlauf ›</button>
        </div>
        <div>${RECORDS.map(renderRecordRow).join('')}</div>
      </div>
    </div>`;
}

function renderSetRow(ex, i, base) {
  const v = getSet(ex.id, i, base);
  const unit = ex.id === 'carry' ? ' m' : ' Wdh.';
  const weightLabel = String(v.w).replace('.', ',') + ' kg';
  return `
    <div class="set-row ${v.done ? 'done' : ''}">
      <div class="set-num">${i + 1}</div>
      <div class="weight-stepper">
        <button data-action="set-wdown" data-ex="${ex.id}" data-idx="${i}">−</button>
        <div class="weight-value">${weightLabel}</div>
        <button data-action="set-wup" data-ex="${ex.id}" data-idx="${i}">+</button>
      </div>
      <button class="reps-btn" data-action="set-reps" data-ex="${ex.id}" data-idx="${i}">${v.r}${unit}</button>
      <button class="rpe-btn ${v.rpe >= 9 ? 'high' : ''}" data-action="set-rpe" data-ex="${ex.id}" data-idx="${i}">RPE ${v.rpe}</button>
      <button class="check-btn ${v.done ? 'done' : ''}" data-action="set-toggle" data-ex="${ex.id}" data-idx="${i}">✓</button>
    </div>`;
}

function renderExerciseCard(ex) {
  return `
    <div class="ex-card">
      <div class="ex-head">
        <div style="flex:1;min-width:0">
          <div class="ex-target">${ex.target}</div>
          <div class="ex-name">${ex.name}</div>
        </div>
        <button class="info-btn" data-action="ex-info" data-ex="${ex.id}">i</button>
      </div>
      <div class="ex-sets">${ex.sets.map((base, i) => renderSetRow(ex, i, base)).join('')}</div>
    </div>`;
}

function renderSession() {
  const { done, total } = sessionProgress();
  const pct = total ? Math.round(done / total * 100) : 0;
  return `
    <div class="stack-12">
      <div class="card progress-card">
        <div class="progress-top">
          <div class="progress-txt">Satz ${done} von ${total}</div>
          <div class="progress-txt">${total - done} offen</div>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      ${EX.map(renderExerciseCard).join('')}
      <div class="tip-box">Gewicht mit ±, Wiederholungen und RPE durch Antippen. Haken loggt den Satz und bietet den Pausentimer an — starten musst du ihn selbst.</div>
      <button class="btn-block-outline" data-action="finish-session">Einheit abschließen</button>
    </div>`;
}

function renderDetail() {
  const e = currentExercise();
  return `
    <div class="stack-12">
      <div class="card">
        <div style="font-size:12px;letter-spacing:.06em;text-transform:uppercase;font-weight:600;color:var(--fg-3)">${e.target}</div>
        <p style="font-size:14px;line-height:1.5;margin-top:10px">${e.note}</p>
      </div>
      <div class="card">
        <div class="card-title-inv" style="color:var(--sm-navy)">Ausführung</div>
        <div class="cue-list">${e.cues.map(c => `<div class="cue"><span class="dash">—</span><span>${c}</span></div>`).join('')}</div>
      </div>
      <div class="pair">
        <div class="pair-navy">
          <div class="pair-label">Letztes Mal</div>
          <div class="pair-value">${e.last}</div>
        </div>
        <div class="pair-white">
          <div class="pair-label">Alternative</div>
          <div class="pair-value">${e.alt}</div>
        </div>
      </div>
      <div class="card-yellow">
        <div class="card-title-inv">Warum surfrelevant</div>
        <p style="font-size:13.5px;line-height:1.5;margin-top:6px;color:var(--sm-navy-900)">${e.why}</p>
      </div>
    </div>`;
}

function weekRowSub(d) {
  return d.code ? `${totalSetsForCode(d.code)} Sätze · ${d.note}` : d.sub;
}

function renderPlanWeek() {
  return `
    <div class="stack-12">
      <div class="card card-flush">
        ${WEEK.map(d => `
          <div class="week-row ${d.state === 'today' ? 'today' : ''}" ${d.state === 'today' ? 'data-action="start-session"' : ''}>
            <div class="dow-col"><div class="dow">${d.dow}</div><div class="num">${d.num}</div></div>
            <div style="flex:1;min-width:0">
              <div class="title ${d.state === 'open' ? 'open' : ''}">${d.title}</div>
              <div class="sub">${weekRowSub(d)}</div>
            </div>
            <div class="badge ${d.state === 'done' ? 'done' : ''} ${d.state === 'today' ? 'today' : ''}">${d.badge}</div>
          </div>`).join('')}
      </div>
      <div class="card-navy">
        <div class="card-title-inv" style="color:var(--sm-yellow)">Regel der Wasserphase</div>
        <p style="font-size:13px;line-height:1.5;margin-top:6px;color:rgba(255,255,255,.88)">Keine schweren Beine am Vorabend eines Surftags. Gym nach der Session oder mit mindestens vier Stunden Abstand. RPE-Deckel 7, nie bis zum Muskelversagen.</p>
      </div>
    </div>`;
}

function renderPlanBlockA() {
  return `
    <div class="stack-12">
      <div class="card-navy">
        <div style="font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--sm-yellow)">11.9. – 27.9. · 2,5 Wochen</div>
        <div class="card-title-inv" style="font-size:20px;margin-top:4px">Block A — Wasserphase</div>
        <p style="font-size:13px;line-height:1.5;margin-top:6px;color:rgba(255,255,255,.85)">Täglich surfen, Gym nur dreimal pro Woche und mit halbem Volumen. Ziel ist nicht Zuwachs, sondern belastbare Schultern, Hüften und ein stabiler unterer Rücken.</p>
      </div>
      ${BLOCK_A.map(b => `
        <div class="plan-card">
          <div style="display:flex;align-items:center;gap:8px">
            <span class="plan-code">${b.code}</span>
            <span class="plan-meta">${b.meta} · ${countSetsInItems(b.items)} Sätze</span>
          </div>
          <div class="plan-title">${b.title}</div>
          <div class="item-list">${b.items.map(([n, sp]) => `<div class="item-row"><div>${n}</div><div class="spec">${sp}</div></div>`).join('')}</div>
        </div>`).join('')}
    </div>`;
}

function renderPlanBlockB() {
  return `
    <div class="stack-12">
      <div class="card-ink">
        <div style="font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--sm-yellow)">Ab 28.9. · 8 Wochen</div>
        <div class="card-title-inv" style="font-size:20px;margin-top:4px">Block B — Hauptblock</div>
        <p style="font-size:13px;line-height:1.5;margin-top:6px;color:rgba(255,255,255,.85)">Vier Einheiten pro Woche mit je 25 Arbeitssätzen. Die letzten Übungen laufen als Supersatz mit 45 Sekunden Pause — so bleibt die Einheit bei 60 bis 75 Minuten.</p>
      </div>
      ${BLOCK_B.map(d => `
        <div class="plan-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
            <span style="font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:600;color:var(--fg-3)">${d.day}</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--fg-3)">${countSetsInItems(d.items)} Sätze · ${d.meta}</span>
          </div>
          <div class="plan-title" style="margin-top:6px">${d.title}</div>
          <div class="item-list" style="margin-top:10px">${d.items.map(([n, sp]) => `<div class="item-row"><div>${n}</div><div class="spec">${sp}</div></div>`).join('')}</div>
        </div>`).join('')}
    </div>`;
}

function renderPlan() {
  const tabBtn = (key, label) => `<button class="${state.planTab === key ? 'active' : ''}" data-action="plan-tab" data-tab="${key}">${label}</button>`;
  const body = state.planTab === 'w' ? renderPlanWeek() : state.planTab === 'a' ? renderPlanBlockA() : renderPlanBlockB();
  return `
    <div class="stack-12">
      <div class="segmented">${tabBtn('w', 'Woche')}${tabBtn('a', 'Block A')}${tabBtn('b', 'Block B')}</div>
      ${body}
    </div>`;
}

function renderCoreCycles() {
  return `
    <div class="stack-12">
      ${CYCLES.map(c => {
        const isToday = c.today;
        const pillLabel = isToday ? (state.coreDone ? 'erledigt' : 'offen') : 'geplant';
        return `
          <div class="cyc-card ${isToday ? 'today' : ''}">
            <div class="cyc-head">
              <div style="min-width:0">
                <div class="cyc-eyebrow">${c.eyebrow}</div>
                <div class="cyc-title">${c.title}</div>
              </div>
              <div class="pill ${isToday && state.coreDone ? 'on' : ''}">${pillLabel}</div>
            </div>
            <div class="cyc-items">${c.items.map(([n, sp]) => `<div class="cyc-item"><span>${n}</span><span class="spec">${sp}</span></div>`).join('')}</div>
            ${isToday ? `<button class="btn-cyc ${state.coreDone ? 'on' : ''}" data-action="core-start">${state.coreDone ? 'Als offen markieren' : 'Zyklus A starten'}</button>` : ''}
          </div>`;
      }).join('')}
      <div class="card">
        <div class="card-title-inv" style="color:var(--sm-navy)">Ehrlich zum Sixpack</div>
        <p style="font-size:13px;line-height:1.5;color:var(--fg-2);margin-top:6px">Das tägliche Training macht die Bauchmuskeln dicker und den Rumpf für Rotation und Wipeouts belastbar. Sichtbar macht sie der Körperfettanteil — das entscheidet die Ernährung, nicht der Plan.</p>
      </div>
    </div>`;
}

function renderMobility() {
  return `
    <div class="stack-12">
      ${MOB.map((m, i) => {
        const done = !!state.mobDone[i];
        return `
          <div class="mob-card ${done ? 'done' : ''}">
            <div class="cyc-head">
              <div style="min-width:0">
                <div class="cyc-eyebrow">${m.eyebrow}</div>
                <div class="cyc-title">${m.title}</div>
              </div>
              <div class="pill ${done ? 'on' : ''}">${done ? 'erledigt' : 'offen'}</div>
            </div>
            <div class="cyc-items">${m.items.map(([n, sp]) => `<div class="cyc-item"><span>${n}</span><span class="spec">${sp}</span></div>`).join('')}</div>
            <button class="btn-mob ${done ? 'done' : ''}" data-action="mob-toggle" data-idx="${i}">${done ? 'Erledigt ✓' : 'Abhaken'}</button>
          </div>`;
      }).join('')}
      <div class="card">
        <div class="card-title-inv" style="color:var(--sm-navy)">Damit es wirkt</div>
        <div class="tips-list">
          <div>Statisch dehnen nie direkt vor dem Krafttraining</div>
          <div>Dehnung bei 6 bis 7 von 10, nie im Schmerz</div>
          <div>Ruhig weiteratmen statt pressen</div>
          <div>Bei Schulterproblemen den Sleeper Stretch weglassen</div>
        </div>
      </div>
    </div>`;
}

function renderCore() {
  const tabBtn = (key, label) => `<button class="${state.coreTab === key ? 'active' : ''}" data-action="core-tab" data-tab="${key}">${label}</button>`;
  return `
    <div class="stack-12">
      <div class="segmented">${tabBtn('core', 'Core · 10 min')}${tabBtn('mob', 'Mobility')}</div>
      ${state.coreTab === 'core' ? renderCoreCycles() : renderMobility()}
    </div>`;
}

function renderVerlauf() {
  const maxBar = Math.max(...BARS.map(b => b.total));
  return `
    <div class="stack-12">
      <div class="card">
        <div class="card-title">Volumen je Woche</div>
        <div class="bars">
          ${BARS.map(b => `
            <div class="bar-col">
              <div class="bar-track"><div class="bar-fill" style="height:${Math.round(b.total / maxBar * 100)}%"></div></div>
              <div class="bar-label">${b.label}</div>
            </div>`).join('')}
        </div>
        <div style="margin-top:11px;font-size:11px;color:var(--fg-3)">Geloggte Arbeitssätze pro Kalenderwoche</div>
      </div>
      <div class="card">
        <div class="card-title">Bestwerte &amp; Progression</div>
        <div>${RECORDS.map(renderRecordRow).join('')}</div>
      </div>
      <div class="card-navy">
        <div style="font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--sm-yellow)">Doppelprogression</div>
        <p style="font-size:13px;line-height:1.5;margin-top:6px;color:rgba(255,255,255,.88)">Bleib beim Gewicht, bis du in allen Sätzen die obere Wiederholungszahl schaffst. Dann rauf: 2,5 kg am Oberkörper, 5 kg an den Beinen — und wieder am unteren Ende anfangen.</p>
      </div>
      <div class="card">
        <div class="card-title-inv" style="color:var(--sm-navy)">RPE lesen</div>
        <p style="font-size:13px;line-height:1.5;color:var(--fg-2);margin-top:6px">RPE 8 heißt: zwei saubere Wiederholungen wären noch gegangen. RPE 9 eine, RPE 7 drei. Hauptübungen auf 8, Explosives deutlich darunter, die Abschlussübungen dürfen an die 9.</p>
      </div>
    </div>`;
}

function renderProfil() {
  return `
    <div class="stack-12">
      <div class="card-navy profile-head">
        <div class="profile-avatar">JS</div>
        <div style="flex:1;min-width:0">
          <div class="profile-name">Jan S.</div>
          <div class="profile-sub">Fortgeschritten · RPE-Deckel 8 · 3 Gym-Tage</div>
        </div>
      </div>
      <div class="card card-flush">
        ${SETTINGS_DEF.map((s, i) => {
          const on = !!state.settings[i];
          return `
            <div class="setting-row">
              <div style="flex:1;min-width:0">
                <div class="setting-label">${s.label}</div>
                <div class="setting-hint">${s.hint}</div>
              </div>
              <button class="switch ${on ? 'on' : ''}" data-action="setting-toggle" data-idx="${i}"><span class="knob"></span></button>
            </div>`;
        }).join('')}
      </div>
      <div class="card">
        <div class="card-title-inv" style="color:var(--sm-navy)">Geräte im Studio</div>
        <div class="gear-tags">${GEAR.map(g => `<span class="gear-tag">${g}</span>`).join('')}</div>
        <p style="font-size:12px;line-height:1.45;color:var(--fg-3);margin-top:11px">Fehlt ein Gerät: Latzug ersetzt Klimmzug, Hackenschmidt die Kniebeuge, Kurzhantelrudern das Langhantelrudern. Die Bewegungsrichtung zählt, nicht das Gerät.</p>
      </div>
      <div class="card-yellow">
        <div class="card-title-inv">Die eine Regel</div>
        <p style="font-size:13px;line-height:1.5;margin-top:6px;color:var(--sm-navy-900)">Face Pulls und Außenrotationen werden nie gestrichen, auch nicht wenn die Zeit knapp wird. Die Paddelschulter ist die Verletzung, die Surfer aus dem Wasser holt.</p>
      </div>
    </div>`;
}

/* ---------- rest bar + bottom nav ---------- */

function renderRestBar() {
  if (state.rest === null || state.screen !== 'session') return '';
  const mm = Math.floor(state.restLeft / 60);
  const ss = String(state.restLeft % 60).padStart(2, '0');
  const label = state.restLeft === 0 ? 'Bereit' : `${mm}:${ss}`;
  const btnLabel = state.restRunning ? 'Pause' : (state.restLeft === 0 ? '90 s' : 'Start');
  return `
    <div class="rest-bar">
      <div style="flex:1;min-width:0">
        <div class="rest-label">Pause</div>
        <div class="rest-time">${label}</div>
      </div>
      <button class="rest-primary ${state.restRunning ? 'running' : ''}" data-action="rest-primary">${btnLabel}</button>
      <button class="rest-dismiss" data-action="rest-dismiss">×</button>
    </div>`;
}

const NAV_ITEMS = [
  { screen: 'home', label: 'Heute', icon: '<path d="M3 10.5 12 3.5l9 7"></path><path d="M5.5 9.5V20.5h13V9.5"></path>' },
  { screen: 'plan', label: 'Plan', icon: '<rect x="3.5" y="4.5" width="17" height="16" rx="2.5"></rect><path d="M3.5 9.5h17M8.5 3v3M15.5 3v3"></path>' },
  { screen: 'core', label: 'Core', icon: '<circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path>' },
  { screen: 'verlauf', label: 'Verlauf', icon: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path>' },
  { screen: 'profil', label: 'Profil', icon: '<circle cx="12" cy="8.5" r="4"></circle><path d="M4.5 20.5c1.5-3.6 4.2-5.5 7.5-5.5s6 1.9 7.5 5.5"></path>' }
];

function renderBottomNav() {
  return NAV_ITEMS.map(item => `
    <button class="navbtn ${state.screen === item.screen ? 'active' : ''}" data-action="nav" data-screen="${item.screen}">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
      <span>${item.label}</span>
    </button>`).join('');
}

/* ---------- render + events ---------- */

function renderAll() {
  document.getElementById('header').innerHTML = renderHeader();
  document.getElementById('content').innerHTML = renderContent();
  document.getElementById('rest-bar').innerHTML = renderRestBar();
  document.getElementById('bottomnav').innerHTML = renderBottomNav();
}

document.getElementById('app').addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  const exId = el.dataset.ex;
  const idx = el.dataset.idx !== undefined ? parseInt(el.dataset.idx, 10) : undefined;

  switch (action) {
    case 'nav': go(el.dataset.screen); break;
    case 'back': back(); break;
    case 'start-session': setState({ screen: 'session' }); break;
    case 'finish-session': setState({ screen: 'home' }); break;
    case 'ex-info': setState({ screen: 'detail', detailId: exId }); break;
    case 'set-wup':
    case 'set-wdown':
    case 'set-reps':
    case 'set-rpe':
    case 'set-toggle': {
      const ex = EX.find(x => x.id === exId);
      const base = ex.sets[idx];
      const v = getSet(exId, idx, base);
      if (action === 'set-wup') onWUp(exId, idx, v);
      else if (action === 'set-wdown') onWDown(exId, idx, v);
      else if (action === 'set-reps') onReps(exId, idx, v);
      else if (action === 'set-rpe') onRpe(exId, idx, v);
      else onToggle(exId, idx, v);
      break;
    }
    case 'plan-tab': setState({ planTab: el.dataset.tab }); break;
    case 'core-tab': setState({ coreTab: el.dataset.tab }); break;
    case 'core-start': setState(s => ({ coreDone: !s.coreDone })); break;
    case 'mob-toggle': setState(s => ({ mobDone: { ...s.mobDone, [idx]: !s.mobDone[idx] } })); break;
    case 'setting-toggle': setState(s => ({ settings: { ...s.settings, [idx]: !s.settings[idx] } })); break;
    case 'rest-primary': restPrimary(); break;
    case 'rest-dismiss': restDismiss(); break;
  }
});

renderAll();
