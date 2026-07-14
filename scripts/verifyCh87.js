// Verify patched reader vs ch87-backup.html. Expect: ALL chapters byte-identical EXCEPT ch87 (idx 86).
// ch87: block count 14 -> 15 (colophon INSERTED at index 9). Mapping new->old: new[0..8]==old[0..8]
// (with edits at b4/b6/b8 sanskrit + b8 iast), new[9]=colophon (brand new), new[10..14]==old[9..13].
// 0 english changes on pre-existing blocks; no residual ō/ē/x/ou in verse sanskrit/iast; fixes present.
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
const cur = loadFrom(READER), old = loadFrom(SC + '/ch87-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci = 0; ci < cur.length; ci++) { if (ci === 86) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch87:', outside);

const A = cur[86].blocks, O = old[86].blocks;
if (O.length !== 14) throw new Error('backup ch87 not 14 blocks');
if (A.length !== 15) throw new Error(`ch87 expected 15 blocks, got ${A.length}`);

// new[9] must be the inserted colophon
const col = A[9];
if (!col.colophon || col.label !== 'Colophon') throw new Error('b9 not colophon');
if (!/vaikuṇṭhalakṣaṇaṃ nāma saptāśītitamaḥ paṭalaḥ \|\|87\|\|/.test(col.iast)) throw new Error('colophon iast malformed');
if (!/वैकुण्ठलक्षणं नाम सप्ताशीतितमः पटलः ॥८७॥/.test(col.sanskrit)) throw new Error('colophon deva malformed');
if (!/Thus ends the Eighty-Seventh Chapter/.test(col.english)) throw new Error('colophon english missing');
for (const bad of ['ō', 'ē', 'x']) if (col.sanskrit.includes(bad) || col.iast.includes(bad)) throw new Error('residual in colophon');

// tail new[10..14] == old[9..13] byte-identical
for (let k = 10; k < 15; k++) {
  if (JSON.stringify(A[k]) !== JSON.stringify(O[k - 1])) throw new Error(`tail block new[${k}] != old[${k - 1}]`);
}

// head new[0..8]: only b4/b6/b8 changed; english on those unchanged
const EXPECTED = new Set(['b4.sanskrit', 'b6.sanskrit', 'b8.iast']); // b8 pattern-a: Deva has no macrons
const seen = new Set(); let engChanged = 0;
for (let bi = 0; bi < 9; bi++) {
  const nb = A[bi], ob = O[bi];
  if (nb.type !== ob.type) throw new Error(`type mismatch b${bi}`);
  for (const key of new Set([...Object.keys(nb), ...Object.keys(ob)])) {
    if (JSON.stringify(nb[key]) !== JSON.stringify(ob[key])) { seen.add(`b${bi}.${key}`); if (key === 'english') engChanged++; }
  }
}
console.log('ch87 head field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs on pre-existing blocks (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED head field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected head field diff: ' + e);
if (engChanged) throw new Error('english changed');

// no residual in edited verse fields
for (const [bi, f] of [[4, 'sanskrit'], [6, 'sanskrit'], [8, 'sanskrit'], [8, 'iast']]) {
  for (const bad of ['ō', 'ē', 'x']) if (A[bi][f].includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
  if (/ou/.test(A[bi][f])) throw new Error(`residual ou in b${bi}.${f}`);
}
// applied-fix presence
if (!A[4].sanskrit.includes('सर्वेषामण्डानामुपरि')) throw new Error('b4 य् fix missing');
if (A[4].sanskrit.includes('सर्वेषामण्डानाम्युपरि')) throw new Error('b4 old य् remains');
if (!A[4].sanskrit.includes('anabhilakṣyaṃ')) throw new Error('b4 anabhilakṣyaṃ missing');
if (!A[4].sanskrit.includes('amṛtajalataraṅga')) throw new Error('b4 jalataraṅga missing');
if (!A[4].sanskrit.includes('parijanaiḥ yutaṃ')) throw new Error('b4 parijanaiḥ yutaṃ missing');
if (!A[6].sanskrit.includes('svalīlayaiva')) throw new Error('b6 svalīlayaiva missing');
if (!A[6].sanskrit.includes('sisṛkṣor')) throw new Error('b6 sisṛkṣor missing');
if (!A[6].sanskrit.includes('dhībhyo&#39;nnam')) throw new Error('b6 bhyo missing');

// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) { const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; colophon inserted; fixes present; no residuals.');
if (outside) throw new Error('unexpected diffs outside ch87');
console.log('\nVERIFY OK');
