// ch54 (Ekakālotsavādi-vidhiḥ — one-day festival & concluding bath: aśakta options, avatāra
// utsava, mṛgayotsava, utsava/tithi/vāra/nakṣatra daivata tables, haridrā-cūrṇa rite, tīrtha
// bath w/ 5+5 kalaśas, return procession, dhvajāvarohaṇa & night bali circuit, puṣpayāga,
// ekāhotsava) reconciliation. BIGGEST content-fix chapter (27 <p>, 19 PB). NO lump, NO
// structural defect. b3 Colophon intact — only its empty english filled. Cross-checked vs
// mUlam 054_ekakAlotsavAdividhiH.md. b2 english UNTOUCHED. (मुद्रितपाठे …) apparatus Deva-only ✓.
// DIVERGENCES LEFT (Deva=IAST consistent; English endorses/silent): samaviṃśati-bhedaiḥ [mUlam
// सप्तविंशति=27; English "twenty specific varieties" endorses — cf ch25/52], yuktamantraṃ Deva
// [mUlam युक्तमन्नं "food"; English non-committal — IAST garble yuktamanthaṃ fixed to Deva's
// mantraṃ], āśārkādīnāṃ [apparatus धनेशाशाखादीनां], dhanuḥsahasrābhyām [apparatus], marddala.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/e4773e0a-a857-49b6-8a2f-7dacef2dd33b/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[53];
if (ch.number !== 54) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
let s = b2.sanskrit;
const pbBefore = s.split('<!--PB-->').length - 1;

