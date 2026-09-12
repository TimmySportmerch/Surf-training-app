// Surf Gym Tracker — app logic & rendering (vanilla JS, no build step).

const STORAGE_KEY = 'surfGymTracker.v3';

const DEFAULT_PROFILES = {
  timmy: {
    id: 'timmy',
    name: 'Timmy',
    initials: 'TI',
    avatarImg: 'images/timmy.jpg',
    color: '#d72638',
    level: 'Surf Strength · 3 Gym-Tage · Block A',
    targetGym: 3,
    gymCompletedThisWeek: 0,
    streak: 0,
    coreDone: false,
    mobDone: { 0: false, 1: false },
    sets: {},
    settings: { 0: true, 1: true, 2: false, 3: true },
    records: [],
    bars: []
  },
  annika: {
    id: 'annika',
    name: 'Annika',
    initials: 'AN',
    avatarImg: 'images/annika.jpg',
    color: '#f4a900',
    level: 'Surf Strength · 3 Gym-Tage · Block A',
    targetGym: 3,
    gymCompletedThisWeek: 0,
    streak: 0,
    coreDone: false,
    mobDone: { 0: false, 1: false },
    sets: {},
    settings: { 0: true, 1: true, 2: false, 3: true },
    records: [],
    bars: []
  }
};

function defaultState() {
  return {
    activeUser: null, // null triggers onboarding
    screen: 'home',
    planTab: 'w',
    coreTab: 'core',
    activeUnitId: 'A1',
    selectedUnit: 'A1',
    selectedBlock: 'A',
    detailId: null,
    editingExId: null,
    units: JSON.parse(JSON.stringify(DEFAULT_UNITS)),
    profiles: JSON.parse(JSON.stringify(DEFAULT_PROFILES)),
    rest: null,
    restLeft: 0,
    restRunning: false
  };
}

function loadState() {
  const defaults = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const saved = JSON.parse(raw);
    const profiles = {
      timmy: { ...defaults.profiles.timmy, ...(saved.profiles && saved.profiles.timmy), avatarImg: 'images/timmy.jpg' },
      annika: { ...defaults.profiles.annika, ...(saved.profiles && saved.profiles.annika), avatarImg: 'images/annika.jpg' }
    };

    // Restore units (merge saved units with default units)
    let units = JSON.parse(JSON.stringify(DEFAULT_UNITS));
    if (saved.units) {
      Object.keys(DEFAULT_UNITS).forEach(k => {
        if (saved.units[k] && Array.isArray(saved.units[k])) {
          units[k] = saved.units[k];
        }
      });
    } else if (saved.exercises && Array.isArray(saved.exercises)) {
      // Migrate legacy A1 exercises
      units['A1'] = saved.exercises;
    }

    return {
      ...defaults,
      ...saved,
      profiles,
      units,
      activeUnitId: saved.activeUnitId || 'A1',
      selectedUnit: saved.selectedUnit || 'A1',
      selectedBlock: saved.selectedBlock || 'A',
      restRunning: false
    };
  } catch {
    return defaults;
  }
}

/* ---------- Supabase Cloud Sync ---------- */
const SUPABASE_URL = 'https://ufmdksvifegzvxpjsrds.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbWRrc3ZpZmVnenZ4cGpzcmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNzI3NTIsImV4cCI6MjEwNDc0ODc1Mn0.-MvN7-sxpweQAs2yDsajB3RFCvYuhxv6O7XDnkeK19Y';

let supabaseClient = null;
try {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn('Supabase client init error:', err);
}

let syncStatus = 'idle'; // 'idle' | 'syncing' | 'synced' | 'error'
let cloudSyncTimeout = null;

function updateSyncBadge() {
  const badges = document.querySelectorAll('.sync-badge');
  badges.forEach(badge => {
    badge.className = `sync-badge ${syncStatus}`;
    if (syncStatus === 'syncing') {
      badge.innerHTML = `🔄 Synchronisiere...`;
    } else if (syncStatus === 'synced') {
      badge.innerHTML = `🟢 Live-Sync`;
    } else if (syncStatus === 'error') {
      badge.innerHTML = `⚠️ Offline-Modus`;
    } else {
      badge.innerHTML = `☁️ Cloud-Sync`;
    }
  });
}

function triggerCloudSync() {
  if (!supabaseClient || !state.activeUser) return;
  if (cloudSyncTimeout) clearTimeout(cloudSyncTimeout);

  syncStatus = 'syncing';
  updateSyncBadge();

  cloudSyncTimeout = setTimeout(async () => {
    try {
      const u = state.activeUser;
      const prof = state.profiles && state.profiles[u];
      if (prof) {
        const { error: profErr } = await supabaseClient.from('user_sync').upsert({
          id: `profile_${u}`,
          data: prof,
          updated_at: new Date().toISOString()
        });
        if (profErr) throw profErr;
      }
      if (state.units) {
        await supabaseClient.from('user_sync').upsert({
          id: 'units',
          data: state.units,
          updated_at: new Date().toISOString()
        });
      }
      syncStatus = 'synced';
      updateSyncBadge();
    } catch (err) {
      console.warn('Cloud sync push error:', err);
      syncStatus = 'error';
      updateSyncBadge();
    }
  }, 700);
}

async function pullCloudSync() {
  if (!supabaseClient) return;
  try {
    syncStatus = 'syncing';
    updateSyncBadge();

    const { data, error } = await supabaseClient.from('user_sync').select('*');
    if (error) throw error;
    if (!data || !Array.isArray(data)) {
      syncStatus = 'synced';
      updateSyncBadge();
      return;
    }

    let changed = false;
    data.forEach(row => {
      if (row.id === 'profile_timmy' && row.data) {
        const cloudTime = (row.data._updatedAt) || (row.updated_at ? new Date(row.updated_at).getTime() : 0);
        const localTime = (state.profiles.timmy && state.profiles.timmy._updatedAt) || 0;
        const hasLocalProgress = state.profiles.timmy && Object.keys(state.profiles.timmy.sets || {}).length > 0;
        if (state.activeUser !== 'timmy' || cloudTime > localTime || !hasLocalProgress) {
          state.profiles.timmy = { ...DEFAULT_PROFILES.timmy, ...row.data, avatarImg: 'images/timmy.jpg' };
          changed = true;
        }
      } else if (row.id === 'profile_annika' && row.data) {
        const cloudTime = (row.data._updatedAt) || (row.updated_at ? new Date(row.updated_at).getTime() : 0);
        const localTime = (state.profiles.annika && state.profiles.annika._updatedAt) || 0;
        const hasLocalProgress = state.profiles.annika && Object.keys(state.profiles.annika.sets || {}).length > 0;
        if (state.activeUser !== 'annika' || cloudTime > localTime || !hasLocalProgress) {
          state.profiles.annika = { ...DEFAULT_PROFILES.annika, ...row.data, avatarImg: 'images/annika.jpg' };
          changed = true;
        }
      } else if (row.id === 'units' && row.data) {
        state.units = { ...DEFAULT_UNITS, ...row.data };
        changed = true;
      }
    });

    if (changed) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
      renderAll();
    }
    syncStatus = 'synced';
    updateSyncBadge();
  } catch (err) {
    console.warn('Pull cloud sync error:', err);
    syncStatus = 'error';
    updateSyncBadge();
  }
}

