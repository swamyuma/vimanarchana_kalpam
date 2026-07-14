// ch53 (Utsava-vidhiḥ — festival rules: yāgaśālā & kumbha-vedi, aṣṭadik deity invocations,
// pratisara, daily homas w/ per-day samidh & flower lists, kumbha worship, bali circuits by
// village layout, śibikā procession, conduct rules) reconciliation. Content-fix chapter:
// NO lump, NO structural defect. b3 Colophon intact (proper IAST) — only its empty english
// filled ("thus ends", ch34/48 style). Cross-checked vs mUlam 053_utsavavidhiH.md. b2 english
// UNTOUCHED. Deva carries (मुद्रितपाठे …) apparatus — Deva-only, correctly absent from IAST.
// DIVERGENCES LEFT (Deva=IAST consistent; English endorses or silent): dvārābhāve [mUlam
// बेराभावे "absence of icons"; English "If the temple doors are not aligned" endorses doors],
// viṣṇukāntaṃ [mUlam विष्णुक्रान्तं], catasṛṣu dikṣu [चतुर्दिक्षु], yakṣebhyo+apparatus [mUlam
// न्यक्षेभ्यो], aṅgaṇaṃ [अङ्कणं], trayaḥ pañcāśattamaḥ spacing (title), mahendrāya [mUlam
// वेन्द्राय, apparatus notes it].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/e4773e0a-a857-49b6-8a2f-7dacef2dd33b/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[52];
if (ch.number !== 53) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
let s = b2.sanskrit;
const pbBefore = s.split('<!--PB-->').length - 1;

