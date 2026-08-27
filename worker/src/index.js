// Proxy de la Wiki Mazothecoach: recibe preguntas del visor (GitHub Pages),
// aplica rate limits y responde con Claude usando el corpus de la wiki.
// La API key vive como secret del worker; nunca llega al navegador.
import Anthropic from '@anthropic-ai/sdk';
import { QA, SECTIONS } from './corpus.js';

const ALLOWED_ORIGINS = [
  'https://mazothecoach.github.io',
  'http://localhost:5174',
  'http://localhost:4173',
];

const MODEL = 'claude-opus-5'; // cambiar a 'claude-haiku-4-5' abarata ~5x cada respuesta

const SYSTEM_INTRO = `Eres la Wiki de Mazothecoach: asistente educativo del visor anatómico 3D (https://mazothecoach.github.io/anatomy-viewer/) para clientas y clientes de coaching.

Reglas:
- Responde SOLO con el contenido de la wiki que te paso abajo. Las secciones "Respuesta de Mazo: …" son respuestas que Mazo ya dio a dudas de clientes: son la fuente MÁS autorizada — úsalas en su voz.
- Si la pregunta NO está cubierta, responde CORTO con exactamente esta estructura y nada más:
  "Mazo aún no tiene una respuesta en la wiki. Él ya recibió esta pregunta y la contestará pronto."
  Si en las secciones hay algo parcialmente relacionado, agrega UNA línea: "Lo que sí hay en la wiki o similar es: <resumen brevísimo de lo relacionado>."
  Cierra con: "Si corre prisa, pregúntale directo a Mazo (@mazobastidas_ en Instagram)."
  Prohibido alargarlo con párrafos, disculpas o explicaciones extra.
  Si respondes en otro idioma, traduce la estructura pero SIEMPRE que uses este fallback termina con el token literal [[SIN_RESPUESTA]] en su propia línea (nunca lo traduzcas ni lo uses en respuestas normales).
- Tono Mazothecoach: honesto, técnico pero claro, sin humo motivacional. Directo y compacto (3-6 oraciones normalmente, listas cortas si ayudan).
- Responde en el idioma de la pregunta (español por defecto).
- No es consejo médico: si describen dolor agudo, lesión o algo clínico, recomienda evaluación profesional en vez de adivinar.
- No inventes rangos, orígenes ni inserciones que no estén en el corpus.
- Videos (secciones "Video: …"): si un video trata EXACTAMENTE el tema de la pregunta, ciérralo con "Este video lo explica: <link>". Si el video solo es cercano o parcialmente relacionado, usa "Este video te podría servir: <link>". NUNCA compartas un link que no venga en esas secciones ni modifiques los links.`;

// ── Rate limits (KV) ─────────────────────────────────────────────────────────
async function checkLimits(env, ip) {
  const now = new Date();
  const hourKey = `ip:${ip}:${now.toISOString().slice(0, 13)}`;      // por IP por hora
  const dayKey = `day:${now.toISOString().slice(0, 10)}`;            // global por día
  const [ipCount, dayCount] = await Promise.all([env.RATE.get(hourKey), env.RATE.get(dayKey)]);
  const ipLimit = parseInt(env.RATE_LIMIT_IP_HOUR || '10', 10);
  const dayLimit = parseInt(env.RATE_LIMIT_GLOBAL_DAY || '300', 10);

  if ((parseInt(dayCount || '0', 10)) >= dayLimit) {
    return { ok: false, retryAfter: 86400 - (now.getUTCHours() * 3600 + now.getUTCMinutes() * 60) };
  }
  if ((parseInt(ipCount || '0', 10)) >= ipLimit) {
    return { ok: false, retryAfter: 3600 - (now.getUTCMinutes() * 60 + now.getUTCSeconds()) };
  }
  await Promise.all([
    env.RATE.put(hourKey, String(parseInt(ipCount || '0', 10) + 1), { expirationTtl: 3700 }),
    env.RATE.put(dayKey, String(parseInt(dayCount || '0', 10) + 1), { expirationTtl: 90000 }),
  ]);
  return { ok: true };
}

