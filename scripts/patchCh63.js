// ch63 (Karṣaṇādi-punaḥsaṃskāra-vidhiḥ — temple renovation & re-consecration: re-plowing/
// sowing rite, re-doing first-brick/garbha/crown-brick touches, undersized/destroyed/uprooted/
// stolen/moved images, relocation after flood etc., king installing a captured image,
// building near an apauruṣeya shrine) reconciliation. Content-fix chapter (16 <p>, 7 PB =
// 8 spreads, NO lump-markup; b2 is ONE huge opening <p>). b3 Colophon intact — filled empty
// english. mUlam 063_karShaNAdipunassaMskAravidhiH.md. english UNTOUCHED.
// DEVA FIXES: कर्षणाार्थम्→कर्षणार्थम् [double-ा glyph — the आा/ुु/ेे class, now also ाा],
// गोक्षणेभ्यो→गोगणेभ्यो + IAST gōkṣaṇebhyo→gogaṇebhyo [non-word; mUlam गोगणेभ्यो "to the herds
// of cows", English "cows" endorses; (गोभ्यो) gloss stays; cf ch61 gogora], सङ्बाध→सम्बाध +
// saṅbādha→sambādha [bad ṅb sandhi; mUlam सम्बाध], स्वराष्ट्र मनोरमे→स्वराष्ट्रे [dropped
// locative े; IAST svarāṣṭre + English "own country" endorse], समफलं (…) मचिराद्→समफलम् (…)
// अचिराद् + IAST samaphalaṃ macirād→samaphalam acirād [orphaned म mis-split; acirād "quickly"].
// KEY IAST: praxeapaṇaṃ→prakṣepaṇaṃ ×3 [x+ea combo], alayaṃ saṃṣodhya→ālayaṃ saṃśodhya ×2
// [dropped ā + ṣ-for-ś], dhruvavasthāpanōktavad→dhruvasthāpanoktavad [dittography+ō],
// puṇyāhānter→puṇyāhānte, aiah→aiḥ ×5 [NEW final-h variant], vimānanya→vimānasya [recurs ch62],
// caturveda-adi→ādi ×2, sthāpitaṃ yadi→sthāpituṃ [infinitive; mUlam], jitva→jitvā,
// vimānama→vimānam, beraṃ āhṛtya→beram.
// LEFT (Deva=IAST consistent): पञ्चाग्नौ [mUlam पद्माग्नौ, cf ch61-62], दिग्दैवतं/विमानपाल-दैवतं
// [mUlam -देवत्यं], मूर्ध्नेष्टकार्थं [apparatus अंत्येष्टकार्थं], तद्-तद्-नाम्ना [तत्तन्नाम्ना],
// चतसृणां [चतुसॄणां], निर्दोषबेरं [निर्दोषं बेरं], तद्-वास्तु-विभाग-आलये [तद्वास्त्वङ्गाऽऽलये],
// अपौरुषेयस्य [mUlam अपौरुष; apparatus अपीरुष], सिध्यति [सिद्ध्यति], ग्रामादीनां हीने [ग्रामादौ],
// reader's extra आलयं संशोध्य; आद्येष्टकार्थम् औपासनाग्निकुण्डं clause [absent in mUlam].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[62];
if (ch.number !== 63) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
const PB_BEFORE = (b2.sanskrit.match(/<!--PB-->/g) || []).length;
let s = b2.sanskrit;

