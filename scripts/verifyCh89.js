// Verify patched reader vs ch89-backup.html. Expect: ALL chapters byte-identical EXCEPT ch89 (idx 88).
// ch89: block count 19 -> 20 (colophon INSERTED at index 14). Mapping new->old: new[0..13]==old[0..13]
// (with edits at b4.sanskrit, b7/b10/b12/b13.iast), new[14]=colophon (new), new[15..19]==old[14..18].
// 0 english changes on pre-existing blocks; no residual ō/ē/x/ou; fixes present.
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
const cur = loadFrom(READER), old = loadFrom(SC + '/ch89-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci = 0; ci < cur.length; ci++) { if (ci === 88) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch89:', outside);

const A = cur[88].blocks, O = old[88].blocks;
if (O.length !== 19) throw new Error('backup ch89 not 19 blocks');
if (A.length !== 20) throw new Error(`ch89 expected 20 blocks, got ${A.length}`);

// new[14] must be inserted colophon
const col = A[14];
if (!col.colophon || col.label !== 'Colophon') throw new Error('b14 not colophon');
if (!/bhūrāditattvaprakāśo nāma ekonanavatitamaḥ paṭalaḥ \|\|89\|\|/.test(col.iast)) throw new Error('colophon iast malformed');
if (!/भूरादितत्त्वप्रकाशो नाम एकोननवतितमः पटलः ॥८९॥/.test(col.sanskrit)) throw new Error('colophon deva malformed');
if (!/Thus ends the Eighty-Ninth Chapter/.test(col.english)) throw new Error('colophon english missing');
for (const bad of ['ō', 'ē', 'x']) if (col.sanskrit.includes(bad) || col.iast.includes(bad)) throw new Error('residual in colophon');

// tail new[15..19] == old[14..18]
for (let k = 15; k < 20; k++) {
  if (JSON.stringify(A[k]) !== JSON.stringify(O[k - 1])) throw new Error(`tail block new[${k}] != old[${k - 1}]`);
}

// head new[0..13]: only the expected fields changed; english unchanged
// every verse block had ō/ē normalized: b4 pattern-b (sanskrit), b6-b13 pattern-a (iast)
const EXPECTED = new Set(['b4.sanskrit', 'b6.iast', 'b7.iast', 'b8.iast', 'b10.iast', 'b11.iast', 'b12.iast', 'b13.iast']);
const seen = new Set(); let engChanged = 0;
for (let bi = 0; bi < 14; bi++) {
  const nb = A[bi], ob = O[bi];
  if (nb.type !== ob.type) throw new Error(`type mismatch b${bi}`);
  for (const k of new Set([...Object.keys(nb), ...Object.keys(ob)])) {
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])) { seen.add(`b${bi}.${k}`); if (k === 'english') engChanged++; }
  }
}
console.log('ch89 head field diffs:', [...seen].sort().join(', ') || '(none)');
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
if (!A[4].sanskrit.includes('tejasaścakṣuḥ')) throw new Error('b4 tejasaścakṣuḥ missing');
if (!A[7].iast.includes('kṣut-tṛṣṇā')) throw new Error('b7 kṣut missing');
if ((A[10].iast.match(/lakṣaṇāni/g) || []).length !== 3) throw new Error('b10 lakṣaṇāni ×3 missing');
if (!A[10].iast.includes('ityādayo')) throw new Error('b10 ityādayo missing');
if (!A[12].iast.includes('mātra-yuktaṃ svapnam')) throw new Error('b12 yuktaṃ missing');
if (!A[12].iast.includes('jīva-yuktam eva')) throw new Error('b12 yuktam missing');
if (!A[13].iast.includes('daśendriyāṇi')) throw new Error('b13 daśendriyāṇi missing');
if (A[13].iast.includes('daśendriyāni')) throw new Error('b13 old daśendriyāni remains');

// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) { const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; colophon inserted; fixes present; no residuals.');
if (outside) throw new Error('unexpected diffs outside ch89');
console.log('\nVERIFY OK');