// ── Selección de contexto ────────────────────────────────────────────────────
// Elige las secciones del corpus más relevantes a la pregunta (match por
// términos, sin acentos) hasta ~14KB — mantiene barato cada mensaje.
const STOP = new Set(['que', 'como', 'donde', 'cual', 'para', 'con', 'los', 'las', 'una', 'del', 'por', 'mis', 'the', 'and', 'for', 'what', 'how', 'where', 'should', 'debo', 'deberia', 'hasta', 'hago', 'esta', 'este', 'when', 'why']);
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const tokens = s => norm(s).split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !STOP.has(w));

// ── Conocimiento enseñado por Mazo ──────────────────────────────────────────
// Respuestas que Mazo da desde /admin: entran al corpus al instante, sin
// redeploy. Fuente de verdad: una key KV por entrada (`kbe:<id>`) — escribir o
// borrar nunca reescribe el resto (sin read-modify-write). `kb:all` es solo un
// blob compilado para que el chat lea 1 key; se regenera en cada /teach.
// `add`/`removeT` compensan la consistencia eventual de KV list: la key recién
// escrita (o borrada) puede no aparecer aún en el listado, así que se fusiona
// (o excluye) explícitamente al compilar el blob.
async function rebuildKb(env, add = null, removeT = null) {
  const keys = [];
  let cursor;
  do {
    const page = await env.RATE.list({ prefix: 'kbe:', cursor });
    keys.push(...page.keys);
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  let kb = (await Promise.all(keys.map(async k => {
    try { return JSON.parse(await env.RATE.get(k.name)); } catch { return null; }
  }))).filter(Boolean);
  if (removeT) kb = kb.filter(e => e.t !== removeT);
  if (add && !kb.some(e => e.t === add.t)) kb.push(add);
  kb.sort((a, b) => a.t.localeCompare(b.t));
  await env.RATE.put('kb:all', JSON.stringify(kb));
  return kb;
}
async function getKb(env) {
  const raw = await env.RATE.get('kb:all');
  if (raw !== null) { try { return JSON.parse(raw); } catch { /* blob corrupto: recompilar */ } }
  return rebuildKb(env);
}
const kbToSections = kb => kb.map(e => ({
  doc: 'respuestas-de-mazo',
  title: `Respuesta de Mazo: ${e.q}`,
  text: `## Respuesta de Mazo: ${e.q}\n${e.a}`,
}));

function pickSections(question, extraSections = [], budget = 14000) {
  const q = tokens(question);
  if (!q.length) return [];
  const scored = [...extraSections, ...SECTIONS].map(sec => {
    const title = norm(sec.title), text = norm(sec.text);
    let score = 0;
    for (const w of q) {
      if (title.includes(w)) score += 5;
      let i = 0, hits = 0;
      while ((i = text.indexOf(w, i)) !== -1 && hits < 4) { hits++; i += w.length; }
      score += hits;
    }
    return { sec, score };
  }).filter(x => x.score > 2).sort((a, b) => b.score - a.score);

  const picked = [];
  let total = 0;
  for (const { sec } of scored) {
    if (total + sec.text.length > budget) continue;
    picked.push(sec);
    total += sec.text.length;
    if (picked.length >= 10) break;
  }
  return picked;
}

// ── Página /admin (para Mazo, desde el cel) ─────────────────────────────────
const ADMIN_HTML = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Wiki — dudas</title>
<style>
  :root { --bg:#0b0b0b; --panel:#161616; --lime:#c6f432; --txt:#f2f2f2; --dim:#9c9c9c; --border:#2a2a2a; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--txt); font:15px/1.5 system-ui, sans-serif; padding:16px; max-width:720px; margin-inline:auto; }
  h1 { font-size:18px; color:var(--lime); letter-spacing:.5px; }
  h2 { font-size:14px; color:var(--dim); text-transform:uppercase; letter-spacing:1px; margin-top:28px; }
  .card { background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:14px; margin:10px 0; }
  .q { font-weight:600; }
  .meta { font-size:12px; color:var(--dim); margin:4px 0 8px; }
  .pend { border-left:3px solid var(--lime); }
  textarea, input[type=text] { width:100%; background:#0f0f0f; color:var(--txt); border:1px solid var(--border); border-radius:8px; padding:10px; font:inherit; margin-top:6px; }
  textarea { min-height:76px; resize:vertical; }
  button { background:var(--lime); color:#111; border:0; border-radius:8px; padding:9px 16px; font:inherit; font-weight:700; margin-top:8px; cursor:pointer; }
  button.sec { background:transparent; color:var(--dim); border:1px solid var(--border); font-weight:400; }
  .ok { color:var(--lime); font-size:13px; margin-left:8px; }
  .ans { white-space:pre-wrap; color:var(--dim); font-size:13px; margin-top:6px; }
  .qe { font-weight:600; }
</style></head><body>
<h1>WIKI MAZOTHECOACH — DUDAS</h1>
<p style="color:var(--dim);font-size:13px">Contesta aquí y la wiki aprende al instante (sin redeploy). Tu respuesta se usa en tu voz cuando alguien pregunte algo parecido. Puedes editar la pregunta antes de publicar.</p>
<p id="err" style="color:#ff7a7a;font-size:13px"></p>
<h2>Dudas pendientes</h2><div id="pend"></div>
<h2>Enseñar algo nuevo</h2>
<div class="card"><input type="text" id="nq" placeholder="Pregunta (como la haría una clienta)">
<textarea id="na" placeholder="Tu respuesta, en tu tono"></textarea>
<button onclick="teach(nq.value, na.value, this).then(ok => { if (ok) { nq.value=''; na.value=''; } })">Publicar</button></div>
<h2>Respuestas publicadas</h2><div id="kb"></div>
<h2>Todas las preguntas (90 días)</h2><div id="all"></div>
<script>
const KEY = new URLSearchParams(location.search).get('admin');
const api = (p, opts) => fetch(p + '?admin=' + encodeURIComponent(KEY), opts).then(r => r.json());
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
async function teach(q, a, btn) {
  q = (q || '').trim(); a = (a || '').trim();
  if (!q || !a) { alert('Falta la pregunta o la respuesta'); return false; }
  btn.disabled = true;
  const r = await api('/teach', { method:'POST', body: JSON.stringify({ q, a }) }).catch(() => null);
  btn.disabled = false;
  if (r && r.ok) { btn.insertAdjacentHTML('afterend', '<span class="ok">publicada ✓</span>'); load(); return true; }
  alert('No se pudo publicar' + (r && r.error ? ' (' + r.error + ')' : '')); return false;
}
async function borrar(t) {
  if (!confirm('¿Borrar esta respuesta de la wiki?')) return;
  await api('/teach', { method:'POST', body: JSON.stringify({ del: t }) });
  load();
}
function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/ +/g,' ').trim(); }
// La pregunta va en un <input> editable (Mazo puede limpiarla antes de
// publicar) y los botones usan data-attributes con un handler delegado:
// cero JS inyectado en atributos onclick.
function card(it, id, esPend) {
  const caja = '<textarea class="ae" id="a_' + id + '" data-q="' + esc(norm(it.q)) + '" placeholder="Tu respuesta…"></textarea>' +
    '<button data-teach="' + id + '">Publicar respuesta</button>';
  return '<div class="card' + (esPend ? ' pend' : '') + '">' +
    '<input type="text" class="qe" id="q_' + id + '" value="' + esc(it.q) + '">' +
    '<div class="meta">' + it.n + '× · última ' + it.t.slice(0,10) + (it.pend && !esPend ? ' · <b style="color:var(--lime)">sin respuesta</b>' : '') + '</div>' +
    (esPend ? caja : '<details><summary style="cursor:pointer;color:var(--dim);font-size:13px">Responder</summary>' + caja + '</details>') +
    '</div>';
}
document.addEventListener('click', e => {
  const d = e.target.dataset || {};
  if (d.teach) teach(document.getElementById('q_' + d.teach).value, document.getElementById('a_' + d.teach).value, e.target);
  if (d.del) borrar(d.del);
});
async function load() {
  try {
    const [qs, kbr] = await Promise.all([api('/questions'), api('/kb')]);
    if (qs.error || kbr.error) throw new Error(qs.error || kbr.error);
    const kb = kbr.kb || [];
    // conservar borradores escritos antes de re-renderizar
    const drafts = new Map();
    document.querySelectorAll('textarea.ae').forEach(t => { if (t.value.trim()) drafts.set(t.dataset.q, t.value); });
    document.getElementById('kb').innerHTML = kb.map(e =>
      '<div class="card"><div class="q">' + esc(e.q) + '</div><div class="ans">' + esc(e.a) + '</div>' +
      '<button class="sec" data-del="' + esc(e.t) + '">Borrar</button></div>').join('') || '<p class="meta">Nada aún.</p>';
    // dedupe por texto normalizado; pendientes = marcadas sinRespuesta y sin respuesta publicada parecida
    const seen = new Map();
    for (const q of (qs.questions || [])) {
      const k = norm(q.q);
      if (!k) continue;
      const cur = seen.get(k) || { q: q.q, n: 0, t: q.t, pend: false };
      cur.n++; if (q.t > cur.t) cur.t = q.t;
      if (q.sinRespuesta) cur.pend = true;
      seen.set(k, cur);
    }
    const kbNorm = kb.map(e => norm(e.q));
    const items = [...seen.values()].sort((a, b) => b.t.localeCompare(a.t));
    const pend = items.filter(it => it.pend && !kbNorm.some(k => k === norm(it.q)));
    document.getElementById('pend').innerHTML = pend.map((it, i) => card(it, 'p' + i, true)).join('') || '<p class="meta">Sin pendientes 🎉</p>';
    document.getElementById('all').innerHTML = items.map((it, i) => card(it, 't' + i, false)).join('');
    document.querySelectorAll('textarea.ae').forEach(t => { if (drafts.has(t.dataset.q)) t.value = drafts.get(t.dataset.q); });
    document.getElementById('err').textContent = '';
  } catch (e) {
    document.getElementById('err').textContent = 'No se pudo cargar (' + e.message + '). Revisa la clave admin del link o recarga.';
  }
}
load();
</script></body></html>`;

// ── HTTP ─────────────────────────────────────────────────────────────────────
function cors(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };
}
const json = (obj, status, headers) => new Response(JSON.stringify(obj), { status, headers });

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const headers = cors(origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

    const url = new URL(request.url);
    const adminKey = request.headers.get('X-Admin-Key') || url.searchParams.get('admin');
    const isAdmin = env.ADMIN_KEY && adminKey === env.ADMIN_KEY;

    // POST /teach — Mazo publica (o borra) una respuesta; entra al corpus al
    // instante vía KV. Va ANTES del check de Origin: se usa desde /admin
    // (mismo origen del worker) y desde scripts, siempre con clave admin.
    if (request.method === 'POST' && url.pathname === '/teach') {
      if (!isAdmin) return json({ error: 'forbidden' }, 403, headers);
      let b;
      try { b = await request.json(); } catch { return json({ error: 'bad_json' }, 400, headers); }
      if (b.del) {
        await env.RATE.delete(`kbe:${b.del}`);
        const kb = await rebuildKb(env, null, b.del);
        return json({ ok: true, count: kb.length }, 200, headers);
      }
      const q = typeof b.q === 'string' ? b.q.trim() : '';
      const a = typeof b.a === 'string' ? b.a.trim() : '';
      // límite de q alineado con el máximo que acepta el chat (800)
      if (!q || !a || q.length > 800 || a.length > 3000) return json({ error: 'bad_entry' }, 400, headers);
      const t = `${new Date().toISOString()}:${Math.random().toString(36).slice(2, 6)}`;
      await env.RATE.put(`kbe:${t}`, JSON.stringify({ q, a, t }));
      const kb = await rebuildKb(env, { q, a, t });
      return json({ ok: true, count: kb.length }, 200, headers);
    }

    if (request.method === 'GET') {
      // GET /kb — lista de respuestas enseñadas (para la página /admin).
      if (url.pathname === '/kb') {
        if (!isAdmin) return json({ error: 'forbidden' }, 403, headers);
        return json({ kb: await getKb(env) }, 200, headers);
      }
      // GET /admin — panel para que Mazo conteste dudas desde el cel.
      if (url.pathname === '/admin') {
        if (!isAdmin) return new Response('forbidden', { status: 403 });
        return new Response(ADMIN_HTML, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
      // Dudas registradas (solo Mazo, con clave admin): alimenta el reporte
      // semanal de los viernes y la lista de videos por grabar.
      if (url.pathname === '/questions') {
        if (!isAdmin) return json({ error: 'forbidden' }, 403, headers);
        const keys = [];
        let cursor;
        do {
          const page = await env.RATE.list({ prefix: 'q:', cursor });
          keys.push(...page.keys);
          cursor = page.list_complete ? null : page.cursor;
        } while (cursor);
        // El nombre empieza con timestamp ISO → orden lexicográfico = cronológico.
        // Cap a las 400 más nuevas: mantiene la página rápida y lejos del límite
        // de operaciones KV por invocación.
        keys.sort((a, b) => b.name.localeCompare(a.name));
        const recent = keys.slice(0, 400);
        const questions = (await Promise.all(
          recent.map(async k => { try { return JSON.parse(await env.RATE.get(k.name)); } catch { return null; } }
        ))).filter(Boolean).sort((a, b) => (a.t < b.t ? -1 : 1));
        return json({ count: questions.length, total: keys.length, questions }, 200, headers);
      }
      return json({ ok: true, service: 'mazowiki' }, 200, headers);
    }
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, headers);
    if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ error: 'forbidden_origin' }, 403, headers);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400, headers); }

    // Validación del historial que manda el widget
    const msgs = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return json({ error: 'bad_messages' }, 400, headers);
    for (const m of msgs) {
      if ((m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string' || m.content.length > 800) {
        return json({ error: 'bad_messages' }, 400, headers);
      }
    }

    if (!env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 503, headers);

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const limit = await checkLimits(env, ip);
    if (!limit.ok) return json({ error: 'rate_limited', retryAfter: limit.retryAfter }, 429, headers);

    const question = msgs[msgs.length - 1].content;
    // Si KV falla aquí, el chat degrada a responder sin lo enseñado (nunca 500).
    const kb = await getKb(env).catch(() => []);
    const picked = pickSections(question, kbToSections(kb));

    // Registro de dudas (90 días): alimenta el reporte semanal y la página /admin.
    // `video` = si alguna sección de video matcheó (las que no, son ideas de contenido).
    const hasVideo = picked.some(s => /^Video:/i.test(s.title));
    const nowIso = new Date().toISOString();
    const qKey = `q:${nowIso}:${Math.random().toString(36).slice(2, 6)}`;
    const qTtl = { expirationTtl: 60 * 60 * 24 * 90 };
    ctx.waitUntil(env.RATE.put(qKey, JSON.stringify({ t: nowIso, q: question, video: hasVideo }), qTtl));
    const dynamicContext = picked.length
      ? `\n\n# Secciones relevantes de la wiki\n\n${picked.map(s => `(${s.doc})\n${s.text}`).join('\n\n')}`
      : '';

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    try {
      const resp = await client.messages.create({
        model: MODEL,
        max_tokens: 1500,
        output_config: { effort: 'low' },
        system: [
          // Bloque estable (intro + Q&A completo) con cache — se reusa entre mensajes
          { type: 'text', text: `${SYSTEM_INTRO}\n\n# Q&A de coaching (voz de Mazo)\n\n${QA}`, cache_control: { type: 'ephemeral' } },
          // Bloque dinámico: secciones elegidas para ESTA pregunta
          ...(dynamicContext ? [{ type: 'text', text: dynamicContext }] : []),
        ],
        messages: msgs.map(m => ({ role: m.role, content: m.content })),
      });

      if (resp.stop_reason === 'refusal') {
        return json({ reply: 'Esa pregunta no la puedo responder aquí. Pregúntale directo a Mazo (@mazobastidas_ en Instagram).' }, 200, headers);
      }
      let reply = resp.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
      // Fallback "no está en la wiki": el modelo lo marca con el token
      // [[SIN_RESPUESTA]] (independiente del idioma); la frase en español queda
      // como red de seguridad. Se quita el token antes de responder al widget
      // y la duda se marca pendiente — /admin la muestra primero.
      const sinResp = reply.includes('[[SIN_RESPUESTA]]') || /aún no tiene una respuesta en la wiki/i.test(reply);
      reply = reply.replace(/\s*\[\[SIN_RESPUESTA\]\]\s*/g, '').trim();
      if (sinResp) {
        ctx.waitUntil(env.RATE.put(qKey, JSON.stringify({ t: nowIso, q: question, video: hasVideo, sinRespuesta: true }), qTtl));
      }
      return json({ reply: reply || '…' }, 200, headers);
    } catch (err) {
      const status = err && err.status;
      if (status === 429 || (status >= 500)) return json({ error: 'upstream_busy' }, 503, headers);
      console.error('anthropic error', status, err && err.message);
      return json({ error: 'upstream_error' }, 502, headers);
    }
  },
};
