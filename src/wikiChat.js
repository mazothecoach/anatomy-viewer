// Chat de la Wiki: burbuja flotante que pregunta al worker (Cloudflare) y
// responde con el corpus de la wiki. Si el worker no está configurado o falla,
// cae con gracia al notebook de NotebookLM.
import { t } from './i18n.js';

// ← Pegar aquí la URL que imprime `npm run deploy` en worker/ (mazowiki)
const API_URL = 'https://mazowiki.mazothecoach.workers.dev';
const NOTEBOOK_URL = 'https://notebook.google.com/notebook/fedd18fd-f1a0-428a-b07a-d1848e8ef391';

const configured = !API_URL.includes('TU-SUBDOMINIO');
const history = [];
let busy = false;

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Markdown mínimo: **negritas**, links clickeables y saltos de línea.
const md = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/(https?:\/\/[^\s<]+[^\s<.,)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
  .replace(/\n/g, '<br>');

function bubble(kind, html) {
  const box = document.getElementById('wiki-chat-msgs');
  const div = document.createElement('div');
  div.className = `wc-msg ${kind}`;
  div.innerHTML = html;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

const notebookLink = () => ` <a href="${NOTEBOOK_URL}" target="_blank" rel="noopener">NotebookLM →</a>`;

async function send(text) {
  history.push({ role: 'user', content: text });
  bubble('user', md(text));
  if (!configured) {
    bubble('bot', md(t('wiki_chat_offline')) + notebookLink());
    return;
  }
  busy = true;
  const thinking = bubble('bot wc-thinking', esc(t('wiki_chat_thinking')));
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-12) }),
    });
    if (res.status === 429) {
      const data = await res.json().catch(() => ({}));
      const min = Math.max(1, Math.ceil((data.retryAfter || 3600) / 60));
      thinking.className = 'wc-msg bot';
      thinking.innerHTML = md(t('wiki_chat_limited').replace('{min}', min));
      history.pop();
      return;
    }
    if (!res.ok) throw new Error(`http ${res.status}`);
    const data = await res.json();
    thinking.className = 'wc-msg bot';
    thinking.innerHTML = md(data.reply || '…');
    history.push({ role: 'assistant', content: data.reply || '' });
  } catch (err) {
    console.warn('[wiki-chat]', err);
    thinking.className = 'wc-msg bot';
    thinking.innerHTML = md(t('wiki_chat_error')) + notebookLink();
    history.pop();
  } finally {
    busy = false;
  }
}

// Mover + redimensionar el panel (solo desktop con mouse; en cel queda el sheet).
// Persiste posición/tamaño en localStorage y agrega un botón ⟲ para resetear.
// Solo se guarda tras un GESTO del usuario (drag o resize nativo): abrir el
// panel o un cambio de layout no deben congelar la posición default.
function initDragResize(panel) {
  if (!window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) return;
  const head = panel.querySelector('.wc-head');
  panel.classList.add('wc-free');

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const anchored = () => !!panel.style.left; // ya convertido de right/bottom a left/top
  const save = () => {
    const r = panel.getBoundingClientRect();
    if (r.width < 50) return; // oculto: no guardar ceros
    localStorage.setItem('wcRect', JSON.stringify({ l: r.left, t: r.top, w: r.width, h: r.height }));
  };
  const apply = r => {
    panel.style.left = clamp(r.l, 0, window.innerWidth - 120) + 'px';
    panel.style.top = clamp(r.t, 0, window.innerHeight - 120) + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    if (r.w) panel.style.width = clamp(r.w, 280, window.innerWidth) + 'px';
    if (r.h) panel.style.height = clamp(r.h, 320, window.innerHeight) + 'px';
  };
  try {
    const saved = JSON.parse(localStorage.getItem('wcRect') || 'null');
    if (saved) apply(saved);
  } catch { /* rect corrupto: ignorar */ }

  // Cualquier gesto sobre el panel (incluye el grip de resize nativo): marcar
  // interacción y anclar a left/top para que el resize no crezca invertido.
  let interacting = false;
  panel.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    interacting = true;
    if (!anchored()) {
      const r = panel.getBoundingClientRect();
      apply({ l: r.left, t: r.top });
    }
  });
  window.addEventListener('pointerup', () => { setTimeout(() => { interacting = false; }, 200); });

  let drag = null;
  const endDrag = () => { if (drag) { drag = null; save(); } };
  head.addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.target.closest('button')) return;
    const r = panel.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    head.setPointerCapture(e.pointerId);
  });
  head.addEventListener('pointermove', e => {
    if (drag) apply({ l: e.clientX - drag.dx, t: e.clientY - drag.dy });
  });
  head.addEventListener('pointerup', endDrag);
  head.addEventListener('pointercancel', endDrag);
  head.addEventListener('lostpointercapture', endDrag);

  // Resize nativo (CSS resize: both): guardar solo si viene de un gesto real.
  new ResizeObserver(() => {
    if (interacting && !panel.classList.contains('hidden')) save();
  }).observe(panel);

  // Si la ventana cambia de tamaño, re-clampear para que nunca quede fuera.
  window.addEventListener('resize', () => {
    if (!anchored()) return;
    const r = panel.getBoundingClientRect();
    apply({ l: r.left, t: r.top });
  });

  const reset = document.createElement('button');
  reset.className = 'wc-reset';
  reset.type = 'button';
  reset.title = t('wiki_chat_reset');
  reset.textContent = '⟲';
  reset.onclick = () => { interacting = false; localStorage.removeItem('wcRect'); panel.style.cssText = ''; };
  head.insertBefore(reset, head.querySelector('.wc-close'));
}

export function initWikiChat() {
  const btn = document.getElementById('wiki-chat-btn');
  const panel = document.getElementById('wiki-chat');
  const form = document.getElementById('wiki-chat-form');
  const input = document.getElementById('wiki-chat-input');
  let greeted = false;
  initDragResize(panel);

  btn.onclick = () => {
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
      if (!greeted) { greeted = true; bubble('bot', md(t('wiki_chat_hello'))); }
      input.focus();
    }
  };
  document.getElementById('wiki-chat-close').onclick = () => panel.classList.add('hidden');

  form.onsubmit = e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || busy) return;
    input.value = '';
    send(text);
  };
}
