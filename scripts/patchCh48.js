// ch48 (Snapana-vidhiḥ — bathing ritual: occasions, 8 soils/mountains/grains/maṅgalas,
// 12 principal liquids, pavilion & vedi setup, 9 vessel-count grades, aśaktau 9-fold scale)
// reconciliation. Content-fix chapter (NO lump-markup) + TWO STRUCTURAL repairs (ch22-pattern):
//   (1) b2's FINAL <p> was missing its IAST <em> line entirely;
//   (2) that orphaned IAST sat in b3(Colophon).iast, while the colophon's own IAST was missing.
// Fix: append the orphan (sarvou->sarvau fixed) into b2's last <p>; write the proper colophon
// IAST into b3.iast (ch34 style); fill b3.english "thus ends" line (empty -> content, intended).
// Cross-checked vs mUlam 048_uttamottamAdinavavidhiH.md. Separate english field UNTOUCHED.
// DIVERGENCES LEFT (Deva=IAST consistent, English endorses or is silent): samasamopasnānāś
// [mUlam saptasapta; English "equal secondary" endorses sama], 7-pot grade madhyamādhamam
// [mUlam adhamamadhyamam; English "Madhyama-adhama (7 vessels)" endorses the reader], mahitam
// [mUlam sahitam], catvāriṃśadvyādhikasahasra [English "1024"], khajūra [mUlam vañjula; English
// "Khajura"], mandara [mUlam viḍūra], etaddvāricūrṇa, sāṃśāṅgaṃ [mUlam rasāṃśaṃ], mṛddadhīnī,
// samarpayet [mUlam samarcayet], pāṅktīśa [mUlam paṅktīśa].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/e4773e0a-a857-49b6-8a2f-7dacef2dd33b/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[47];
if (ch.number !== 48) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
let s = b2.sanskrit;
const pbBefore = s.split('<!--PB-->').length - 1;

