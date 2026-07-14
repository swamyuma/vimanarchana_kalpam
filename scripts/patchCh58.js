// ch58 (Rāmatraya-vidhiḥ — the three Rāmas: Jāmadagnya/Paraśurāma, Rāghava/Rāma with Sītā,
// Lakṣmaṇa & Hanumān, Balarāma with Revatī — iconography + consecration) reconciliation.
// Content-fix chapter (26 <p>, 11 PB = 12 spreads, NO lump-markup). b3 Colophon intact (Deva+IAST
// both correct) — filled empty english. mUlam 058_rAmatrayavidhiH.md. english UNTOUCHED.
// (मुद्रितपाठे …) apparatus Deva-only ✓; like ch57, IAST omits editorial numeric parens — do NOT restore.
// DEVA FIXES (mUlam/IAST/English-confirmed): ऊन-नवाधं-तालेन→ऊन-नवार्ध-तालेन [dropped र्, cf ch48
// न्यासाधं/ch56 भागाधं; IAST ūna-navārdha + English "nine and a half" endorse], उत्पल्लधरां→उत्पलधरां
// [non-word ल्ल; IAST utpala + English "utpala" endorse; mudrita नोत्फुल्लपद्म in apparatus],
// शराधाङ्गुलहीनं→शरार्धाङ्गुलहीनं [dropped र् again; IAST śarārdhāṅgula endorses],
// सीतां मयोनिजां→सीताम् अयोनिजां + IAST mirror [mis-split of सीतामयोनिजां — ayonijā "not womb-born",
// Sītā's famous epithet; मयोनिजा is a non-word; mUlam confirms; English quote "mayonijāṃ" is a
// typo-citation, fixed anyway per ch47/49/57 sthauṇaja precedent].
// DIVERGENCES LEFT (Deva=IAST consistent; English endorses/silent): समतालमितं [mUlam सप्तताल —
// English "samatāla...equal proportions" ENDORSES], जङ्घा सम-दशाङ्गुला [mUlam सप्तदश; English "ten"
// ENDORSES], पार्श्वमध्य-बाहु-अन्तरं समाङ्गुलं [mUlam सप्ताङ्गुलं; English silent] — sama-for-sapta
// nos. 6-8; also पाष्ण्य [mUlam पार्ष्ण्य], नीध्रं [नीव्रं], मुखद्वयं [मुखद्वलयं], शङ्खराजं
// [mUlam शब्दराशिं; apparatus notes शङ्खराशिं], ऊरुद्वयं [ऊर्वन्तं], उद्बद्ध [उद्बन्ध], करण्डमकुट
// [करण्टिका], मूर्ध्वकुन्तलं [उद्बन्ध; cf ch34], वर्त्म [वामे], सूत्रान्न नाभिः, अन्यसूत्रनिभं
// [निम्नं], षण्मास [षण्मान], भ्रूअन्तं [भ्रूअतं], ऊन-नवार्ध [mUlam ऊनार्ध].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[57];
if (ch.number !== 58) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
const PB_BEFORE = (b2.sanskrit.match(/<!--PB-->/g) || []).length;
let s = b2.sanskrit;

