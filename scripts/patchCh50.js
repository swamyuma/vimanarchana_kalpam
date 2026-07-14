// ch50 (Cakra-lakṣaṇa / Cakra-pratiṣṭhā-vidhiḥ — Sudarśana disc: materials/dimensions/spokes,
// shaft & pedestal, anthropomorphic nava-tāla form, consecration rites) reconciliation.
// STRUCTURAL: the final Deva paragraph had a ~40-word LATIN STRETCH embedded mid-sentence
// ("शाययितvā uttarācchādanaṃ ... huत्वा, रात्रिशेषं") — the Devanagari column carried IAST text
// with mojibake bookends. Reconstructed the Devanagari (mUlam-confirmed), with a baked
// translit(newDeva)===fixedIAST assertion so the reconstruction provably mirrors the em line.
// Cross-checked vs mUlam 050_chakralaxaNachakrapratiShThAvidhiH.md. english UNTOUCHED.
// NO colophon block (mUlam colophon out of scope, precedent). NO lump-markup.
// DIVERGENCES LEFT (Deva=IAST consistent; English endorses or silent): araṇireṇu-patra [mUlam
// वेणुपत्र; English "leaves of the araṇi or reṇu plants" — endorsed], samāṅgulaṃ [mUlam
// सप्ताङ्गुलं, series 7-9-11; English omits the value], jvālāyām [mUlam ज्वालायामं], yuśrītam
// (+paren variant) [mUlam युञ्जीत], sahaiva [सहजमेव], śilpaśāstra [शिल्पि], saṃgṛhītvā
// [सङ्गृह्य], suvarṇaṃ [mUlam वर्णं = mUlam's own slip], vastradvayair [वस्त्राद्यै], viṣṇoḥ
// loke [विष्णुलोके], devālayābhimukhe [आलया-], aṣṭottaraśatāvṛttyā [शतमावृत्या].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const { translit } = require('./translit.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/e4773e0a-a857-49b6-8a2f-7dacef2dd33b/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[49];
if (ch.number !== 50) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2];
if (b2.type !== 'verse') throw new Error('b2 not verse');
let s = b2.sanskrit;
const pbBefore = s.split('<!--PB-->').length - 1;

// STRUCTURAL: replace the Latin stretch in the Deva column with reconstructed Devanagari.
const STRETCH_FROM = 'शाययितvā uttarācchādanaṃ kṛtvā; tathāiva houtrapraśaṃsya; cakrādipañcāyudhān mūrtimantraiḥ samāvāhya; āvāhanākrameṇa juṣṭākāra-svāhākārou kṛtvā; vaiṣṇavaṃ soudarśanaṃ cakragāyatrīṃ ca aṣṭottaraśatāvṛttyā huत्वा, रात्रिशेषं';
const STRETCH_TO = 'शाययित्वा उत्तराच्छादनं कृत्वा; तथैव हौत्रप्रशंस्य; चक्रादिपञ्चायुधान् मूर्तिमन्त्रैः समावाह्य; आवाहनाक्रमेण जुष्टाकार-स्वाहाकारौ कृत्वा; वैष्णवं सौदर्शनं चक्रगायत्रीं च अष्टोत्तरशतावृत्त्या हुत्वा, रात्रिशेषं';
const IAST_TARGET = 'śāyayitvā uttarācchādanaṃ kṛtvā; tathaiva hautrapraśaṃsya; cakrādipañcāyudhān mūrtimantraiḥ samāvāhya; āvāhanākrameṇa juṣṭākāra-svāhākārau kṛtvā; vaiṣṇavaṃ saudarśanaṃ cakragāyatrīṃ ca aṣṭottaraśatāvṛttyā hutvā, rātriśeṣaṃ';
if (translit(STRETCH_TO) !== IAST_TARGET) throw new Error('translit mismatch — reconstruction does not mirror the fixed IAST');
if (s.split(STRETCH_FROM).length - 1 !== 1) throw new Error('Latin stretch not found exactly once');
s = s.split(STRETCH_FROM).join(STRETCH_TO);

