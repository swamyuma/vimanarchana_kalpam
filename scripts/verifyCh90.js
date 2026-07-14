// Verify patched reader vs ch90-backup.html. Expect: ALL chapters byte-identical EXCEPT ch90 (idx 89);
// block count unchanged (22, colophon b17 pre-existing). Changed fields: b4/b10/b12/b14/b16.sanskrit,
// b7/b8.iast, b17.sanskrit + b17.iast. 0 english diffs; no residual ō/ē/x/ou; fixes present.
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
const cur = loadFrom(READER), old = loadFrom(SC + '/ch90-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci = 0; ci < cur.length; ci++) { if (ci === 89) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch90:', outside);

const A = cur[89].blocks, O = old[89].blocks;
if (A.length !== 22 || O.length !== 22) throw new Error('block count changed: ' + O.length + ' -> ' + A.length);
const EXPECTED = new Set(['b4.sanskrit', 'b7.iast', 'b8.iast', 'b10.sanskrit', 'b12.sanskrit', 'b14.sanskrit', 'b16.sanskrit', 'b17.sanskrit', 'b17.iast']);
const seen = new Set(); let engChanged = 0;
for (let bi = 0; bi < A.length; bi++) {
  const nb = A[bi], ob = O[bi];
  if (nb.type !== ob.type) throw new Error(`type mismatch b${bi}`);
  for (const k of new Set([...Object.keys(nb), ...Object.keys(ob)])) {
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])) { seen.add(`b${bi}.${k}`); if (k === 'english') engChanged++; }
  }
}
console.log('ch90 field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected field diff: ' + e);
if (engChanged) throw new Error('english changed');

// no residual in verse sanskrit/iast
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) { const v = b[f]; if (!v) return;
    for (const bad of ['ō', 'ē', 'x']) if (v.includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
    if (/ou/.test(v)) throw new Error(`residual ou in b${bi}.${f}`); } });

// applied-fix presence
if (!A[4].sanskrit.includes('dehalakṣaṇaṃ vakṣye')) throw new Error('b4 lakṣaṇaṃ/vakṣye missing');
if (!A[4].sanskrit.includes('ṣaṇṇavatyaṅgulo') || !A[4].sanskrit.includes('dvyaṅgulaṃ')) throw new Error('b4 aṅgula missing');
if (!A[4].sanskrit.includes('dakṣiṇe abhaya') || !A[4].sanskrit.includes('dakṣiṇavāmayoḥ')) throw new Error('b4 dakṣiṇ missing');
if (!A[4].sanskrit.includes('sarvābharaṇayuktaḥ')) throw new Error('b4 yuktaḥ missing');
if (!A[12].sanskrit.includes('keśanakhayutaḥ') || !A[12].sanskrit.includes('suprasannamukhaḥ')) throw new Error('b12 nakha/mukhaḥ missing');
if (!A[14].sanskrit.includes('dalābhanetraḥ')) throw new Error('b14 dalābhanetraḥ missing');
if (!A[16].sanskrit.includes('smeramukhaḥ') || !A[16].sanskrit.includes('adhomukhamūrdhva')) throw new Error('b16 mukha missing');
if (!A[17].sanskrit.includes('विमानार्चनाकल्पे')) throw new Error('b17 कल्पे missing');
if (A[17].sanskrit.includes('विमानार्चनाकल्ये')) throw new Error('b17 old कल्ये remains');
if (!A[17].iast.includes('dehalakṣaṇaṃ nāma')) throw new Error('b17 iast lakṣaṇaṃ missing');
if (!A[17].colophon) throw new Error('b17 not colophon');

// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) { const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; fixes present; no residuals.');
if (outside) throw new Error('unexpected diffs outside ch90');
console.log('\nVERIFY OK');