const FIXES = [
  // --- DEVA fixes (+ paired IAST) ---
  ['कर्षणाार्थम्', 'कर्षणार्थम्', 1],
  ['गोक्षणेभ्यो', 'गोगणेभ्यो', 1], ['gōkṣaṇebhyo', 'gogaṇebhyo', 1],
  ['सङ्बाध', 'सम्बाध', 1], ['saṅbādha', 'sambādha', 1],
  ['स्वराष्ट्र मनोरमे', 'स्वराष्ट्रे मनोरमे', 1],
  ['समफलं (', 'समफलम् (', 1], [') मचिराद्', ') अचिराद्', 1],
  ['samaphalaṃ macirād', 'samaphalam acirād', 1],
  // --- x→kṣ (+ea combos) ---
  ['praxeapaṇaṃ', 'prakṣepaṇaṃ', 3],
  ['samabhyuxya', 'samabhyukṣya', 1], ['abhyuxya', 'abhyukṣya', 1], // order matters
  ['ālayābhimuxe', 'ālayābhimukhe', 1],
  ['daxiṇ', 'dakṣiṇ', 2], ['salaxaṇaṃ', 'salakṣaṇaṃ', 2],
  // --- 'ea' garble family ---
  ['sudhāvarṇaleapanaṃ', 'sudhāvarṇalepanaṃ', 1], ['deaveśaṃ', 'deveśaṃ', 1],
  ['viṣvakseaṇam', 'viṣvaksenam', 1], ['suvarṇeana', 'suvarṇena', 1],
  ['hasteana', 'hastena', 1], ['mantreaṇa', 'mantreṇa', 1],
  ['deavaṃ', 'devaṃ', 2], ['yeana keanacit', 'yena kenacit', 1], ['deaśe', 'deśe', 3],
  // --- non-standard ō (+garbles) ---
  ['sarvalōhebhyaḥ', 'sarvalohebhyaḥ', 1],
  ['dhruvavasthāpanōktavad', 'dhruvasthāpanoktavad', 1], // dittography vava + ō
  // --- ou→au GLOBAL (4: bhūmou ×2, pañcāgnou, grāmādou; no English in field; tag-safe) ---
  ['ou', 'au', 4],
  // --- word-final h→ḥ ---
  ['aih ', 'aiḥ ', 5],   // pañcagavyaih anuvākādyaih droṇaih droṇārdhaih taṇḍulaih
  ['aiah', 'aiḥ', 5],    // gajādyaiah ācāryādyaiah avidhijñaiah vidhijñaiah ×2
  ['viṣṇoh', 'viṣṇoḥ', 1],
  // --- āi→ai ---
  ['tathāiva', 'tathaiva', 1],
  // --- misc slips (Deva primary, mUlam-confirmed) ---
  ['puṇyāhānter', 'puṇyāhānte', 1],
  ['alayaṃ saṃṣodhya', 'ālayaṃ saṃśodhya', 2],  // dropped ā + ṣ-for-ś
  ['dattva', 'dattvā', 1],                       // Deva दत्त्वा
  ['caturveda-adi-mantrān', 'caturveda-ādi-mantrān', 2], // dropped macron
  ['vimānanya', 'vimānasya', 1],                 // garble (recurs ch62)
  ['vimānama utkṛṣṭaṃ', 'vimānam utkṛṣṭaṃ', 1],
  ['jitva ', 'jitvā ', 1],                       // Deva जित्वा
  ['beraṃ āhṛtya', 'beram āhṛtya', 1],           // Deva बेरम् आहृत्य
  ['sthāpitaṃ yadi', 'sthāpituṃ yadi', 1],       // Deva स्थापितुं (infinitive)
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the sixty-third chapter, named &quot;The Rules for Renovation and Re-consecration Beginning with Plowing&quot; (Karṣaṇādi-punaḥsaṃskāra-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 63 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou/ea/ō/ē/āi': (latin.match(/ou|ea|ō|ē|āi/g) || []).length,
  'residual aiah/gōkṣ/saṅb': (s.match(/aiah|gōkṣ|saṅb/g) || []).length,
  'residual final-h': (latin.match(/[aāeiīouū]h(?=[\s,;.)&])/g) || []).length,
  'residual deva ाा/आा/ुु/ेे/गोक्षण/मचिराद्': (s.match(/ाा|आा|ुु|ेे|गोक्षण|मचिराद्/g) || []).length,
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
fs.writeFileSync(SC + '/ch63-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
