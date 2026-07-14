// ch49 (Snapana-vidhi-anusandhānam — executing the bathing: priests, night-before rites,
// bringing the deity, per-substance deity invocations & bathing mantras, dhruva-berā variant)
// reconciliation. Content-fix chapter: NO lump-markup, NO structural defect (all 33 <p> have
// their IAST). Cross-checked vs mUlam 049_snapanavidhiH.md. Separate english UNTOUCHED.
// NO colophon block in reader (mUlam has one — out of editorial scope per ch23/35/40 precedent).
// DIVERGENCES LEFT (Deva=IAST consistent; English endorses or is silent): ruṇanti-tīrtheṣu
// [mUlam वरुणं; English names a deity "Ruṇatīrtha" — endorsed ghost reading], pīvatram [mUlam
// पवित्रम्; English quotes "Vasoḥ pīvatra"], vandhyona [mUlam वन्ध्यान], sāmāścatasraḥ [mUlam
// सामैश्चिताङ्गम्], sa sarvavit [mUlam सर्ववेत्ता], kaṣāyeṇoddhṛtya [mUlam उद्वर्त्य],
// viśve'sminmagnāḥ [mUlam विश्वे निमग्न], āvāhanākrameṇa [mUlam आवाहनक्रमेण], dadhiṃ [mUlam
// दधि], jayādīn [mUlam जपादीन्, mUlam's own slip], devasenāpatim primary [mUlam देवेशानम्],
// stray opening quote before इन्द्रादीशान (cosmetic, mirrored in both scripts).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/e4773e0a-a857-49b6-8a2f-7dacef2dd33b/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[48];
if (ch.number !== 49) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2];
if (b2.type !== 'verse') throw new Error('b2 not verse');
let s = b2.sanskrit;
const pbBefore = s.split('<!--PB-->').length - 1;

const DEVA_FIXES = [
  ['आलयमाविशेत ।', 'आलयमाविशेत् ।', 1],            // missing virama; mUlam आलयमाविशेत् (IAST āviśet ✓)
  ['तद्विम्बार्हे', 'तद्बिम्बार्हे', 1],             // व->ब (bimba, cf ch25); mUlam तद्बिम्बार्हं (+IAST)
  ['अप्सरसवश्चाभ्यर्च्य', 'अप्सरसश्चाभ्यर्च्य', 1],  // spurious व, non-word; mUlam अप्सरसश्चाभ्यर्च्य (+IAST)
  ['अप्सरसवश्च आवाह्य', 'अप्सरसश्च आवाह्य', 1],      // same; mUlam अप्सरसश्च आवाह्य (+IAST)
  ['पुष्पादिभिरलङ्कृत्या;', 'पुष्पादिभिरलङ्कृत्य;', 1], // gerund spurious ā (cf ch15); mUlam अलङ्कृत्य (+IAST)
  ['विहिना', 'विधिना', 1],                            // ध->ह; mUlam शुद्धस्नपनविधिना (+IAST)
];
const IAST_FIXES = [
  // mirrors of Deva fixes
  ['tadvimbārhe', 'tadbimbārhe', 1],
  ['apsarasavścābhyarcya', 'apsarasaścābhyarcya', 1],  // also garbled vś
  ['apsarasavṣca āvāhya', 'apsarasaśca āvāhya', 1],    // also ṣ->ś
  ['puṣpādibhiralaṅkṛtyā;', 'puṣpādibhiralaṅkṛtya;', 1],
  ['vihinā', 'vidhinā', 1],
  // ou -> au (all 8 Sanskrit; no English 'ou' in field)
  ['dvou', 'dvau', 1], ['pūrvarātrou', 'pūrvarātrau', 1],
  ['houtrapraśaṃsya', 'hautrapraśaṃsya', 1], ['aśvinou', 'aśvinau', 1],
  ['sarvouṣadhy', 'sarvauṣadhy', 2], ['vanouṣadh', 'vanauṣadh', 2],
  // x -> kṣ
  ['axatodakaṃ', 'akṣatodakaṃ', 1], ['axatodakena', 'akṣatodakena', 1],
  ['nixipya', 'nikṣipya', 1],
  // kh -> ṣ garble (distinctive this chapter)
  ['muṣamaṇḍape', 'mukhamaṇḍape', 1],      // Deva मुखमण्डपे
  ['devālayamuṣe', 'devālayamukhe', 1],    // Deva देवालयमुखे
  // ō glyph
  ['tvōrje', 'tvorje', 1], ['āpōhiṣṭh', 'āpohiṣṭh', 1],
  // Latin+Deva mojibake
  ['dakṣिṇa', 'dakṣiṇa', 1],
  // truncated gerunds (Deva has full -य)
  ['visṛjy ', 'visṛjya ', 1], ['alaṅkṛty;', 'alaṅkṛtya;', 1],
  // dropped-k kṣ->ṣ (recurring from ch47/48)
  ['proṣya', 'prokṣya', 1],                // Deva प्रोक्ष्य
  ['vārīṣcatasraḥ', 'vārīścatasraḥ', 2],   // Deva वारीश्चतस्रः (ś; cf ch47 same fix)
  // other IAST slips (Deva primary, mUlam-confirmed)
  ['dravyadevarādhan', 'dravyadevārādhan', 1], // dropped ā; Deva देवाराधन
  ['śayanastāne', 'śayanasthāne', 1],          // dropped h; Deva स्थाने
  ['svāhakāraṃ', 'svāhākāraṃ', 1],             // dropped ā; Deva स्वाहाकारं
  ['yamanairṛtyormadhye', 'yamanirṛtyormadhye', 1],       // Deva यमनिर्ऋत्योर्
  ['nairṛtavaruṇayorantare', 'nirṛtivaruṇayorantare', 1], // Deva निर्ऋति
  ['‘devasyatve’ (devasya tvā) iti', '‘devasya tvā’ iti', 1], // IAST kept mUlam sandhi+gloss; Deva primary ‘देवस्य त्वा’
  ['viāmahe', 'vidmahe', 1],                   // garble; Deva विद्महे
  ['devasenāthim', 'devasanāthim', 1],         // apparatus quote; Deva देवसनाथिम्
  ['gāyatryāeva', 'gāyatryaiva', 1],           // Deva गायत्र्यैव
  ['pañcavimśati', 'pañcaviṃśati', 1],         // m->ṃ (recurring)
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
  'residual ō/ä/proṣ/muṣam': (s.match(/[ōä]|proṣ|muṣam/g) || []).length,
  'residual latin+deva': (s.match(/[a-zāīūṛṃḥśṣṭḍṇñṅ]+[ऀ-ॿ]/g) || []).length,
  'residual trunc-gerund': (latin.match(/[a-zāīūṛ]{2,}[bcdfghjklmnprstv]y(?=[,;.\s])/g) || []).join(',') || 0,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual x'] || chk['residual ou (latin tokens)'] || chk['residual ō/ä/proṣ/muṣam'] || chk['residual latin+deva']) throw new Error('residual defect');
if ((s.split('<!--PB-->').length - 1) !== pbBefore) throw new Error('PB changed');
for (const k of ['em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' unbalanced'); }

b2.sanskrit = s;
fs.writeFileSync(SC + '/ch49-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
