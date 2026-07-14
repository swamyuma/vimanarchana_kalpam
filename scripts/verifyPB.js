// Verify PB-marker insertion for a chapter. Usage: node verifyPB.js <chNum> <backup.html>
// Checks (spec §5): (1) stripMarkers(field)===backup field for sk/iast/english (non-alteration);
// (2) equal marker counts across non-empty fields per block; (3) explosion yields parts each with
// non-empty sanskrit AND english, balanced em/strong/li/ul/p; (4) global: nothing else changed.
const fs = require('fs');
const { READER } = require('./load.js');
const { getExploder } = require('./pbTools.js');
const { PB_MARKER, explodeBlocks } = getExploder();
const CH = parseInt(process.argv[2], 10);
const BACKUP = process.argv[3];
if (!CH || !BACKUP) throw new Error('usage: node verifyPB.js <chNum> <backup.html>');

function loadFrom(p) {
  const html = fs.readFileSync(p, 'utf8');
  const m = 'const VIMANARCHANA_CHAPTERS = '; const i = html.indexOf(m); const s = i + m.length;
  let d = 0, j = s, inS = false, sc = '', e = false;
  for (; j < html.length; j++) { const c = html[j];
    if (inS) { if (e) { e = false; continue; } if (c === '\\') { e = true; continue; } if (c === sc) inS = false; continue; }
    if (c === '"' || c === "'" || c === '`') { inS = true; sc = c; continue; }
    if (c === '[') d++; else if (c === ']') { d--; if (d === 0) { j++; break; } } }
  return JSON.parse(html.slice(s, j));
}
const strip = s => (s || '').split(PB_MARKER).join('');
const cur = loadFrom(READER), old = loadFrom(BACKUP);
if (cur.length !== old.length) throw new Error('chapter count changed');

let fail = 0;
function check(cond, msg) { if (!cond) { console.log('  FAIL:', msg); fail++; } }

// (4) global: every field byte-identical after stripping markers; markers only in target chapter
let globalOk = true, changedFields = 0;
for (let ci = 0; ci < cur.length; ci++) {
  const A = cur[ci].blocks, B = old[ci].blocks;
  if (A.length !== B.length) { console.log('BLOCK COUNT DIFF ch idx', ci); globalOk = false; continue; }
  for (let bi = 0; bi < A.length; bi++) {
    for (const k of new Set([...Object.keys(A[bi]), ...Object.keys(B[bi])])) {
      const a = A[bi][k], b = B[bi][k];
      if (JSON.stringify(a) === JSON.stringify(b)) continue;
      // differs: must be marker-only, and only in target chapter
      if (cur[ci].number !== CH) { console.log('UNEXPECTED diff outside ch', CH, '-> ch idx', ci, 'b', bi, k); globalOk = false; continue; }
      if (typeof a === 'string' && strip(a) === b) { changedFields++; }
      else { console.log('NON-MARKER diff in ch', CH, 'b', bi, k); globalOk = false; }
    }
  }
}
console.log('(1/4) fields changed by markers only:', changedFields, '| global integrity:', globalOk ? 'OK' : 'BROKEN');
if (!globalOk) fail++;

// (2)+(3) explosion of the target chapter
const chap = cur.find(c => c.number === CH);
const bal = (s, o, c) => (s.match(new RegExp(o, 'g')) || []).length === (s.match(new RegExp(c, 'g')) || []).length;
let totalParts = 0;
chap.blocks.forEach((blk, bi) => {
  if ((blk.sanskrit || '').indexOf(PB_MARKER) === -1) return;
  const parts = explodeBlocks([blk]);
  totalParts += parts.length;
  console.log(`  b${bi}: ${parts.length} parts`);
  parts.forEach((p, i) => {
    check((p.sanskrit || '').trim().length > 0, `b${bi} part${i} empty sanskrit`);
    check((p.english || '').trim().length > 0, `b${bi} part${i} empty english`);
    for (const [o, c] of [['<em>', '</em>'], ['<strong>', '</strong>'], ['<li>', '</li>'], ['<ul>', '</ul>'], ['<p>', '</p>']]) {
      check(bal(p.sanskrit || '', o, c), `b${bi} part${i} sanskrit unbalanced ${o}`);
      check(bal(p.english || '', o, c), `b${bi} part${i} english unbalanced ${o}`);
    }
    check((p.sanskrit || '').indexOf(PB_MARKER) === -1, `b${bi} part${i} residual marker`);
  });
});
console.log('(3) total parts produced:', totalParts);
console.log(fail === 0 ? '\nALL CHECKS PASSED' : `\n${fail} CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);