function initRealtimeSync() {
  if (!supabaseClient) return;
  try {
    supabaseClient
      .channel('public:user_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_sync' },
        (payload) => {
          const row = payload.new;
          if (!row || !row.id || !row.data) return;

          let changed = false;
          if (row.id === 'profile_timmy') {
            const cloudTime = (row.data._updatedAt) || (row.updated_at ? new Date(row.updated_at).getTime() : 0);
            const localTime = (state.profiles.timmy && state.profiles.timmy._updatedAt) || 0;
            if (state.activeUser !== 'timmy' || cloudTime > localTime) {
              state.profiles.timmy = { ...DEFAULT_PROFILES.timmy, ...row.data, avatarImg: 'images/timmy.jpg' };
              changed = true;
            }
          } else if (row.id === 'profile_annika') {
            const cloudTime = (row.data._updatedAt) || (row.updated_at ? new Date(row.updated_at).getTime() : 0);
            const localTime = (state.profiles.annika && state.profiles.annika._updatedAt) || 0;
            if (state.activeUser !== 'annika' || cloudTime > localTime) {
              state.profiles.annika = { ...DEFAULT_PROFILES.annika, ...row.data, avatarImg: 'images/annika.jpg' };
              changed = true;
            }
          } else if (row.id === 'units') {
            state.units = { ...DEFAULT_UNITS, ...row.data };
            changed = true;
          }

          if (changed) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
            renderAll();
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          syncStatus = 'synced';
          updateSyncBadge();
        }
      });
  } catch (err) {
    console.warn('Realtime subscription error:', err);
  }
}

let state = loadState();
let restInterval = null;

function saveState() {
  if (state.activeUser && state.profiles && state.profiles[state.activeUser]) {
    state.profiles[state.activeUser]._updatedAt = Date.now();
  }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  triggerCloudSync();
}

function setState(patch) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p };
  saveState();
  renderAll();
}

function currentProfile() {
  const u = state.activeUser || 'timmy';
  return (state.profiles && state.profiles[u]) || DEFAULT_PROFILES.timmy;
}

function partnerProfile() {
  const u = state.activeUser === 'annika' ? 'timmy' : 'annika';
  return (state.profiles && state.profiles[u]) || DEFAULT_PROFILES.annika;
}

function getUnitMeta(unitId) {
  return UNITS_META[unitId] || UNITS_META['A1'];
}

function getUnitExercises(unitId) {
  const uId = unitId || state.activeUnitId || 'A1';
  return (state.units && state.units[uId]) || DEFAULT_UNITS[uId] || [];
}

function currentExercise() {
  const exercises = getUnitExercises(state.activeUnitId);
  if (state.detailId) {
    const found = exercises.find(e => e.id === state.detailId);
    if (found) return found;
    // Search in all units if not in current
    for (const k of Object.keys(state.units || DEFAULT_UNITS)) {
      const e = (state.units[k] || []).find(x => x.id === state.detailId);
      if (e) return e;
    }
  }
  return exercises[0] || DEFAULT_UNITS.A1[0];
}

function totalSetsForUnit(unitId) {
  const exs = getUnitExercises(unitId);
  return exs.reduce((sum, ex) => sum + (ex.sets ? ex.sets.length : 3), 0);
}

function totalSetsForCode(code) {
  return totalSetsForUnit(code);
}

function sessionProgress(unitId = state.activeUnitId || 'A1') {
  let done = 0, total = 0;
  const exercises = getUnitExercises(unitId);
  exercises.forEach(ex => (ex.sets || []).forEach((b, i) => {
    total++;
    if (getSet(unitId, ex.id, i, b).done) done++;
  }));
  return { done, total };
}

/* ---------- set tracking ---------- */

function getSet(unitId, exId, i, base) {
  const prof = currentProfile();
  const k = unitId + '_' + exId + '-' + i;
  const legacyK = exId + '-' + i;
  const v = (prof.sets && (prof.sets[k] || (unitId === 'A1' ? prof.sets[legacyK] : undefined))) || {};
  return {
    w: v.w !== undefined ? v.w : base.w,
    r: v.r !== undefined ? v.r : base.r,
    rpe: v.rpe !== undefined ? v.rpe : 7,
    done: !!v.done
  };
}

function setKey(unitId, exId, i, patch) {
  const u = state.activeUser || 'timmy';
  const k = unitId + '_' + exId + '-' + i;
  setState(s => {
    const prof = s.profiles[u] || DEFAULT_PROFILES[u];
    const cur = (prof.sets && prof.sets[k]) || {};
    return {
      profiles: {
        ...s.profiles,
        [u]: {
          ...prof,
          sets: { ...prof.sets, [k]: { ...cur, ...patch } }
        }
      }
    };
  });
}

function onWUp(unitId, exId, i, v) {
  const step = exId.includes('carry') || exId.includes('squat') ? 5 : 2.5;
  setKey(unitId, exId, i, { w: +(v.w + step).toFixed(1) });
}
function onWDown(unitId, exId, i, v) {
  const step = exId.includes('carry') || exId.includes('squat') ? 5 : 2.5;
  setKey(unitId, exId, i, { w: Math.max(0, +(v.w - step).toFixed(1)) });
}
function onReps(unitId, exId, i, v) {
  const isCarry = exId.includes('carry');
  const max = isCarry ? 60 : 20;
  const min = isCarry ? 20 : 4;
  const step = isCarry ? 10 : 1;
  setKey(unitId, exId, i, { r: v.r >= max ? min : v.r + step });
}
function onRpe(unitId, exId, i, v) {
  setKey(unitId, exId, i, { rpe: v.rpe >= 10 ? 6 : v.rpe + 1 });
}
function onToggle(unitId, exId, i, v) {
  setKey(unitId, exId, i, { done: !v.done });
  if (!v.done) setState({ rest: 90, restLeft: 90, restRunning: false });
}

/* ---------- navigation ---------- */

function go(screen) { setState({ screen }); }
function back() {
  setState(s => {
    if (s.screen === 'exercises-settings') return { screen: 'profil', editingExId: null };
    return { screen: s.screen === 'detail' ? 'session' : 'home' };
  });
}

/* ---------- header ---------- */

