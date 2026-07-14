// Verify patched reader vs ch93-backup.html. Expect: ALL chapters byte-identical EXCEPT ch93 (idx 92);
// block count unchanged (20, colophon b15 pre-existing). Changed fields: b4/b5/b6/b12/b13.iast,
// b8/b10.sanskrit, b14.sanskrit + b14.iast, b15.iast + b15.english. Only b15.english is an english diff
// (empty→content, intended colophon fill); all OTHER english diffs must be 0. No residual ō/ē/x/ou.
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
const cur = loadFrom(READER), old = loadFrom(SC + '/ch93-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci = 0; ci < cur.length; ci++) { if (ci === 92) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch93:', outside);

const A = cur[92].blocks, O = old[92].blocks;
if (A.length !== 20 || O.length !== 20) throw new Error('block count changed: ' + O.length + ' -> ' + A.length);
const EXPECTED = new Set(['b4.iast', 'b5.iast', 'b6.iast', 'b8.sanskrit', 'b10.sanskrit', 'b12.iast', 'b13.iast', 'b14.sanskrit', 'b14.iast', 'b15.iast', 'b15.english']);
const seen = new Set(); let engChangedNonColophon = 0;
for (let bi = 0; bi < A.length; bi++) {
  const nb = A[bi], ob = O[bi];
  if (nb.type !== ob.type) throw new Error(`type mismatch b${bi}`);
  for (const k of new Set([...Object.keys(nb), ...Object.keys(ob)])) {
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])) { seen.add(`b${bi}.${k}`); if (k === 'english' && bi !== 15) engChangedNonColophon++; }
  }
}
console.log('ch93 field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs on non-colophon blocks (must be 0):', engChangedNonColophon);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected field diff: ' + e);
if (engChangedNonColophon) throw new Error('non-colophon english changed');
// b15 english must be empty->content
if ((O[15].english || '').trim() !== '') throw new Error('backup b15 english was not empty');
if (!/Thus ends the Ninety-Third Chapter/.test(A[15].english)) throw new Error('b15 english fill missing');

// no residual in verse sanskrit/iast
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) { const v = b[f]; if (!v) return;
    for (const bad of ['ō', 'ē', 'x']) if (v.includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
    if (/ou/.test(v)) throw new Error(`residual ou in b${bi}.${f}`); } });

// applied-fix presence (spot)
if (!A[6].iast.includes('mukhanāsike') || !A[6].iast.includes('kṣut-pipāsādīni')) throw new Error('b6 fixes missing');
if (!A[8].sanskrit.includes('आकाशाद् वायु') || !A[8].sanskrit.includes('aṇḍaja')) throw new Error('b8 fixes missing');
for (const t of ['karmakṣayāt', 'kīlālākhyaṃ', 'śleṣmākhye', 'pittākhya', 'vāyuḥ sarvasroto', 'mukhaiḥ', 'vyāpārānmuktaḥ', 'mukhaṃ na', 'mukhyaprāṇa', 'sūkṣmaśarīriṇaṃ'])
  if (!A[10].sanskrit.includes(t)) throw new Error('b10 missing ' + t);
if (A[10].sanskrit.includes('mux') || A[10].sanskrit.includes('āxy')) throw new Error('b10 residual x-token');
if (!A[13].iast.includes('aparapakṣaṃ') || !A[13].iast.includes('dakṣiṇāyana')) throw new Error('b13 fixes missing');
if (!A[14].sanskrit.includes('भूरादीन्') || A[14].sanskrit.includes('भूर्दीन्')) throw new Error('b14 भूरादीन् missing');
if ((A[14].iast.match(/sūkṣmadeha/g) || []).length !== 2) throw new Error('b14 sūkṣmadeha ×2 missing');
if ((A[14].iast.match(/śuklapakṣ/g) || []).length !== 2) throw new Error('b14 śuklapakṣ ×2 missing');
if (!A[14].iast.includes('gacchatīti')) throw new Error('b14 gacchatīti missing');

// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) { const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; fixes present; colophon english filled; no residuals.');
if (outside) throw new Error('unexpected diffs outside ch93');
console.log('\nVERIFY OK');
