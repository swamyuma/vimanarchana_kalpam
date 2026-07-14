// ch37 (Nava-ṣaṭ-pañca-mūrti-pratiṣṭhā-vidhiḥ) reconciliation.
// Blocks: B2/B10/B12/B14 pattern-b (Deva+inline <em> IAST); B4-B8 pattern-a (separate iast);
// B14 also has the `**...*` lump-markup defect in its deity-placement bullet list (IAST lumped
// + misplaced) -> regenerated as proper pattern-b via translit.js. B15 colophon: empty English backfilled.
// All targeted fixes are Deva<->IAST slips confirmed by the translit checker + mUlam 037.
const fs = require('fs');
const { load, writeBack } = require('./load.js');
const { translit } = require('./translit.js');
const WRITE = process.argv.includes('--write');

const { html, chapters, start, end } = load();
const ch = chapters[36];
if (ch.number !== 37) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;

// [blockIdx, field, from, to, expectedCount]
const FIXES = [
  // --- B2 (sanskrit) ---
  [2,'sanskrit','yāgāśālā','yāgaśālā',12],     // yāga-śālā (extra ā); recurs
  [2,'sanskrit','mūtteḥ','mūrtteḥ',5],          // dropped r (Deva मूर्त्ते)
  [2,'sanskrit','oupāsana','aupāsana',3],       // ou->au
  [2,'sanskrit','pouṇḍarīk','pauṇḍarīk',1],     // ou->au
  [2,'sanskrit','cāvasathyama','cāvasathyam',1],// extra a
  [2,'sanskrit','śrāmaṇakagni','śrāmaṇakāgni',1],// dropped ā (śrāmaṇaka-agni)
  // --- B4 (iast) ---
  [4,'iast','souvarṇ','sauvarṇ',1],
  // --- B5 (iast + Deva) ---
  [5,'iast','yāgāśālā','yāgaśālā',1],
  [5,'iast','houtraṃ','hautraṃ',1],
  [5,'sanskrit','होतृन्','होतॄन्',1],            // Deva: hotṝn acc.pl. (mUlam होतॄन्; IAST already hotṝn)
  // --- B6 (iast) ---
  [6,'iast','mūtteḥ','mūrtteḥ',4],
  // --- B8 (iast) ---
  [8,'iast','mūtteḥ','mūrtteḥ',1],
  [8,'iast','gṛhītā,','gṛhītvā,',1],            // Deva गृहीत्वा gerund
  // --- B10 (sanskrit) ---
  [10,'sanskrit','yāgāśālā','yāgaśālā',7],
  [10,'sanskrit','mūtteḥ','mūrtteḥ',4],
  [10,'sanskrit','pouṇḍarīk','pauṇḍarīk',1],
  [10,'sanskrit','āgnou','āgnau',2],            // pauṇḍarīkāgnau, pradhānāgnau
  [10,'sanskrit','varāhāṇāṃ','vārāhāṇāṃ',1],    // Deva वाराह (long ā); mUlam वाराह
  [10,'sanskrit','tṛtīyalastha','tṛtīyatalastha',1], // IAST label typo; Deva तृतीयतलस्थ
  [10,'sanskrit','abja-śataṃ bilva-patraṃ','abja-śataṃ (100 kamalāni) bilva-patraṃ',1], // IAST dropped Deva gloss (१०० कमलानि)
  // --- B12 (sanskrit) ---
  [12,'sanskrit','yāgāśālā','yāgaśālā',2],
  [12,'sanskrit','pouṇḍarīk','pauṇḍarīk',1],
  [12,'sanskrit','sannidhou','sannidhau',1],
  [12,'sanskrit','devyou','devyau',1],
  [12,'sanskrit','toyadhāra-pura','toyadhārā-pura',1],
  [12,'sanskrit','naranārāyaṇ-nārasiṃha','naranārāyaṇa-nārasiṃha',1],
  [12,'sanskrit','viṣṇu-adi-pañcamūrtīnāṃ','viṣṇu-ādi-pañcamūrttīnāṃ',1],
  // --- B14 (sanskrit) — PROSE lines only (bullet section regenerated below) ---
  [14,'sanskrit','yāgāśālā','yāgaśālā',2],
  [14,'sanskrit','pouṇḍarīk','pauṇḍarīk',1],
  [14,'sanskrit','āgnou','āgnau',2],            // 2× sabhyāgnau
  [14,'sanskrit','souvarṇ','sauvarṇ',1],
  [14,'sanskrit','mouliṃ','mauliṃ',1],
  [14,'sanskrit','dhoutraṃ','hautraṃ',1],       // IAST: dh->h + ou->au (the हौत्रं word; cf ch34/B5)
  [14,'sanskrit','धौत्रं','हौत्रं',1],           // Deva: पूर्ववद् हौत्रं प्रशंस्य (mUlam+B5)
  [14,'sanskrit','adhivāsou','adhivāsau',1],
  [14,'sanskrit','tatesteṣāṃ','tatasteṣāṃ',1],
  [14,'sanskrit','vādyaiky','vādyaiḥ',1],
  [14,'sanskrit','toyadhāra-pura','toyadhārā-pura',1],
  [14,'sanskrit','dhruvaberaāt','dhruvaberāt',1],
  [14,'sanskrit','viṣṇu-yādīnāṃ','viṣṇu-ādīnāṃ',1],
  [14,'sanskrit','tadāiva','tadaiva',1],
  [14,'sanskrit','yajñāśālaye','yajñālaye',1],  // Deva यज्ञालये (mUlam यज्ञालये)
  [14,'sanskrit','puruṣ-satya','puruṣa-satya',1],
  [14,'sanskrit','dīpam iv ','dīpam iva ',1],
  // --- B15 colophon (iast) — align to Deva मूर्त्ति ---
  [15,'iast','navaṣaṭpañcamūrtipratiṣṭhā','navaṣaṭpañcamūrttipratiṣṭhā',1],
];

