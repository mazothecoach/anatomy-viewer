import { t, tf, toggleLang, applyStaticStrings } from './i18n.js';

const $ = sel => document.querySelector(sel);

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Glifo SVG del vientre muscular dibujado a su longitud real por zona.
// short = contraído (corto+grueso, lima); mid = neutral (ámbar); long = estirado (largo+fino, azul).
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

// Renderiza la ficha de una estructura (músculo/hueso) en el idioma activo.
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
  rows.push(`<dt>${t('location')}</dt><dd>${escapeHtml(tf(struct.location))}</dd>`);
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

// Construye la lista lateral con las estructuras que existen en la BD,
// marcando cuáles enlazaron a una malla del modelo cargado.
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

// Cablea todos los controles de UI. Devuelve helpers para el main.
export function wireControls({ viewer, getStructures, onLayer, onLang }) {
  $('#toggle-lang').onclick = () => { toggleLang(); onLang && onLang(); };

  const viewBtn = $('#toggle-view');
  let clientMode = false;
  function paintViewBtn() { viewBtn.textContent = clientMode ? t('view_client') : t('view_coach'); }
  paintViewBtn();
  viewBtn.onclick = () => {
    clientMode = !clientMode;
    document.body.classList.toggle('client', clientMode);
    paintViewBtn();
  };

  $('#layer-muscle').onclick = () => switchLayer('muscle');
  $('#layer-bone').onclick = () => switchLayer('bone');
  function switchLayer(layer) {
    $('#layer-muscle').classList.toggle('active', layer === 'muscle');
    $('#layer-bone').classList.toggle('active', layer === 'bone');
    viewer.setLayer(layer);
    onLayer && onLayer(layer);
  }

  $('#btn-reset').onclick = () => viewer.reset();
  $('#btn-fit').onclick = () => viewer.fit();

  $('#search').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('#list .item').forEach(el => {
      el.style.display = !q || el.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  return { repaintViewBtn: paintViewBtn };
}

export function setStatus(key, cls = '') {
  const el = $('#status');
  el.textContent = t(key);
  el.className = 'status ' + cls;
}

export function showEmpty(show) {
  $('#empty').classList.toggle('hidden', !show);
}

export function showProgress(show, pct = 0) {
  const p = $('#progress');
  p.classList.toggle('show', show);
  if (show) { $('#progress-text').textContent = t('status_loading'); $('#progress-bar').style.width = Math.round(pct * 100) + '%'; }
}

export { applyStaticStrings };
