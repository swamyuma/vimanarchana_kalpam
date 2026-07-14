// Verify patched reader vs ch91-backup.html. Expect: ALL chapters byte-identical EXCEPT ch91 (idx 90).
// ch91: block count 11 -> 12 (colophon INSERTED at index 7). Mapping: new[0..6]==old[0..6] (with edits
// at b4.sanskrit, b6.sanskrit), new[7]=colophon (new), new[8..11]==old[7..10]. 0 english diffs on
// pre-existing blocks; no residual ō/ē/x/ou; fixes present.
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
const cur = loadFrom(READER), old = loadFrom(SC + '/ch91-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci = 0; ci < cur.length; ci++) { if (ci === 90) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch91:', outside);

const A = cur[90].blocks, O = old[90].blocks;
if (O.length !== 11) throw new Error('backup ch91 not 11 blocks');
if (A.length !== 12) throw new Error(`ch91 expected 12 blocks, got ${A.length}`);

// new[7] colophon
const col = A[7];
if (!col.colophon || col.label !== 'Colophon') throw new Error('b7 not colophon');
if (!/hṛtpadmamadhyadhyānaṃ nāma ekanavatitamaḥ paṭalaḥ \|\|91\|\|/.test(col.iast)) throw new Error('colophon iast malformed');
if (!/हृत्पद्ममध्यध्यानं नाम एकनवतितमः पटलः ॥९१॥/.test(col.sanskrit)) throw new Error('colophon deva malformed');
if (!/मातृकान्तरे पटलसमाप्तिर्नास्ति/.test(col.sanskrit)) throw new Error('colophon mātṛkāntara note missing');
if (!/Thus ends the Ninety-First Chapter/.test(col.english)) throw new Error('colophon english missing');
for (const bad of ['ō', 'ē', 'x']) if (col.sanskrit.includes(bad) || col.iast.includes(bad)) throw new Error('residual in colophon');

// tail new[8..11] == old[7..10]
for (let k = 8; k < 12; k++) {
  if (JSON.stringify(A[k]) !== JSON.stringify(O[k - 1])) throw new Error(`tail block new[${k}] != old[${k - 1}]`);
}

// head new[0..6]: only b4.sanskrit + b6.sanskrit changed; english unchanged
const EXPECTED = new Set(['b4.sanskrit', 'b6.sanskrit']);
const seen = new Set(); let engChanged = 0;
for (let bi = 0; bi < 7; bi++) {
  const nb = A[bi], ob = O[bi];
  if (nb.type !== ob.type) throw new Error(`type mismatch b${bi}`);
  for (const k of new Set([...Object.keys(nb), ...Object.keys(ob)])) {
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])) { seen.add(`b${bi}.${k}`); if (k === 'english') engChanged++; }
  }
}
console.log('ch91 head field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs on pre-existing blocks (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED head field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected head field diff: ' + e);
if (engChanged) throw new Error('english changed');

// no residual in verse sanskrit/iast
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) { const v = b[f]; if (!v) return;
    for (const bad of ['ō', 'ē', 'x']) if (v.includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
    if (/ou/.test(v)) throw new Error(`residual ou in b${bi}.${f}`); } });

// applied-fix presence
if (!A[4].sanskrit.includes('adhomukhaṃ') || !A[4].sanskrit.includes('ūrdhvamukhaṃ') || !A[4].sanskrit.includes('viśvatomukhaḥ')) throw new Error('b4 mukha fixes missing');
if (!A[4].sanskrit.includes('padmākṣaḥ')) throw new Error('b4 padmākṣaḥ missing');
if (!A[4].sanskrit.includes('vahniśikhā') || A[4].sanskrit.includes('vahnīśikhā')) throw new Error('b4 vahniśikhā missing');
if (!A[6].sanskrit.includes('dakṣiṇavāmayoḥ')) throw new Error('b6 dakṣiṇ missing');
if (!A[6].sanskrit.includes('jñānacakṣuṣā')) throw new Error('b6 cakṣuṣā missing');

// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) { const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; colophon inserted; fixes present; no residuals.');
if (outside) throw new Error('unexpected diffs outside ch91');
console.log('\nVERIFY OK');
