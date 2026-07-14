// ch56 (Varāha-vidhi-pratiṣṭhā — the three Varāhas [ādi/pralaya/yajña]: iconometry of the
// boar face, iconography of each with consorts, consecration mantras & homas) reconciliation.
// Content-fix chapter (12 <p>, 6 PB = 7 spreads, NO lump-markup). b3 Colophon intact (Deva+IAST) —
// filled empty english. mUlam 056_varAhavidhipratiShThA.md. english UNTOUCHED.
// (मुद्रितपाठे …) apparatus Deva-only ✓; editorial numeric parens (द्विमात्रं) kept in both scripts ✓.
// DEVA FIXES (mUlam-confirmed; IAST already correct): त्र्योदश→त्रयोदश ×2 [13, mUlam त्रयोदश],
// शरङ्गुलं→शराङ्गुलं [śara+aṅgula sandhi; IAST śarāṅgulaṃ + mUlam शराङ्गुलं], भागाधं→भागार्धं
// [+IAST bhāgādhhaṃ→bhāgārdhaṃ; mUlam भागार्धमात्रं; cf ch48 न्यासाधं], स्तमान्तां→स्तनान्तां
// [breast; mUlam + English "reach the Lord's breast" endorse].
// DIVERGENCES LEFT (Deva=IAST consistent; English endorses/silent): नेत्रात् श्रोत्रं समाङ्गुलं &
// नासामूलविस्तारं समाङ्गुलं [mUlam सप्ताङ्गुलं ×2 — sama-for-sapta, English silent per-item],
// तदायामं समदशाङ्गुलम् [mUlam सप्तदश; cf ch15/35 samadaśa precedent], उष्णीषं रुद्रमात्रं [mUlam
// श्रोणान्तं; apparatus उष्णातं], कण्ठं कलायुतं word order [mUlam कलायुतं कण्ठं], उत्क्रमणाया
// आकुञ्चित [mUlam उत्क्रमणाय कुञ्चित], प्रसारितपदां [mUlam पादां], तदूर्वोः primary w/ (तदूरौ)
// paren [mUlam तदूरौ], क्षमो धरः [mUlam क्ष्मामेक; English "Kṣamo dharaḥ" endorses],
// जगत्त्रायकम् [apparatus जगत्रायकम्], तद्रूपं (वराहरूपं) कौतुकं [English interprets differently
// but untouchable].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/2bacb96b-19e3-4a48-b55e-a2afb25d64a6/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[55];
if (ch.number !== 56) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
const PB_BEFORE = (b2.sanskrit.match(/<!--PB-->/g) || []).length;
let s = b2.sanskrit;