function renderHeader() {
  const prof = currentProfile();
  if (state.screen === 'home') {
    const { done } = sessionProgress('A1');
    const gymCount = prof.gymCompletedThisWeek || 2;
    const avatarInner = prof.avatarImg
      ? `<img src="${prof.avatarImg}" alt="${prof.name}" class="avatar-photo">`
      : prof.initials;
    return `
      <div class="header">
        <div class="header-top">
          <div class="header-titles">
            <div class="eyebrow eyebrow-yellow">Block A · Wasserphase · Woche 1</div>
            <div class="page-title">Freitag 11.9.</div>
          </div>
          <button class="avatar-btn" data-action="nav" data-screen="profil" style="background:${prof.color}; border: 2px solid rgba(255,255,255,.6); padding:0; overflow:hidden">
            ${avatarInner}
          </button>
        </div>
        <div class="header-stats">
          <div class="stat-box"><div class="stat-label">Bis Block B</div><div class="stat-value">17 Tage</div></div>
          <div class="stat-box"><div class="stat-label">Gym (${prof.name})</div><div class="stat-value">${done > 0 ? Math.min(3, gymCount + 1) : gymCount} / 3</div></div>
        </div>
      </div>`;
  }

  let eyebrow = '';
  let title = '';

  if (state.screen === 'detail') {
    const ex = currentExercise();
    eyebrow = 'Übungsdetail';
    title = ex.name;
  } else if (state.screen === 'session') {
    const meta = getUnitMeta(state.activeUnitId);
    eyebrow = meta.block === 'A' ? 'Wasserphase · Block A' : 'Hauptblock · Block B';
    title = meta.dayTitle;
  } else if (state.screen === 'exercises-settings') {
    const meta = getUnitMeta(state.selectedUnit);
    eyebrow = 'Plan-Editor';
    title = `Übungen · ${meta.code || meta.title}`;
  } else {
    const HEAD_MAP = {
      plan: ['Trainingsplan', 'Plan'],
      core: ['Täglich · 10 Minuten', 'Core & Mobility'],
      verlauf: ['Seit KW 31', 'Fortschritt'],
      profil: ['Konto', 'Profil & Einstellungen']
    };
    [eyebrow, title] = HEAD_MAP[state.screen] || ['', ''];
  }

  const showBack = ['session', 'detail', 'exercises-settings'].includes(state.screen);

  return `
    <div class="header ${showBack ? 'header-sub' : ''}">
      <div class="header-sub-row">
        ${showBack ? '<button class="back-btn" data-action="back">‹</button>' : ''}
        <div style="flex:1;min-width:0">
          <div class="eyebrow eyebrow-yellow">${eyebrow}</div>
          <div class="page-title">${title}</div>
        </div>
      </div>
    </div>`;
}

/* ---------- consistency widget ---------- */

function renderConsistencyCard() {
  const isTimmy = state.activeUser === 'timmy';
  const isAnnika = state.activeUser === 'annika';

  const profTimmy = (state.profiles && state.profiles.timmy) || DEFAULT_PROFILES.timmy;
  const profAnnika = (state.profiles && state.profiles.annika) || DEFAULT_PROFILES.annika;

  const timmyGym = isTimmy && sessionProgress('A1').done > 0
    ? Math.min(profTimmy.targetGym, profTimmy.gymCompletedThisWeek + 1)
    : profTimmy.gymCompletedThisWeek;
  const timmyCoreDone = profTimmy.coreDone;
  const timmyStreak = profTimmy.streak + (timmyCoreDone ? 1 : 0);
  const timmyScore = Math.round((timmyGym / profTimmy.targetGym) * 50 + (timmyCoreDone ? 30 : 15) + (timmyStreak >= 5 ? 20 : 10));

  const annikaGym = isAnnika && sessionProgress('A1').done > 0
    ? Math.min(profAnnika.targetGym, profAnnika.gymCompletedThisWeek + 1)
    : profAnnika.gymCompletedThisWeek;
  const annikaCoreDone = profAnnika.coreDone;
  const annikaStreak = profAnnika.streak + (annikaCoreDone ? 1 : 0);
  const annikaScore = Math.round((annikaGym / profAnnika.targetGym) * 50 + (annikaCoreDone ? 30 : 15) + (annikaStreak >= 5 ? 20 : 10));

  let leaderBadge = '🤝 Gleichauf';
  let leaderText = 'Beide voll auf Kurs für Block B!';
  if (timmyScore > annikaScore) {
    leaderBadge = '🔥 Timmy führt';
    leaderText = isTimmy ? 'Stark, Timmy! Du hast diese Woche die Nase vorn.' : 'Timmy führt knapp — hol dir die nächste Session!';
  } else if (annikaScore > timmyScore) {
    leaderBadge = '🔥 Annika führt';
    leaderText = isAnnika ? 'Stark, Annika! Du hast diese Woche die Nase vorn.' : 'Annika führt knapp — hol dir die nächste Session!';
  }

  const timmyAvatar = profTimmy.avatarImg
    ? `<img src="${profTimmy.avatarImg}" alt="Timmy" class="avatar-photo">`
    : profTimmy.initials;
  const annikaAvatar = profAnnika.avatarImg
    ? `<img src="${profAnnika.avatarImg}" alt="Annika" class="avatar-photo">`
    : profAnnika.initials;

  return `
    <div class="card card-consistency">
      <div class="consistency-top">
        <div>
          <div class="eyebrow eyebrow-yellow">Duell der Woche · Konsistenz</div>
          <div class="consistency-title">Timmy vs. Annika</div>
        </div>
        <span class="consistency-pill">${leaderBadge}</span>
      </div>

      <div class="consistency-grid">
        <!-- Timmy -->
        <div class="athlete-card ${isTimmy ? 'is-me' : ''}">
          <div class="athlete-header">
            <div class="athlete-avatar" style="background:#d72638">
              ${timmyAvatar}
            </div>
            <div style="flex:1;min-width:0">
              <div class="athlete-name">Timmy ${isTimmy ? '<span class="badge-you">DU</span>' : ''}</div>
              <div class="athlete-streak">${timmyStreak} Tage Streak 🔥</div>
            </div>
          </div>
          <div class="metric-row">
            <div class="metric-label"><span>Gym</span><strong>${timmyGym} / 3</strong></div>
            <div class="progress-bar"><div class="progress-fill" style="width:${Math.round((timmyGym / 3) * 100)}%; background:#d72638"></div></div>
          </div>
          <div class="metric-subrow">
            <span class="sub-label">Core heute:</span>
            <span class="sub-val ${timmyCoreDone ? 'done' : ''}">${timmyCoreDone ? '✓ Erledigt' : 'Offen'}</span>
          </div>
        </div>

        <div class="vs-badge">VS</div>

        <!-- Annika -->
        <div class="athlete-card ${isAnnika ? 'is-me' : ''}">
          <div class="athlete-header">
            <div class="athlete-avatar" style="background:#f4a900">
              ${annikaAvatar}
            </div>
            <div style="flex:1;min-width:0">
              <div class="athlete-name">Annika ${isAnnika ? '<span class="badge-you">DU</span>' : ''}</div>
              <div class="athlete-streak">${annikaStreak} Tage Streak 🔥</div>
            </div>
          </div>
          <div class="metric-row">
            <div class="metric-label"><span>Gym</span><strong>${annikaGym} / 3</strong></div>
            <div class="progress-bar"><div class="progress-fill" style="width:${Math.round((annikaGym / 3) * 100)}%; background:#f4a900"></div></div>
          </div>
          <div class="metric-subrow">
            <span class="sub-label">Core heute:</span>
            <span class="sub-val ${annikaCoreDone ? 'done' : ''}">${annikaCoreDone ? '✓ Erledigt' : 'Offen'}</span>
          </div>
        </div>
      </div>

      <div class="consistency-footer">
        <span class="surf-icon">🏄</span>
        <span class="consistency-note">${leaderText}</span>
        <div class="sync-badge ${syncStatus}" data-action="manual-sync" title="Tippen zum Synchronisieren">
          ${syncStatus === 'syncing' ? '🔄 Synchronisiere...' : (syncStatus === 'synced' ? '🟢 Live-Sync' : (syncStatus === 'error' ? '⚠️ Offline-Modus' : '☁️ Cloud-Sync'))}
        </div>
      </div>
    </div>`;
}

