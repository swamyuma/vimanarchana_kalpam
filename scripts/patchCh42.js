// ch42 (Upacārabheda-sandhyāghaṭikā-vidhiḥ / Bali-vidhiḥ) reconciliation.
// Single content block b3 (verse, pattern-b: Deva + inline <em> IAST per <p>; empty `iast` leaf).
// Separate `english` field (complete) UNTOUCHED. b2 is a prose WARNING (source pages 180-181 lost);
// chapter is TRUNCATED at "vimānārcanāyāmeva dvātriṃ-... (granthapātaḥ)" — the lost sections
// (ṣoḍaśopacāra-parigaṇana, ghaṭikā-vidhāna, colophon) are NOT imported (per abridgment precedent).
// b3.sanskrit + english carry <!--PB--> page-break markers (batch-1 commit d9e13bd) — NOT disturbed.
// The Deva-side "(मुद्रितपाठे X)" printed-variant apparatus is the editor's authority; Deva primary
// reading is transliterated, the (मुद्रितपाठे ...) apparatus stays Deva-only (ch12 rule).
// Cross-checked vs mUlam 042_upachArabhedasandhyAghaTikAvidhiH.md. ALL 18 fixes are IAST-side slips
// (no Deva errors found; the Deva was carefully edited with apparatus).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/357a72e2-eb1c-4f8e-843a-248568ad40f5/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[41];
if (ch.number !== 42) throw new Error('wrong chapter ' + ch.number);
const b = ch.blocks[3];
if (b.type !== 'verse') throw new Error('b3 not verse: ' + b.type);
let s = b.sanskrit;
const pbBefore = s.split('<!--PB-->').length - 1;

// IAST-side transliteration slips (Deva primary is correct; mUlam-confirmed).
const IAST_FIXES = [
  ['bhajaṅgārdha', 'bhujaṅgārdha', 1],   // Deva भुजङ्ग (serpent); a->u slip
  ['praxipya', 'prakṣipya', 1],          // x->kṣ; Deva प्रक्षिप्य
  ['koutukāṅgulou', 'kautukāṅgulau', 1], // ou->au x2; Deva कौतुकाङ्गुलौ
  ['paramātmanaṃ', 'paramātmānaṃ', 1],   // dropped ā; Deva परमात्मानं (acc paramātman)
  ['axataṃ', 'akṣataṃ', 1],              // x->kṣ; Deva अक्षतं
  ['axataiḥ', 'akṣataiḥ', 1],            // x->kṣ; Deva अक्षतैः
  ['madhyye', 'madhye', 1],              // extra y; Deva मध्ये (nṛttamaṇḍapamadhye)
  ['apsarasāśca', 'apsarasaśca', 1],     // spurious ā; Deva अप्सरसश्च
  ['dattva,', 'dattvā,', 2],             // dropped macron; Deva दत्त्वा (P5 puṣpaṃ + P7 viṣvaksenāya)
  ['tadvaiṣṇuḥ', 'tadviṣṇuḥ', 1],        // vaiṣṇ->viṣṇ (recurs ch41); Deva 'प्र तद्विष्णुः'
  ['koutuke', 'kautuke', 1],             // ou->au; Deva कौतुके
  ['xiṣpet', 'kṣipet', 1],               // x->kṣ + garble; Deva क्षिपेत्
  ['vigrahaścāik', 'vigrahaścaik', 1],   // āi->ai; Deva विग्रहश्चैकार्थी
  ['daṣiṇā', 'dakṣiṇā', 3],              // dropped k; Deva दक्षिणा (praṇāmadaṣiṇā x2 + daṣiṇāyutāḥ)
  ['ṣadupacār', 'ṣaḍupacār', 2],         // dental d->retroflex ḍ; Deva षडुपचार (P11 -āḥ + P12 -ān)
  ['dvou upacārou', 'dvau upacārau', 1], // ou->au x2; Deva द्वौ उपचारौ
  ['ādou', 'ādau', 1],                   // ou->au; Deva आदौ
  ['snapanāni', 'snapanaṃ', 1],          // pl->sg; Deva आसन-स्नपनं (English "seat and bath")
];

let applied = 0;
for (const [from, to, exp] of IAST_FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

const chk = {
  applied,
  'residual ou': s.split('ou').length - 1,               // expect 0 (all 6 were Deva औ)
  'residual x': (s.match(/x/g) || []).length,             // expect 0 (all were kṣ)
  'residual daṣiṇā': s.split('daṣiṇā').length - 1,        // expect 0
  'PB markers (before/after)': pbBefore + '/' + (s.split('<!--PB-->').length - 1),
  'em bal': (s.match(/<em>/g)||[]).length + '/' + (s.match(/<\/em>/g)||[]).length,
  'strong bal': (s.match(/<strong>/g)||[]).length + '/' + (s.match(/<\/strong>/g)||[]).length,
  'p bal': (s.match(/<p>/g)||[]).length + '/' + (s.match(/<\/p>/g)||[]).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual ou'] || chk['residual x'] || chk['residual daṣiṇā']) throw new Error('residual defect');
if (pbBefore !== (s.split('<!--PB-->').length - 1)) throw new Error('PB marker count changed!');
const eb = chk['em bal'].split('/'); if (eb[0] !== eb[1]) throw new Error('em unbalanced');
const sb = chk['strong bal'].split('/'); if (sb[0] !== sb[1]) throw new Error('strong unbalanced');
const pb = chk['p bal'].split('/'); if (pb[0] !== pb[1]) throw new Error('p unbalanced');

b.sanskrit = s;
fs.writeFileSync(SC + '/ch42-b3-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
