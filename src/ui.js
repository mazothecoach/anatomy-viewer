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
  if (struct.notes) rows.push(`<dt>${t('notes_label')}</dt><dd>${escapeHtml(tf(struct.notes))}</dd>`);

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
  // La figura de sentadilla solo aplica al tema del fémur; otros temas van sin figura.
  const fig = item.id === 'femur_length'
    ? `<div class="morph-fig">${squatComparisonSVG(tf(item.long.label), tf(item.short.label))}</div>` : '';
  info.innerHTML = `<div class="muscle-card">
    <h2>${escapeHtml(tf(item.name))}</h2>
    ${fig}
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
    ${secondary ? `<dt class="hs-label">${t('secondary_muscles')}</dt><div class="muscle-chips">${secondary}</div>` : ''}
    ${ex.whereToFeel ? `<div class="feel-box"><strong>${t('where_to_feel')}</strong><span>${escapeHtml(tf(ex.whereToFeel))}</span></div>` : ''}
  </div>`;
}

// ── Movimiento: articulaciones (ROM + huesos que se mueven + acoplado) ───────
const PLANE_KEY = { sagittal: 'plane_sagittal', frontal: 'plane_frontal', transverse: 'plane_transverse' };
// Medidor de ángulo: rayo de referencia (0°) + rayo al valor del ROM + el número.
function romArc(deg) {
  const R = 32, cap = Math.min(deg, 180), rad = cap * Math.PI / 180;
  const ex = (40 + R * Math.cos(rad)).toFixed(1), ey = (40 - R * Math.sin(rad)).toFixed(1);
  return `<svg viewBox="0 0 80 50" width="64" height="40" aria-hidden="true">
    <line x1="40" y1="40" x2="72" y2="40" stroke="#444" stroke-width="2"/>
    <line x1="40" y1="40" x2="${ex}" y2="${ey}" stroke="#c6ff3d" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="40" cy="40" r="2.5" fill="#9a9a9a"/>
    <text x="40" y="13" text-anchor="middle" fill="#c6ff3d" font-size="12" font-family="sans-serif">${deg}°</text>
  </svg>`;
}
export function renderJoint(joint, structById, animate) {
  const info = $('#info');
  const boneName = id => { const s = structById.get(id); return s ? tf(s.name) : id; };
  const movs = (joint.movements || []).map((m, i) => {
    const moving = (m.movingBones || []).map(boneName).join(', ');
    const plane = m.plane && PLANE_KEY[m.plane] ? t(PLANE_KEY[m.plane]) : (m.plane || '');
    const tag = animate ? 'button' : 'div';
    const cls = animate ? 'mov-row mov-sel' : 'mov-row';
    return `<${tag} class="${cls}"${animate ? ` data-mi="${i}"` : ''}>
      <div class="mov-arc">${romArc(m.romDeg)}</div>
      <div class="mov-body">
        <strong>${escapeHtml(tf(m.name))}</strong>
        <span class="mov-meta">${escapeHtml(plane)}${moving ? ` · ${t('moves_label')}: ${escapeHtml(moving)}` : ''}</span>
      </div>
    </${tag}>`;
  }).join('');
  info.innerHTML = `<div class="muscle-card">
    <h2>${escapeHtml(tf(joint.name))}</h2>
    ${joint.type ? `<dt class="hs-label">${t('joint_type')}</dt><dd style="font-size:13px;margin:2px 0 0">${escapeHtml(tf(joint.type))}</dd>` : ''}
    <dt class="hs-label">${t('range_of_motion')}</dt>
    <div class="mov-list">${movs}</div>
    ${animate ? `<dt class="hs-label">${t('animate_label')}</dt>
      <div class="animate-ctrl">
        <div class="slider-row"><span class="slider-end" id="anim-min">0°</span>
        <input type="range" id="joint-animate" min="0" max="20" step="1" value="0" />
        <span class="slider-end" id="anim-max">20°</span></div>
        <span class="animate-hint">${t('animate_hint')}</span>
      </div>
      <div id="coupling-ctrl" class="coupling-ctrl"></div>` : ''}
    ${joint.coupledMotion ? `<div class="highlight-summary"><strong>${t('coupled_motion')}:</strong> ${escapeHtml(tf(joint.coupledMotion))}</div>` : ''}
    ${joint.notes ? `<div class="psl-note coach-only">${escapeHtml(tf(joint.notes))}</div>` : ''}
  </div>`;
}

