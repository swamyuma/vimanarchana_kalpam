// ch43 (Puṣpa-haviḥ-dāna-vidhiḥ) reconciliation — RE-ZIP a scrambled block.
// Single content block b3 (verse, pattern-b). Deva column is clean & correctly ordered (with
// editor "(मुद्रितपाठे X)" apparatus); the IAST <em> column is OFFSET/mis-paired from the
// हविर्निर्वाप section on, because the Deva splits 3 regions into more paragraphs than the IAST.
// Chapter is TRUNCATED at the START (pages 180-181 lost) — begins mid-sentence "...ca varjayet".
// Approach (user-chosen): RE-ZIP — relocate each existing IAST block onto its correct Deva <p>
// (splitting 3 merged IAST bodies), preserving the editor's exact romanizations & citations,
// then fix the real slips. English UNTOUCHED; PB markers (9) kept at the same section boundaries.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/357a72e2-eb1c-4f8e-843a-248568ad40f5/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[42];
if (ch.number !== 43) throw new Error('wrong chapter ' + ch.number);
const b = ch.blocks[3];
if (b.type !== 'verse') throw new Error('b3 not verse');
const rawS = b.sanskrit;

// ---- parse raw <p> blocks into {pb, deva, iast} ----
const inner = rawS.replace(/^<blockquote>\n/, '').replace(/\n<\/blockquote>\s*$/, '');
const pRe = /(<!--PB-->)?<p>([\s\S]*?)<\/p>/g;
const P = [];
let m;
while ((m = pRe.exec(inner))) {
  const pb = !!m[1];
  const lines = m[2].split('<br>\n');
  const deva = [], iast = [];
  for (const ln of lines) (ln.trimStart().startsWith('<em') ? iast : deva).push(ln);
  P.push({ pb, deva: deva.join('<br>\n'), iast: iast.join('<br>\n') });
}
if (P.length !== 21) throw new Error('expected 21 <p>, got ' + P.length);

// helper: split an em-body string "<em>...</em>" into N pieces after given markers (chars conserved)
function splitEmBody(emBody, markers) {
  const text = emBody.replace(/^<em>/, '').replace(/<\/em>$/, '');
  const pieces = []; let pos = 0;
  for (const mk of markers) {
    const at = text.indexOf(mk, pos);
    if (at < 0) throw new Error('marker not found: ' + mk);
    const cut = at + mk.length;
    pieces.push(text.slice(pos, cut)); pos = cut;
  }
  pieces.push(text.slice(pos));
  if (pieces.join('') !== text) throw new Error('split lost chars');
  return pieces.map(p => '<em>' + p.trim() + '</em>');
}

// merge-1 (P[6].iast = havirnirvāpa title + [S7|S8|S9]); title-em is first line, body-em second
const m1 = P[6].iast.split('<br>\n'); // [titleEm, bodyEm]
const [s7b, s8b, s9b] = splitEmBody(m1[1], ['iti kecit.', 'catuḥ prakṣālya;']);
// merge-2 (P[14].iast = haviḥṣu title + [S17a|S17b])
const m2 = P[14].iast.split('<br>\n');
const [s17ab, s17bb] = splitEmBody(m2[1], ['prāpnoti.']);
// merge-3 (P[16].iast = single body-em [S19|S20], no title)
const [s19b, s20b] = splitEmBody(P[16].iast, ['bhojyam eva.']);

// ---- build new IAST portion for each target <p> (Deva stays P[i].deva) ----
const newIast = [];
newIast[0]  = P[0].iast;
newIast[1]  = P[1].iast;
newIast[2]  = P[2].iast;
newIast[3]  = P[3].iast;
newIast[4]  = P[4].iast;
newIast[5]  = P[5].iast;
newIast[6]  = m1[0] + '<br>\n' + s7b;   // havirnirvāpa title + S7
newIast[7]  = s8b;                       // S8
newIast[8]  = s9b;                       // S9
newIast[9]  = P[7].iast;                 // upadaṃśāḥ title + S10
newIast[10] = P[8].iast;                 // S11
newIast[11] = P[9].iast;                 // S12
newIast[12] = P[10].iast;                // prabhūta title + S13
newIast[13] = P[11].iast;                // ṣadvidha title + S14
newIast[14] = P[12].iast;                // varjya title + S15
newIast[15] = P[13].iast;                // havirānayana title + S16
newIast[16] = m2[0] + '<br>\n' + s17ab;  // haviḥṣu title + S17a
newIast[17] = s17bb;                     // S17b
newIast[18] = P[15].iast;                // S18
newIast[19] = s19b;                      // S19
newIast[20] = s20b;                      // S20

// PB flags per target para (same 9 section boundaries as original)
const PB = new Set([4, 5, 6, 9, 12, 13, 14, 15, 16]);
const paras = [];
for (let i = 0; i < 21; i++) {
  const pre = PB.has(i) ? '<!--PB-->' : '';
  paras.push(`${pre}<p>${P[i].deva}<br>\n${newIast[i]}</p>`);
}
let s = '<blockquote>\n' + paras.join('\n') + '\n</blockquote>';

