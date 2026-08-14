// Convierte los .md de la wiki en src/corpus.js para el worker.
// Corre después de regenerar la wiki (tools/build-wiki.mjs):
//   node build-corpus.mjs
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const WIKI = 'C:/Users/fbast/OneDrive/Freelance/Mazothecoach/Knowledge/wiki';

const read = f => readFileSync(join(WIKI, f), 'utf8');

// El Q&A completo viaja SIEMPRE en el system prompt (es la voz de Mazo).
const qa = read('wiki-coaching-qa.md');

// El resto se parte en secciones (## ...) y el worker elige las relevantes
// por pregunta — así no se mandan 120KB de corpus en cada mensaje.
const sections = [];
for (const file of ['wiki-musculos.md', 'wiki-ejercicios.md', 'wiki-articulaciones.md', 'wiki-dolor-morfologia.md']) {
  const raw = read(file);
  const docTitle = (raw.match(/^# (.+)$/m) || [, file])[1];
  const parts = raw.split(/^## /m).slice(1); // lo anterior al primer ## es el intro del doc
  for (const p of parts) {
    const nl = p.indexOf('\n');
    const title = p.slice(0, nl).trim();
    const text = p.slice(nl + 1).trim();
    if (text) sections.push({ doc: docTitle, title, text: `## ${title}\n${text}` });
  }
}

const out = `// GENERADO por build-corpus.mjs — no editar a mano.
export const QA = ${JSON.stringify(qa)};
export const SECTIONS = ${JSON.stringify(sections)};
`;
writeFileSync(new URL('./src/corpus.js', import.meta.url), out);
console.log(`corpus.js: ${sections.length} secciones + Q&A (${(out.length / 1024).toFixed(0)}KB)`);
