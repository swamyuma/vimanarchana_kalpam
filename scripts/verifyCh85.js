// Verify patched reader vs ch85-backup.html. Expect: ALL chapters byte-identical EXCEPT ch85
// (idx 84): (a) ONE new block at idx 10 (colophon); (b) old b0-9 → new b0-9 with only
// b5.sanskrit + b5.iast + b6.iast + b9.sanskrit changed; (c) old b10-12 → new b11-13 unchanged;
// (d) 0 english changes to pre-existing blocks; (e) no residual x/ou in edited verse sanskrit/iast;
// fixes present.
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
const cur = loadFrom(READER), old = loadFrom(SC + '/ch85-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci = 0; ci < cur.length; ci++) { if (ci === 84) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch85:', outside);
const A = cur[84].blocks, B = old[84].blocks;
if (A.length !== B.length + 1) throw new Error(`ch85 block count: expected ${B.length + 1}, got ${A.length}`);
const COL = 10;
const col = A[COL];
if (!col.colophon || col.type !== 'verse' || col.label !== 'Colophon') throw new Error('idx 10 not colophon');
if (!/इति श्रीवैखानसे.*पञ्चाशीतितमः पटलः.*८५/.test(col.sanskrit)) throw new Error('colophon Deva malformed');
if (!/pañcāśītitamaḥ paṭalaḥ .*85/.test(col.iast)) throw new Error('colophon IAST malformed');
if (!/Eighty-fifth Chapter/.test(col.english)) throw new Error('colophon English malformed');
const EXPECTED = new Set(['b5.sanskrit', 'b5.iast', 'b6.iast', 'b9.sanskrit']);
const seen = new Set(); let engChanged = 0;
for (let ni = 0; ni < A.length; ni++) { if (ni === COL) continue;
  const oi = ni < COL ? ni : ni - 1; const nb = A[ni], ob = B[oi];
  if (nb.type !== ob.type) throw new Error(`type mismatch new b${ni} vs old b${oi}`);
  for (const k of new Set([...Object.keys(nb), ...Object.keys(ob)])) {
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])) { seen.add(`b${oi}.${k}`); if (k === 'english') engChanged++; } } }
console.log('ch85 pre-existing field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs to pre-existing (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED ch85 field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected ch85 field diff: ' + e);
if (engChanged) throw new Error('english changed on pre-existing block');
// residuals in edited verse sanskrit/iast (must be 0)
for (const [bi, f] of [[5, 'sanskrit'], [5, 'iast'], [6, 'iast'], [9, 'sanskrit']]) {
  if (/x/.test(A[bi][f])) throw new Error(`residual x in b${bi}.${f}`);
  if (/ou/.test(A[bi][f])) throw new Error(`residual ou in b${bi}.${f}`);
}
// applied-fix presence (targeted)
if (!A[5].sanskrit.includes('श्रोतुम्')) throw new Error('b5 Deva श्रोतुम् missing');
if (A[5].sanskrit.includes('श्रोतुद्')) throw new Error('b5 Deva श्रोतुद् remains');
if (!A[5].iast.includes('saṅkṣepeṇoktaṃ')) throw new Error('b5 saṅkṣepeṇoktaṃ missing');
if (!A[6].iast.includes('vakṣye')) throw new Error('b6 vakṣye missing');
for (const t of ['susūkṣmatvād', 'sthūla-sūkṣma']) if (!A[9].sanskrit.includes(t)) throw new Error('b9 fix missing: ' + t);
if ((A[9].sanskrit.split('antarbahiśca').length - 1) !== 2) throw new Error('b9 antarbahiśca count != 2');
if (/antarbahisca/.test(A[9].sanskrit)) throw new Error('residual antarbahisca');
// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) { const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; no residual x/ou in edited fields; fixes present.');
if (outside) throw new Error('unexpected diffs outside ch85');
console.log('\nVERIFY OK');