// Devanagari baseline for B14 (only Deva fix is धौत्रं->हौत्रं; bullet regen preserves Deva)
const devSeq = s => (s.match(/[ऀ-ॿ]/g) || []).join('');
const b14DevBaseline = devSeq(B[14].sanskrit.split('धौत्रं').join('हौत्रं'));

let applied = 0;
for (const [bi, field, from, to, exp] of FIXES) {
  const cur = B[bi][field];
  const n = cur.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT MISMATCH b${bi}.${field} "${from}": expected ${exp}, found ${n}`);
  B[bi][field] = cur.split(from).join(to);
  applied += n;
}

// ---- B14 bullet-section regeneration (the `**...*` lump defect) ----
{
  let s = B[14].sanskrit;
  const regionRe = /<p>आलय-प्रदक्षिणं[\s\S]*?<\/ul>/;
  const region = s.match(regionRe);
  if (!region) throw new Error('B14 bullet region not found');
  const R = region[0];
  const p30 = R.match(/<p>(आलय-प्रदक्षिणं[^<]*?)<\/p>/)[1];
  const ulInner = R.match(/<ul>([\s\S]*)<\/ul>/)[1];
  const chunks = ulInner.split('<li>').slice(1);
  const bullets = chunks.map(c => {
    let cut = c.length;
    for (const marker of ['<em>', '**', '</li>']) { const p = c.indexOf(marker); if (p >= 0) cut = Math.min(cut, p); }
    return c.slice(0, cut).replace(/\s+/g, ' ').trim();
  }).filter(x => x);
  if (bullets.length !== 9) throw new Error('expected 9 bullets, got ' + bullets.length);
  let nb = `<p>${p30}<br>\n<em>${translit(p30)}</em></p>\n<ul>\n`;
  for (const bd of bullets) nb += `<li>${bd}<br>\n<em>${translit(bd)}</em></li>\n`;
  nb += '</ul>';
  B[14].sanskrit = s.replace(regionRe, nb);
}

// ---- B15 colophon English backfill (was empty) ----
if (B[15].english !== '') throw new Error('B15 english not empty: ' + JSON.stringify(B[15].english));
B[15].english = '<ul>\n<li><p><em>Thus ends the thirty-seventh chapter, named &quot;The Rules for the Consecration of the Nine, Six, and Five Image Layouts&quot; (Nava-ṣaṭ-pañca-mūrti-pratiṣṭhā-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 37 ||</em></p>\n</li>\n</ul>\n';

// ---- checks ----
const chk = {
  'B14 deva preserved': devSeq(B[14].sanskrit) === b14DevBaseline,
  'B14 residual **': (B[14].sanskrit.match(/\*\*/g) || []).length,
  'B14 em bal': (B[14].sanskrit.match(/<em>/g)||[]).length + '/' + (B[14].sanskrit.match(/<\/em>/g)||[]).length,
  'B14 strong bal': (B[14].sanskrit.match(/<strong>/g)||[]).length + '/' + (B[14].sanskrit.match(/<\/strong>/g)||[]).length,
  'applied': applied,
};
console.log(JSON.stringify(chk, null, 1));
if (!chk['B14 deva preserved']) throw new Error('B14 Devanagari not preserved');
if (chk['B14 residual **'] !== 0) throw new Error('B14 ** remains');

if (WRITE) {
  fs.writeFileSync(require('./load.js').READER, writeBack(html, start, end, chapters));
  console.log('WROTE reader.');
} else {
  console.log('DRY RUN (pass --write).');
}
