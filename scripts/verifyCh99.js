// Verify patched reader vs ch99-backup.html. Expect: ALL chapters byte-identical EXCEPT ch99 (idx 98);
// block count unchanged (14, colophon b9 pre-existing). Changed fields: b4.sanskrit, b6.iast,
// b6.sanskrit, b7.iast, b8.iast, b9.iast, b9.english. Only b9.english is an english diff (empty→content,
// intended colophon fill); all OTHER english diffs must be 0. No residual ō/ē/x/ou/asterisk.
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
const cur = loadFrom(READER), old = loadFrom(SC + '/ch99-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci = 0; ci < cur.length; ci++) { if (ci === 98) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch99:', outside);

const A = cur[98].blocks, O = old[98].blocks;
if (A.length !== 14 || O.length !== 14) throw new Error('block count changed: ' + O.length + ' -> ' + A.length);
const EXPECTED = new Set(['b4.sanskrit', 'b6.iast', 'b6.sanskrit', 'b7.iast', 'b8.iast', 'b9.iast', 'b9.english']);
const seen = new Set(); let engChangedNonColophon = 0;
for (let bi = 0; bi < A.length; bi++) {
  const nb = A[bi], ob = O[bi];
  if (nb.type !== ob.type) throw new Error(`type mismatch b${bi}`);
  for (const k of new Set([...Object.keys(nb), ...Object.keys(ob)])) {
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])) { seen.add(`b${bi}.${k}`); if (k === 'english' && bi !== 9) engChangedNonColophon++; }
  }
}
console.log('ch99 field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs on non-colophon blocks (must be 0):', engChangedNonColophon);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected field diff: ' + e);
if (engChangedNonColophon) throw new Error('non-colophon english changed');
if ((O[9].english || '').trim() !== '') throw new Error('backup b9 english was not empty');
if (!/Thus ends the Ninety-Ninth Chapter/.test(A[9].english)) throw new Error('b9 english fill missing');

// no residual in verse sanskrit/iast
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) { const v = b[f]; if (!v) return;
    for (const bad of ['ō', 'ē', 'x', '*']) if (v.includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
    if (/ou/.test(v)) throw new Error(`residual ou in b${bi}.${f}`); } });

// applied-fix presence
for (const t of ['vakṣye', 'anabhilakṣyaṃ', 'sūkṣmaḥ', 'virūpākṣaḥ', 'ध्यानभेदविधिः', 'ज्वलरूप'])
  if (!A[4].sanskrit.includes(t)) throw new Error('b4 missing ' + t);
if (A[4].sanskrit.includes('विद्यिः') || A[4].sanskrit.includes('ज्वारूप') || /x/.test(A[4].sanskrit)) throw new Error('b4 residual');
if (!A[6].iast.includes('vakṣye') || !A[6].iast.includes('kuṇḍalinīmukhaṃ')) throw new Error('b6 iast fixes missing');
if ((A[6].sanskrit.match(/मण्डलम् अनुप्रविश्य/g) || []).length !== 2) throw new Error('b6 माण्डलम् अनुप्रविश्य ×2 missing');
if (A[6].sanskrit.includes('मण्डलम नुप्रविश्य')) throw new Error('b6 old word-split remains');
if (!A[9].colophon || !/dhyānabhēdavidhirnāma ēkōnaśatatamaḥ paṭalaḥ \|\|99\|\|/.test(A[9].iast) === false) { /* iast normalized below */ }
if (!/dhyānabhedavidhirnāma ekonaśatatamaḥ paṭalaḥ \|\|99\|\|/.test(A[9].iast)) throw new Error('b9 colophon iast malformed');

// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) { const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; fixes present; colophon english filled; no residuals.');
if (outside) throw new Error('unexpected diffs outside ch99');
console.log('\nVERIFY OK');
