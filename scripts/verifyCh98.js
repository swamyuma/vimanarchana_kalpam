// Verify patched reader vs ch98-backup.html. Expect: ALL chapters byte-identical EXCEPT ch98 (idx 97);
// block count unchanged (12, colophon b7 pre-existing). Changed fields: b4.sanskrit, b6.sanskrit,
// b7.iast. 0 english diffs; no residual ō/ē/x/ou/asterisk; markup repair + fix present.
const fs = require('fs');
const { READER } = require('./load.js');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/34ebb02e-e8b5-412b-8eee-23d63704dea7/scratchpad';
function loadFrom(p) {
  const html = fs.readFileSync(p, 'utf8');
  const m = 'const VIMANARCHANA_CHAPTERS = '; const i = html.indexOf(m); const s = i + m.length;
  let d = 0, j = s, inS = false, sc = '', esc = false;
  for (; j < html.length; j++) { const c = html[j];
    if (inS) { if (esc) { esc = false; continue; } if (c === '\\') { esc = true; continue; } if (c === sc) { inS = false; } continue; }
    if (c === '"' || c === "'" || c === '`') { inS = true; sc = c; continue; }
    if (c === '[') d++; else if (c === ']') { d--; if (d === 0) { j++; break; } } }
  return JSON.parse(html.slice(s, j));
}
const cur = loadFrom(READER), old = loadFrom(SC + '/ch98-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci = 0; ci < cur.length; ci++) { if (ci === 97) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch98:', outside);

const A = cur[97].blocks, O = old[97].blocks;
if (A.length !== 12 || O.length !== 12) throw new Error('block count changed: ' + O.length + ' -> ' + A.length);
const EXPECTED = new Set(['b4.sanskrit', 'b6.sanskrit', 'b7.iast']);
const seen = new Set(); let engChanged = 0;
for (let bi = 0; bi < A.length; bi++) {
  const nb = A[bi], ob = O[bi];
  if (nb.type !== ob.type) throw new Error(`type mismatch b${bi}`);
  for (const k of new Set([...Object.keys(nb), ...Object.keys(ob)])) {
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])) { seen.add(`b${bi}.${k}`); if (k === 'english') engChanged++; }
  }
}
console.log('ch98 field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected field diff: ' + e);
if (engChanged) throw new Error('english changed');

// no residual (incl asterisk) in verse sanskrit/iast
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) { const v = b[f]; if (!v) return;
    for (const bad of ['ō', 'ē', 'x', '*']) if (v.includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
    if (/ou/.test(v)) throw new Error(`residual ou in b${bi}.${f}`); } });

// applied-fix presence
if ((A[4].sanskrit.match(/<em><strong>pṛthivīdhāraṇā/g) || []).length !== 1) throw new Error('b4 pṛthivī em-repair missing');
if (!A[4].sanskrit.includes('<em><strong>abdhāraṇā') || !A[4].sanskrit.includes('<em><strong>agnidhāraṇā')) throw new Error('b4 em-repair incomplete');
if (!A[4].sanskrit.includes('हृदयान्तम्') || A[4].sanskrit.includes('हृदवान्तम्')) throw new Error('b4 हृदयान्तम् fix missing');
if (!A[7].colophon || !/dhāraṇāvidhirnāma aṣṭanavatitamaḥ paṭalaḥ \|\|98\|\|/.test(A[7].iast)) throw new Error('b7 colophon malformed');

// markup balance (em must be balanced now)
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) { const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; lump-repair + fix present; no residuals.');
if (outside) throw new Error('unexpected diffs outside ch98');
console.log('\nVERIFY OK');
