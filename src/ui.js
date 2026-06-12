import { t, tf, toggleLang, applyStaticStrings } from './i18n.js';

const $ = sel => document.querySelector(sel);
const isNarrow = () => window.matchMedia('(max-width: 760px)').matches;

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ── Glifo de zona de curva de fuerza ─────────────────────────────────────────
function zoneGlyph(kind) {
  const cfg = {
    short: { x1: 17, x2: 47, h: 11, color: '#c6ff3d' },
    mid:   { x1: 11, x2: 53, h: 7,  color: '#ffb84d' },
    long:  { x1: 5,  x2: 59, h: 4,  color: '#6ad1ff' }
  }[kind];
  const cy = 17, mx = (cfg.x1 + cfg.x2) / 2;
  const belly = `M ${cfg.x1} ${cy} Q ${mx} ${cy - cfg.h} ${cfg.x2} ${cy} Q ${mx} ${cy + cfg.h} ${cfg.x1} ${cy} Z`;
  return `<svg viewBox="0 0 64 34" width="56" height="30" aria-hidden="true">
    <line x1="0" y1="${cy}" x2="${cfg.x1}" y2="${cy}" stroke="#5a5a5a" stroke-width="2"/>
    <line x1="${cfg.x2}" y1="${cy}" x2="64" y2="${cy}" stroke="#5a5a5a" stroke-width="2"/>
    <path d="${belly}" fill="${cfg.color}" opacity="0.9"/>
  </svg>`;
}
function zoneRow(kind, labelKey, capKey, exercise) {
  return `<div class="zone zone-${kind}">
    <div class="zone-glyph">${zoneGlyph(kind)}</div>
    <div class="zone-body">
      <strong>${t(labelKey)}</strong>
      <span class="zone-cap">${t(capKey)}</span>
      <span class="zone-ex">${escapeHtml(tf(exercise) || '—')}</span>
    </div>
  </div>`;
}

// ── Ficha de una estructura ──────────────────────────────────────────────────
export function renderInfo(struct, meshName) {
  const info = $('#info');
  if (!struct) {
    info.innerHTML = `<div class="muscle-card">
      <h2>${escapeHtml(meshName || '—')}</h2>
      <div class="mesh">mesh: ${escapeHtml(meshName || '')}</div>
      <p class="placeholder">${t('no_data')}</p>
    </div>`;
    return;
  }
  const fc = struct.forceCurve || {};
  const rows = [];
  if (struct.location) rows.push(`<dt>${t('location')}</dt><dd>${escapeHtml(tf(struct.location))}</dd>`);
  if (struct.origin) rows.push(`<dt class="coach-only">${t('origin')}</dt><dd class="coach-only">${escapeHtml(tf(struct.origin))}</dd>`);
  if (struct.insertion) rows.push(`<dt class="coach-only">${t('insertion')}</dt><dd class="coach-only">${escapeHtml(tf(struct.insertion))}</dd>`);
  if (struct.action) rows.push(`<dt>${t('action')}</dt><dd>${escapeHtml(tf(struct.action))}</dd>`);
  if (struct.function) rows.push(`<dt class="coach-only">${t('function')}</dt><dd class="coach-only">${escapeHtml(tf(struct.function))}</dd>`);
  if (struct.innervation) rows.push(`<dt class="coach-only">${t('innervation')}</dt><dd class="coach-only">${escapeHtml(tf(struct.innervation))}</dd>`);

  const hasCurve = fc.shortened || fc.mid || fc.lengthened;
  const curveBlock = hasCurve ? `
    <dt>${t('forcecurve')}</dt>
    <dd><div class="zones">
      ${zoneRow('short', 'zone_short', 'cap_short', fc.shortened)}
      ${zoneRow('mid', 'zone_mid', 'cap_mid', fc.mid)}
      ${zoneRow('long', 'zone_long', 'cap_long', fc.lengthened)}
    </div></dd>` : '';

  const psl = struct.pslNotes && tf(struct.pslNotes)
    ? `<div class="psl-note coach-only"><strong>${t('psl_note')}:</strong> ${escapeHtml(tf(struct.pslNotes))}</div>` : '';

  info.innerHTML = `<div class="muscle-card">
    <h2>${escapeHtml(tf(struct.name))}</h2>
    <div class="mesh">mesh: ${escapeHtml(meshName || '')}</div>
    <dl>${rows.join('')}${curveBlock}</dl>
    ${psl}
  </div>`;
}

