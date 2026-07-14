// ch65 (Pratiṣṭhā-prāyaścitta-vidhiḥ — expiations for consecration errors: aṅkurārpaṇa,
// akṣimocana, jalādhivāsa, yajñaśālā/vedi/kuṇḍa faults, fire-carrying, contaminated ājya/caru,
// substitute materials, defiled pots/homas, mantra lapses, wrongly-woken deity, dakṣiṇā rules,
// wrong āvāhana source) reconciliation. PATTERN-A chapter: 55 blocks, 52 content verses
// (b2-b53, each with own sanskrit/iast/english) + b54 Colophon. NO PB. NO lump.
// mUlam 065_pratiShThAprAyashchittavidhiH.md. english UNTOUCHED (all verses already translated).
// Fixes applied ACROSS all verse blocks' sanskrit+iast fields with TOTAL count-guards.
// DEVA FIXES: व्याहती→व्याहृती ×5 [missing ृ; IAST vyāhṛtīśca endorses], देशाधिपदैवत्ं +
// द्वाराधिपदैवत्ं→-दैवतं [broken त्ं glyph ×2], दिकपाल→दिक्पाल [missing halant],
// विंशातिकृत्वो→विंशतिकृत्वो, अग्निम् आदर्तव्यं (अग्निम् आहृत्य)→अग्निम् आहृत्य (मुद्रितपाठे
// आदर्तव्यं) [reversed-primary paren, cf ch64 तच्छीह्रि; mUlam आहृत्य + IAST endorse].
// KEY IAST (Deva primary + mUlam): rāja-rāṣṭra-vināśāya→nāśāya [mUlam राजराष्ट्रनाशाय],
// pratyekaṃ yajet→pṛthak pṛthak yajet [Deva+mUlam], ṛtvijām alābhe→abhāve [Deva+mUlam],
// lokādhipadaivataṃ→lokādhidaivataṃ [Deva अधि], tvoūrje→tvorje [iṣe tvorje tvā!],
// śāyayes→śāyayet, āditya→ādṛtya [Deva आदृत्य], daivatyāṃ→daivatyaṃ ×10, aiah-family ×7,
// x→kṣ ×27, 'ea' ×20, ṣ-for-ś (viṣeṣe ×3+1, puraṣcaraṇaṃ, dīṣitasya→dīkṣ, ṣeṣahoma),
// kuṇde/kuṇdẽ→kuṇḍe. COLOPHON b54.iast: removed stray markdown fence '```' (+its <br>).
// LEFT (Deva=IAST consistent): कुण्डाणां [b45; mUlam inconclusive], विंशातिकृत्वो-family
// counts, b54 SK <h2> vs IA <p> structure.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[64];
if (ch.number !== 65) throw new Error('wrong chapter ' + ch.number);
const verses = ch.blocks.filter(b => b.type === 'verse');
if (verses.length !== 53) throw new Error('expected 53 verse blocks, got ' + verses.length);
const colo = verses[verses.length - 1];
if (colo.label !== 'Colophon') throw new Error('last verse not colophon');

