// Verify patched reader vs ch86-backup.html. Expect: ALL chapters byte-identical EXCEPT ch86
// (idx 85): NO new block (colophon b9 already present); block count unchanged; only b4.sanskrit +
// b6.sanskrit + b8.sanskrit + b9.iast changed; 0 english changes; no residual ō/ē/x/ou in edited
// verse sanskrit/iast; fixes present.
const fs = require('fs');
const { READER } = require('./load.js');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/dbab5cc2-ed6f-4e86-bda1-cfa8ae072711/scratchpad';
function loadFrom(p) {
  const html = fs.readFileSync(p, 'utf8');
  const m = 'const VIMANARCHANA_CHAPTERS = '; const i = html.indexOf(m); const start = i + m.length;
  let d = 0, j = start, inS = false, sc = '', esc = false;
  for (; j < html.length; j++) { const c = html[j];
    if (inS) { if (esc) { esc = false; continue; } if (c === '\\') { esc = true; continue; } if (c === sc) { inS = false; } continue; }
    if (c === '"' || c === "'" || c === '`') { inS = true; sc = c; continue; }
    if (c === '[') d++; else if (c === ']') { d--; if (d === 0) { j++; break; } } }
  return JSON.parse(html.slice(start, j));
}
const cur = loadFrom(READER), old = loadFrom(SC + '/ch86-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci = 0; ci < cur.length; ci++) { if (ci === 85) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch86:', outside);
const A = cur[85].blocks, B = old[85].blocks;
if (A.length !== B.length) throw new Error(`ch86 block count changed: ${B.length} -> ${A.length}`);
const EXPECTED = new Set(['b4.sanskrit', 'b6.sanskrit', 'b8.sanskrit', 'b9.iast']);
const seen = new Set(); let engChanged = 0;
for (let bi = 0; bi < A.length; bi++) {
  const nb = A[bi], ob = B[bi];
  if (nb.type !== ob.type) throw new Error(`type mismatch b${bi}`);
  for (const k of new Set([...Object.keys(nb), ...Object.keys(ob)])) {
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])) { seen.add(`b${bi}.${k}`); if (k === 'english') engChanged++; } } }
console.log('ch86 field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED ch86 field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected ch86 field diff: ' + e);
if (engChanged) throw new Error('english changed');
// residuals in edited verse sanskrit/iast (must be 0)
for (const [bi, f] of [[4, 'sanskrit'], [6, 'sanskrit'], [8, 'sanskrit'], [9, 'iast']]) {
  for (const bad of ['ō', 'ē', 'x']) if (A[bi][f].includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
  if (/ou/.test(A[bi][f])) throw new Error(`residual ou in b${bi}.${f}`);
}
// applied-fix presence
if (!A[6].sanskrit.includes('saṅkalpānurūpā')) throw new Error('b6 saṅkalpānurūpā missing');
if (A[6].sanskrit.includes('saṅkalpanurūpā')) throw new Error('b6 old saṅkalpanurūpā remains');
// colophon b9 still well-formed (pre-existing)
if (!A[9].colophon || !/ṣaḍaśītitamaḥ paṭalaḥ .*86/.test(A[9].iast)) throw new Error('b9 colophon malformed');
if (!/sakalavidhirnāma/.test(A[9].iast)) throw new Error('b9 colophon name missing');
// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) { const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; no residual ō/ē/x/ou; fixes present.');
if (outside) throw new Error('unexpected diffs outside ch86');
console.log('\nVERIFY OK');