// ── Acerca de / disclaimer de fuentes ────────────────────────────────────────
export function renderAbout() {
  $('#info').innerHTML = `<div class="muscle-card">
    <h2>${t('about_title')}</h2>
    <p style="font-size:13px;line-height:1.6;margin:8px 0 0">${escapeHtml(t('about_content'))}</p>
    <div class="highlight-summary" style="margin-top:12px">${escapeHtml(t('about_model'))}</div>
    <p style="font-size:12px;color:var(--text-dim);margin-top:12px">${escapeHtml(t('about_original'))}</p>
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
// Filtra la lista por texto, o por un conjunto de ids (búsqueda coloquial por grupo).
export function applySearchFilter(query, idSet) {
  const q = (query || '').trim().toLowerCase();
  document.querySelectorAll('#list .item').forEach(el => {
    const show = idSet ? idSet.has(el.dataset.id) : (!q || el.textContent.toLowerCase().includes(q));
    el.style.display = show ? '' : 'none';
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

// ── Picker de ejercicios AGRUPADO por GRUPO COLOQUIAL (acordeón) ─────────────
// El cliente abre "Femoral", "Glúteos", "Pecho"… y ve sus ejercicios. Adentro,
// la ficha del ejercicio muestra el músculo con su nombre científico.
export function renderExercisePicker(exercises, exGroups, onPick) {
  const picker = $('#picker');
  if (!exercises || !exercises.length) {
    picker.innerHTML = `<p class="placeholder">${t('empty_exercises')}</p>`;
    return;
  }
  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  // Índice músculo → índice de grupo coloquial (orden anatómico del archivo).
  const groupOf = new Map();
  (exGroups || []).forEach((g, i) => (g.muscleIds || []).forEach(id => groupOf.set(id, i)));
  const buckets = (exGroups || []).map(g => ({ label: tf(g.label), exs: [] }));
  const other = { label: tf({ es: 'Otros', en: 'Other' }), exs: [] };
  exercises.forEach(ex => {
    const gi = groupOf.get(ex.primaryMuscle);
    (gi != null ? buckets[gi] : other).exs.push(ex);
  });
  const ordered = [...buckets, other].filter(b => b.exs.length);

  picker.innerHTML = '';
  // Lupa: buscar ejercicio por nombre (o por grupo coloquial: "femoral", "glúteos"…).
  const search = document.createElement('input');
  search.type = 'search'; search.className = 'ex-search'; search.autocomplete = 'off';
  search.setAttribute('placeholder', t('exercise_search_ph'));
  picker.appendChild(search);
  const groupsEl = document.createElement('div');
  groupsEl.className = 'ex-groups';
  picker.appendChild(groupsEl);

  const nodes = [];
  ordered.forEach((bucket, idx) => {
    const group = document.createElement('div');
    group.className = 'ex-group' + (idx === 0 ? ' open' : '');
    const head = document.createElement('button');
    head.className = 'ex-group-head';
    head.innerHTML = `<span class="ex-group-name">${escapeHtml(bucket.label)}</span><span class="ex-count">${bucket.exs.length}</span>`;
    head.onclick = () => group.classList.toggle('open');
    const body = document.createElement('div');
    body.className = 'ex-group-body';
    const cards = [];
    bucket.exs.forEach(ex => {
      const card = document.createElement('button');
      card.className = 'picker-card sub';
      card.textContent = tf(ex.name);
      card._q = norm(`${tf(ex.name)} ${bucket.label}`);
      card.onclick = () => {
        picker.querySelectorAll('.picker-card').forEach(x => x.classList.remove('active'));
        card.classList.add('active');
        onPick(ex);
      };
      body.appendChild(card);
      cards.push(card);
    });
    group.appendChild(head);
    group.appendChild(body);
    groupsEl.appendChild(group);
    nodes.push({ group, cards, label: norm(bucket.label), first: idx === 0 });
  });

  search.addEventListener('input', () => {
    const q = norm(search.value.trim());
    nodes.forEach(({ group, cards, label, first }) => {
      if (!q) { group.style.display = ''; cards.forEach(c => c.style.display = ''); group.classList.toggle('open', first); return; }
      const labelMatch = label.includes(q);
      let any = false;
      cards.forEach(c => { const show = labelMatch || c._q.includes(q); c.style.display = show ? '' : 'none'; if (show) any = true; });
      group.style.display = any ? '' : 'none';
      group.classList.toggle('open', any); // expande los grupos con resultados
    });
  });
}

// ── Drawer / bottom-sheet móvil ──────────────────────────────────────────────
// El sheet tiene 3 estados: half (default — el modelo se ve arriba), expanded
// y peek (minimizado SIN deseleccionar: el highlight sigue en el modelo).
export function openInfoPanel() {
  if (!isNarrow()) return;
  const r = $('.right');
  r.classList.add('open');
  r.classList.remove('peek'); // una selección nueva siempre vuelve a mostrarse
}
export function closeInfoPanel() { $('.right').classList.remove('open', 'peek', 'expanded'); }
export function setSheetState(st) {
  const r = $('.right');
  r.classList.toggle('peek', st === 'peek');
  r.classList.toggle('expanded', st === 'expanded');
}
function sheetState() {
  const r = $('.right');
  return r.classList.contains('peek') ? 'peek' : (r.classList.contains('expanded') ? 'expanded' : 'half');
}
function wireSheetGestures() {
  const handle = $('#sheet-handle');
  const sheet = $('.right');
  let sy = null;
  handle.addEventListener('pointerdown', e => { sy = e.clientY; handle.setPointerCapture(e.pointerId); });
  const finish = e => {
    if (sy === null) return;
    const dy = e.clientY - sy;
    sy = null;
    const st = sheetState();
    if (dy > 28) setSheetState(st === 'expanded' ? 'half' : 'peek');       // bajar un nivel (nunca cierra)
    else if (dy < -28) setSheetState(st === 'peek' ? 'half' : 'expanded'); // subir un nivel
    else setSheetState(st === 'peek' ? 'half' : 'peek');                   // tap: minimizar/restaurar
  };
  handle.addEventListener('pointerup', finish);
  handle.addEventListener('pointercancel', () => { sy = null; });
  // en peek, tocar el sheet (título visible) lo restaura
  sheet.addEventListener('click', e => {
    if (sheetState() === 'peek' && !e.target.closest('#sheet-close') && !e.target.closest('#sheet-handle')) {
      setSheetState('half');
    }
  });
}
function openDrawer() { $('.left').classList.add('open'); $('#scrim').classList.add('show'); }
function closeDrawer() { $('.left').classList.remove('open'); $('#scrim').classList.remove('show'); }

// ── Cableado de controles ────────────────────────────────────────────────────
export function wireControls(opts) {
  const {
    viewer, onLayer, onLang, initialMode,
    onMode, onRegion, painZones, physiqueGoals, morphology, exercises, joints,
    onPickPain, onPickPhysique, onPickMorphology, onPickExercise, onPickJoint, onListPick,
    exGroups
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
    physique: $('#mode-physique'), morphology: $('#mode-morphology'), movement: $('#mode-movement')
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
    if (mode === 'exercise') renderExercisePicker(exercises, exGroups, onPickExercise);
    if (mode === 'pain') renderPickerList(painZones, 'empty_painzones', onPickPain);
    if (mode === 'physique') renderPickerList(physiqueGoals, 'empty_physique', onPickPhysique);
    if (mode === 'morphology') {
      renderPickerList(morphology, 'pick_morphology', onPickMorphology);
      if (morphology && morphology.length) onPickMorphology(morphology[0]); // auto-muestra el 1°
    }
    if (mode === 'movement') renderPickerList(joints, 'pick_movement', onPickJoint);
    onMode && onMode(mode);
  }
  modeBtns.explore.onclick = () => setMode('explore');
  modeBtns.exercise.onclick = () => setMode('exercise');
  modeBtns.pain.onclick = () => setMode('pain');
  modeBtns.physique.onclick = () => setMode('physique');
  modeBtns.morphology.onclick = () => setMode('morphology');
  modeBtns.movement.onclick = () => setMode('movement');

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

  // búsqueda (coloquial por grupo si hay onSearch; si no, texto sobre la lista)
  $('#search').addEventListener('input', e => (opts.onSearch || applySearchFilter)(e.target.value));

  // drawer / sheet móvil
  $('#toggle-sidebar').onclick = () => {
    $('.left').classList.contains('open') ? closeDrawer() : openDrawer();
  };
  $('#scrim').onclick = () => { closeDrawer(); closeInfoPanel(); };
  $('#sheet-close').onclick = closeInfoPanel;
  wireSheetGestures();
  $('#about-link').onclick = () => { renderAbout(); openInfoPanel(); };

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
