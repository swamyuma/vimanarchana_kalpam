// ch52 (Utsavārambha / Mṛt-saṅgrahaṇa-vidhiḥ — festival commencement: maṇḍapa, vehicles,
// instruments, provisions, aṅkurārpaṇa timing, first-day rites, evening soil-gathering
// procession, Earth-Goddess figure & digging) reconciliation. Content-fix chapter: NO lump,
// NO structural defect. Cross-checked vs mUlam 052_mRtsangrahaNavidhiH.md. english UNTOUCHED.
// NO colophon block (precedent).
// DIVERGENCES LEFT (Deva=IAST consistent; English endorses or silent): samaviṃśativigrahaiḥ
// [mUlam सप्तविंशति=27; English "twenty forms" endorses — same call as ch25 samaviṃśati],
// viṣṇumūruṃ rakṣasva [mUlam विष्णुर्मां रक्षत्विति], cāvabhṛthāntaṃ [mUlam यावत्तीर्थान्तं],
// mṛtsikta [मृष्ट], guḍa [mUlam गुल = mUlam slip], pūrvāhne [पूर्वाह्णे], medinīti [मेदिनीमिति],
// bāhoḥ [बाह्वो], ulikhya single-l [mUlam उल्लिख्य], tatra mukhe [तत्प्रमुखे], dundubhi [दर्दुर],
// yuktyā [युक्तितः].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/e4773e0a-a857-49b6-8a2f-7dacef2dd33b/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[51];
if (ch.number !== 52) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2];
if (b2.type !== 'verse') throw new Error('b2 not verse');
let s = b2.sanskrit;
const pbBefore = s.split('<!--PB-->').length - 1;

const DEVA_FIXES = [
  ['उदीचीं मैशानीं', 'उदीचीम् ऐशानीं', 1],   // mis-split: m of udīcīm migrated (cf ch50 मौपासन); mUlam प्राचीमुदीचीमैशानीं (+IAST)
  ['तामुन्मन्य', 'तामानम्य', 1],             // garble (IAST tāmunamnya garbled differently); English "bowing to her" endorses ānamya (cf ch49 देवमानम्य); mUlam तामनुमान्य noted (+IAST)
];
const IAST_FIXES = [
  ['udīcīṃ maiśānīṃ', 'udīcīm aiśānīṃ', 1],
  ['tāmunamnya', 'tāmānamya', 1],
  // havis- for havir- (visarga sandhi before voiced; Deva हविर्)
  ['havisdravyaṃ', 'havirdravyaṃ', 1], ['havisdroṇaṃ', 'havirdroṇaṃ', 1],
  ['havisnivedayet', 'havirnivedayet', 3],
  // ṣ-for-kh / ṣ-for-kṣ (recurring from ch49-51)
  ['muṣamaṇḍapa', 'mukhamaṇḍapa', 1],        // Deva मुखमण्डप
  ['udaṅmuṣo', 'udaṅmukho', 1],              // Deva उदङ्मुखो
  ['uliṣya', 'ulikhya', 1],                  // Deva उलिख्य
  ['ityādinā abhyuṣya', 'ityādinā abhyukṣya', 1], // Deva अभ्युक्ष्य
  // x -> kṣ
  ['lājā’xata', 'lājā’kṣata', 1], ['aṣṭāxara', 'aṣṭākṣara', 1],
  ['daxiṇamākuñcya', 'dakṣiṇamākuñcya', 1],
  ['dhṛtotpaladaxiṇahastām', 'dhṛtotpaladakṣiṇahastām', 1],
  // ou -> au
  ['devyou', 'devyau', 1], ['aiśānīnyastamoulikāṃ', 'aiśānīnyastamaulikāṃ', 1],
  // Deva-fragment-in-IAST mojibake (exact ch47 defect)
  ['sarvalङ्kārasaṃyuktaṃ', 'sarvālaṅkārasaṃyuktaṃ', 1], // Deva सर्वालङ्कारसंयुक्तं
  // other IAST slips (Deva primary, mUlam-confirmed)
  ['stambhairyutaṃ', 'stambhairyuktaṃ', 1],  // Deva स्तम्भैर्युक्तं
  ['vyāla-hansa-', 'vyāla-haṃsa-', 1],       // Deva हंस
  ['muraj-śaṅkha', 'muraja-śaṅkha', 1],      // dropped a; Deva मुरज
  ['piñcāny', 'piñchāny', 1],                // dropped h; Deva पिञ्छान्य
  ['cāmarāni', 'cāmarāṇi', 1],               // n->ṇ; Deva चामराणि
  ['kumbhadevarādhanārthaṃ', 'kumbhadevārādhanārthaṃ', 1], // dropped ā (cf ch49); Deva देवाराधन
  ['snapanoktavidhaneṣu', 'snapanoktavidhānena', 1], // dropped ā + wrong ending; Deva विधानेन
  ['tathāivābhyarcya', 'tathaivābhyarcya', 1], // āi
  ['pradacṣiṇīkṛtya', 'pradakṣiṇīkṛtya', 1], // cṣ garble (recurring)
  ['aṅkurārpaṇastāne', 'aṅkurārpaṇasthāne', 1], // dropped h; Deva स्थाने
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
  'residual muṣ/havis/uliṣ': (s.match(/muṣ|havis|uliṣ/g) || []).length,
  'residual latin+deva mix': (s.match(/[a-zāīūṛṃḥśṣṭḍṇñṅ]+[ऀ-ॿ]|[ऀ-ॿ]+[a-zāīūṛṃḥśṣṭḍṇñṅ]/g) || []).length,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual x'] || chk['residual ou (latin tokens)'] || chk['residual muṣ/havis/uliṣ'] || chk['residual latin+deva mix']) throw new Error('residual defect');
if ((s.split('<!--PB-->').length - 1) !== pbBefore) throw new Error('PB changed');
for (const k of ['em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' unbalanced'); }

b2.sanskrit = s;
fs.writeFileSync(SC + '/ch52-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
