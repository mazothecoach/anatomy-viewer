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

export function initWikiChat() {
  const btn = document.getElementById('wiki-chat-btn');
  const panel = document.getElementById('wiki-chat');
  const form = document.getElementById('wiki-chat-form');
  const input = document.getElementById('wiki-chat-input');
  let greeted = false;

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
