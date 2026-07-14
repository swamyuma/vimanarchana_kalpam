// ch60 (Mānuṣa-vāsudevādi-vidhiḥ — Mānuṣa-Vāsudeva group of 8 standing deities, seated
// Daivika-Vāsudeva with consorts, their 7-fire consecration, ālekhya painted-image rules +
// consecration, prakaraṇa conclusion) reconciliation. Content-fix chapter (10 <p>, 4 PB =
// 5 spreads, NO lump-markup). b3 Colophon intact (Deva+IAST correct) — filled empty english.
// mUlam 060_mAnuShavAsudevAdividhaH.md. english UNTOUCHED.
// DEVA+IAST fixes (both scripts, mUlam-confirmed, English silent):
//  आधारान्ते→आघारान्ते + ādhārānte→āghārānte [the āghāra opening ghee-oblation before
//  vāstuhoma; mUlam आघारान्ते; ch18 precedent (आधारं हुत्वा→आघारं); NOT ch25's case — there
//  English endorsed ādhāra, here English is silent];
//  उत्पूतराधावैः→उत्पूतैराधावैः + utpūtarādhāvaih→utpūtairādhāvaiḥ [non-word; = utpūtaiḥ
//  ādhāvaiḥ "with purified washings", mUlam उत्पूतैराधावैः; editor's (तीर्थोदकैः) gloss stays].
// KEY IAST fixes: vaidicavāsudevasya→vaidika [c-for-k garble; Deva वैदिक = mUlam — the
// दैविक-section/वैदिक-mantra inconsistency is source-level, left], samāliṣya→samālikhya
// [ṣ-for-kh; Deva समालिख्य], devābhimuxe/abhimuxe→mukhe [x-for-kh ×3], xurikādhara→kṣurikā
// [x at word-start], snapanāntam/utsavāntam→ṃ [Deva ं mirrors].
// DIVERGENCES LEFT (Deva=IAST consistent; mUlam differs; English silent/endorses):
//  समाङ्गुलात् [mUlam सप्ताङ्गुलात् — sama-for-sapta #9; English "from one finger-unit" murky],
//  समकलशैः [mUlam सप्तकलशैः — #10; English "the main water-pots" silent; cf ch25 samābhiḥ],
//  बलशासकम् [apparatus बलशासनं; English quote cites the mudrita "balaśāsanam" — primary rule],
//  विरिञ्चिं [विरिञ्चं], श्री-भूमिभ्यां [भूमीभ्यां], नयनानन्दं [नन्दनं], सन्यस्य [cf ch57],
//  पूर्वाह्णे [पूर्वाह्ने], नित्यार्चनम् [नित्यार्चनाम्], English "to the left of Āvasathya"
//  vs Sanskrit उत्तरे [English's own gloss, untouchable].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[59];
if (ch.number !== 60) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
const PB_BEFORE = (b2.sanskrit.match(/<!--PB-->/g) || []).length;
let s = b2.sanskrit;

const FIXES = [
  // --- both-script fixes (mUlam-confirmed) ---
  ['आधारान्ते', 'आघारान्ते', 1], ['ādhārānte', 'āghārānte', 1],
  ['उत्पूतराधावैः', 'उत्पूतैराधावैः', 1], ['utpūtarādhāvaih', 'utpūtairādhāvaiḥ', 1],
  // --- x→kṣ / x-for-kh ---
  ['laxaṇam', 'lakṣaṇam', 2], ['daxiṇ', 'dakṣiṇ', 11],
  ['xurikādhara', 'kṣurikādhara', 1], ['naxatre', 'nakṣatre', 1],
  ['devābhimuxe', 'devābhimukhe', 2], ['abhimuxe', 'abhimukhe', 1], // AFTER devābhimuxe
  ['aximocanaṃ', 'akṣimocanaṃ', 1], ['susaṃraxya', 'susaṃrakṣya', 1],
  ['samabhyuxya', 'samabhyukṣya', 1], ['abhyuxya', 'abhyukṣya', 1], // AFTER samabhyuxya
  ['bījāxaraṃ', 'bījākṣaraṃ', 1],
  // --- ṣ-for-kh ---
  ['samāliṣya', 'samālikhya', 1],
  // --- 'ea' garble ---
  ['kumbhodeakena', 'kumbhodakena', 1], ['deaśe', 'deśe', 1],
  // --- non-standard ō glyph ---
  ['aupāsanāgnikuṇḍayōśca', 'aupāsanāgnikuṇḍayośca', 1], ['garuḍayōśca', 'garuḍayośca', 1],
  ['sāṅgōpāṅgaṃ', 'sāṅgopāṅgaṃ', 1], ['dhānyōpari', 'dhānyopari', 1], ['vyapōhya', 'vyapohya', 1],
  // --- ou→au GLOBAL (7 verified: pouṇḍarīk, houtraṃ ×2, sabhyāgnou, aṅgahomou, tad-rātrou,
  //     bhittou; field has NO English; tag-safe) ---
  ['ou', 'au', 7],
  // --- āi→ai ---
  ['sahāiva', 'sahaiva', 1],
  // --- word-final h→ḥ ---
  ['yoh', 'yoḥ', 6],   // dakṣiṇavāmayoh vāsudevayoh×2 dakṣiṇottarayoh devyoh munyoh
  ['daśakṛtvah', 'daśakṛtvaḥ', 1], ['pūrvedyuh', 'pūrvedyuḥ', 1],
  ['aih ', 'aiḥ ', 4], // pavamānādyaih samakalaśaih mūrtimantraih mantraih
  // --- misc slips (Deva primary) ---
  ['vaidicavāsudevasya', 'vaidikavāsudevasya', 1],
  ['dvyāṅgulamāneṣu', 'dvyaṅgulamāneṣu', 1],   // Deva द्व्यङ्गुलमानेषु
  ['samantrakam kṛtvā', 'samantrakaṃ kṛtvā', 1], // Deva समन्त्रकं
  ['snapanāntam,', 'snapanāntaṃ,', 1],          // Deva स्नपनान्तं
  ['utsavāntam prakaraṇaṃ', 'utsavāntaṃ prakaraṇaṃ', 1], // Deva उत्सवान्तं
  ['yāgāśālā', 'yāgaśālā', 1],                  // recurring spurious ā
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the sixtieth chapter, named &quot;The Rules for Mānuṣa-Vāsudeva, Daivika-Vāsudeva, and the Rest&quot; (Mānuṣa-vāsudevādi-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 60 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou/ea/ō/āi': (latin.match(/ou|ea|ō|āi/g) || []).length,
  'residual final-h': (latin.match(/[aāeiīouū]h(?=[\s,;.)&])/g) || []).length,
  'residual deva आधारान्ते/उत्पूतरा': (s.match(/आधारान्ते|उत्पूतरा/g) || []).length,
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
fs.writeFileSync(SC + '/ch60-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
