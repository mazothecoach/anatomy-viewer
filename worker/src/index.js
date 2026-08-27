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
- Responde SOLO con el contenido de la wiki que te paso abajo. Si la pregunta no está cubierta, dilo honesto y sugiere preguntarle directo a Mazo (@mazothecoach).
- Tono Mazothecoach: honesto, técnico pero claro, sin humo motivacional. Directo y compacto (3-6 oraciones normalmente, listas cortas si ayudan).
- Responde en el idioma de la pregunta (español por defecto).
- No es consejo médico: si describen dolor agudo, lesión o algo clínico, recomienda evaluación profesional en vez de adivinar.
- No inventes rangos, orígenes ni inserciones que no estén en el corpus.
- Si entre las secciones hay un video de Mazo relevante (secciones "Video: …"), cierra tu respuesta compartiendo su link tal cual, con una frase tipo "Aquí Mazo te lo explica a mayor detalle: <link>". NUNCA compartas un link que no venga en esas secciones ni modifiques los links.`;

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

function pickSections(question, budget = 14000) {
  const q = tokens(question);
  if (!q.length) return [];
  const scored = SECTIONS.map(sec => {
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
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = cors(origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method === 'GET') return json({ ok: true, service: 'mazowiki' }, 200, headers);
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
    const picked = pickSections(question);
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
        return json({ reply: 'Esa pregunta no la puedo responder aquí. Pregúntale directo a Mazo (@mazothecoach).' }, 200, headers);
      }
      const reply = resp.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
      return json({ reply: reply || '…' }, 200, headers);
    } catch (err) {
      const status = err && err.status;
      if (status === 429 || (status >= 500)) return json({ error: 'upstream_busy' }, 503, headers);
      console.error('anthropic error', status, err && err.message);
      return json({ error: 'upstream_error' }, 502, headers);
    }
  },
};
