// ch51 (Brahmotsava / Dhvajārohaṇa-vidhiḥ — festival types, flag-staff/flag/Garuḍa iconography,
// pulley rigging, foundation pit, flag consecration & hoisting, bali procession, proclamation)
// reconciliation. Content-fix chapter: NO lump-markup, NO structural defect. Cross-checked vs
// mUlam 051_dhvajArohaNavidhiH.md. Separate english UNTOUCHED. NO colophon block (precedent).
// DOMINANT defect: ṣ-for-kh ×11 (all मुख words: abhimuṣe/prāṅmuṣa/udaṅmuṣo/sumuṣākhya/naṣa=nakha
// — the ch49/50 defect at scale) + x->kṣ ×22 + ou->au ×14.
// DIVERGENCES LEFT (Deva=IAST consistent; English endorses or is silent): samaṣaṭ-pañca-catustāla
// [mUlam सप्तषट्; English "six, five, or four spans" omits it], dvitrikālaṃ [mUlam हविस्त्रिकालं;
// English "two or three times, or once a day" endorses], daṇḍāyajñokta [mUlam दण्डाग्रे यज्ञोक्त;
// multi-token, English vague], ṛṣibandhūḥ [mUlam ऋषिपत्न्यः], bhūtīśaṃ [भूतेशं, cf ch24],
// vyāpohya [व्यपोह्य], yānādavaropya [यानादावरोप्य], śyāmāvarṇaṃ [श्यामवर्णं], yuktiṃ [युक्तितः],
// sarvālaṅkāra [सर्वाभरण], garbhagṛhasya [गर्भगेहस्य], 7-hasta list w/o ṣaṣ [mUlam adds षड्ढस्त].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/e4773e0a-a857-49b6-8a2f-7dacef2dd33b/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[50];
if (ch.number !== 51) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2];
if (b2.type !== 'verse') throw new Error('b2 not verse');
let s = b2.sanskrit;
const pbBefore = s.split('<!--PB-->').length - 1;