// ---- VERIFY relocation is content-preserving (before fixes) ----
const devOnly = str => (str.match(/[ऀ-ॿ।॥॰]/g) || []).join('');
const iastTokens = str => (str.replace(/<[^>]+>/g, ' ').replace(/&#39;/g, ' ')
  .match(/[A-Za-zĀ-ſǍ-ǰḀ-ỿāīūṛṝḷḹṅñṭḍṇśṣṃḥ]+/g) || []).sort();
if (devOnly(s) !== devOnly(rawS)) throw new Error('Devanagari sequence changed by relocation!');
const t0 = iastTokens(rawS).join('|'), t1 = iastTokens(s).join('|');
if (t0 !== t1) {
  const a = iastTokens(rawS), c = iastTokens(s);
  console.log('token diff (old-only):', a.filter(x => !c.includes(x)).slice(0, 20));
  console.log('token diff (new-only):', c.filter(x => !a.includes(x)).slice(0, 20));
  throw new Error('IAST token multiset changed by relocation!');
}
console.log('relocation OK: Devanagari + IAST-token multiset preserved.');

// ---- apply content fixes (count-guarded) ----
const DEVA_FIXES = [
  ['प्रप्रिक्षिप्य', 'प्रक्षिप्य', 1],   // S1 Deva typo (extra प्रि); mUlam प्रक्षिप्य
  ['कारकोटकानि', 'कार्कोटकानि', 1],     // S10 Deva (dropped ्); mUlam कार्कोटकानि, English kārkoṭaka
];
const IAST_FIXES = [
  ['praxipya', 'prakṣipya', 3],          // x->kṣ (S1, S3, S8)
  ['aṣṭniṣkam', 'aṣṭaniṣkam', 1],        // dropped a; Deva अष्टनिष्कम्
  ['dvou', 'dvau', 1],                   // ou->au; Deva द्वौ
  ['gudaṃ', 'guḍaṃ', 1],                 // dental d->retroflex ḍ; Deva गुडं
  ['ṣaddroṇ', 'ṣaḍdroṇ', 1],             // dental->retroflex; Deva षड्द्रोण
  ['ṣadvidha', 'ṣaḍvidha', 2],           // dental->retroflex; Deva षड्विध (title + iti ṣaḍvidhaṃ)
  ['droṇādhikem', 'droṇādhikam', 1],     // e->a typo; Deva द्रोणाधिकम्
  ['praṇaveṇa', 'praṇavena', 1],         // retroflex->dental; Deva प्रणवेन
  ['uddhṛty,', 'uddhṛtya,', 1],          // dropped final a; Deva उद्धृत्य
  ['viṣṇordeveśasya', 'viṣṇoḥ deveśasya', 1], // padaccheda; Deva विष्णोः देवेशस्य
  ['niveditamannādisarvaṃ mācāryāya', 'niveditānnādisarvam ācāryāya', 1], // garble; Deva निवेदितान्नादिसर्वम् आचार्याय
  ['nivedaniyam', 'nivedanīyam', 1],     // short i->ī; Deva निवेदनीयम्
  ['balihaṇe', 'baliharaṇe', 1],         // dropped r; Deva बलिहरणे
  ['bhoktavyāṃ', 'bhoktavyaṃ', 1],       // long ā->a; Deva भोक्तव्यं
];
let applied = 0;
for (const [from, to, exp] of [...DEVA_FIXES, ...IAST_FIXES]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

const chk = {
  applied,
  'residual praxipya': s.split('praxipya').length - 1,
  'residual प्रप्रि': s.split('प्रप्रि').length - 1,
  'residual dvou': s.split('dvou').length - 1,
  'PB markers': s.split('<!--PB-->').length - 1,
  'em bal': (s.match(/<em>/g)||[]).length + '/' + (s.match(/<\/em>/g)||[]).length,
  'strong bal': (s.match(/<strong>/g)||[]).length + '/' + (s.match(/<\/strong>/g)||[]).length,
  'p bal': (s.match(/<p>/g)||[]).length + '/' + (s.match(/<\/p>/g)||[]).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual praxipya'] || chk['residual प्रप्रि'] || chk['residual dvou']) throw new Error('residual defect');
if (chk['PB markers'] !== 9) throw new Error('PB count != 9');
for (const k of ['em bal','strong bal','p bal']) { const [a,c]=chk[k].split('/'); if(a!==c) throw new Error(k+' unbalanced'); }
// after fixes the Devanagari sequence must equal original modulo the 2 Deva fixes
let devRef = devOnly(rawS).replace('प्रप्रिक्षिप्य','प्रक्षिप्य').replace('कारकोटकानि','कार्कोटकानि');
if (devOnly(s) !== devRef) throw new Error('final Devanagari mismatch');
console.log('final Devanagari matches original modulo 2 intended Deva fixes.');

b.sanskrit = s;
fs.writeFileSync(SC + '/ch43-b3-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