/* ---------- onboarding ---------- */

function renderOnboarding() {
  return `
    <div class="onboarding-screen">
      <div class="onboarding-logo">🏄‍♂️</div>
      <div class="onboarding-title">Surf Gym Tracker</div>
      <p class="onboarding-sub">Wähle einmalig dein Profil aus. Dieses Handy speichert ab sofort deine Sätze, Gewichte und Konsistenz automatisch.</p>

      <div class="onboarding-cards">
        <button class="onboarding-btn" data-action="select-profile" data-user="timmy">
          <div class="onboarding-avatar" style="overflow:hidden; border: 2.5px solid #d72638; background:#fff">
            <img src="images/timmy.jpg" alt="Timmy" class="avatar-photo">
          </div>
          <div class="onboarding-info">
            <div class="onboarding-name">Timmy</div>
            <div class="onboarding-detail">Surf Strength · 3 Gym-Tage · Block A</div>
          </div>
          <span class="onboarding-arrow">›</span>
        </button>

        <button class="onboarding-btn" data-action="select-profile" data-user="annika">
          <div class="onboarding-avatar" style="overflow:hidden; border: 2.5px solid #f4a900; background:#fff">
            <img src="images/annika.jpg" alt="Annika" class="avatar-photo">
          </div>
          <div class="onboarding-info">
            <div class="onboarding-name">Annika</div>
            <div class="onboarding-detail">Surf Strength · 3 Gym-Tage · Block A</div>
          </div>
          <span class="onboarding-arrow">›</span>
        </button>
      </div>

      <div class="onboarding-foot">
        <span>💡 Beide Profile treten auf dem Dashboard im wöchentlichen Konsistenz-Duell gegeneinander an!</span>
      </div>
    </div>`;
}

/* ---------- home ---------- */

function renderRecordRow(r) {
  return `
    <div class="record-row">
      <div>
        <div class="record-name">${r.name}</div>
        <div class="record-when">${r.when}</div>
      </div>
      <div style="text-align:right">
        <div class="record-val">${r.value}</div>
        <div class="record-delta">${r.delta}</div>
      </div>
    </div>`;
}

function renderHome() {
  const prof = currentProfile();
  const activeMeta = getUnitMeta(state.activeUnitId || 'A1');
  const totalSets = totalSetsForUnit(activeMeta.id);
  const { done } = sessionProgress(activeMeta.id);
  const startLabel = done > 0 ? `Einheit fortsetzen (${done}/${totalSets} Sätze)` : `Einheit starten (${activeMeta.code || activeMeta.dayTitle})`;
  const records = prof.records || RECORDS;
  const exercises = getUnitExercises(activeMeta.id);

  return `
    <div class="stack">
      <div class="card-emphasis">
        <div class="cmd-body">
          <div class="cmd-tags">
            <span class="cmd-badge">Heute · ${activeMeta.code || activeMeta.title}</span>
            <span class="cmd-meta">${activeMeta.meta} · ${totalSets} Sätze</span>
          </div>
          <div class="cmd-title">${activeMeta.title}</div>
          <p class="cmd-note">${activeMeta.why}</p>
          <div class="cmd-foot"><span>${activeMeta.note || 'RPE 7'}</span><span>${exercises.length} Übungen</span></div>
        </div>
        <button class="btn-block-red" data-action="start-session" data-unit="${activeMeta.id}">${startLabel}</button>
      </div>

      ${renderConsistencyCard()}

      <div class="card">
        <div class="card-head">
          <div class="card-title">Wochenraster</div>
          <button class="link-btn" data-action="nav" data-screen="plan">Ganze Woche ›</button>
        </div>
        <div class="week-grid">
          ${WEEK.map(d => `
            <div class="day-cell ${d.state}" ${d.code ? `data-action="start-session" data-unit="${d.code}" style="cursor:pointer"` : ''}>
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
          <div class="card-title-inv">Täglich-Streak (${prof.name})</div>
          <button class="pill-btn" data-action="nav" data-screen="core">Öffnen</button>
        </div>
        <div class="streak-row">
          <div class="streak-box">
            <div class="streak-label">Core · Zyklus A</div>
            <div class="streak-value">${prof.streak + (prof.coreDone ? 1 : 0)} Tage</div>
            <div class="streak-sub">${prof.coreDone ? 'heute erledigt' : 'heute noch offen'}</div>
          </div>
          <div class="streak-box">
            <div class="streak-label">Mobility</div>
            <div class="streak-value">${(prof.mobDone && (prof.mobDone[0] || prof.mobDone[1])) ? 1 : 0} Tage</div>
            <div class="streak-sub">${prof.mobDone && prof.mobDone[1] ? 'komplett erledigt' : 'heute noch offen'}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <div class="card-title">Letzte Bestwerte (${prof.name})</div>
          <button class="link-btn" data-action="nav" data-screen="verlauf">Verlauf ›</button>
        </div>
        <div>${records.length ? records.map(renderRecordRow).join('') : '<p style="font-size:12px;color:var(--fg-3);padding:10px 0;margin:0">Noch keine Bestwerte erfasst. Sobald du trainierst, werden deine PRs hier angezeigt!</p>'}</div>
      </div>
    </div>`;
}

/* ---------- workout session ---------- */

function renderSetRow(unitId, ex, i, base) {
  const v = getSet(unitId, ex.id, i, base);
  const unit = ex.id.includes('carry') ? ' m' : ' Wdh.';
  const weightLabel = String(v.w).replace('.', ',') + ' kg';
  return `
    <div class="set-row ${v.done ? 'done' : ''}">
      <div class="set-num">${i + 1}</div>
      <div class="weight-stepper">
        <button data-action="set-wdown" data-unit="${unitId}" data-ex="${ex.id}" data-idx="${i}">−</button>
        <div class="weight-value">${weightLabel}</div>
        <button data-action="set-wup" data-unit="${unitId}" data-ex="${ex.id}" data-idx="${i}">+</button>
      </div>
      <button class="reps-btn" data-action="set-reps" data-unit="${unitId}" data-ex="${ex.id}" data-idx="${i}">${v.r}${unit}</button>
      <button class="rpe-btn ${v.rpe >= 9 ? 'high' : ''}" data-action="set-rpe" data-unit="${unitId}" data-ex="${ex.id}" data-idx="${i}">RPE ${v.rpe}</button>
      <button class="check-btn ${v.done ? 'done' : ''}" data-action="set-toggle" data-unit="${unitId}" data-ex="${ex.id}" data-idx="${i}">✓</button>
    </div>`;
}

function renderExerciseCard(unitId, ex) {
  return `
    <div class="ex-card">
      <div class="ex-head">
        <div style="flex:1;min-width:0">
          <div class="ex-target">${ex.target}</div>
          <div class="ex-name">${ex.name}</div>
        </div>
        ${ex.youtube ? `<a href="${ex.youtube}" target="_blank" rel="noopener noreferrer" class="yt-play-btn" title="YouTube Video öffnen">▶</a>` : ''}
        <button class="info-btn" data-action="ex-info" data-unit="${unitId}" data-ex="${ex.id}">i</button>
      </div>
      <div class="ex-sets">${(ex.sets || []).map((base, i) => renderSetRow(unitId, ex, i, base)).join('')}</div>
    </div>`;
}

function renderSession() {
  const unitId = state.activeUnitId || 'A1';
  const meta = getUnitMeta(unitId);
  const exercises = getUnitExercises(unitId);
  const { done, total } = sessionProgress(unitId);
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

      ${exercises.map(ex => renderExerciseCard(unitId, ex)).join('')}

      <div class="tip-box">
        Gewicht mit ±, Wiederholungen und RPE durch Antippen. Haken loggt den Satz und bietet den Pausentimer an. Mit ▶ öffnest du das YouTube-Tutorial.
      </div>

      <div style="display:flex;gap:10px;margin-top:6px">
        <button class="btn-block-outline" style="flex:1" data-action="finish-session">Einheit abschließen</button>
        <button class="btn-secondary" data-action="open-unit-settings" data-unit="${unitId}">✏️ Übungen anpassen</button>
      </div>
    </div>`;
}

