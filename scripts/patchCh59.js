// ch59 (Kṛṣṇa-kalkyādi-mūrti-vidhiḥ — Kṛṣṇa with Rukmiṇī/Satyabhāmā/Garuḍa, Navanītanāṭa,
// Kāliyamardana + consecration; Kalkin; Ādimūrti on Ananta's coils; Anantaśayana rules)
// reconciliation. Content-fix chapter (18 <p>, 8 PB = 9 spreads, NO lump-markup). b3 Colophon
// intact (Deva+IAST correct) — filled empty english. mUlam 059_kRShNakalkyAdimUrtividhiH.md.
// english UNTOUCHED. Apparatus (मुद्रितपाठे …) Deva-only ✓; IAST omits editorial parens (ch57/58).
// DEVA FIX: क्षामान्→क्षामाम् [Satyabhāmā mantra acc.sg.fem; IAST kṣāmām + English quote
// "kṣāmām" + mUlam क्षामाम् all endorse; न्-for-म् slip].
// KEY IAST fixes: kāliyāmardan→kāliyamardan ×3 [Deva कालियमर्दन short a throughout; English
// mantra-quote "Kāliyamardanaṃ" endorses; the "Kāliyā-mardana:" English header is editorial,
// untouchable], iti navanītanāṭasya→naṭasya [Deva इति नवनीतनटस्य = mUlam; the chapter's OTHER
// नाट forms (title/body/mantra) are Deva=IAST consistent and stay], vāmaṃ saṅkhaṃ→saśaṅkhaṃ
// [dropped śa; Deva सशङ्खं; English "conch" endorses], satyabhāmāyoh→satyabhāmayoḥ [extra ā,
// cf ch21 same fix; Deva सत्यभामयोः], pratiṣṭhoktakremeṇa→krameṇa [e-for-a garble],
// vāmām ākuñcya→vāmam [cf ch19], m/ṃ-before-vowel mirrors (dhruvaberam aṣṭopacāraiḥ,
// daśatālamitam aśvākāraṃ, mukham anyat, sapadma-vāmahastāṃ per Deva ां).
// DIVERGENCES LEFT (Deva=IAST consistent; mUlam differs): द्वादशाङ्गुलं [mUlam दशाङ्गुलं;
// apparatus notes], षट्सप्तत्युत्तराष्टादशाङ्गुलं [mUlam षट्सप्ताऽष्टदश… निम्नं; apparatus],
// वामाङ्गुलं [वामेऽङ्गुलं], तस्यार्धहृदयं [तस्यार्धं हृदयं], मेढ्रभागं [मेढ्रं भागं], जङ्घान्तं
// [जान्वन्तं], sūtrān mātrātrayaṃ space [Deva सूत्रान्मात्रात्रयं; cosmetic], नवनीतनाट (नृत्त)
// [mUlam नट], सपताकं [सपतकं], सुदतीं [सुन्दरीं], 'सत्यः सत्यज्ञः' [mUlam सत्यस्सत्यस्थ],
// धूर्णावहन्ता [mUlam धूर्नो वहन्ता; apparatus घूर्नो], अन्यत् नराकारं [अन्यं], छत्रमौलिं
// [छन्नमौलिं, cf ch57], सुसम्प्रबुद्धं [mUlam सुप्तं प्रबुद्धं], उत्तान-कुञ्चितं [कुचितं],
// वामपादं [वामपदं], ekajānu-krameṇa hyphen [cosmetic].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[58];
if (ch.number !== 59) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
const PB_BEFORE = (b2.sanskrit.match(/<!--PB-->/g) || []).length;
let s = b2.sanskrit;