const FIXES = [
  // --- DEVA fixes ---
  ['व्याहती', 'व्याहृती', 5],
  ['देशाधिपदैवत्ं', 'देशाधिपदैवतं', 1], ['द्वाराधिपदैवत्ं', 'द्वाराधिपदैवतं', 1],
  ['दिकपाल', 'दिक्पाल', 1], ['विंशातिकृत्वो', 'विंशतिकृत्वो', 1],
  ['अग्निम् आदर्तव्यं (अग्निम् आहृत्य)', 'अग्निम् आहृत्य (मुद्रितपाठे आदर्तव्यं)', 1],
  // --- IAST spurious vi- (Deva + mUlam राजराष्ट्रनाशाय) ---
  ['rāja-rāṣṭra-vināśāya', 'rāja-rāṣṭra-nāśāya', 1],
  ['samāceret', 'samācaret', 1],
  ['daivatyāṃ', 'daivatyaṃ', 10],
  // --- x→kṣ ---
  ['axi-mocan', 'akṣi-mocan', 6], ['nixip', 'nikṣip', 3], ['naxatre', 'nakṣatre', 1],
  ['proxaṇollekhaṇe', 'prokṣaṇollekhane', 1], ['maxikā', 'makṣikā', 1],
  ['vixipya', 'vikṣipya', 1], ['laxanahīne', 'lakṣaṇahīne', 1],
  ['daxiṇ', 'dakṣiṇ', 8], ['praxip', 'prakṣip', 2], ['laxaṇ', 'lakṣaṇ', 3],
  // --- 'ea' garble family ---
  ['ekaneatre', 'ekanetre', 1], ['anyadeaśe', 'anyadeśe', 1],
  ['deasādhipadaivataṃ', 'deśādhipadaivataṃ', 1], ['pramāṇeana', 'pramāṇena', 1],
  ['mantreaṇa', 'mantreṇa', 3], ['sruveana', 'sruveṇa', 2],
  ['sājyeana', 'sājyena', 1], ['ājyeana', 'ājyena', 1], ['ghṛteana', 'ghṛtena', 1],
  ['yatneaṇa', 'yatnena', 1], ['snapanōktakrameana', 'snapanoktakrameṇa', 1],
  ['aśubhadeasāt', 'aśubhadeśāt', 1], ['deavārthaṃ', 'devārthaṃ', 1],
  ['deavam', 'devam', 2], ['jaleana', 'jalena', 1], ['śuddhoadakeana', 'śuddhodakena', 1],
  // --- ou→au (targeted m-mirror first, then global; tag-safe) ---
  ['pūrvaṃ āśoucaṃ', 'pūrvam āśaucaṃ', 1],
  ['ou', 'au', 21],
  // --- aiah / final-h family ---
  ['śva-kukkutādyaiah', 'śva-kukkuṭādyaiḥ', 2], ['patitaiahca', 'patitaiśca', 1],
  ['aiah', 'aiḥ', 3], ['darbhiah', 'darbhaiḥ', 1],
  // --- ṣ-for-ś ---
  ['viṣeṣe', 'viśeṣe', 3], ['āghāraviṣeṣaṃ', 'āghāraviśeṣaṃ', 1],
  ['puraṣcaraṇaṃ', 'puraścaraṇaṃ', 1], ['ṣeṣahomahīne', 'śeṣahomahīne', 1],
  ['dīṣitasya', 'dīkṣitasya', 1], ['nāṣe ca', 'nāśe ca', 1],
  // --- misc slips (Deva primary, mUlam-confirmed) ---
  ['dravyām ādāya', 'dravyam ādāya', 1],
  ['prāyaścittāgnikuṇde', 'prāyaścittāgnikuṇḍe', 1], ['nityāgnikuṇdẽ', 'nityāgnikuṇḍe', 1],
  ['yunkte', 'yukte', 2], ['darbhāmālāyāṃ', 'darbhamālāyāṃ', 1],
  ['dattva', 'dattvā', 2], ['vā āditya tat', 'vā ādṛtya tat', 1],
  ['pratyekaṃ yajet', 'pṛthak pṛthak yajet', 1],   // Deva पृथक् पृथक् + mUlam
  ['śāyayes', 'śāyayet', 1], ['tathāiva', 'tathaiva', 1],
  ['ṛtvijām alābhe', 'ṛtvijām abhāve', 1],          // Deva अभावे + mUlam
  ['lokādhipadaivataṃ', 'lokādhidaivataṃ', 1],       // Deva लोकाधिदैवतं
  ['āghāraproyogaṃ', 'āghāraprayogaṃ', 1],
  ['tvoūrje', 'tvorje', 1],                          // iṣe tvorje tvā (mUlam)
];

// apply across all verse blocks' sanskrit + iast
const refs = [];
verses.forEach(b => { refs.push([b, 'sanskrit']); refs.push([b, 'iast']); });
let applied = 0;
for (const [from, to, exp] of FIXES) {
  let n = 0;
  for (const [b, f] of refs) n += (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  for (const [b, f] of refs) if (b[f]) b[f] = b[f].split(from).join(to);
  applied += n;
}

// colophon: remove stray markdown fence from iast, fill english
if ((colo.iast.match(/```/g) || []).length !== 1) throw new Error('colophon fence not found');
colo.iast = colo.iast.replace(/<br>\s*```/, '');
if (colo.iast.includes('`')) throw new Error('fence removal failed');
applied += 1;
if (colo.english !== '') throw new Error('colophon english unexpectedly non-empty');
colo.english = '<ul>\n<li><p><em>Thus ends the sixty-fifth chapter, named &quot;The Rules of Expiation for the Consecration&quot; (Pratiṣṭhā-prāyaścitta-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 65 ||</em></p>\n</li>\n</ul>\n';

// residual checks across all verse blocks
let all = '', allLatin = '';
verses.forEach(b => { all += (b.sanskrit || '') + '\n' + (b.iast || '') + '\n'; });
allLatin = all.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (all.match(/x/g) || []).length,
  'residual ou/ea/ō/ē/ẽ/āi': (allLatin.match(/ou|ea|ō|ē|ẽ|āi/g) || []).length,
  'residual aiah/yunkte/daivatyāṃ/kuṇd(?!ḍ)': (all.match(/aiah|yunkte|daivatyāṃ|kuṇd[^ḍ]/g) || []).length,
  'residual final-h': (allLatin.match(/[aāeiīouū]h(?=[\s,;.)&])/g) || []).length,
  'residual deva व्याहती/दैवत्ं/दिकपाल/विंशाति': (all.match(/व्याहती|दैवत्ं|दिकपाल|विंशाति/g) || []).length,
  'residual backtick': (all.match(/`/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
for (const k of Object.keys(chk)) {
  if (k.startsWith('residual') && chk[k]) throw new Error('residual defect: ' + k);
}
// per-block markup balance
verses.forEach((b, i) => {
  for (const f of ['sanskrit', 'iast']) {
    const v = b[f] || '';
    if ((v.match(/<p>/g) || []).length !== (v.match(/<\/p>/g) || []).length) throw new Error(`p unbalanced in ${f} of verse ${i}`);
    if ((v.match(/<strong>/g) || []).length !== (v.match(/<\/strong>/g) || []).length) throw new Error(`strong unbalanced in ${f} of verse ${i}`);
  }
});
console.log('markup balanced in all verse blocks.');

fs.writeFileSync(SC + '/ch65-NEW-all.txt', all);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
