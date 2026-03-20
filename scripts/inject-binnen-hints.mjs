/**
 * One-off: inject hint lines after correctAnswer in binnen-questions.ts
 * Run: node scripts/inject-binnen-hints.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const target = path.join(root, 'app/src/data/binnen-hints.json');
const tsPath = path.join(root, 'app/src/data/binnen-questions.ts');

const hints = JSON.parse(fs.readFileSync(target, 'utf8'));

let src = fs.readFileSync(tsPath, 'utf8');
let currentId = null;
const lines = src.split('\n');
const out = [];

function escapeHint(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/^\s+id: (\d+),$/);
  if (idMatch) currentId = Number(idMatch[1]);

  out.push(line);

  if (line.trim() === "correctAnswer: 'a',") {
    const next = lines[i + 1] ?? '';
    if (next.includes('hint:')) continue;
    const h = hints[String(currentId)];
    if (h == null) throw new Error(`Missing hint for id ${currentId}`);
    out.push(`    hint: '${escapeHint(h)}',`);
  }
}

fs.writeFileSync(tsPath, out.join('\n'), 'utf8');
console.log('Injected hints for', Object.keys(hints).length, 'ids');
