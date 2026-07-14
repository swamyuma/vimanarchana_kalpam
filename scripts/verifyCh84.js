// Verify patched reader vs ch84-backup.html. Expect: ALL chapters byte-identical EXCEPT ch84
// (idx 83): (a) ONE new block at idx 13 (colophon); (b) old b0-12 → new b0-12 with only
// b4.sanskrit + b6.iast + b8.iast + b10.sanskrit + b12.sanskrit changed; (c) old b13-15 → new
// b14-16 unchanged; (d) 0 english changes to pre-existing blocks; (e) no residual x/ou in edited
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
const cur = loadFrom(READER), old = loadFrom(SC + '/ch84-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci = 0; ci < cur.length; ci++) { if (ci === 83) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch84:', outside);
const A = cur[83].blocks, B = old[83].blocks;
if (A.length !== B.length + 1) throw new Error(`ch84 block count: expected ${B.length + 1}, got ${A.length}`);
const COL = 13;
const col = A[COL];
if (!col.colophon || col.type !== 'verse' || col.label !== 'Colophon') throw new Error('idx 13 not colophon');
if (!/इति श्रीवैखानसे.*चतुरशीतितमः पटलः.*८४/.test(col.sanskrit)) throw new Error('colophon Deva malformed');
if (!/caturaśītitamaḥ paṭalaḥ .*84/.test(col.iast)) throw new Error('colophon IAST malformed');
if (!/Eighty-fourth Chapter/.test(col.english)) throw new Error('colophon English malformed');
const EXPECTED = new Set(['b4.sanskrit', 'b6.iast', 'b8.iast', 'b10.sanskrit', 'b12.sanskrit']);
const seen = new Set(); let engChanged = 0;
for (let ni = 0; ni < A.length; ni++) { if (ni === COL) continue;
  const oi = ni < COL ? ni : ni - 1; const nb = A[ni], ob = B[oi];
  if (nb.type !== ob.type) throw new Error(`type mismatch new b${ni} vs old b${oi}`);
  for (const k of new Set([...Object.keys(nb), ...Object.keys(ob)])) {
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])) { seen.add(`b${oi}.${k}`); if (k === 'english') engChanged++; } } }
console.log('ch84 pre-existing field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs to pre-existing (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED ch84 field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected ch84 field diff: ' + e);
if (engChanged) throw new Error('english changed on pre-existing block');
// residuals in edited verse sanskrit/iast (must be 0)
for (const [bi, f] of [[4, 'sanskrit'], [6, 'iast'], [8, 'iast'], [10, 'sanskrit'], [12, 'sanskrit']]) {
  if (/x/.test(A[bi][f])) throw new Error(`residual x in b${bi}.${f}`);
  if (/ou/.test(A[bi][f])) throw new Error(`residual ou in b${bi}.${f}`);
}
// applied-fix presence (targeted)
if (!A[4].sanskrit.includes('पश्चिमस्तृतीयः')) throw new Error('b4 Deva पश्चिमस्तृतीयः missing');
if (A[4].sanskrit.includes('पश्चिम्स्तृतीयः')) throw new Error('b4 Deva old halant remains');
for (const t of ['caturaśītitamaḥ', 'gāyatryāḥ', 'adhidaivataṃ']) if (!A[4].sanskrit.includes(t)) throw new Error('b4 fix missing: ' + t);
if (!A[12].sanskrit.includes('पद्मसङ्काशं')) throw new Error('b12 Deva पद्मसङ्काशं missing');
for (const t of ['padmasaṅkāśaṃ', 'bhūrbhuvaḥsuvaḥ']) if (!A[12].sanskrit.includes(t)) throw new Error('b12 fix missing: ' + t);
if ((A[12].sanskrit.split('bhakṣaṇa').length - 1) < 2) throw new Error('b12 bhakṣaṇa count < 2');
if (/bhaxana/.test(A[12].sanskrit)) throw new Error('residual bhaxana');
// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) { const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; no residual x/ou in edited fields; fixes present.');
if (outside) throw new Error('unexpected diffs outside ch84');
console.log('\nVERIFY OK');