const DEVA_FIXES = [
  ['शिनीवालीम्', 'सिनीवालीम्', 1],       // dental s (cf ch12 sinīvālī); mUlam; IAST sinīvālīm already correct
  ['अप्स्वरः', 'अप्सरः', 1],             // garble; mUlam आदित्याऽप्सरः; IAST apsaraḥ correct
  ['नृत्त्व-गीत', 'नृत्त-गीत', 1],        // spurious व; mUlam नृत्तगीत; IAST nṛtta correct
  ['प्रधानाचार्यपूर्व प', 'प्रधानाचार्यपूर्वं प', 1], // dropped ं; mUlam पूर्वं; IAST pūrvaṃ correct
  ['तद्द्वास्त्वङ्गानां', 'तद्वास्त्वङ्गानां', 1],   // extra द्; mUlam तद्वास्त्वङ्गानां (vāstu-aṅga deities) (+IAST)
  ['ब्रह्मेेशानौ', 'ब्रह्मेशानौ', 1],     // DOUBLE े matra glyph defect (cf ch30 double-ु)
];
const IAST_FIXES = [
  ['taddvāstvāṅgānāṃ', 'tadvāstvaṅgānāṃ', 1],
  // x -> kṣ family
  ['axādinā', 'akṣādinā', 1], ['naxatradevataṃ', 'nakṣatradaivataṃ', 1],
  ['naxatre', 'nakṣatre', 1],
  ['abhimuxe', 'abhimukhe', 2], ['ābhimuxe', 'ābhimukhe', 5], // short-a x2 (abhimuxe garuḍaṃ / dhānyapīṭhe); long-ā x5 (devā- x4, ālayā- x1)
  ['tadabhimuxaṃ', 'tadabhimukhaṃ', 1],
  ['daxiṇ', 'dakṣiṇ', 7], ['laxmīm', 'lakṣmīm', 1],
  ['praxiṣya', 'prakṣipya', 1], ['praxiṣet', 'prakṣipet', 1],  // x + ṣ-for-p
  ['axatodaka', 'akṣatodaka', 2], ['taxaka', 'takṣaka', 1],
  ['abhyuxya', 'abhyukṣya', 2], ['lājā’xata', 'lājā’kṣata', 1],
  ['aṣṭāxar', 'aṣṭākṣar', 3], ['dvādaśāxaraṃ', 'dvādaśākṣaraṃ', 1],
  ['nixiṣtāni', 'nikṣiptāni', 1],                         // x + ṣt-for-pt
  ['janmaxtre', 'janmarkṣe', 1], ['janmaxte', 'janmarkṣe', 1], // garbled janmarkṣe
  ['durbhixa', 'durbhikṣa', 1], ['śixādibhiśca', 'śikṣādibhiśca', 1],
  ['caityavṛxamūle', 'caityavṛkṣamūle', 1], ['vixipya', 'vikṣipya', 1],
  ['abhilaxyaṃ', 'abhilakṣyaṃ', 1],
  // ou -> au (24)
  ['aśaktou', 'aśaktau', 1], ['tadrātrou', 'tadrātrau', 3], ['soumya', 'saumya', 3],
  ['prathamatithou', 'prathamatithau', 1], ['kouberaṃ', 'kauberaṃ', 1],
  ['koumāraṃ', 'kaumāraṃ', 1], ['dourgaṃ', 'daurgaṃ', 1], ['musalou', 'musalau', 1],
  ['brahmeśānou', 'brahmeśānau', 1], ['dvou', 'dvau', 1], ['sannidhou', 'sannidhau', 4],
  ['koutuke', 'kautuke', 1], ['pratiṣṭhātsovou', 'pratiṣṭhotsavau', 1],
  ['dhānyarāśou', 'dhānyarāśau', 1], ['oupāsanāgnikuṇḍaṃ', 'aupāsanāgnikuṇḍaṃ', 1],
  ['houtraṃ', 'hautraṃ', 1], ['svāhākārou', 'svāhākārau', 1],
  // ṣ-for-kh (muṣṭiṃ is legit — targeted only)
  ['muṣavāsaṃ', 'mukhavāsaṃ', 3],
  // havis -> haviḥ/havir (Deva हविः/हविर्)
  ['havisnivedanaṃ', 'havirnivedanaṃ', 1], ['havisnivedya', 'havirnivedya', 1],
  ['mahāhavis', 'mahāhaviḥ', 3],
  ['havis nivedy,', 'haviḥ nivedya,', 1],  // BEFORE the next two (substring) + truncated gerund
  ['havis nivedya', 'haviḥ nivedya', 1], ['havis nivedayet', 'haviḥ nivedayet', 1],
  // devata -> daivata / ādi -> ādhi (Deva आधि/दैवत)
  ['utsavādidevata-kathanam', 'utsavādhidevata-kathanam', 1], // header: Deva उत्सवाधिदेवत-कथनम्
  ['utsavādidevataṃ', 'utsavādhidaivataṃ', 2],
  ['sarvadevatam', 'sarvadaivataṃ', 1],
  ['śrīdaivataṃ', 'śrīdaivatyaṃ', 2],      // Deva श्रीदैवत्यं
  ['mātṛdaivataṃ', 'mātṛdaivatyaṃ', 1],    // Deva मातृदैवत्यं
  ['adhidevataṃ viṣṇum', 'adhidaivataṃ viṣṇum', 1],
  ['puṣpādidevam', 'puṣpādhidevam', 1], ['puṣpādidevataṃ', 'puṣpādhidaivataṃ', 1],
  ['kumbhadevarādhanaṃ', 'kumbhadevārādhanaṃ', 1],
  // ky-for-kṛ + cṣ garble (recurring)
  ['kyttikābhyaḥ', 'kṛttikābhyaḥ', 1], ['kyte', 'kṛte', 1], ['cūrṇīkytya', 'cūrṇīkṛtya', 1],
  ['pradacṣiṇīkytya', 'pradakṣiṇīkṛtya', 1], ['pradacṣiṇīkārayitvā', 'pradakṣiṇīkārayitvā', 1],
  ['pradacṣiṇaṃ', 'pradakṣiṇaṃ', 2],
  // other IAST slips (Deva primary)
  ['taṇḍul-tāmbūl-ādīn', 'taṇḍula-tāmbūla-ādīn', 1], // dropped a's; Deva तण्डुल-ताम्बूल-आदीन्
  ['pūrvedine', 'pūrvadine', 1],           // Deva पूर्वदिने
  ['gomeyena', 'gomayena', 1], ['tayyoḥ', 'tayoḥ', 1],
  ['vārīṣcatasraḥ', 'vārīścatasraḥ', 1],   // recurring
  ['sarvajanaḥ', 'sarvajanāḥ', 1], ['vimrjya', 'vimṛjya', 1], ['visrjya', 'visṛjya', 2],
  ['madhyadi-krameṇa', 'madhyādi-krameṇa', 1], ['samāropeyet', 'samāropayet', 2],
  ['balidravyāiḥ', 'balidravyaiḥ', 1],
  ['yuktamanthaṃ', 'yuktamantraṃ', 1],     // IAST garble; Deva युक्तमन्त्रं primary [mUlam मन्नं noted]
  ['ālayagatedbyo', 'ālayagatebhyo', 1],   // dby garble
  ['alayaṃ praviśya', 'ālayaṃ praviśya', 1],
  ['ath puṣpayāga', 'atha puṣpayāga', 1], ['ayene', 'ayane', 1],
  ['candroporāge', 'candroparāge', 1], ['anāvrṣṭi', 'anāvṛṣṭi', 1],
  ['tadanantere', 'tadanantare', 1], ['uttarīyādyāiḥ', 'uttarīyādyaiḥ', 1],
  ['āvahanāntaṃ', 'āvāhanāntaṃ', 1], ['puruṣusūktaṃ', 'puruṣasūktaṃ', 1],
  ['pañcabhumidevānām', 'pañcabhūmidevānām', 1], ['purāṇavacanaaiḥ', 'purāṇavacanaiḥ', 1],
  ['va japantaḥ', 'vā japantaḥ', 1], ['stanadghnaṃ', 'stanadaghnaṃ', 1],
  ['dattva;', 'dattvā;', 1], ['dattva,', 'dattvā,', 1],
  ['kṛtva;', 'kṛtvā;', 1], ['kṛtva nava', 'kṛtvā nava', 1],
  ['annyāṃśca', 'anyāṃśca', 1],
  ['anyadevotsove', 'anyadevotsave', 1], ['utsove', 'utsave', 1], // otsove & utsove garbles; Deva उत्सवे
  ['devāiḥ', 'devaiḥ', 1],
  ['viśeṣato abhyarcya', 'viśeṣataḥ abhyarcya', 1], // Deva विशेषतः
  ['nirvapya', 'nirvāpya', 1], ['snāpy;', 'snāpya;', 1],
  ['cakraṃ abhiṣicya', 'cakram abhiṣicya', 1],      // Deva चक्रम्
  ['abhyarcyead', 'abhyarcayed', 1],
  ['tacciṣṭ', 'tacchiṣṭ', 3],                       // Deva तच्छिष्ट
  ['nadīsangaame', 'nadīsaṅgame', 1], ['dhānyaveddyāṃ', 'dhānyavedyāṃ', 1],
  ['vādyasaṃyuktaṃ', 'vādyasamāyuktaṃ', 2],         // Deva समायुक्तं
  ['vādyaghoṣasaṃyuktaṃ', 'vādyaghoṣasamāyuktaṃ', 1],
  ['stotradhvanisaṃyuktam', 'stotradhvanisamāyuktam', 1],
  ['ālayam praviśet', 'ālayaṃ praviśet', 1],
  ['kuśodak-japyodak-', 'kuśodaka-japyodaka-', 1],  // dropped finals; Deva full अ
];
let applied = 0;
for (const [from, to, exp] of [...DEVA_FIXES, ...IAST_FIXES]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the fifty-fourth chapter, named &quot;The Rules for the One-Day Festival and the Rest&quot; (Ekakālotsavādi-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 54 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'PB (before/after)': pbBefore + '/' + (s.split('<!--PB-->').length - 1),
  'residual x': (s.match(/x/g) || []).length,
  'residual ou (latin tokens)': (latin.match(/[a-zāīūṛśṣṭḍṇ]ou|ou[a-zāīūṛśṣṭḍṇ]/g) || []).length,
  'residual muṣ(non-ṭ)/havis/kyt/utsove': (s.match(/muṣ(?!ṭ)|havis|kyt|utsove|devata(?!-k)/g) || []).join(',') || 0,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual x'] || chk['residual ou (latin tokens)'] || chk['residual muṣ(non-ṭ)/havis/kyt/utsove'] !== 0) throw new Error('residual defect');
if ((s.split('<!--PB-->').length - 1) !== pbBefore) throw new Error('PB changed');
for (const k of ['em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' unbalanced'); }

b2.sanskrit = s;
b3.english = NEW_B3_ENG;
fs.writeFileSync(SC + '/ch54-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
