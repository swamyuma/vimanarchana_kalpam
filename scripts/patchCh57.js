// ch57 (Nārasiṃha-Vāmana-Trivikrama-vidhiḥ — Nṛsiṃha girija/sthūṇaja/yānaka iconography &
// consecration, Vāmana iconometry, Trivikrama with retinue & consecration) reconciliation.
// Content-fix chapter (25 <p>, 6 PB = 7 spreads, NO lump-markup). b3 Colophon intact (Deva+IAST
// both correct) — filled empty english. mUlam 057_trivikramavidhiH.md. english UNTOUCHED.
// (मुद्रितपाठे …) apparatus Deva-only ✓; THIS chapter's convention OMITS editorial numeric parens
// (द्विमात्रं)/(१२० अङ्गुलं)/etc from the IAST throughout — do NOT restore (unlike ch37/38).
// DEVA FIXES (mUlam-confirmed; IAST already correct): अष्टांशांतारं→अष्टांशतारं [spurious ां;
// mUlam अष्टांशं तारं], कर्णमूलां तं→कर्णमूलान्तं [mis-split of -mūlāntaṃ, cf ch34/50/52; mUlam
// कर्णमूलान्तं; IAST karṇamūlāntaṃ endorses], चतूर्यवं→चतुर्यवं [mUlam; IAST caturyavaṃ].
// NEW DEFECT CLASS this chapter: 'ea'-for-'e' garble ×13 (kundeandu, heamābhaṃ, vibhāgeana,
// utkuṭikāsanean, …) — scan /ea/. Also DOMINANT word-final h-for-ḥ ×17 (tayoh, devyoh, hareh…).
// IAST HEADER ERROR: atha ṣaṭpañcāśattamaḥ (56th!) → saptapañcāśattamaḥ (Deva सप्तपञ्चाशत्तमः).
// sthauṇaja→sthūṇaja ×4 per Deva+mUlam स्थूणज (English "Sthauṇaja" = citation of the typo form,
// fixed anyway per ch47/49 precedent); sthauṇaṃ ×1 stays (Deva स्थौणं = mUlam).
// DIVERGENCES LEFT (Deva=IAST consistent; English endorses/silent): जानुविशालं समाङ्गुलं [mUlam
// सप्ताङ्गुलं — 5th sama-for-sapta, English silent on knee width], करण्डकमकुट [mUlam करण्डिका],
// छत्रमौलिं [mUlam छन्नमौलिं], वीरस्कन्ध [mUlam वीश], हेमकलशम् [mUlam होम], सन्यस्य [=mUlam],
// वस्त्रेणाबद्ध्य [mUlam वस्त्रेणाबध्य], तस्मात् हन्वन्तं [mUlam तत्समं; apparatus],
// पुरोगत-दन्तोत्तारं [mUlam पुरोगतं दृशोस्तारं; apparatus], dṛṣṭi quote placement त्रिलोकेशं.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[56];
if (ch.number !== 57) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
const PB_BEFORE = (b2.sanskrit.match(/<!--PB-->/g) || []).length;
let s = b2.sanskrit;