function renderDetail() {
  const e = currentExercise();
  const unitId = state.activeUnitId || 'A1';
  return `
    <div class="stack-12">
      <div class="card">
        <div style="font-size:12px;letter-spacing:.06em;text-transform:uppercase;font-weight:600;color:var(--fg-3)">${e.target}</div>
        <p style="font-size:14px;line-height:1.5;margin-top:10px">${e.note || ''}</p>
      </div>

      ${e.youtube ? `
        <a href="${e.youtube}" target="_blank" rel="noopener noreferrer" class="btn-youtube">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          <span>Video-Tutorial auf YouTube ansehen</span>
          <span style="font-size:16px; margin-left:auto">↗</span>
        </a>
      ` : ''}

      <button class="btn-secondary" style="width:100%" data-action="open-edit-exercise" data-unit="${unitId}" data-ex="${e.id}">
        ✏️ Diese Übung im Editor bearbeiten
      </button>

      <div class="card">
        <div class="card-title-inv" style="color:var(--sm-navy)">Ausführung</div>
        <div class="cue-list">${(e.cues || []).map(c => `<div class="cue"><span class="dash">—</span><span>${c}</span></div>`).join('')}</div>
      </div>
      <div class="pair">
        <div class="pair-navy">
          <div class="pair-label">Letztes Mal</div>
          <div class="pair-value">${e.last || '—'}</div>
        </div>
        <div class="pair-white">
          <div class="pair-label">Alternative</div>
          <div class="pair-value">${e.alt || '—'}</div>
        </div>
      </div>
      <div class="card-yellow">
        <div class="card-title-inv">Warum surfrelevant</div>
        <p style="font-size:13.5px;line-height:1.5;margin-top:6px;color:var(--sm-navy-900)">${e.why || ''}</p>
      </div>
    </div>`;
}

/* ---------- plan screens ---------- */

function weekRowSub(d) {
  return d.code ? `${totalSetsForUnit(d.code)} Sätze · ${d.note}` : d.sub;
}

function renderPlanWeek() {
  return `
    <div class="stack-12">
      <div class="card card-flush">
        ${WEEK.map(d => `
          <div class="week-row ${d.state === 'today' ? 'today' : ''}" ${d.code ? `data-action="start-session" data-unit="${d.code}" style="cursor:pointer"` : ''}>
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

      ${BLOCK_A_META.map(b => {
        const exs = getUnitExercises(b.unitId);
        const totalSets = totalSetsForUnit(b.unitId);
        return `
          <div class="plan-card">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <div style="display:flex;align-items:center;gap:8px">
                <span class="plan-code">${b.code}</span>
                <span class="plan-meta">${b.meta} · ${totalSets} Sätze</span>
              </div>
              <button class="plan-btn-edit" data-action="open-unit-settings" data-unit="${b.unitId}">✏️ Bearbeiten</button>
            </div>
            <div class="plan-title">${b.title}</div>
            <div class="item-list">
              ${exs.map(e => `
                <div class="item-row">
                  <div style="display:flex;align-items:center;gap:6px;min-width:0">
                    <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.name}</span>
                    ${e.youtube ? '<span style="color:var(--sm-red);font-size:10px;font-weight:700">▶</span>' : ''}
                  </div>
                  <div class="spec">${e.target}</div>
                </div>`).join('')}
            </div>
            <div class="plan-card-actions">
              <button class="plan-btn-start" data-action="start-session" data-unit="${b.unitId}">▶ Einheit ${b.code} starten</button>
            </div>
          </div>`;
      }).join('')}
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

      ${BLOCK_B_META.map(d => {
        const exs = getUnitExercises(d.unitId);
        const totalSets = totalSetsForUnit(d.unitId);
        return `
          <div class="plan-card">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
              <span style="font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:600;color:var(--fg-3)">${d.day}</span>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-family:var(--font-mono);font-size:11px;color:var(--fg-3)">${totalSets} Sätze · ${d.meta}</span>
                <button class="plan-btn-edit" data-action="open-unit-settings" data-unit="${d.unitId}">✏️</button>
              </div>
            </div>
            <div class="plan-title" style="margin-top:6px">${d.title}</div>
            <div class="item-list" style="margin-top:10px">
              ${exs.map(e => `
                <div class="item-row">
                  <div style="display:flex;align-items:center;gap:6px;min-width:0">
                    <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e.name}</span>
                    ${e.youtube ? '<span style="color:var(--sm-red);font-size:10px;font-weight:700">▶</span>' : ''}
                  </div>
                  <div class="spec">${e.target}</div>
                </div>`).join('')}
            </div>
            <div class="plan-card-actions">
              <button class="plan-btn-start" data-action="start-session" data-unit="${d.unitId}">▶ ${d.day} starten</button>
            </div>
          </div>`;
      }).join('')}
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

/* ---------- core & mobility ---------- */

function renderCoreCycles() {
  const prof = currentProfile();
  return `
    <div class="stack-12">
      ${CYCLES.map(c => {
        const isToday = c.today;
        const pillLabel = isToday ? (prof.coreDone ? 'erledigt' : 'offen') : 'geplant';
        return `
          <div class="cyc-card ${isToday ? 'today' : ''}">
            <div class="cyc-head">
              <div style="min-width:0">
                <div class="cyc-eyebrow">${c.eyebrow}</div>
                <div class="cyc-title">${c.title}</div>
              </div>
              <div class="pill ${isToday && prof.coreDone ? 'on' : ''}">${pillLabel}</div>
            </div>
            <div class="cyc-items">${c.items.map(([n, sp]) => `<div class="cyc-item"><span>${n}</span><span class="spec">${sp}</span></div>`).join('')}</div>
            ${isToday ? `<button class="btn-cyc ${prof.coreDone ? 'on' : ''}" data-action="core-start">${prof.coreDone ? 'Als offen markieren' : 'Zyklus A starten'}</button>` : ''}
          </div>`;
      }).join('')}
    </div>`;
}