export function clearInfo() {
  $('#info').innerHTML = `<p class="placeholder">${t('select_prompt')}</p>`;
}

// Resumen de resaltado múltiple (dolor / físico): rationale + chips de músculos.
export function renderHighlightSummary(item, structById, missingIds) {
  const info = $('#info');
  const ids = item.strengthen || item.targetMuscles || [];
  const missing = new Set(missingIds || []);
  const chips = ids.map(id => {
    const s = structById.get(id);
    const label = s ? tf(s.name) : id;
    const cls = missing.has(id) ? 'chip missing' : 'chip';
    const title = missing.has(id) ? ` title="${t('not_in_model')}"` : '';
    return `<span class="${cls}"${title}>${escapeHtml(label)}</span>`;
  }).join('');
  info.innerHTML = `<div class="muscle-card">
    <h2>${escapeHtml(tf(item.name))}</h2>
    <dt class="hs-label">${t('muscles_highlighted')}</dt>
    <div class="muscle-chips">${chips || '—'}</div>
    ${item.rationale ? `<div class="highlight-summary"><strong>${t('rationale')}:</strong> ${escapeHtml(tf(item.rationale))}</div>` : ''}
  </div>`;
}

// ── Morfología: comparación fémur largo vs corto ─────────────────────────────
function squatFigure(j, femurColor) {
  // j = {ankle,knee,hip,shoulder,head,foot:[x1,x2],y}  coordenadas en el viewBox
  const L = (a, b, c, w) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const dot = p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="#9a9a9a"/>`;
  return [
    L(j.foot.slice(0,2), j.foot.slice(2,4), '#5a5a5a', 3),     // pie
    L(j.ankle, j.knee, '#888', 3),                              // pierna
    L(j.knee, j.hip, femurColor, 6),                            // FÉMUR (resaltado)
    L(j.hip, j.shoulder, '#888', 3),                            // torso
    L(j.shoulder, j.head, '#888', 3),                           // cuello
    `<circle cx="${j.head[0]}" cy="${j.head[1]}" r="7" fill="none" stroke="#888" stroke-width="3"/>`,
    dot(j.knee), dot(j.hip), dot(j.shoulder)
  ].join('');
}
function squatComparisonSVG(longLabel, shortLabel) {
  const longJ = { foot:[44,142,96,142], ankle:[60,138], knee:[94,100], hip:[48,108], shoulder:[80,60], head:[85,47] };
  const shortJ = { foot:[196,142,248,142], ankle:[214,138], knee:[234,104], hip:[212,112], shoulder:[218,62], head:[221,49] };
  return `<svg viewBox="0 0 300 168" width="100%" aria-hidden="true">
    <line x1="20" y1="142" x2="280" y2="142" stroke="#2a2a2a" stroke-width="1"/>
    ${squatFigure(longJ, '#c6ff3d')}
    ${squatFigure(shortJ, '#6ad1ff')}
    <text x="70" y="160" text-anchor="middle" fill="#c6ff3d" font-size="11" font-family="sans-serif">${escapeHtml(longLabel)}</text>
    <text x="223" y="160" text-anchor="middle" fill="#6ad1ff" font-size="11" font-family="sans-serif">${escapeHtml(shortLabel)}</text>
  </svg>`;
}
export function renderMorphology(item) {
  const info = $('#info');
  if (!item) { info.innerHTML = `<p class="placeholder">${t('pick_morphology')}</p>`; return; }
  info.innerHTML = `<div class="muscle-card">
    <h2>${escapeHtml(tf(item.name))}</h2>
    <div class="morph-fig">${squatComparisonSVG(tf(item.long.label), tf(item.short.label))}</div>
    <div class="highlight-summary">${escapeHtml(tf(item.summary))}</div>
    <dt class="hs-label" style="color:#c6ff3d">${escapeHtml(tf(item.long.label))}</dt>
    <dd style="font-size:13px;line-height:1.5;margin:3px 0 0">${escapeHtml(tf(item.long.note))}</dd>
    <dt class="hs-label" style="color:#6ad1ff">${escapeHtml(tf(item.short.label))}</dt>
    <dd style="font-size:13px;line-height:1.5;margin:3px 0 0">${escapeHtml(tf(item.short.note))}</dd>
  </div>`;
}

// ── Ejercicio: músculo objetivo + zona + dónde sentirlo ──────────────────────
const ZONE_KEY = { shortened: 'short', mid: 'mid', lengthened: 'long' };
const ZONE_LABEL = { shortened: 'zone_short', mid: 'zone_mid', lengthened: 'zone_long' };
export function renderExercise(ex, structById) {
  const info = $('#info');
  const target = ex.primaryMuscle ? structById.get(ex.primaryMuscle) : null;
  const zk = ZONE_KEY[ex.loadedZone];
  const secondary = (ex.secondaryMuscles || []).map(id => {
    const s = structById.get(id);
    return `<span class="chip">${escapeHtml(s ? tf(s.name) : id)}</span>`;
  }).join('');
  info.innerHTML = `<div class="muscle-card">
    <h2>${escapeHtml(tf(ex.name))}</h2>
    <dt class="hs-label">${t('target_muscle')}</dt>
    <dd style="font-size:14px;color:var(--accent);margin:2px 0 0">${escapeHtml(target ? tf(target.name) : (ex.primaryMuscle || '—'))}</dd>
    ${zk ? `<dt class="hs-label">${t('loaded_zone')}</dt>
      <dd><div class="zones">${zoneRow(zk, ZONE_LABEL[ex.loadedZone], 'cap_' + zk, target && target.forceCurve ? target.forceCurve[ex.loadedZone] : null)}</div></dd>` : ''}
    ${secondary ? `<dt class="hs-label">${t('muscles_highlighted')}</dt><div class="muscle-chips">${secondary}</div>` : ''}
    ${ex.whereToFeel ? `<div class="feel-box"><strong>${t('where_to_feel')}</strong><span>${escapeHtml(tf(ex.whereToFeel))}</span></div>` : ''}
  </div>`;
}

// ── Lista lateral (modo Explore) ─────────────────────────────────────────────
export function buildList(structures, linkedIds, onPick) {
  const list = $('#list');
  list.innerHTML = '';
  structures.forEach(s => {
    const el = document.createElement('div');
    const linked = linkedIds.has(s.id);
    el.className = 'item' + (linked ? '' : ' notlinked');
    el.textContent = tf(s.name);
    el.dataset.id = s.id;
    el.onclick = () => onPick(s);
    list.appendChild(el);
  });
}
export function setActiveListItem(id) {
  document.querySelectorAll('#list .item').forEach(el =>
    el.classList.toggle('active', el.dataset.id === id));
}
export function applySearchFilter(query) {
  const q = (query || '').trim().toLowerCase();
  document.querySelectorAll('#list .item').forEach(el => {
    el.style.display = !q || el.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// ── Pestañas de región ───────────────────────────────────────────────────────
export function buildRegionTabs(regions, activeRegion, onPick) {
  const host = $('#region-tabs');
  host.innerHTML = '';
  const mk = (value, key) => {
    const b = document.createElement('button');
    b.className = 'region-pill' + ((value || null) === (activeRegion || null) ? ' active' : '');
    b.textContent = t(key);
    b.dataset.region = value || '';
    b.onclick = () => {
      host.querySelectorAll('.region-pill').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      onPick(value || null);
    };
    host.appendChild(b);
  };
  mk(null, 'region_all');
  regions.forEach(r => mk(r, 'region_' + r));
}

// ── Picker (modo Dolor / Físico) ─────────────────────────────────────────────
export function renderPickerList(items, emptyKey, onPick) {
  const picker = $('#picker');
  if (!items || !items.length) {
    picker.innerHTML = `<p class="placeholder">${t(emptyKey)}</p>`;
    return;
  }
  picker.innerHTML = '';
  items.forEach(it => {
    const card = document.createElement('button');
    card.className = 'picker-card';
    card.textContent = tf(it.name);
    card.onclick = () => {
      picker.querySelectorAll('.picker-card').forEach(x => x.classList.remove('active'));
      card.classList.add('active');
      onPick(it);
    };
    picker.appendChild(card);
  });
}

// ── Drawer / bottom-sheet móvil ──────────────────────────────────────────────
export function openInfoPanel() { if (isNarrow()) $('.right').classList.add('open'); }
export function closeInfoPanel() { $('.right').classList.remove('open'); }
function openDrawer() { $('.left').classList.add('open'); $('#scrim').classList.add('show'); }
function closeDrawer() { $('.left').classList.remove('open'); $('#scrim').classList.remove('show'); }

// ── Cableado de controles ────────────────────────────────────────────────────
export function wireControls(opts) {
  const {
    viewer, onLayer, onLang, initialMode,
    onMode, onRegion, painZones, physiqueGoals, morphology, exercises,
    onPickPain, onPickPhysique, onPickMorphology, onPickExercise, onListPick
  } = opts;

  // idioma
  $('#toggle-lang').onclick = () => { toggleLang(); onLang && onLang(); };

  // vista coach / cliente (ui.js es dueño único de body.client)
  const viewBtn = $('#toggle-view');
  let clientMode = initialMode === 'client';
  document.body.classList.toggle('client', clientMode);
  function paintViewBtn() { viewBtn.textContent = clientMode ? t('view_client') : t('view_coach'); }
  paintViewBtn();
  viewBtn.onclick = () => {
    clientMode = !clientMode;
    document.body.classList.toggle('client', clientMode);
    paintViewBtn();
  };

  // modo Explore / Dolor / Físico
  let currentMode = 'explore';
  const modeBtns = {
    explore: $('#mode-explore'), exercise: $('#mode-exercise'), pain: $('#mode-pain'),
    physique: $('#mode-physique'), morphology: $('#mode-morphology')
  };
  function setMode(mode) {
    currentMode = mode;
    Object.entries(modeBtns).forEach(([m, b]) => b.classList.toggle('active', m === mode));
    viewer.clearHighlight();
    viewer.clearIsolation();
    clearInfo();
    const explore = mode === 'explore';
    $('#explore-panel').classList.toggle('hidden', !explore);
    $('#picker').classList.toggle('hidden', explore);
    if (mode === 'exercise') renderPickerList(exercises, 'empty_exercises', onPickExercise);
    if (mode === 'pain') renderPickerList(painZones, 'empty_painzones', onPickPain);
    if (mode === 'physique') renderPickerList(physiqueGoals, 'empty_physique', onPickPhysique);
    if (mode === 'morphology') {
      renderPickerList(morphology, 'pick_morphology', onPickMorphology);
      if (morphology && morphology.length) onPickMorphology(morphology[0]); // auto-muestra el 1°
    }
    onMode && onMode(mode);
  }
  modeBtns.explore.onclick = () => setMode('explore');
  modeBtns.exercise.onclick = () => setMode('exercise');
  modeBtns.pain.onclick = () => setMode('pain');
  modeBtns.physique.onclick = () => setMode('physique');
  modeBtns.morphology.onclick = () => setMode('morphology');

  // capas músculo / hueso
  $('#layer-muscle').onclick = () => switchLayer('muscle');
  $('#layer-bone').onclick = () => switchLayer('bone');
  function switchLayer(layer) {
    $('#layer-muscle').classList.toggle('active', layer === 'muscle');
    $('#layer-bone').classList.toggle('active', layer === 'bone');
    viewer.setLayer(layer);
    onLayer && onLayer(layer);
  }

  // cámara
  $('#btn-reset').onclick = () => viewer.reset();
  $('#btn-fit').onclick = () => viewer.fit();

  // búsqueda (texto sobre la lista ya filtrada por región)
  $('#search').addEventListener('input', e => applySearchFilter(e.target.value));

  // drawer / sheet móvil
  $('#toggle-sidebar').onclick = () => {
    $('.left').classList.contains('open') ? closeDrawer() : openDrawer();
  };
  $('#scrim').onclick = () => { closeDrawer(); closeInfoPanel(); };
  $('#sheet-close').onclick = closeInfoPanel;

  return { repaintViewBtn: paintViewBtn, setMode, getMode: () => currentMode, closeDrawer };
}

export function setStatus(key, cls = '') {
  const el = $('#status');
  el.textContent = t(key);
  el.className = 'status ' + cls;
}
export function showEmpty(show) { $('#empty').classList.toggle('hidden', !show); }
export function showProgress(show, pct = 0) {
  const p = $('#progress');
  p.classList.toggle('show', show);
  if (show) { $('#progress-text').textContent = t('status_loading'); $('#progress-bar').style.width = Math.round(pct * 100) + '%'; }
}

export { applyStaticStrings };