const FIXES = [
  // --- DEVA fixes (mUlam-confirmed) ---
  ['अष्टांशांतारं', 'अष्टांशतारं', 1],
  ['कर्णमूलां तं', 'कर्णमूलान्तं', 1],
  ['चतूर्यवं', 'चतुर्यवं', 1],
  // --- IAST header: wrong ordinal (56th for 57th) ---
  ['atha ṣaṭpañcāśattamaḥ', 'atha saptapañcāśattamaḥ', 1],
  // --- 'ea' garble family (do jaleaśou/bhrūvou BEFORE the ou→au global) ---
  ['kundeandu', 'kundendu', 1], ['mahīdeavīṃ', 'mahīṃ devīṃ', 1],
  ['utkuṭikāsanean', 'utkuṭikāsanena', 1], ['meakhalopavīta', 'mekhalopavīta', 1],
  ['pradeaśinī', 'pradeśinī', 1], ['vibhāgeana', 'vibhāgena', 1],
  ['vāmeana', 'vāmena', 1], ['prasāritapādeana', 'prasāritapādena', 1],
  ['jaleaśou', 'jaleśau', 1], ['heamābhaṃ', 'hemābhaṃ', 1],
  ['heamakalaśam', 'hemakalaśam', 1], ['bhearītāḍana', 'bherītāḍana', 1],
  ['anyadeavānāṃ', 'anyadevānāṃ', 1],
  // --- ou→au: bhruvau needs ū→u too, then GLOBAL (field has NO English; 15 remaining verified) ---
  ['bhrūvou', 'bhruvau', 1],  // Deva भ्रुवौ short u
  ['ou', 'au', 15],           // ūrau dvau pādau anyahastau prasāritau śrī-bhūmyau pradhānāgnau×2 hautra×2 kaupīna dṛśau cāmaradhāriṇau sanatkumārau pauṇḍarīka
  // --- ṣ-for-kh (मुख/नख) ---
  ['muṣam', 'mukham', 3],     // muṣam; muṣamadhyaṃ, muṣamaṅgulōnam (muṣṭinā legit, untouched)
  ['muṣaṃ', 'mukhaṃ', 2],     // tayoh muṣaṃ + kalāmuṣaṃ
  ['muṣasya', 'mukhasya', 1],
  ['naṣāyāmam', 'nakhāyāmam', 1], ['naṣāyāmaṃ', 'nakhāyāmaṃ', 1],
  // --- non-standard ō glyph (+ov garble) ---
  ['mukhamaṅgulōnam', 'mukhamaṅgulonam', 1], ['yavōnāṃ', 'yavonāṃ', 1],
  ['dviyovōnāt', 'dviyavonāt', 1],
  // --- x→kṣ ---
  ['laxaṇam', 'lakṣaṇam', 6], ['exaṇaṃ', 'ekṣaṇaṃ', 2],
  ['daxiṇ', 'dakṣiṇ', 18], ['vaxasthalasya', 'vakṣasthalasya', 1],
  ['rudrāxāṅgulaṃ', 'rudrākṣāṅgulaṃ', 1],
  // --- ṣ-for-kṣ / dropped-k / ṣ-for-ś / s-for-ś ---
  ['antariṣalok', 'antarikṣalok', 1],   // STEM — text has antariṣalokā- (long ā)
  ['praṣālayantaṃ', 'prakṣālayantaṃ', 1],
  ['saviṃśati-ṣatāṅgulaṃ', 'saviṃśati-śatāṅgulaṃ', 1],
  ['visāl', 'viśāl', 4],      // uttaroṣṭha-, aṣṭāṅgula-, jānu-, nalaka-viśāla
  // --- sthūṇaja per Deva+mUlam (sthauṇaṃ ×1 stays) ---
  ['sthauṇaj', 'sthūṇaj', 4],
  // --- word-final h→ḥ ---
  ['yoh', 'yoḥ', 11],         // tayoh×2 pārśvayoh×3 (dakṣiṇa)vāmayoh devyoh×2 kaniṣṭhayoh ubhayoh trivikramayoh
  ['doh ', 'doḥ ', 1], ['nābheh', 'nābheḥ', 1], ['viṣṇoh', 'viṣṇoḥ', 1],
  ['hareh', 'hareḥ', 1], ['aṣṭopacāraih', 'aṣṭopacāraiḥ', 1], ['mantraih', 'mantraiḥ', 1],
  // --- āi→ai ---
  ['bhujāiryuktaṃ', 'bhujairyuktaṃ', 1], ['yuktyāiva', 'yuktyaiva', 1],
  ['trāivikramasya', 'traivikramasya', 1],
  // --- ky-for-kṛ ---
  ['prāñjalīkytahastāṃ', 'prāñjalīkṛtahastāṃ', 1],
  // --- dental d in ṣaḍ- ---
  ['ṣady', 'ṣaḍy', 3],        // ṣaḍyavam/ṣaḍyavā/ṣaḍyavaṃ
  // --- spurious/dropped vowels & misc slips (Deva primary) ---
  ['dvyāṅgul', 'dvyaṅgul', 3],           // Deva द्व्यङ्गुल
  ['pañcaṅgul', 'pañcāṅgul', 2],         // Deva पञ्चाङ्गुल
  ['dvādaśaṅgulaṃ', 'dvādaśāṅgulaṃ', 1], // Deva द्वादशाङ्गुलं (jaṅghā)
  ['dviyav-dvivistāraṃ', 'dviyava-dvivistāraṃ', 1],
  ['dvibhūjaṃ', 'dvibhujaṃ', 1],         // Deva द्विभुजं
  ['dvisāptāṅgulaṃ', 'dvisaptāṅgulaṃ', 1],
  ['vāmām ākuñcya', 'vāmam ākuñcya', 1], // Deva वामम्
  ['sasyāśyāmābhāṃ', 'sasyaśyāmābhāṃ', 1],
  ['yānakanārasiṃhasya', 'yānakanarasiṃhasya', 1], // Deva+mUlam यानकनरसिंहस्य
  ['nava-aṣṭ-sapt-ṣaṭ', 'nava-aṣṭa-sapta-ṣaṭ', 1],
  ['kalādvyaṃ', 'kalādvayaṃ', 1],
  ['havya vāhanāṅgulam', 'havyavāhanāṅgulam', 1],
  ['agravatāraṃ', 'agratāraṃ', 1],       // spurious va; Deva अग्रतारं
  ['śaṅkh-śārṅga', 'śaṅkha-śārṅga', 1],
  ['pūrvovat', 'pūrvavat', 1],
  ['snapanotsavādīni', 'snapana-utsavādīni', 2], // mirror Deva split (cf ch55/56)
  ['yāgāśālā', 'yāgaśālā', 2],           // recurring spurious ā
  ['mātrā&#39;’yatā', 'mātrā&#39;&#39;yatā', 1], // curly-quote-for-apostrophe (Deva ऽऽ; cf ch51 backtick)
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the fifty-seventh chapter, named &quot;The Rules for Nārasiṃha, Vāmana, and Trivikrama&quot; (Nārasiṃha-Vāmana-Trivikrama-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 57 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou/ea/ō/āi': (latin.match(/ou|ea|ō|āi/g) || []).length,
  'residual muṣ(!ṭ)/kyt/visāl/ṣady/sthauṇaj': (s.match(/muṣ(?!ṭ)|kyt|visāl|ṣady|sthauṇaj/g) || []).length,
  'residual final-h': (latin.match(/[aāeiīouū]h(?=[\s,;.)&])/g) || []).length,
  'residual deva अष्टांशां/मूलां तं/चतूर्': (s.match(/अष्टांशां|मूलां तं|चतूर्/g) || []).length,
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
fs.writeFileSync(SC + '/ch57-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
