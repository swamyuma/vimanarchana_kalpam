// ch55 (Matsya-kūrma-vidhiḥ — fish & tortoise avatāras: iconometry, consecration fires &
// mantras, daily worship) reconciliation. Small content-fix chapter (10 <p>, NO PB markers).
// b3 Colophon intact — filled empty english. mUlam 055_matsyakUrmavidhiH.md. english UNTOUCHED.
// (मुद्रितपाठे …) apparatus Deva-only ✓.
// DIVERGENCES LEFT (Deva=IAST consistent; English endorses): samāṃśaṃ [mUlam सप्तांशं=7;
// English "equal parts" endorses — 4th English-endorsed sama-for-sapta], dvibhāgaṃ dvibhāgaṃ
// [mUlam द्विभागं त्रिभागं; English "two parts" endorses], abhideśamānaṃ [mUlam निर्देशमानं],
// ṣaṭtriṃśat [mUlam त्रिषट्; apparatus], yad vai sasṛṣṭaḥ [mUlam यत् स्वयं सृष्ट].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/e4773e0a-a857-49b6-8a2f-7dacef2dd33b/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[54];
if (ch.number !== 55) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
let s = b2.sanskrit;

const DEVA_FIXES = [
  ['ङ्गुुल', 'ङ्गुल', 2],  // DOUBLE ु matra (एकाङ्गुुलम्, वस्वङ्गुुल; cf ch30/50); IAST already correct
];
const IAST_FIXES = [
  ['laxanam', 'lakṣaṇam', 2], ['laxaṇaṃ', 'lakṣaṇaṃ', 1], ['paxāyāma', 'pakṣāyāma', 1], // x->kṣ (+n->ṇ)
  ['ālayābhimuxe', 'ālayābhimukhe', 1],                 // x-for-kh; Deva आलयाभिमुखे
  ['grāmādou', 'grāmādau', 1], ['pouṇḍarīkāgniṃ', 'pauṇḍarīkāgniṃ', 1],
  ['pouṇḍarīkāgnistaṣmin', 'pauṇḍarīkāgniḥ tasmin', 1], // ou + ṣm garble + mirror Deva split पौण्डरीकाग्निः तस्मिन्
  ['houtraśaṃsanaṃ', 'hautraśaṃsanaṃ', 2],
  ['pradhānāgnou', 'pradhānāgnau', 1], ['svāhākārou', 'svāhākārau', 1],
  ['dvitram', 'dvimātraṃ', 1],                          // garble; Deva द्विमात्रं
  ['ṣaṭtriṃśadāṅgulaṃ', 'ṣaṭtriṃśadaṅgulaṃ', 1],        // spurious ā; Deva षट्त्रिंशदङ्गुलं
  ['dvyāṃśaṃ tryāṃśaṃ', 'dvyaṃśaṃ tryaṃśaṃ', 1],        // spurious ā (cf ch48); Deva द्व्यंशं त्र्यंशं
  ['pūrvavat yāgāśālāṃ', 'pūrvavad yāgaśālāṃ', 1],      // spurious ā + d-sandhi mirror; Deva पूर्ववद् यागशालां
  ['yāgāśālā-madhyye', 'yāgaśālā-madhye', 1],           // spurious ā + yy
  ['alaṅkrtya', 'alaṅkṛtya', 1],                        // r-for-ṛ
  ['krīḍātmakam', 'krīḍātmakaṃ', 1],                    // Deva क्रीडात्मकं anusvāra
  ['snapanotsavādīni', 'snapana-utsavādīni', 1],        // mirror Deva split स्नपन-उत्सवादीनि
  ['āyāma-samāṃśaṃ', 'āyāma-samaṃ', 1],                 // IAST spurious āṃśa; Deva आयाम-समं (mUlam समं)
  ['ṣadbhāgaṃ', 'ṣaḍbhāgaṃ', 1],                        // dental d; Deva षड्भागं
  ['yuktyāiva', 'yuktyaiva', 1],                        // āi
  ['viṣṇoriva', 'viṣṇoḥ iva', 1],                       // mirror Deva split विष्णोः इव
  ['dhruvaberaṃ aṣṭopacāraiḥ', 'dhruvaberam aṣṭopacāraiḥ', 1], // Deva ध्रुवबेरम्
];
let applied = 0;
for (const [from, to, exp] of [...DEVA_FIXES, ...IAST_FIXES]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the fifty-fifth chapter, named &quot;The Rules for the Fish and Tortoise Incarnations&quot; (Matsya-kūrma-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 55 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou (latin tokens)': (latin.match(/[a-zāīūṛśṣṭḍṇ]ou|ou[a-zāīūṛśṣṭḍṇ]/g) || []).length,
  'residual ुु/ेे/madhyye': (s.match(/ुु|ेे|madhyye/g) || []).length,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual x'] || chk['residual ou (latin tokens)'] || chk['residual ुु/ेे/madhyye']) throw new Error('residual defect');
for (const k of ['em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' unbalanced'); }

b2.sanskrit = s;
b3.english = NEW_B3_ENG;
fs.writeFileSync(SC + '/ch55-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