const DEVA_FIXES = [
  ['षडङ्गुुलं', 'षडङ्गुलं', 1],  // double ु matra (ch30 defect); + IAST ṣad below
  ['तत्प्राच्यां मौपासनाग्निकुण्डं', 'तत्प्राच्याम् औपासनाग्निकुण्डं', 1], // mis-split: m of prācyām migrated (cf ch34); mUlam तत्प्राच्यामौपासनाग्नि (+IAST)
];
const IAST_FIXES = [
  ['tatprācyāṃ moupāsanāgnikuṇḍaṃ', 'tatprācyām aupāsanāgnikuṇḍaṃ', 1],
  // x -> kṣ (10 tokens)
  ['laxaṇ', 'lakṣaṇ', 2], ['vṛxeṇa', 'vṛkṣeṇa', 1], ['naxatre', 'nakṣatre', 1],
  ['aximocanaṃ', 'akṣimocanaṃ', 1], ['vixipya', 'vikṣipya', 1], ['daxiṇ', 'dakṣiṇ', 2],
  ['nixipya', 'nikṣipya', 1], ['tadbījāxaraṃ', 'tadbījākṣaraṃ', 1],
  // ou -> au (remaining after stretch replacement)
  ['souvarṇaṃ', 'sauvarṇaṃ', 1],
  ['dvou siṃhou cakramudvahantou', 'dvau siṃhau cakramudvahantau', 1],
  ['houtrapraśaṃsya', 'hautrapraśaṃsya', 1], ['svāhākārou', 'svāhākārau', 1],
  ['soudarśanaṃ', 'saudarśanaṃ', 1],
  // other IAST slips (Deva primary, mUlam-confirmed)
  ['ārakūtasya', 'ārakūṭasya', 1],               // retroflex ṭ; Deva आरकूट (cf ch13)
  ['kṛṣadaṇḍādadhasthāt', 'kṛśadaṇḍādadhastāt', 1], // ś + adhastāt; Deva कृशदण्डादधस्तात्
  ['ṣadaṅgulaṃ', 'ṣaḍaṅgulaṃ', 1],               // dental d; Deva षडङ्गुलं
  ['ābharaṇanvitaṃ', 'ābharaṇānvitaṃ', 1],       // dropped ā; Deva आभरणान्वितं
  ['cakrapratiṣṭhāṃ vakṣye', 'atha cakrasya pratiṣṭhāṃ vakṣye', 1], // IAST dropped atha + compound; Deva अथ चक्रस्य प्रतिष्ठां
  ['yāgāśālāṃ', 'yāgaśālāṃ', 1],                 // spurious ā; Deva यागशालां
  ['snapanasvabhraṃ', 'snapanaśvabhraṃ', 2],     // ś; Deva श्वभ्रं
  ['praṣālya', 'prakṣālya', 1],                  // dropped k (recurring)
  ['tathāivā’bhiṣicya', 'tathaivā’bhiṣicya', 1], // āi
  ['tathāiva ', 'tathaiva ', 1],
  ['tadāiv ', 'tadaiva ', 1],                    // garble; Deva तदैव
  ['pradacṣiṇīkṛtya', 'pradakṣiṇīkṛtya', 1],     // cṣ garble; Deva प्रदक्षिणीकृत्य
  ['muṣamaṇḍape', 'mukhamaṇḍape', 1],            // ṣ-for-kh (recurring from ch49); Deva मुखमण्डपे
];
let applied = 1;
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
  'residual praṣ/muṣ/ā i': (s.match(/praṣ|muṣam|āiv/g) || []).length,
  'residual latin+deva mix': (s.match(/[a-zāīūṛṃḥśṣṭḍṇñṅ]+[ऀ-ॿ]|[ऀ-ॿ]+[a-zāīūṛṃḥśṣṭḍṇñṅ]/g) || []).length,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual x'] || chk['residual ou (latin tokens)'] || chk['residual praṣ/muṣ/ā i'] || chk['residual latin+deva mix']) throw new Error('residual defect');
if ((s.split('<!--PB-->').length - 1) !== pbBefore) throw new Error('PB changed');
for (const k of ['em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' unbalanced'); }

b2.sanskrit = s;
fs.writeFileSync(SC + '/ch50-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
