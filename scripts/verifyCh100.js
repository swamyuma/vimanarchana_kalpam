// Verify patched reader vs ch100-backup.html. Expect: ALL chapters byte-identical EXCEPT ch100 (idx 99);
// block count unchanged (16, colophon b11 pre-existing). Changed fields: b4.sanskrit, b6.iast, b11.iast.
// 0 english diffs; no residual ō/ē/x/ou/asterisk; fixes present.
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
const cur = loadFrom(READER), old = loadFrom(SC + '/ch100-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
if (cur.length !== 100) throw new Error('expected 100 chapters, got ' + cur.length);
let outside = 0;
for (let ci = 0; ci < cur.length; ci++) { if (ci === 99) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch100:', outside);

const A = cur[99].blocks, O = old[99].blocks;
if (A.length !== 16 || O.length !== 16) throw new Error('block count changed: ' + O.length + ' -> ' + A.length);
// every verse block had ō/ē normalized: b4/b10 pattern-b (sanskrit), b6/b7/b8/b11 pattern-a (iast)
const EXPECTED = new Set(['b4.sanskrit', 'b6.iast', 'b7.iast', 'b8.iast', 'b10.sanskrit', 'b11.iast']);
const seen = new Set(); let engChanged = 0;
for (let bi = 0; bi < A.length; bi++) {
  const nb = A[bi], ob = O[bi];
  if (nb.type !== ob.type) throw new Error(`type mismatch b${bi}`);
  for (const k of new Set([...Object.keys(nb), ...Object.keys(ob)])) {
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])) { seen.add(`b${bi}.${k}`); if (k === 'english') engChanged++; }
  }
}
console.log('ch100 field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected field diff: ' + e);
if (engChanged) throw new Error('english changed');

// no residual in verse sanskrit/iast
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) { const v = b[f]; if (!v) return;
    for (const bad of ['ō', 'ē', 'x', '*']) if (v.includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
    if (/ou/.test(v)) throw new Error(`residual ou in b${bi}.${f}`); } });

// applied-fix presence
for (const t of ['tallakṣaṇaṃ', 'vakṣye', 'ādityamayūkha'])
  if (!A[4].sanskrit.includes(t)) throw new Error('b4 missing ' + t);
if (!A[6].iast.includes('praṇavākṣareṇa') || !A[6].iast.includes('prāṇam āropya')) throw new Error('b6 fixes missing');
if (A[6].iast.includes('prānam')) throw new Error('b6 dental prānam remains');
if (!A[11].colophon || !/ayutagranthasaṃhitāyāṃ samādhividhirnāma śatatamaḥ paṭalaḥ \|\|100\|\|/.test(A[11].iast)) throw new Error('b11 colophon malformed');

// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) { const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; fixes present; no residuals.');
if (outside) throw new Error('unexpected diffs outside ch100');
console.log('\nVERIFY OK — ch100 (FINAL) reconciled.');
