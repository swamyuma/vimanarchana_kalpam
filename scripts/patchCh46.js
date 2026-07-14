// ch46 (Māsa-viśeṣa-pūjā-vidhiḥ) reconciliation. Content-fix chapter (NO lump-markup).
// b2 (verse, pattern-b, 16 PB = 17 spreads); b3 colophon (Deva-only <h2>, clean, untouched).
// Separate english UNTOUCHED. All fixes are IAST-side slips (Deva clean, has (मुद्रितपाठे) apparatus).
// Cross-checked vs mUlam 046_mAsavisheShapUjAvidhiH.md. Heavy x->kṣ, यो->jo, ou->au, ē/à glyphs.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/357a72e2-eb1c-4f8e-843a-248568ad40f5/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[45];
if (ch.number !== 46) throw new Error('wrong chapter ' + ch.number);
const b = ch.blocks[2];
if (b.type !== 'verse') throw new Error('b2 not verse');
let s = b.sanskrit;
const devBefore = (s.match(/[ऀ-ॿ।॥॰]/g) || []).join('');
const pbBefore = s.split('<!--PB-->').length - 1;

const FIXES = [
  // x -> kṣ (stems where safe)
  ['naxatr','nakṣatr',7], ['lax','lakṣ',3], ['daxṣiṇ','dakṣiṇ',2],
  ['aṣṭāxaramantraṃ','aṣṭākṣaramantraṃ',1], ['bhaxyāṇi','bhakṣyāṇi',2],
  ['bhāxyāni','bhakṣyāṇi',1], ['ekāxaraṃ','ekākṣaraṃ',1], ['gōxīraṃ','gokṣīraṃ',1],
  ['janmarxe','janmarkṣe',1], ['praxipya','prakṣipya',1], ['rxaparvaṇi','ṛkṣaparvaṇi',1],
  ['sūxmaṃ','sūkṣmaṃ',1], ['vinixipet','vinikṣipet',1], ['xīram','kṣīram',1],
  // ou -> au (targeted; all Sanskrit)
  ['rātrou','rātrau',3], ['goulyaṃ','gaulyaṃ',2], ['pouṣ','pauṣ',2],
  ['dhoutavastreṇa','dhautavastreṇa',1], ['koupaṃ','kaupaṃ',1], ['kṣoumaṃ','kṣaumaṃ',1],
  ['pourṇamāsyāṃ','paurṇamāsyāṃ',1], ['punarvasou','punarvasau',1], ['ādityaraśmou','ādityaraśmau',1],
  // non-standard glyphs / āi
  ['bhēdaiḥ','bhedaiḥ',2], ['sarvàiśvaryam','sarvaiśvaryam',1], ['stotrāiḥ','stotraiḥ',2],
  ['jayaśabdāiśca','jayaśabdaiśca',2], ['tathāiva','tathaiva',2],
  // j -> y (यो/यत्/यः; targeted so legit j [jaya/japtvā/jayantī] untouched)
  ['jo dadyāt','yo dadyāt',4], ['jo dīpaṃ','yo dīpaṃ',1], ['jo nivedayati','yo nivedayati',1],
  ['jat nūnaṃ','yat nyūnaṃ',1], ['jaḥ kurute','yaḥ kurute',1], ['brahmajajñaṃ','brahmayajñaṃ',1],
  // other slips
  ['mārgāśīrṣ','mārgaśīrṣ',3],           // extra ā; Deva मार्गशीर्ष
  ['saṅkrāntiṣu','saṅkramaṇeṣu',1],      // wrong word; Deva/mUlam सङ्क्रमणेषु
  ['viṣuvat-ayane','viṣuvad-ayane',1],   // t->d; Deva विषुवद्
  ['sarvatraālayaṃ','sarvatra ālayaṃ',1],// padaccheda; Deva सर्वत्र आलयं
  ['utsavāṃ kṛtvā','utsavaṃ kṛtvā',1],   // long ā->a; Deva उत्सवं
  ['śrāvayeti','śrāvayet',1],            // extra i; Deva श्रावयेत्
  ['dhūpadanaphalaṃ','dhūpadānaphalaṃ',1],       // dropped macron दान (NOT nivedana!)
  ['gandhadanaphalaṃ','gandhadānaphalaṃ',1],
  ['pānīyadanaphalaṃ','pānīyadānaphalaṃ',1],
  ['snānatoyadanaphalaṃ','snānatoyadānaphalaṃ',1],
  ['vastradanaphalaṃ','vastradānaphalaṃ',1],
  ['mukhavāsadanaphalaṃ','mukhavāsadānaphalaṃ',1],
  ['dīpadanaphalaṃ','dīpadānaphalaṃ',1],
  ['puṣpadanaphalaṃ','puṣpadānaphalaṃ',1],
  ['rghyadanaphalaṃ','rghyadānaphalaṃ',1],
  ['alaṅkṛty,','alaṅkṛtya,',1],          // dropped a; Deva अलङ्कृत्य
  ['saṃsnāpy,','saṃsnāpya,',1],          // dropped a; Deva संस्नाप्य
  ['utsevena','utsavena',1],             // e->a; Deva उत्सवेन
  ['arcāstāne','arcāsthāne',1],          // dropped h; Deva अर्चास्थाने
  ['citrakaṣādyaiḥ','citrakakṣādyaiḥ',1],// dropped k; Deva चित्रकक्षाद्यैः
  ['aṣṭacatvārīṃśat','aṣṭacatvāriṃśat',1], // long ī->i; Deva चत्वारिंशत्
  ['dīpamāṇḍape','dīpamaṇḍape',1],       // long ā->a; Deva दीपमण्डपे
  ['mukhamaṇṭape','mukhamaṇḍape',1],     // ṭ->ḍ; Deva मुखमण्डपे
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

const chk = {
  applied,
  'PB markers (before/after)': pbBefore + '/' + (s.split('<!--PB-->').length - 1),
  'residual x': (s.match(/x/g)||[]).length,       // expect 0
  'residual ou': s.split('ou').length - 1,        // expect 0 (all Sanskrit)
  'residual ē/à': (s.match(/[ēà]/g)||[]).length,  // expect 0
  'residual danaphala(non-nivedana)': (s.match(/[^e]danaphala/g)||[]).length, // expect 0 (only nivedana keeps short a)
  'deva unchanged': ((s.match(/[ऀ-ॿ।॥॰]/g)||[]).join('')) === devBefore,
  'em bal': (s.match(/<em>/g)||[]).length + '/' + (s.match(/<\/em>/g)||[]).length,
  'strong bal': (s.match(/<strong>/g)||[]).length + '/' + (s.match(/<\/strong>/g)||[]).length,
  'p bal': (s.match(/<p>/g)||[]).length + '/' + (s.match(/<\/p>/g)||[]).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual x'] || chk['residual ou'] || chk['residual ē/à']) throw new Error('residual defect');
if ((s.split('<!--PB-->').length - 1) !== pbBefore) throw new Error('PB changed');
if (!chk['deva unchanged']) throw new Error('Devanagari changed (expected IAST-only)!');
for (const k of ['em bal','strong bal','p bal']) { const [a,c]=chk[k].split('/'); if(a!==c) throw new Error(k+' unbalanced'); }

b.sanskrit = s;
fs.writeFileSync(SC + '/ch46-b-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