const DEVA_FIXES = [
  ['त्र्योदश', 'त्रयोदश', 2],       // 13; mUlam त्रयोदश; IAST already trayodaśa
  ['शरङ्गुलं', 'शराङ्गुलं', 1],     // śara+aṅgula; IAST śarāṅgulaṃ + mUlam confirm (apparatus शरुङ्गुलं untouched)
  ['भागाधं', 'भागार्धं', 1],        // mUlam भागार्धमात्रं; cf ch48 dropped-र्
  ['स्तमान्तां', 'स्तनान्तां', 1],   // breast; mUlam + English endorse; IAST stanāntāṃ already correct
];
const IAST_FIXES = [
  ['bhāgādhhaṃ', 'bhāgārdhaṃ', 1],  // pairs with Deva भागाधं→भागार्धं
  ['trivido', 'trividho', 1],       // Deva त्रिविधो
  ['muṣaṃ', 'mukhaṃ', 1], ['muṣena', 'mukhena', 1], ['muṣam', 'mukham', 1], // ṣ-for-kh (मुख; cf ch49-53)
  ['drgantaṃ', 'dṛgantaṃ', 1],      // Deva दृगन्तं
  ['hrdayā', 'hṛdayā', 2],          // hrdayāntaṃ + hrdayāt; Deva हृदय
  ['trayodaśa-dvyaṃ', 'trayodaśa-dvayaṃ', 1],       // Deva द्वयं
  ['ṣaḍviṃśatyāṅgul', 'ṣaḍviṃśatyaṅgul', 2],        // spurious ā; Deva षड्विंशत्यङ्गुल
  ['caturāṅgul', 'caturaṅgul', 2],                  // spurious ā; Deva चतुरङ्गुल
  ['tryāṅgulaṃ', 'tryaṅgulaṃ', 2],                  // spurious ā; Deva त्र्यङ्गुलं
  ['dvyāṅgulaṃ', 'dvyaṅgulaṃ', 1],                  // spurious ā; Deva द्व्यङ्गुलं
  ['samāṅgula,', 'samāṅgulaṃ,', 1],                 // dropped ṃ; Deva समाङ्गुलं
  ['tanmedhye', 'tanmadhye', 1],                    // Deva तन्मध्ये
  ['tathāiva', 'tathaiva', 1],                      // āi (recurring)
  ['laxanam', 'lakṣaṇam', 3],                       // x→kṣ + n→ṇ; Deva लक्षणम् (section labels ×3)
  ['daxiṇ', 'dakṣiṇ', 13],                          // x→kṣ (all 13 Sanskrit; no English in field)
  ['vaxye', 'vakṣye', 2],                           // x→kṣ; Deva वक्ष्ये
  ['sasyāśyāma', 'sasyaśyāma', 2],                  // spurious ā; Deva सस्यश्याम
  ['pādou', 'pādau', 1],                            // ou→au; Deva पादौ
  ['prāñjalīkytahastāṃ', 'prāñjalīkṛtahastāṃ', 1],  // ky-for-kṛ (cf ch53/54)
  ['śyāmbhāṃ', 'śyāmābhāṃ', 1],                     // dropped ā; Deva श्यामाभां
  ['samīṣya', 'samīkṣya', 3],                       // ṣ-for-kṣ; Deva समीक्ष्य
  ['śaṅkhacakradharavam', 'śaṅkhacakradharam', 1],  // spurious va; Deva शङ्खचक्रधरम्
  ['prasārya āsīnaṃ', 'prasārya āsīnāṃ', 3],        // fem acc; Deva आसीनां ×3 (samāsīnaṃ masc untouched)
  ['devīṃ mahīṃ sasyaśyāmanibhāṃ', 'mahīṃ devīṃ sasyaśyāmanibhāṃ', 1], // mirror Deva word order महीं देवीं (AFTER sasyā fix)
  ['yāgāśālāṃ', 'yāgaśālāṃ', 1],                    // recurring spurious ā
  ['tad-bhitti-sam-vistārāṃ', 'tad-bhitti-sama-vistārāṃ', 1], // dropped a; Deva सम-विस्तारां
  ['pādahīn-vistārāṃ', 'pādahīna-vistārāṃ', 1],     // dropped a; Deva पादहीन-
  ['pradhānāgnou', 'pradhānāgnau', 2],              // ou→au
  ['houtraśaṃsanaṃ', 'hautraśaṃsanaṃ', 1],          // ou→au
  ['mahīdaraṃ', 'mahīdharaṃ', 1],                   // dropped h; Deva महीधरं; English quote endorses
  ['yajñāiḥ', 'yajñaiḥ', 1],                        // āi; Deva यज्ञैः; English quote endorses
  ['snapanotsavādīni', 'snapana-utsavādīni', 1],    // mirror Deva split स्नपन-उत्सवादीनि (cf ch55)
];
let applied = 0;
for (const [from, to, exp] of [...DEVA_FIXES, ...IAST_FIXES]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the fifty-sixth chapter, named &quot;The Consecration of the Varāha Incarnations&quot; (Varāha-vidhi-pratiṣṭhā), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 56 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou (latin tokens)': (latin.match(/[a-zāīūṛśṣṭḍṇ]ou|ou[a-zāīūṛśṣṭḍṇ]/g) || []).length,
  'residual muṣ/kyt/āi/hrday/samīṣ': (s.match(/muṣ|kyt|āi|hrday|samīṣ/g) || []).length,
  'residual त्र्योदश/भागाध/स्तमान्': (s.match(/त्र्योदश|भागाध|स्तमान्/g) || []).length,
  'PB': (s.match(/<!--PB-->/g) || []).length + '/' + PB_BEFORE,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual x'] || chk['residual ou (latin tokens)'] || chk['residual muṣ/kyt/āi/hrday/samīṣ'] || chk['residual त्र्योदश/भागाध/स्तमान्']) throw new Error('residual defect');
for (const k of ['PB', 'em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' mismatch'); }

b2.sanskrit = s;
b3.english = NEW_B3_ENG;
fs.writeFileSync(SC + '/ch56-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
