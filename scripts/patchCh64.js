// ch64 (Dūṣita-prāyaścitta / Snapanamaṇḍapādi-dāhādau prāyaścitta-vidhiḥ — expiations for
// fire/lightning/wind damage to halls, defective timbers, missing gems/metals/seeds, śūla
// faults, wrong-material or defective images [abhicārika danger], stolen kautuka, image
// tilt/defect omens, anukta expiation) reconciliation. Content-fix chapter (27 <p>, 23 PB =
// 24 spreads, NO lump). b3 Colophon intact — filled empty english. mUlam
// 064_dUShitaprAyashchittavidhiH.md. english UNTOUCHED.
// BIGGEST FIX — IAST TRUNCATION RESTORED: final para IAST read "kāpilena vyāhṛtyantaṃ yajet",
// dropping "ghṛtena pañcāgnau vaiṣṇavaṃ, viṣṇusūktaṃ, śrībhūmidaivatyaṃ," (Deva + mUlam +
// English "ghee (of a kapila cow)" all have the full sentence) — restored by transliterating
// the Deva primary.
// DEVA FIXES: header प्रायश्चितत्त्वम्→प्रायश्चित्तम् [IAST header prāyaścittam endorses],
// नपुंसकशिलाया→नपुंसकशिलया [instr. fem; IAST śilayā + mUlam शिलया], अर्धलोभाद्→अर्थलोभाद् +
// ardhalobhād→arthalobhād [greed for WEALTH; mUlam + English "greed" + ch61's अर्थलोभाद्],
// तच्छीह्रि (तच्छक्तिं)→तच्छक्तिं (मुद्रितपाठे तच्छीह्रि) [primary was a non-word garble with
// the real reading in the paren — swapped into the chapter's own apparatus style; IAST
// tacchaktiṃ + mUlam तच्छक्तिं + English "śakti" endorse].
// KEY IAST: garbhavinyāsārthaṃ pīṭhavinyāsārthaṃ→garbhanyāsārthaṃ pīṭhanyāsārthaṃ [Deva न्यास
// ×2], daivata→daivatya ×3 (mahābhūta/śrībhūmi/sarva — Deva दैवत्यं), aiah→aiḥ ×5 [recurs
// ch63], yunkte→yukte, vināṣe→vināśe, taduktāmāna→taduktamāna, kautukādiberam ajñānāt [m].
// LEFT (Deva=IAST consistent; mUlam differs): पञ्चाग्नौ [पद्माग्नौ ×3, recurs ch61-63],
// सुधया अयुक्तं [mUlam युक्तं — defect-list context supports a-yuktaṃ], आग्नेयं च व्याहृत्यन्तं
// [mUlam विच्छिन्नं], दैविके आर्षे पौरुषे [mUlam चार्षे पौराणिके], रजतं [राजतं], यवमात्रं
// [यवमानं], अर्थहानिः [अर्थहीनः], 'yad devāḥ' split [यद्देवाः; cosmetic], उक्तवर्णैः [उक्तवर्णान्].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[63];
if (ch.number !== 64) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
const PB_BEFORE = (b2.sanskrit.match(/<!--PB-->/g) || []).length;
let s = b2.sanskrit;

const FIXES = [
  // --- IAST truncation restore (translit of Deva primary) ---
  ['kāpilena vyāhṛtyantaṃ yajet', 'kāpilena ghṛtena pañcāgnau vaiṣṇavaṃ, viṣṇusūktaṃ, śrībhūmidaivatyaṃ, vyāhṛtyantaṃ yajet', 1],
  // --- DEVA fixes (+ paired IAST) ---
  ['प्रायश्चितत्त्वम्', 'प्रायश्चित्तम्', 1],
  ['नपुंसकशिलाया', 'नपुंसकशिलया', 1],
  ['अर्धलोभाद्', 'अर्थलोभाद्', 1], ['ardhalobhād', 'arthalobhād', 1],
  ['तच्छीह्रि (तच्छक्तिं)', 'तच्छक्तिं (मुद्रितपाठे तच्छीह्रि)', 1],
  // --- IAST vinyāsa-for-nyāsa (Deva गर्भन्यासार्थं पीठन्यासार्थं) ---
  ['garbhavinyāsārthaṃ pīṭhavinyāsārthaṃ', 'garbhanyāsārthaṃ pīṭhanyāsārthaṃ', 1],
  // --- daivata→daivatya (Deva दैवत्यं) ---
  ['āgneyaṃ mahābhūtadaivataṃ', 'āgneyaṃ, mahābhūtadaivatyaṃ', 1], // + Deva comma
  ['śrībhūmidaivataṃ', 'śrībhūmidaivatyaṃ', 1],
  ['sarvadaivataṃ', 'sarvadaivatyaṃ', 1],
  // --- x→kṣ ---
  ['abhyuxya', 'abhyukṣya', 1], ['nixipya', 'nikṣipya', 2], ['praxālya', 'prakṣālya', 1],
  ['napuṃsakavṛxeṇa', 'napuṃsakavṛkṣeṇa', 1], ['kālānapexaṃ', 'kālānapekṣaṃ', 1],
  ['salaxaṇaṃ', 'salakṣaṇaṃ', 3], ['laxaṇāni', 'lakṣaṇāni', 1],
  ['daxiṇāvanate', 'dakṣiṇāvanate', 1], ['kuxicchidre', 'kukṣicchidre', 1],
  ['dhanaxayaḥ', 'dhanakṣayaḥ', 1], ['vaxye', 'vakṣye', 1],
  // --- non-standard ō ---
  ['berōkta', 'berokta', 1],
  // --- ou→au GLOBAL (7: pañcāgnou ×3, nityāgnou, soumyaṃ, souvarṇaṃ, souraṃ; tag-safe) ---
  ['ou', 'au', 7],
  // --- word-final h→ḥ ---
  ['dadbhyah', 'dadbhyaḥ', 1], ['aiah', 'aiḥ', 5],
  // --- misc slips (Deva primary, mUlam-confirmed) ---
  ['taduktāmāna', 'taduktamāna', 1],       // Deva तदुक्तमान
  ['kautukādiberaṃ ajñānāt', 'kautukādiberam ajñānāt', 1], // Deva -बेरम् अ
  ['yunkte', 'yukte', 1],                  // Deva युक्ते
  ['vināṣe', 'vināśe', 1],                 // Deva विनाशे
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the sixty-fourth chapter, named &quot;The Rules of Expiation for Defilement by Fire, Lightning, Wind, Thieves, and Enemies&quot; (Dūṣita-prāyaścitta-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 64 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou/ea/ō/ē/āi': (latin.match(/ou|ea|ō|ē|āi/g) || []).length,
  'residual aiah/yunkte/vināṣ': (s.match(/aiah|yunkte|vināṣ/g) || []).length,
  'residual final-h': (latin.match(/[aāeiīouū]h(?=[\s,;.)&])/g) || []).length,
  'residual deva चितत्त्व/शिलाया/अर्धलोभ/तच्छीह्रि (': (s.match(/चितत्त्व|शिलाया|अर्धलोभ|तच्छीह्रि \(/g) || []).length,
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
fs.writeFileSync(SC + '/ch64-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
