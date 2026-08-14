# mazowiki — proxy del chat de la Wiki

Cloudflare Worker que conecta el chat del visor (GitHub Pages) con Claude:
guarda la API key como secret, aplica **rate limits** (por IP/hora + tope
global/día) y arma el contexto con las secciones relevantes de la wiki.

## Deploy (una sola vez, ~5 min)

```bash
cd worker
npm install
npx wrangler login                      # abre el navegador (cuenta Cloudflare, plan free basta)
npx wrangler kv namespace create RATE   # imprime un id → pégalo en wrangler.toml (kv_namespaces.id)
npx wrangler secret put ANTHROPIC_API_KEY   # pega tu API key de console.anthropic.com
npm run deploy                          # regenera corpus.js y publica
```

El deploy imprime la URL (algo como `https://mazowiki.<subdominio>.workers.dev`).
Pégala en `src/wikiChat.js` (const `API_URL`) del visor y redeploya el visor.

## Ajustes

- **Límites**: `RATE_LIMIT_IP_HOUR` y `RATE_LIMIT_GLOBAL_DAY` en `wrangler.toml` → `npx wrangler deploy`.
- **Costo por respuesta**: `MODEL` en `src/index.js`. `claude-opus-5` (default, mejor calidad) ≈ 2-4¢ por respuesta; `claude-haiku-4-5` ≈ 0.5¢.
- **Actualizar contenido**: tras regenerar la wiki (`node tools/build-wiki.mjs`), corre `npm run deploy` aquí (regenera `src/corpus.js`).

## Qué hace por dentro

1. CORS: solo acepta requests desde `mazothecoach.github.io` (y localhost en dev).
2. Rate limit en Workers KV: si se pasa, responde 429 y el widget muestra el aviso.
3. Selección de contexto: puntúa las ~200 secciones de la wiki contra la pregunta
   y manda solo las top (~14KB) + el Q&A completo (con prompt caching en el bloque estable).
4. Llama a la API de Anthropic y regresa `{ reply }`.