const FIXES = [
  // --- DEVA fixes ---
  ['ऊन-नवाधं-तालेन', 'ऊन-नवार्ध-तालेन', 1],
  ['उत्पल्लधरां', 'उत्पलधरां', 1],
  ['शराधाङ्गुलहीनं', 'शरार्धाङ्गुलहीनं', 1],
  ['सीतां मयोनिजां', 'सीताम् अयोनिजां', 1],
  ['sītāṃ mayonijāṃ', 'sītām ayonijāṃ', 1],   // IAST mirror of the mis-split fix
  // --- IAST header: spurious ā (Deva अष्टपञ्चाशत्तमः; colophon IAST aṣṭapañcāśattamaḥ) ---
  ['aṣṭāpañcāśattamaḥ', 'aṣṭapañcāśattamaḥ', 1],
  // --- 'ea'-for-'e' garble family (cf ch57) ---
  ['vāmeana', 'vāmena', 2], ['vāmahasteana', 'vāmahastena', 1],
  ['arcayead', 'arcayed', 1], ['reavat', 'revat', 3], ['deavīṃ', 'devīṃ', 1],
  // --- ou→au: saumitreḥ (also final-h) first, then GLOBAL (field has NO English; 9 verified:
  //     pradhānāgnou×3 houtraṃ×3 moulipārśve soumitriṃ×2) ---
  ['soumitreh', 'saumitreḥ', 1],
  ['ou', 'au', 9],
  // --- non-standard ō glyph (+oō garble) ---
  ['vāmakoōparāntaraṃ', 'vāmakorparāntaraṃ', 1],  // Deva वामकोर्परान्तरं
  ['vāmōru', 'vāmoru', 2], ['madhyōrvantaraṃ', 'madhyorvantaraṃ', 1], ['kalōnam', 'kalonam', 1],
  // --- x→kṣ ---
  ['lax', 'lakṣ', 15],        // laxaṇam×6 laxmaṇasya×3 laxmīṃ×2 sītālaxmaṇa laxmīvardhanaṃ laxmaṇam laxmaṇayoh
  ['daxiṇ', 'dakṣiṇ', 13],
  ['śukapaxa', 'śukapakṣa', 1], ['stana-axa', 'stana-akṣa', 1],
  // --- ṣ-for-kh (मुख) / ṣ-for-kṣ ---
  ['muṣataśca', 'mukhataśca', 1], ['muṣaṃ', 'mukhaṃ', 2], ['muṣadvayaṃ', 'mukhadvayaṃ', 1],
  ['samīṣya', 'samīkṣya', 1],
  // --- word-final h→ḥ (śatrughnayohca BEFORE the yoh global) ---
  ['śatrughnayohca', 'śatrughnayośca', 1],   // Deva -योश्च
  ['yoh', 'yoḥ', 3],          // pāṣṇyoh lakṣmaṇayoh vāyoh
  ['mūrdhnah', 'mūrdhnaḥ', 2],
  ['adharahanoh', 'adharāhanoḥ', 1],         // Deva अधराहनोः (also dropped ā)
  ['nābheh', 'nābheḥ', 4], ['nābhih', 'nābhiḥ', 1], ['dhanuh', 'dhanuḥ', 1],
  ['viṣṇoh', 'viṣṇoḥ', 2], ['hanūmatah', 'hanūmataḥ', 1],
  ['urobāhoh', 'uro-bāhoḥ', 1],              // Deva उरो-बाहोः (also mirror hyphen)
  ['raih ', 'raiḥ ', 5],      // ṣoḍaśopacāraih aṣṭopacāraih×2 -mantraih×2
  // --- āi→ai ---
  ['yuktyāiva', 'yuktyaiva', 2],
  // --- spurious/dropped vowels & misc slips (Deva primary) ---
  ['yāgāśālā', 'yāgaśālā', 3],               // recurring spurious ā
  ['snapanotsavādīni', 'snapana-utsavādīni', 2], // mirror Deva split (cf ch55/56/57)
  ['savyastanāśca', 'savyastanaśca', 1],     // Deva सव्यस्तनश्च
  ['nibha-ambaraṃ', 'nibha-ambarāṃ', 1],     // Deva -अम्बरां fem
  ['sārdha-dvyāṅgulaṃ', 'sārdha-dvyaṅgulaṃ', 1], // Deva सार्ध-द्व्यङ्गुलं
  ['viṃśatyāṅgulaṃ', 'viṃśatyaṅgulaṃ', 1],   // Deva विंशत्यङ्गुलं (bāhu)
  ['taccuthairhīnaṃ', 'taccaturthairhīnaṃ', 1], // Deva तच्चतुर्थैर्हीनं
  ['atrānuktaṃ', 'atra anuktaṃ', 1],         // mirror Deva split अत्र अनुक्तं
  ['dvibhūjaṃ', 'dvibhujaṃ', 1],             // Deva द्विभुजं (cf ch57)
  ['śar-cāpadharaṃ', 'śara-cāpadharaṃ', 1],  // Deva शर-चापधरं
  ['pṛthag ', 'pṛthak ', 2],                 // Deva पृथक् ×2
  ['padmakisalkavarṇāṃ', 'padmakiñjalkavarṇāṃ', 1], // Deva पद्मकिञ्जल्कवर्णां
  ['puṣpāmbaradharaṃ', 'puṣpāmbaradharāṃ', 1],  // Deva पुष्पाम्बरधरां fem (Revatī)
  ['padmadharaṃ', 'padmadharāṃ', 1],         // Deva पद्मधरां fem
  ['tanmūrtimantraṃ', 'tanmūrtimantrān', 1], // Deva तन्मूर्तिमन्त्रान्
  ['pūrvovat', 'pūrvoktavat', 1],            // Deva पूर्वोक्तवत्
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the fifty-eighth chapter, named &quot;The Rules for the Three Rāmas&quot; (Rāmatraya-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 58 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou/ea/ō/āi': (latin.match(/ou|ea|ō|āi/g) || []).length,
  'residual muṣ/soumitr': (s.match(/muṣ|soumitr/g) || []).length,
  'residual final-h': (latin.match(/[aāeiīouū]h(?=[\s,;.)&])/g) || []).length,
  'residual deva नवाधं/उत्पल्ल/शराधा/मयोनिज': (s.match(/नवाधं|उत्पल्ल|शराधा|मयोनिज/g) || []).length,
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
fs.writeFileSync(SC + '/ch58-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