function renderMobility() {
  const prof = currentProfile();
  return `
    <div class="stack-12">
      ${MOB.map((m, i) => {
        const done = !!(prof.mobDone && prof.mobDone[i]);
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

/* ---------- verlauf ---------- */

function renderVerlauf() {
  const prof = currentProfile();
  const bars = prof.bars || [];
  const records = prof.records || [];
  const maxBar = bars.length ? Math.max(...bars.map(b => b.total), 1) : 1;

  return `
    <div class="stack-12">
      <div class="card">
        <div class="card-title">Volumen je Woche (${prof.name})</div>
        ${bars.length ? `
          <div class="bars">
            ${bars.map(b => `
              <div class="bar-col">
                <div class="bar-track"><div class="bar-fill" style="height:${Math.round(b.total / maxBar * 100)}%; background:${prof.color}"></div></div>
                <div class="bar-label">${b.label}</div>
              </div>`).join('')}
          </div>
          <div style="margin-top:11px;font-size:11px;color:var(--fg-3)">Geloggte Arbeitssätze pro Kalenderwoche</div>
        ` : `
          <p style="font-size:12.5px;color:var(--fg-3);margin-top:8px;line-height:1.45">Noch kein Trainingsvolumen geloggt. Sobald du deine erste Einheit abschließt, wird dein Wochenverlauf hier als Diagramm aufgebaut!</p>
        `}
      </div>
      <div class="card">
        <div class="card-title">Bestwerte &amp; Progression (${prof.name})</div>
        <div>
          ${records.length ? records.map(renderRecordRow).join('') : '<p style="font-size:12.5px;color:var(--fg-3);padding:8px 0;margin:0">Noch keine Bestwerte erfasst. Sobald du Übungen abschließt, erscheinen hier deine persönlichen Rekorde!</p>'}
        </div>
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

/* ---------- exercise settings editor (all units in Block A & B) ---------- */

function renderExerciseSettings() {
  const currentUnitId = state.selectedUnit || 'A1';
  const unitMeta = getUnitMeta(currentUnitId);
  const currentBlock = unitMeta.block || 'A';
  const exercises = getUnitExercises(currentUnitId);
  const editing = state.editingExId ? exercises.find(e => e.id === state.editingExId) : null;

  if (editing) {
    return `
      <div class="stack-12">
        <div class="card">
          <div class="card-head">
            <div>
              <div class="eyebrow eyebrow-yellow">${unitMeta.dayTitle}</div>
              <div class="card-title">Übung bearbeiten</div>
            </div>
            <button class="link-btn" data-action="cancel-edit-exercise">‹ Zurück</button>
          </div>

          <div style="display:flex;flex-direction:column;gap:13px;margin-top:14px">
            <div>
              <label class="form-label">Übungsname</label>
              <input type="text" id="ex-name" class="form-input" value="${editing.name || ''}">
            </div>

            <div>
              <label class="form-label">Zielvorgabe (z.B. 4 × 6–8 · RPE 7)</label>
              <input type="text" id="ex-target" class="form-input" value="${editing.target || ''}">
            </div>

            <div>
              <label class="form-label">YouTube Tutorial Link (Video URL)</label>
              <input type="url" id="ex-youtube" class="form-input" value="${editing.youtube || ''}" placeholder="https://www.youtube.com/watch?v=...">
              ${editing.youtube ? `
                <div style="margin-top:6px">
                  <a href="${editing.youtube}" target="_blank" rel="noopener noreferrer" style="font-size:11.5px;color:var(--sm-red);font-weight:700;text-decoration:none">
                    ▶ Video jetzt testen ↗
                  </a>
                </div>` : ''}
            </div>

            <div>
              <label class="form-label">Alternative Übung</label>
              <input type="text" id="ex-alt" class="form-input" value="${editing.alt || ''}">
            </div>

            <div>
              <label class="form-label">Ausführungs-Tipp / Notiz</label>
              <textarea id="ex-note" class="form-input" rows="3">${editing.note || ''}</textarea>
            </div>

            <div>
              <label class="form-label">Warum surfrelevant</label>
              <textarea id="ex-why" class="form-input" rows="2">${editing.why || ''}</textarea>
            </div>

            <div style="display:flex;gap:10px;margin-top:10px">
              <button class="btn-block-red" style="flex:1" data-action="save-edit-exercise" data-unit="${currentUnitId}" data-ex="${editing.id}">Speichern</button>
              <button class="btn-secondary" data-action="cancel-edit-exercise">Abbrechen</button>
            </div>

            <button class="link-btn" style="color:var(--sm-red);margin-top:12px;text-align:center" data-action="delete-exercise" data-unit="${currentUnitId}" data-ex="${editing.id}">
              🗑️ Übung aus dieser Einheit entfernen
            </button>
          </div>
        </div>
      </div>`;
  }

  // Unit navigation
  const blockUnits = currentBlock === 'A'
    ? [
        { id: 'A1', label: 'A1: Zug & Schulter' },
        { id: 'A2', label: 'A2: Beine & Rumpf' },
        { id: 'A3', label: 'A3: Ganzkörper' }
      ]
    : [
        { id: 'B_mo', label: 'Montag: Zug' },
        { id: 'B_di', label: 'Dienstag: Beine' },
        { id: 'B_do', label: 'Donnerstag: Druck' },
        { id: 'B_sa', label: 'Samstag: Rotation' }
      ];

  return `
    <div class="stack-12">
      <!-- Block Switcher -->
      <div class="segmented">
        <button class="${currentBlock === 'A' ? 'active' : ''}" data-action="select-editor-block" data-block="A">Block A (Wasserphase)</button>
        <button class="${currentBlock === 'B' ? 'active' : ''}" data-action="select-editor-block" data-block="B">Block B (Hauptblock)</button>
      </div>

      <!-- Unit Pills -->
      <div class="unit-scroll-pills">
        ${blockUnits.map(u => `
          <button class="unit-pill ${currentUnitId === u.id ? 'active' : ''}" data-action="select-editor-unit" data-unit="${u.id}">
            ${u.label}
          </button>`).join('')}
      </div>

      <!-- Unit Card Head -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="eyebrow eyebrow-yellow">${unitMeta.dayTitle} · ${totalSetsForUnit(currentUnitId)} Sätze</div>
            <div class="card-title">${unitMeta.title}</div>
          </div>
          <button class="pill-btn" data-action="reset-unit-exercises" data-unit="${currentUnitId}">Standard</button>
        </div>
        <p style="font-size:12px;color:var(--fg-3);margin-top:6px;line-height:1.45">
          ${unitMeta.why}
        </p>
        <div style="margin-top:10px;display:flex;gap:8px">
          <button class="plan-btn-start" style="padding:7px 12px;font-size:11px" data-action="start-session" data-unit="${currentUnitId}">
            ▶ Diese Einheit starten
          </button>
        </div>
      </div>

      <!-- Exercise list -->
      <div class="card card-flush">
        ${exercises.map((ex, i) => `
          <div class="setting-row" style="padding:13px 14px">
            <div style="flex:1;min-width:0">
              <div style="font-family:var(--font-display);font-weight:700;font-size:14px;color:var(--sm-navy)">${i + 1}. ${ex.name}</div>
              <div style="font-size:11.5px;color:var(--fg-3);margin-top:2px">${ex.target}</div>
              ${ex.youtube
                ? `<div style="font-size:11px;color:var(--sm-red);margin-top:4px;font-weight:600;display:flex;align-items:center;gap:6px">
                    <span>▶ YouTube hinterlegt</span>
                    <a href="${ex.youtube}" target="_blank" rel="noopener noreferrer" style="color:var(--sm-red);text-decoration:underline">Testen ↗</a>
                   </div>`
                : '<div style="font-size:11px;color:#9ca3af;margin-top:3px">Kein Video hinterlegt</div>'}
            </div>
            <button class="btn-secondary" style="padding:7px 12px;font-size:11px" data-action="open-edit-exercise" data-unit="${currentUnitId}" data-ex="${ex.id}">
              Bearbeiten
            </button>
          </div>`).join('')}
      </div>

      <button class="btn-block-outline" data-action="add-new-exercise" data-unit="${currentUnitId}">
        + Neue Übung zu ${unitMeta.code || unitMeta.title} hinzufügen
      </button>

      <button class="link-btn" style="color:var(--fg-3);text-align:center;font-size:11px;padding:8px" data-action="reset-all-units">
        ⚠️ Alle Einheiten in Block A &amp; B auf Standard zurücksetzen
      </button>
    </div>`;
}

/* ---------- profile screen ---------- */

function renderProfil() {
  const prof = currentProfile();
  const otherUser = state.activeUser === 'timmy' ? 'annika' : 'timmy';
  const otherName = otherUser === 'timmy' ? 'Timmy' : 'Annika';
  const avatarInner = prof.avatarImg
    ? `<img src="${prof.avatarImg}" alt="${prof.name}" class="avatar-photo">`
    : prof.initials;

  return `
    <div class="stack-12">
      <div class="card-navy profile-head">
        <div class="profile-avatar" style="border: 2px solid rgba(255,255,255,.6); overflow:hidden; background:${prof.color}; padding:0">
          ${avatarInner}
        </div>
        <div style="flex:1;min-width:0">
          <div class="profile-name">${prof.name}</div>
          <div class="profile-sub">${prof.level}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title-inv" style="color:var(--sm-navy)">Trainingsplan &amp; Übungen anpassen</div>
        <p style="font-size:12.5px;line-height:1.45;color:var(--fg-2);margin-top:6px">
          Alle Einheiten in <strong>Block A</strong> (A1, A2, A3) und <strong>Block B</strong> (Montag, Dienstag, Donnerstag, Samstag) flexibel gestalten: Übungen austauschen, Vorgaben ändern und YouTube-Video-Links hinterlegen.
        </p>
        <button class="btn-block-red" style="margin-top:12px" data-action="nav" data-screen="exercises-settings">
          🏋️ Alle Übungen &amp; YouTube-Videos anpassen
        </button>
      </div>

      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div class="card-title-inv" style="color:var(--sm-navy)">Supabase Cloud-Sync</div>
          <div class="sync-badge ${syncStatus}" data-action="manual-sync" title="Tippen zum Synchronisieren">
            ${syncStatus === 'syncing' ? '🔄 Synchronisiere...' : (syncStatus === 'synced' ? '🟢 Verbunden' : (syncStatus === 'error' ? '⚠️ Offline-Modus' : '☁️ Cloud-Sync'))}
          </div>
        </div>
        <p style="font-size:12.5px;line-height:1.45;color:var(--fg-2);margin-top:6px">
          Sichert deine Trainingsdaten, Sätze und Übungs-Anpassungen in Echtzeit in der Cloud. Funktioniert auf iPhone und Desktop.
        </p>
        <button class="btn-secondary" style="margin-top:12px; width:100%" data-action="manual-sync">
          ☁️ Jetzt mit Supabase synchronisieren
        </button>
      </div>

      <div class="card">
        <div class="card-title-inv" style="color:var(--sm-navy)">Handy-Zuweisung</div>
        <p style="font-size:12.5px;line-height:1.45;color:var(--fg-2);margin-top:6px">
          Dieses Smartphone ist aktuell auf <strong>${prof.name}</strong> eingestellt. Deine Sätze und Streaks werden hier gesichert.
        </p>
        <button class="btn-secondary" style="margin-top:12px; width:100%" data-action="switch-user">
          🔄 Zu ${otherName} wechseln
        </button>
      </div>

      <div class="card card-flush">
        ${SETTINGS_DEF.map((s, i) => {
          const on = !!(prof.settings && prof.settings[i]);
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

/* ---------- rest bar & timer ---------- */

function restTick() {
  if (!state.restRunning) return;
  if (state.restLeft <= 1) {
    clearInterval(restInterval);
    restInterval = null;
    setState({ restLeft: 0, restRunning: false });
    return;
  }
  setState(s => ({ restLeft: s.restLeft - 1 }));
}

function restPrimary() {
  if (state.restRunning) {
    clearInterval(restInterval);
    restInterval = null;
    setState({ restRunning: false });
  } else {
    const left = state.restLeft === 0 ? 90 : state.restLeft;
    if (restInterval) clearInterval(restInterval);
    restInterval = setInterval(restTick, 1000);
    setState({ restLeft: left, restRunning: true });
  }
}

function restDismiss() {
  if (restInterval) { clearInterval(restInterval); restInterval = null; }
  setState({ rest: null, restLeft: 0, restRunning: false });
}

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

/* ---------- bottom nav ---------- */

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

function renderContent() {
  switch (state.screen) {
    case 'home': return renderHome();
    case 'session': return renderSession();
    case 'detail': return renderDetail();
    case 'plan': return renderPlan();
    case 'core': return renderCore();
    case 'verlauf': return renderVerlauf();
    case 'profil': return renderProfil();
    case 'exercises-settings': return renderExerciseSettings();
    default: return renderHome();
  }
}

function renderAll() {
  const headerEl = document.getElementById('header');
  const contentEl = document.getElementById('content');
  const restBarEl = document.getElementById('rest-bar');
  const bottomnavEl = document.getElementById('bottomnav');

  if (!state.activeUser) {
    headerEl.innerHTML = '';
    headerEl.style.display = 'none';
    bottomnavEl.style.display = 'none';
    restBarEl.innerHTML = '';
    contentEl.innerHTML = renderOnboarding();
    return;
  }

  headerEl.style.display = 'block';
  bottomnavEl.style.display = 'flex';
  headerEl.innerHTML = renderHeader();
  contentEl.innerHTML = renderContent();
  restBarEl.innerHTML = renderRestBar();
  bottomnavEl.innerHTML = renderBottomNav();
}

/* ---------- event listeners ---------- */

document.getElementById('app').addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  const unitId = el.dataset.unit;
  const exId = el.dataset.ex;
  const idx = el.dataset.idx !== undefined ? parseInt(el.dataset.idx, 10) : undefined;

  switch (action) {
    case 'select-profile': {
      setState({ activeUser: el.dataset.user });
      pullCloudSync();
      break;
    }
    case 'switch-user': {
      const nextUser = state.activeUser === 'timmy' ? 'annika' : 'timmy';
      setState({ activeUser: nextUser });
      pullCloudSync();
      break;
    }
    case 'manual-sync': {
      pullCloudSync();
      triggerCloudSync();
      break;
    }
    case 'nav': go(el.dataset.screen); break;
    case 'back': back(); break;
    case 'start-session': {
      const targetUnit = unitId || 'A1';
      setState({ screen: 'session', activeUnitId: targetUnit });
      break;
    }
    case 'finish-session': setState({ screen: 'home' }); break;
    case 'ex-info': {
      const targetUnit = unitId || state.activeUnitId || 'A1';
      setState({ screen: 'detail', activeUnitId: targetUnit, detailId: exId });
      break;
    }
    case 'open-unit-settings': {
      const targetUnit = unitId || 'A1';
      const meta = getUnitMeta(targetUnit);
      setState({
        screen: 'exercises-settings',
        selectedUnit: targetUnit,
        selectedBlock: meta.block || 'A',
        editingExId: null
      });
      break;
    }
    case 'select-editor-block': {
      const blk = el.dataset.block;
      const defaultUnit = blk === 'A' ? 'A1' : 'B_mo';
      setState({ selectedBlock: blk, selectedUnit: defaultUnit, editingExId: null });
      break;
    }
    case 'select-editor-unit': {
      setState({ selectedUnit: el.dataset.unit, editingExId: null });
      break;
    }
    case 'open-edit-exercise': {
      const targetUnit = unitId || state.selectedUnit || 'A1';
      setState({
        screen: 'exercises-settings',
        selectedUnit: targetUnit,
        selectedBlock: getUnitMeta(targetUnit).block || 'A',
        editingExId: exId
      });
      break;
    }
    case 'cancel-edit-exercise': {
      setState({ editingExId: null });
      break;
    }
    case 'add-new-exercise': {
      const targetUnit = unitId || state.selectedUnit || 'A1';
      const newId = targetUnit.toLowerCase() + '_ex_' + Date.now();
      const newEx = {
        id: newId,
        name: 'Neue Übung',
        target: '3 × 10 · RPE 7',
        youtube: '',
        note: '',
        alt: '',
        why: '',
        cues: ['Saubere Form einhalten', 'Gleichmäßig atmen'],
        sets: [{ w: 10, r: 10 }, { w: 10, r: 10 }, { w: 10, r: 10 }]
      };
      setState(s => {
        const curExs = getUnitExercises(targetUnit);
        return {
          units: {
            ...s.units,
            [targetUnit]: [...curExs, newEx]
          },
          selectedUnit: targetUnit,
          editingExId: newId,
          screen: 'exercises-settings'
        };
      });
      break;
    }
    case 'save-edit-exercise': {
      const targetUnit = unitId || state.selectedUnit || 'A1';
      const nameEl = document.getElementById('ex-name');
      const targetEl = document.getElementById('ex-target');
      const ytEl = document.getElementById('ex-youtube');
      const altEl = document.getElementById('ex-alt');
      const noteEl = document.getElementById('ex-note');
      const whyEl = document.getElementById('ex-why');

      const name = nameEl ? nameEl.value.trim() : 'Übung';
      const target = targetEl ? targetEl.value.trim() : '3 × 10 · RPE 7';
      const youtube = ytEl ? ytEl.value.trim() : '';
      const alt = altEl ? altEl.value.trim() : '';
      const note = noteEl ? noteEl.value.trim() : '';
      const why = whyEl ? whyEl.value.trim() : '';

      setState(s => {
        const curExs = getUnitExercises(targetUnit);
        const updated = curExs.map(ex => {
          if (ex.id !== exId) return ex;
          return { ...ex, name, target, youtube, alt, note, why };
        });
        return {
          units: { ...s.units, [targetUnit]: updated },
          editingExId: null
        };
      });
      break;
    }
    case 'delete-exercise': {
      const targetUnit = unitId || state.selectedUnit || 'A1';
      const meta = getUnitMeta(targetUnit);
      if (confirm(`Diese Übung wirklich aus ${meta.dayTitle} entfernen?`)) {
        setState(s => {
          const curExs = getUnitExercises(targetUnit);
          return {
            units: {
              ...s.units,
              [targetUnit]: curExs.filter(ex => ex.id !== exId)
            },
            editingExId: null
          };
        });
      }
      break;
    }
    case 'reset-unit-exercises': {
      const targetUnit = unitId || state.selectedUnit || 'A1';
      const meta = getUnitMeta(targetUnit);
      if (confirm(`Übungen für ${meta.dayTitle} auf den Standard zurücksetzen?`)) {
        setState(s => ({
          units: {
            ...s.units,
            [targetUnit]: JSON.parse(JSON.stringify(DEFAULT_UNITS[targetUnit] || []))
          },
          editingExId: null
        }));
      }
      break;
    }
    case 'reset-all-units': {
      if (confirm('Wirklich alle Einheiten in Block A und Block B auf den Standard-Plan zurücksetzen?')) {
        setState({
          units: JSON.parse(JSON.stringify(DEFAULT_UNITS)),
          editingExId: null
        });
      }
      break;
    }
    case 'set-wup':
    case 'set-wdown':
    case 'set-reps':
    case 'set-rpe':
    case 'set-toggle': {
      const targetUnit = unitId || state.activeUnitId || 'A1';
      const exercises = getUnitExercises(targetUnit);
      const ex = exercises.find(x => x.id === exId);
      if (!ex) break;
      const base = (ex.sets && ex.sets[idx]) || { w: 10, r: 10 };
      const v = getSet(targetUnit, exId, idx, base);
      if (action === 'set-wup') onWUp(targetUnit, exId, idx, v);
      else if (action === 'set-wdown') onWDown(targetUnit, exId, idx, v);
      else if (action === 'set-reps') onReps(targetUnit, exId, idx, v);
      else if (action === 'set-rpe') onRpe(targetUnit, exId, idx, v);
      else onToggle(targetUnit, exId, idx, v);
      break;
    }
    case 'plan-tab': setState({ planTab: el.dataset.tab }); break;
    case 'core-tab': setState({ coreTab: el.dataset.tab }); break;
    case 'core-start': {
      const u = state.activeUser || 'timmy';
      setState(s => {
        const prof = s.profiles[u] || DEFAULT_PROFILES[u];
        return {
          profiles: {
            ...s.profiles,
            [u]: {
              ...prof,
              coreDone: !prof.coreDone
            }
          }
        };
      });
      break;
    }
    case 'mob-toggle': {
      const u = state.activeUser || 'timmy';
      setState(s => {
        const prof = s.profiles[u] || DEFAULT_PROFILES[u];
        return {
          profiles: {
            ...s.profiles,
            [u]: {
              ...prof,
              mobDone: { ...prof.mobDone, [idx]: !prof.mobDone[idx] }
            }
          }
        };
      });
      break;
    }
    case 'setting-toggle': {
      const u = state.activeUser || 'timmy';
      setState(s => {
        const prof = s.profiles[u] || DEFAULT_PROFILES[u];
        return {
          profiles: {
            ...s.profiles,
            [u]: {
              ...prof,
              settings: { ...prof.settings, [idx]: !prof.settings[idx] }
            }
          }
        };
      });
      break;
    }
    case 'rest-primary': restPrimary(); break;
    case 'rest-dismiss': restDismiss(); break;
  }
});

renderAll();
pullCloudSync();
initRealtimeSync();
