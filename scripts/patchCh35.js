// ch35 (Nava-ṣaṭ-pañca-mūrti-vidhiḥ) reconciliation.
// Single content block (index 2, pattern-b: Deva + inline <em> IAST in `sanskrit`).
// English (b2.english) is complete — UNTOUCHED. No colophon block (chapter ends at āha marīciḥ, like ch23).
// All fixes are Deva<->IAST mismatches / glyph / mojibake, cross-checked vs mUlam 035 + editor's
// Typographical Resolutions Table (block 3). String replacement (NOT regex-callback) per ch20 lesson.
const { load, writeBack } = require('./load.js');
const fs = require('fs');
const WRITE = process.argv.includes('--write');

// [from, to, expectedCount]
const IAST_FIXES = [
  ['manṭapa', 'maṇṭapa', 8],                              // Deva मण्टप = retroflex ṇṭ (editor table confirms)
  ['niściya', 'niścitya', 2],                             // Deva निश्चित्य
  ['pañcavaiṃśati', 'pañcaviṃśati', 2],                   // Deva पञ्चविंशति
  ['ādimūttehr', 'ādimūrtter', 2],                        // Deva आदिमूर्त्तेर् (run before ādimūtteḥ)
  ['ādimūtteḥ', 'ādimūrtteḥ', 3],                         // Deva आदिमूर्त्तेः
  ['kūṭa-śālādaiḥ', 'kūṭa-śālādyaiḥ', 2],                 // Deva शालाद्यैः (table confirms)
  ['tritalairyutaṃ', 'tritalairyuktaṃ', 1],              // Deva त्रितलैर्युक्तं
  ['sālipndraṃ', 'sālindraṃ', 1],                         // Deva सालिन्द्रं (table confirms)
  ['vistāra-samṃ', 'vistāra-samaṃ', 1],                   // Deva विस्तार-समं
  ['bhittou', 'bhittau', 5],                              // Deva भित्तौ (ou->au; covers bāhya-/abhyantara-/bare)
  ['naranārāyaṇou', 'naranārāyaṇau', 1],                  // Deva नरनारायणौ
  ['tou vinā', 'tau vinā', 1],                            // Deva तौ विना
  ['dvyāṃśaṃ śikharaṃ', 'dvyaṃśaṃ śikharaṃ', 3],          // Deva द्व्यंशं शिखरं (short a)
  ['ekāṃśaṃ stūpikāṃ', 'ekāṃśāṃ stūpikāṃ', 1],            // Deva एकांशां (fem acc agreeing w/ stūpikāṃ)
  ['garbhāgare', 'garbhagāre', 1],                        // Deva गर्भगारे (reader's consistent form)
  ['saṃyuttaṃ', 'saṃyuktaṃ', 1],                          // Deva संयुक्तं (kt not tt) [śayāna-dhruva-kautuka]
  ['kautuka-saṃyutaṃ', 'kautuka-saṃyuktaṃ', 1],          // Deva ध्रुव-कौतुक-संयुक्तं (missing k)
  ['servamūrtīnāṃ', 'sarvamūrtīnāṃ', 1],                  // Deva सर्वमूर्तीनां (ser->sar)
  ['viṣṇumūtteḥ', 'viṣṇumūrtteḥ', 1],                     // Deva विष्णुमूर्त्तेः
  ['dvital-prāsādam', 'dvitala-prāsādam', 1],             // Deva द्वितल-प्रासादम्
  ['dvyardhāṃśa,', 'dvyardhāṃśaṃ,', 1],                   // Deva द्व्यर्धांशं
  ['caturvarga-yutaṃ', 'caturvarga-yuktaṃ', 1],           // Deva चतुर्वर्ग-युक्तं
  ['dhruva-yutaṃ', 'dhruva-yuktaṃ', 1],                   // Deva ध्रुव-युक्तं
  ['jālakeka-yutaṃ', 'jālakaika-yuktaṃ', 1],              // Deva जालकैक-युक्तं (jālaka-eka + missing k)
  ['kṛत्वा', 'kṛtvā', 1],                                  // MOJIBAKE: Latin kṛ + Devanagari त्वा
];
// Deva-side fix
const DEVA_FIXES = [
  ['कूटारे', 'कूटागारे', 1],                               // IAST kūṭāgāre; Deva dropped गा (mUlam कूटकागारे)
];

const { html, chapters, start, end } = load();
const ch = chapters[34];
if (ch.number !== 35) throw new Error('wrong chapter: ' + ch.number);
const b = ch.blocks[2];
if (b.type !== 'verse' || b.num !== 1) throw new Error('block 2 not the verse block');

let sk = b.sanskrit;
const englishBefore = b.english;
let applied = 0;
for (const [from, to, exp] of [...IAST_FIXES, ...DEVA_FIXES]) {
  const n = sk.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT MISMATCH for "${from}": expected ${exp}, found ${n}`);
  sk = sk.split(from).join(to);
  applied += n;
}
b.sanskrit = sk;

// integrity checks on the new sanskrit
const resid = {
  'stray ou': sk.split('ou').length - 1,          // blockquote has none; expect 0 after fixes
  'manṭapa dental-n left': sk.split('manṭapa').length - 1,
  'ādimūtte (missing r) left': sk.split('ādimūtte').length - 1,
  'mojibake kṛ+Deva left': sk.split('kṛत्वा').length - 1,
  'em open': (sk.match(/<em>/g) || []).length,
  'em close': (sk.match(/<\/em>/g) || []).length,
  'strong open': (sk.match(/<strong>/g) || []).length,
  'strong close': (sk.match(/<\/strong>/g) || []).length,
};
console.log('replacements applied:', applied);
console.log('english unchanged:', b.english === englishBefore);
console.log('residual/balance:', JSON.stringify(resid, null, 0));
if (resid['stray ou'] !== 0) throw new Error('stray ou remains');
if (resid['manṭapa dental-n left'] !== 0) throw new Error('manṭapa remains');
if (resid['ādimūtte (missing r) left'] !== 0) throw new Error('ādimūtte remains');
if (resid['mojibake kṛ+Deva left'] !== 0) throw new Error('mojibake remains');
if (resid['em open'] !== resid['em close']) throw new Error('em unbalanced');
if (resid['strong open'] !== resid['strong close']) throw new Error('strong unbalanced');

if (WRITE) {
  const out = writeBack(html, start, end, chapters);
  fs.writeFileSync(require('./load.js').READER, out);
  console.log('WROTE reader.');
} else {
  console.log('DRY RUN (pass --write to apply).');
  // emit new sanskrit for visual inspection
  fs.writeFileSync('ch35-b2-sanskrit-NEW.txt', sk);
}