const FIXES = [
  // --- DEVA fix (IAST + English quote + mUlam endorse) ---
  ['क्षामान्', 'क्षामाम्', 1],
  // --- 'ea'-for-'e' garble family (cf ch57/58) ---
  ['heamābhāṃ', 'hemābhāṃ', 1], ['arcākrameaṇa', 'arcākrameṇa', 1],
  ['deaveśaṃ', 'deveśaṃ', 2], ['jāgradbhāveana', 'jāgradbhāvena', 1],
  // --- ou→au GLOBAL (field has NO English; 10 verified: pouṇḍarīk ×4, pradhānāgnou ×3,
  //     houtraṃ ×2, houtraśaṃsanādīni; tag-safe) ---
  ['ou', 'au', 10],
  // --- non-standard ō glyph ---
  ['ahiphaṇōpari', 'ahiphaṇopari', 1],
  // --- x→kṣ ---
  ['laxaṇ', 'lakṣaṇ', 6], ['daxiṇ', 'dakṣiṇ', 14],
  // --- ṣ-for-kh + m-before-vowel mirror (Deva मुखम् अन्यत्) ---
  ['muṣaṃ anyat', 'mukham anyat', 1],
  // --- word-final h→ḥ ---
  ['kalkinah', 'kalkinaḥ', 2], ['nābheh', 'nābheḥ', 1],
  ['satyabhāmāyoh', 'satyabhāmayoḥ', 1],  // + extra ā (Deva सत्यभामयोः; cf ch21)
  ['dhruvaberaṃ aṣṭopacāraih', 'dhruvaberam aṣṭopacāraiḥ', 1], // + Deva बेरम् before vowel
  ['raih ', 'raiḥ ', 4],   // ṣoḍaśopacāra-mantraih, mūrtimantraih ×2, pañcamūrtimantraih
  // --- kāliya (short a per Deva कालियमर्दन; kāliyā-ahi with ā is legit & untouched) ---
  ['kāliyāmardan', 'kāliyamardan', 3],
  // --- Deva इति नवनीतनटस्य (= mUlam); chapter's other नाट forms stay ---
  ['iti navanītanāṭasya', 'iti navanītanaṭasya', 1],
  // --- dropped śa (Deva सशङ्खं; English "conch" endorses) ---
  ['vāmaṃ saṅkhaṃ', 'vāmaṃ saśaṅkhaṃ', 1],
  // --- ṃ/m mirrors per Deva ---
  ['sapadma-vāmahastām', 'sapadma-vāmahastāṃ', 1],       // Deva -हस्तां
  ['daśatālamitaṃ aśvākāraṃ', 'daśatālamitam aśvākāraṃ', 1], // Deva -मितम् अश्वाकारं
  // --- misc slips (Deva primary) ---
  ['vāmām ākuñcya', 'vāmam ākuñcya', 1],  // Deva वामम् (cf ch19)
  ['pratiṣṭhoktakremeṇa', 'pratiṣṭhoktakrameṇa', 1],
  ['snapanotsavādīni', 'snapana-utsavādīni', 1], // mirror Deva split (cf ch55-58)
  ['pṛthag ', 'pṛthak ', 1],              // Deva पृथक्
  ['yāgāśālā', 'yāgaśālā', 2],            // recurring spurious ā
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the fifty-ninth chapter, named &quot;The Rules for the Images of Kṛṣṇa, Kalkin, and the Rest&quot; (Kṛṣṇa-kalkyādi-mūrti-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 59 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou/ea/ō/āi': (latin.match(/ou|ea|ō|āi/g) || []).length,
  'residual muṣ/kāliyāmard': (s.match(/muṣ|kāliyāmard/g) || []).length,
  'residual final-h': (latin.match(/[aāeiīouū]h(?=[\s,;.)&])/g) || []).length,
  'residual deva क्षामान्': (s.match(/क्षामान्/g) || []).length,
  'PB': (s.match(/<!--PB-->/g) || []).length + '/' + PB_BEFORE,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
for (const k of Object.keys(chk)) {
  if (k.startsWith('residual') && chk[k]) throw new Error('residual defect: ' + k);
}
for (const k of ['PB', 'em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' mismatch'); }

b2.sanskrit = s;
b3.english = NEW_B3_ENG;
fs.writeFileSync(SC + '/ch59-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