const DEVA_FIXES = [
  ['बलिम् आहत्य', 'बलिम् आहृत्य', 1],  // आहत्य->आहृत्य (cf ch18); mUlam बलिमाहृत्य; IAST āhṛtya already correct
];
const IAST_FIXES = [
  // devata -> daivata (Deva दैवतं throughout)
  ['utsavādhidevataṃ', 'utsavādhidaivataṃ', 1],
  ['tithivāranaxatradevataṃ', 'tithivāranakṣatradaivataṃ', 1],
  ['utsavādidevataṃ', 'utsavādhidaivataṃ', 1],  // also dropped dhi; Deva उत्सवाधिदैवतं
  ['tithidevatam', 'tithidaivatam', 1], ['vāradevatam', 'vāradaivatam', 1],
  ['naxatradevatam', 'nakṣatradaivatam', 1],
  // x -> kṣ
  ['daxiṇ', 'dakṣiṇ', 5],                        // incl. pradaxiṇavaśena x2
  ['baliraxakaṃ', 'balirakṣakaṃ', 1], ['axata-yutaṃ', 'akṣata-yutaṃ', 1],
  ['xiṣet', 'kṣipet', 4],                        // x->kṣ AND ṣ->p; Deva क्षिपेत्
  ['rājaveśmābhimuxam', 'rājaveśmābhimukham', 1],// x-for-kh; Deva मुखम्
  ['sūxma', 'sūkṣma', 2], ['vixepakāḥ', 'vikṣepakāḥ', 1],
  // ṣ-for-kh
  ['muṣavāsaṃ', 'mukhavāsaṃ', 3], ['muṣyaṃ', 'mukhyaṃ', 1],
  // ou -> au
  ['devyou', 'devyau', 1], ['souvarṇaṃ', 'sauvarṇaṃ', 1], ['rātrou', 'rātrau', 1],
  ['houtraṃ', 'hautraṃ', 1], ['oudumbaraṃ', 'audumbaraṃ', 1],
  ['pourāṇikī', 'paurāṇikī', 1], ['kouśeyādyaiḥ', 'kauśeyādyaiḥ', 1],
  ['souvarṇaiḥ', 'sauvarṇaiḥ', 1],
  // -ebyo/-ebyaḥ dative-pl dropped bh (the ch13/15/17 defect)
  ['ebyo', 'ebhyo', 10], ['ebyaḥ', 'ebhyaḥ', 2],
  ['yaṣebhyo', 'yakṣebhyo', 2],                  // AFTER ebyo; ṣ-for-kṣ; Deva यक्षेभ्यो
  ['rāṣasebhy', 'rākṣasebhy', 2],                // Deva राक्षसेभ्य
  // ky-for-kṛ garble
  ['triguṇīkyta', 'triguṇīkṛta', 1], ['tantu-kytaiśca', 'tantu-kṛtaiśca', 1],
  ['pradacṣiṇīkytya', 'pradakṣiṇīkṛtya', 1],     // cṣ + ky double garble
  // other IAST slips (Deva primary, mUlam-confirmed)
  ['yāgāśālāṃ', 'yāgaśālāṃ', 1],                 // spurious ā (recurring)
  ['kṛtva,', 'kṛtvā,', 1], ['kṛtva ', 'kṛtvā ', 2], // dropped macron
  ['sarvālabhe', 'sarvālābhe', 1],               // Deva सर्वालाभे
  ['ājyālābe', 'ājyālābhe', 1],                  // dropped h; Deva आज्यालाभे
  ['upajhuvā', 'upajuhvā', 1],                   // metathesis; Deva उपजुह्वा
  ['kumbhadevarādanārthaṃ', 'kumbhadevārādhanārthaṃ', 1], // dropped ā + dropped h; Deva देवाराधन
  ['kumbhadevarādhanaṃ', 'kumbhadevārādhanaṃ', 1],
  ['nandyāvartaṃ', 'nandyāvarttaṃ', 1],          // Deva नन्द्यावर्त्तं (mUlam same geminate)
  ['nahāvika', 'navāhika', 1], ['nāhāvika', 'navāhika', 1], // garbles; Deva नवाहिक
  ['viṣvakṣenaṃ', 'viṣvaksenaṃ', 2],             // Deva विष्वक्सेनं (kṣ->ks, cf ch19/28)
  ['dhānypīṭhe', 'dhānyapīṭhe', 1],              // dropped a
  ['madhyādi-nav-dikṣu', 'madhyādi-nava-dikṣu', 1], // dropped a; Deva नव-दिक्षु
  ['tanmadhye tattaddigīśāya', 'tanmadhye taddigīśāya', 1], // Deva तद्दिगीशाय (the first one keeps tattad)
  ['nānavarṇāmbaraiḥ', 'nānāvarṇāmbaraiḥ', 1],   // dropped ā; Deva नानावर्ण
  ['avāpnuyaat', 'avāpnuyāt', 1],                // aa garble
  ['bhaktiyuktāiḥ', 'bhaktiyuktaiḥ', 2],         // āi
  ['yojeyet', 'yojayet', 1],                     // Deva योजयेत्
  ['havisnivedanaṃ', 'havirnivedanaṃ', 1],       // havis->havir (cf ch52)
];
let applied = 0;
for (const [from, to, exp] of [...DEVA_FIXES, ...IAST_FIXES]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

// b3 colophon english fill (empty -> "thus ends"; addition, ch34/48 precedent)
if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty — will not touch');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the fifty-third chapter, named &quot;The Rules for the Festival&quot; (Utsava-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 53 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'PB (before/after)': pbBefore + '/' + (s.split('<!--PB-->').length - 1),
  'residual x': (s.match(/x/g) || []).length,
  'residual ou (latin tokens)': (latin.match(/[a-zāīūṛśṣṭḍṇ]ou|ou[a-zāīūṛśṣṭḍṇ]/g) || []).length,
  'residual muṣ/ebyo/ky-garble': (s.match(/muṣ|ebyo|īky|ukyt/g) || []).length,
  'residual devata (want daivata)': (s.match(/devata/g) || []).length,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual x'] || chk['residual ou (latin tokens)'] || chk['residual muṣ/ebyo/ky-garble'] || chk['residual devata (want daivata)']) throw new Error('residual defect');
if ((s.split('<!--PB-->').length - 1) !== pbBefore) throw new Error('PB changed');
for (const k of ['em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' unbalanced'); }

b2.sanskrit = s;
b3.english = NEW_B3_ENG;
fs.writeFileSync(SC + '/ch53-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