const DEVA_FIXES = [
  ['तद्यद्यग्रे', 'तद्यष्ट्यग्रे', 1],       // non-word; mUlam तद्यष्ट्यग्रे "at the rod's tip" (+IAST)
  ['अचलाणि', 'अचलानि', 1],                   // l blocks retroflexion; mUlam अचलानि (+IAST)
  ['चतुर्विशत्यङ्गुलायामं', 'चतुर्विंशत्यङ्गुलायामं', 1], // dropped ं (24); mUlam (+IAST)
  ['पक्कैश्च', 'पक्वैश्च', 1],               // क्क->क्व; own IAST pakvaiśca + reader's पक्वान्नं + English "cooked"
  ['दम्भ्यः', 'दद्भ्यः', 1],                 // the dadbhyaḥ-svāhā aṅga-homa mantra; mUlam + ch27 precedent (+IAST)
  ['मुद्रान्नं', 'मुद्गान्नं', 2],           // mudga-rice; mUlam मुद्गान्नं ×2 + ch5 precedent (+IAST)
  ['सवदिव्याः', 'सर्वा देव्यः', 1],           // garble; mUlam सर्वा देव्यः "all goddesses" (+IAST)
  ['आाढकैस्तदर्धं', 'आढकैस्तदर्धं', 1],       // आ+ा double vowel-sign glyph defect
];
const IAST_FIXES = [
  // mirrors of Deva fixes
  ['tadyadyagre', 'tadyaṣṭyagre', 1], ['acalāṇi', 'acalāni', 1],
  ['caturviśatyaṅgulāyāmaṃ', 'caturviṃśatyaṅgulāyāmaṃ', 1],
  ['dambhyaḥ', 'dadbhyaḥ', 1], ['mudrānnaṃ', 'mudgānnaṃ', 2],
  ['savadivyāḥ', 'sarvā devyaḥ', 1],
  // x -> kṣ (22 tokens)
  ['durbhixa', 'durbhikṣa', 1], ['māsanaxatre', 'māsanakṣatre', 1],
  ['laxanam', 'lakṣaṇam', 3],                    // also n->ṇ; Deva लक्षणम्
  ['śubhavṛxasāraṃ', 'śubhavṛkṣasāraṃ', 1], ['śubhairvṛxairvā', 'śubhairvṛkṣairvā', 1],
  ['apxīṇaṃ', 'apakṣīṇaṃ', 1],                   // also dropped a; Deva अपक्षीणं
  ['daxiṇ', 'dakṣiṇ', 5],
  ['paxadvayayutaṃ', 'pakṣadvayayutaṃ', 1],
  ['daṇḍāyajñoktavṛxaiḥ', 'daṇḍāyajñoktavṛkṣaiḥ', 1],
  ['axahantrōḥ', 'akṣahantroḥ', 1],              // x + ō glyph; Deva अक्षहन्त्रोः
  ['vixipya', 'vikṣipya', 2], ['’ximocanaṃ', '’kṣimocanaṃ', 1],
  ['axatān', 'akṣatān', 1], ['tadbījāxaraṃ', 'tadbījākṣaraṃ', 1],
  ['yaxa', 'yakṣa', 1],
  // ṣ-for-kh (Deva मुख/नख everywhere)
  ['ālayaābhimuṣe', 'ālayābhimukhe', 1],         // also āā garble
  ['prāṅmuṣaṃ', 'prāṅmukhaṃ', 2],
  ['garuḍasyā’bhimuṣe', 'garuḍasyā’bhimukhe', 1],
  ['paścimābhimuṣaṃ', 'paścimābhimukhaṃ', 1],
  ['dakṣiṇāmuṣaṃ', 'dakṣiṇāmukhaṃ', 1],          // AFTER daxiṇ global
  ['prāṅmuṣa udaṅmuṣo', 'prāṅmukha udaṅmukho', 2],
  ['sumuṣākhya', 'sumukhākhya', 1],
  ['naṣadaśanaṃ', 'nakhadaśanaṃ', 1],            // Deva नखदशनं
  // ṣ-for-kṣ
  ['ityādinā’bhyuṣya', 'ityādinā’bhyukṣya', 1],  // Deva अभ्युक्ष्य
  ['snānāyā’bhyuṣya', 'snānāyā’bhyukṣya', 1],
  ['rāṣasādy', 'rākṣasādy', 1],                  // Deva राक्षसाद्य
  ['praṣālya', 'prakṣālya', 2], ['praṣipya', 'prakṣipya', 1],
  // ou -> au (14)
  ['tadādou', 'tadādau', 1], ['utsavādou', 'utsavādau', 1],
  ['vistārou', 'vistārau', 1], ['pādou', 'pādau', 1], ['kṛśou', 'kṛśau', 1],
  ['kouberamukuṭojjvalaṃ', 'kauberamukuṭojjvalaṃ', 1],
  ['śaṅkhou', 'śaṅkhau', 1], ['dīpadharou', 'dīpadharau', 1],
  ['sūryou', 'sūryau', 1], ['sanatkumārou', 'sanatkumārau', 1],
  ['oupāsanaṃ', 'aupāsanaṃ', 1], ['houtraṃ', 'hautraṃ', 1],
  ['śāntacakrou', 'śāntacakrau', 1], ['anapāyinou', 'anapāyinau', 1],
  // other IAST slips (Deva primary, mUlam-confirmed)
  ['trivida utsavaḥ', 'trividha utsavaḥ', 1],    // Deva त्रिविध
  ['deveśasyotsavavidhiṃ', 'deveśasya utsavavidhiṃ', 1], // mirror Deva split देवेशस्य उत्सवविधिं
  ['pīḍādyāśubha', 'pīḍādyaśubha', 1],           // spurious ā; Deva पीडाद्यशुभ
  ['śāntyotsavaḥ', 'śāntyutsavaḥ', 1],           // Deva शान्त्युत्सवः (line-2 one already correct)
  ['utsavadinasarkhyā', 'utsavadinasaṅkhyā', 1], // garble; Deva संख्या
  ['janmarṣe', 'janmarkṣe', 1],                  // dropped k (recurring)
  ['taddinṃ', 'taddinaṃ', 1],                    // dropped a
  ['kṛmikotara', 'kṛmikoṭara', 1],               // retroflex; Deva कोटर
  ['nav-aṣṭa', 'nava-aṣṭa', 1],                  // dropped a; Deva नव-अष्ट
  ['catustālaviṣtṛtaṃ', 'catustālavistṛtaṃ', 1], // ṣt garble; Deva विस्तृतं
  ['pucchena puccaṃ', 'pucchena pucchaṃ', 1],    // dropped h; Deva पुच्छं
  ['bāhusamāṃ', 'bāhusamaṃ', 1],                 // spurious ā; Deva बाहुसमं
  ['navatālāvibhāgena', 'navatālavibhāgena', 1], // spurious ā; Deva नवतालविभागेन
  ['pañcavarnyutaṃ', 'pañcavarṇayutaṃ', 1],      // dropped a + n->ṇ; Deva पञ्चवर्णयुतं
  ['śukāśyāmavāsasaṃ', 'śukaśyāmavāsasaṃ', 1],   // spurious ā; Deva शुकश्याम
  ['ṣadbhāgaṃ', 'ṣaḍbhāgaṃ', 1],                 // dental d; Deva षड्भागं
  ['avaṭṃ', 'avaṭaṃ', 1],                        // dropped a; Deva अवटं
  ['paścim-uttareṣu', 'paścima-uttareṣu', 1],    // dropped a; Deva पश्चिम-उत्तरेषु
  ['nidhāy;', 'nidhāya;', 1],                    // truncated gerund; Deva निधाय
  ['uttere', 'uttare', 1],                       // Deva उत्तरे
  ['dhānyoparinysta', 'dhānyoparinyasta', 1],    // dropped a; Deva न्यस्त
  ['pradacṣiṇīkṛtya', 'pradakṣiṇīkṛtya', 2],     // cṣ garble (recurring from ch50)
  ['dhvajasthānāmāviśya', 'dhvajasthānamāviśya', 1], // spurious ā; Deva स्थानम्
  ['nivedyet', 'nivedayet', 2],                  // dropped a; Deva निवेदयेत्
  ['aharahras', 'aharahas', 1],                  // spurious r; Deva अहरहस्
  ['vigrahairarcayedityāhamarīciḥ', 'vigrahaiḥ arcayedityāha marīciḥ', 1], // mirror Deva विग्रहैः अर्चयेद् + missing space इत्याह मरीचिः
  ['vā’`ropya', 'vā’’ropya', 1],                 // backtick for right-quote; Deva वाऽऽरोप्य
];
let applied = 0;
for (const [from, to, exp] of [...DEVA_FIXES, ...IAST_FIXES]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'PB (before/after)': pbBefore + '/' + (s.split('<!--PB-->').length - 1),
  'residual x': (s.match(/x/g) || []).length,
  'residual ou (latin tokens)': (latin.match(/[a-zāīūṛśṣṭḍṇ]ou|ou[a-zāīūṛśṣṭḍṇ]/g) || []).length,
  'residual muṣ/praṣ/ō/`': (s.match(/muṣ|praṣ|[ō`]/g) || []).length,
  'residual latin+deva mix': (s.match(/[a-zāīūṛṃḥśṣṭḍṇñṅ]+[ऀ-ॿ]|[ऀ-ॿ]+[a-zāīūṛṃḥśṣṭḍṇñṅ]/g) || []).length,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual x'] || chk['residual ou (latin tokens)'] || chk['residual muṣ/praṣ/ō/`'] || chk['residual latin+deva mix']) throw new Error('residual defect');
if ((s.split('<!--PB-->').length - 1) !== pbBefore) throw new Error('PB changed');
for (const k of ['em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' unbalanced'); }

b2.sanskrit = s;
fs.writeFileSync(SC + '/ch51-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