const DEVA_FIXES = [
  ['संक्रमणेष्बब्दान्ते', 'संक्रमणेष्वब्दान्ते', 1],  // ष्ब->ष्व; mUlam सङ्क्रमणेष्वब्दान्ते
  ['शतशृङ्गान एतान्', 'शतशृङ्गान् एतान्', 1],        // missing virama; mUlam शतश्रृङ्गान् एतान्
  ['न्यासाधं', 'न्यासार्थं', 1],                      // र्थ->ध corruption; mUlam द्रव्यन्यासार्थं (+IAST)
  ['द्वादशाङ्गलविस्तृतानि', 'द्वादशाङ्गुलविस्तृतानि', 1], // missing ु (recurring); mUlam (+IAST)
  ['वासूरत्रेण', 'वा सूत्रेण', 1],                    // garble सूरत्र->सूत्र; mUlam वा सूत्रेण (+IAST)
  ['जलगृह्णीयात्', 'जलं गृह्णीयात्', 1],              // dropped ं; mUlam जलं गृह्णीयात् (+IAST)
  ['मध्यममाधमम्', 'मध्यमाधमम्', 2],                   // extra म; grade madhyamādhama (IAST already correct;
                                                      // 7-pot grade left as madhyamādhama per its own English)
  ['षडगुणं', 'षड्गुणं', 1],                           // missing virama; mUlam षड्गुणम् (+IAST)
  ['रूपस्नानकलशान्', 'उपस्नानकलशान्', 1],             // रू->उ corruption; mUlam उपस्नानकलशान् (+IAST)
  ['सोपस्नान् द्वादशप्रधानाँश्', 'सोपस्नानान् द्वादशप्रधानाँश्', 1], // truncated acc.pl; cf सोपस्नानान् same sentence (+IAST)
  ['पिधानै रपिधाय', 'पिधानैरपिधाय', 1],               // mis-split (r of instr.); mUlam पिधानैरपिधाय (+IAST)
];
const IAST_FIXES = [
  // mirrors of Deva fixes
  ['saṅkrameṇeṣvabdānte', 'saṅkramaṇeṣvabdānte', 1],  // also krameṇ->kramaṇ
  ['śataśṛṅgāna etān', 'śataśṛṅgān etān', 1],
  ['nyāsādhaṃ', 'nyāsārthaṃ', 1],
  ['dvādaśāṅgalavistṛtāni', 'dvādaśāṅgulavistṛtāni', 1],
  ['vāsūtreṇa', 'vā sūtreṇa', 1],
  ['jalgṛhṇīyāt', 'jalaṃ gṛhṇīyāt', 1],
  ['ṣadaguṇaṃ', 'ṣaḍguṇaṃ', 1],
  ['rūpasnānakalaśān', 'upasnānakalaśān', 1],
  ['sopasnān dvādaśapradhānāṃś', 'sopasnānān dvādaśapradhānāṃś', 1],
  ['pidhānai rapidhāya', 'pidhānairapidhāya', 1],
  // kṣ dropped-k / x->kṣ (ch47's distinctive defect recurs)
  ['māsarṣeṣu', 'māsarkṣeṣu', 1], ['janmarṣe', 'janmarkṣe', 1],  // Deva मासर्क्षेषु / जन्मर्क्षे
  ['praṣipet', 'prakṣipet', 1], ['praṣālya', 'prakṣālya', 1], ['praṣipya', 'prakṣipya', 1],
  ['proṣya', 'prokṣya', 1],                                       // Deva प्रोक्ष्य
  ['gandhodak-axatodak-phalodak-kuśodak-ratnodak-japyodak-',
   'gandhodaka-akṣatodaka-phalodaka-kuśodaka-ratnodaka-japyodaka-', 1], // x->kṣ + 6 dropped finals (Deva full अ)
  ['jalam axatodakaṃ', 'jalam akṣatodakaṃ', 1],
  ['paścime axatodakaṃ', 'paścime akṣatodakaṃ', 1],
  ['gandhodak-axatodak-kuśodakān', 'gandhodaka-akṣatodaka-kuśodakān', 1],
  // ou -> au (all Sanskrit; field has no English 'ou')
  ['ṣṭou', 'ṣṭau', 4],            // aṣṭou x3 + parito’ṣṭou
  ['sarvouṣadhy', 'sarvauṣadhy', 2],
  ['souvarṇ', 'sauvarṇ', 2],
  ['rātrou', 'rātrau', 1], ['sannidhou', 'sannidhau', 1],
  ['aṣaktou', 'aśaktau', 1],      // ALSO ṣ->ś: Deva अशक्तौ
  // other IAST slips (Deva primary, mUlam-confirmed)
  ['kartumuyogaḥ', 'kartumudyogaḥ', 1],           // dropped d; Deva कर्तुमुद्योगः
  ['prāgdayāṇi', 'prāgdravyāṇi', 1],              // garble; Deva प्राग्द्रव्याणि
  ['dvyāṃśaṃ', 'dvyaṃśaṃ', 1],                    // spurious ā; Deva द्व्यंशं
  ['anatītpanca', 'anatītpañca', 1],              // missing ñ; Deva पञ्च
  ['taṇḍulairyutaṃ', 'taṇḍulairyuktaṃ', 1],       // Deva तण्डुलैर्युक्तं
  ['phalairyathālābhairyutaṃ', 'phalairyathālābhairyuktaṃ', 1], // Deva युक्तं
  ['saṃyuktṃ', 'saṃyuktaṃ', 1],                   // dropped a
  ['ṣadbhiṛmantraiḥ', 'ṣaḍbhirmantraiḥ', 1],      // dental d + misplaced ṛ; Deva षड्भिर्मन्त्रैः
  ['tvac-cūrṇakaṣāyam', 'tvak-cūrṇakaṣāyam', 1],  // Deva त्वक्-
  ['tadviguṇpūrṇa', 'tadviguṇapūrṇa', 1],         // dropped a; Deva तद्विगुणपूर्ण
  ['pañcavimśati', 'pañcaviṃśati', 1],            // m->ṃ; Deva पञ्चविंशति
  ['anyatamen tadbera', 'anyatamena tadbera', 1], // dropped a; Deva अन्यतमेन
  ['ṣadaṅgulotsedhāṃ', 'ṣaḍaṅgulotsedhāṃ', 1],    // Deva षडङ्गुल
  ['golakā’’vagāḍha', 'golakā’vagāḍha', 1],       // Deva single avagraha गोलकाऽवगाढ
  ['jayādīnarcyet', 'jayādīnarcayet', 1],         // dropped a; Deva अर्चयेत्
  ['prāgagrän', 'prāgagrān', 1],                  // ä glyph
  ['miityeke', 'mityeke', 1],                     // double i
  ['āpūry;', 'āpūrya;', 1],                       // truncated gerund; Deva आपूर्य
  ['nyset', 'nyaset', 1],                         // dropped a; Deva न्यसेत्
  ['caturasrān', 'caturaśrān', 1],                // Deva चतुरश्रान् (line-33 samacaturasrāṃ has Deva स्र — stays)
  ['caturasrāmeva', 'caturaśrāmeva', 1],          // Deva चतुरश्रामेव
];
let applied = 0;
for (const [from, to, exp] of [...DEVA_FIXES, ...IAST_FIXES]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

// STRUCTURAL (1): append the missing final-paragraph IAST (relocated from b3's orphan, sarvau fixed)
const FINAL_IAST = 'etaiḥ saha sarvauṣadhyudakaṃ ca, tadupasnānaṃ ca vinyasya; etaiḥ viṃśati kalaśaiḥ snapanam uttamottamamiti vijñāyate.';
const ORPHAN = 'etaiḥ saha sarvouṣadhyudakaṃ ca, tadupasnānaṃ ca vinyasya; etaiḥ viṃśati kalaśaiḥ snapanam uttamottamamiti vijñāyate.';
if (!b3.iast.includes(ORPHAN)) throw new Error('b3.iast does not hold the expected orphan line');
const TAIL = 'विज्ञायते ॥</p>';
if (s.split(TAIL).length - 1 !== 1) throw new Error('final-para anchor not unique');
s = s.replace(TAIL, 'विज्ञायते ॥<br>\n<em>' + FINAL_IAST + '</em></p>');
applied++;

// STRUCTURAL (2): proper colophon IAST into b3.iast (ch34 style); guard above proves orphan present
const NEW_B3_IAST = '<blockquote>\n<p><strong>iti śrīvaikhānase marīciprokte vimānārcanākalpe snapanadravyasya uttamottamādinavavidhirnāma aṣṭacatvāriṃśaḥ paṭalaḥ || 48 ||</strong></p>\n</blockquote>\n';
// b3.english fill (was empty — addition, not alteration; ch34 precedent)
if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty — will not touch');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the forty-eighth chapter, named &quot;The Ninefold Gradation — Uttamottama and the Rest — of the Bathing Substances&quot; (Snapana-dravyasya Uttamottamādi-nava-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 48 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'PB (before/after)': pbBefore + '/' + (s.split('<!--PB-->').length - 1),
  'residual x': (s.match(/x/g) || []).length,
  'residual ou (latin tokens)': (latin.match(/[a-zāīūṛśṣṭḍṇ]ou|ou[a-zāīūṛśṣṭḍṇ]/g) || []).length,
  'residual praṣ/proṣ/aṣakt/ä': (s.match(/praṣ|proṣ|aṣakt|ä/g) || []).length,
  'residual trunc-gerund': (latin.match(/[a-zāīūṛ]{2,}[bcdfghjklmnprstv]y(?=[,;.\s])/g) || []).join(',') || 0,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual x'] || chk['residual ou (latin tokens)'] || chk['residual praṣ/proṣ/aṣakt/ä']) throw new Error('residual defect');
if ((s.split('<!--PB-->').length - 1) !== pbBefore) throw new Error('PB changed');
for (const k of ['em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' unbalanced'); }

b2.sanskrit = s;
b3.iast = NEW_B3_IAST;
b3.english = NEW_B3_ENG;
fs.writeFileSync(SC + '/ch48-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
