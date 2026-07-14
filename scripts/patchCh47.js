// ch47 (Śuddha-snapana / Āgrayaṇa-vidhiḥ) reconciliation. Content-fix chapter (NO lump-markup).
// b2 (verse, pattern-b, 10 PB = 11 spreads; colophon lives in b2's flow, no separate block).
// Separate english UNTOUCHED. Has Deva-side fixes (mojibake: Latin 'ha'+Deva, tad+Deva; typos)
// AND IAST-side slips. Distinctive defect: kṣ->ṣ (praṣālya, saṃṣālya, sūṣma — dropped k).
// Cross-checked vs mUlam 047_shuddhasnapanA--grayaNavidhiH.md.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/357a72e2-eb1c-4f8e-843a-248568ad40f5/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[46];
if (ch.number !== 47) throw new Error('wrong chapter ' + ch.number);
const b = ch.blocks[2];
if (b.type !== 'verse') throw new Error('b2 not verse');
let s = b.sanskrit;
const pbBefore = s.split('<!--PB-->').length - 1;

const DEVA_FIXES = [
  ['haविर्निवेदनस्थाने', 'हविर्निवेदनस्थाने', 1],   // Latin 'ha'+Deva mojibake
  ['haविर्निवेदनं', 'हविर्निवेदनं', 1],             // Latin 'ha'+Deva
  ['haविश्याकोक्तविधिना', 'हविष्याकोक्तविधिना', 1], // ha->ह + श्या->ष्या (haviṣyāka; mUlam हविष्पाक)
  ['tadविष्णोः', 'तद्विष्णोः', 1],                   // Latin 'tad'+Deva
  ['परवाणि', 'पर्वणि', 1],                           // typo; Deva/mUlam पर्वणि
  ['योरभयप्रदं', 'योर्भयप्रदं', 1],                  // यो-र-अभय -> योर्-भय; mUlam+IAST+English "causes fear"
  ['दूर्वा-अक्शत', 'दूर्वा-अक्षत', 1],               // क्श->क्ष
  ['प्रद्यात्', 'प्रदद्यात्', 1],                    // dropped द; mUlam प्रदद्यात् (+ IAST below)
  ['नववस्तप्रुष्प', 'नववस्त्रपुष्प', 1],             // metathesis स्तप्रु->स्त्रपु
  ['कदलीपत्रानि', 'कदलीपत्राणि', 1],                 // n->ṇ
  ['मूर्तिमांत्रांश्च', 'मूर्तिमन्त्रांश्च', 1],      // मां->मन् (+ IAST below)
];
const IAST_FIXES = [
  // kṣ -> ṣ (dropped k) & ṣ->ś
  ['anyarṣeṣu', 'anyarkṣeṣu', 1], ['puṇyarṣeṣu', 'puṇyarkṣeṣu', 1],
  ['praṣālya', 'prakṣālya', 4],
  ['pādayoḥ praṣipet', 'pādayoḥ prakṣipet', 1],   // Deva प्रक्षिपेत्
  ['purataḥ praṣipet', 'purataḥ nikṣipet', 1],    // Deva निक्षिपेत् (NOT prakṣipet!)
  ['praṣipya', 'prakṣipya', 1], ['saṃṣālya', 'saṃkṣālya', 1],
  ['sūṣmasikatābhiḥ', 'sūkṣmasikatābhiḥ', 1], ['vārīṣcatasraḥ', 'vārīścatasraḥ', 1],
  // x -> kṣ
  ['bhaxyāṇi', 'bhakṣyāṇi', 1], ['karturanukūlanaxatre', 'karturanukūlanakṣatre', 1],
  // ou -> au
  ['mukhavāsou', 'mukhavāsau', 1], ['sandhou', 'sandhau', 2],
  ['souvarṇaiḥ', 'sauvarṇaiḥ', 1], ['śucou', 'śucau', 1],
  // dropped-a gerunds -ṛty, -> -ṛtya,
  ['ṛty,', 'ṛtya,', 5],
  // Deva-fragment-in-IAST mojibake + mirrors of Deva fixes
  ['sarvalङ्kārasaṃyuktaṃ', 'sarvālaṅkārasaṃyuktaṃ', 1],
  ['mūrtimāntrāṃśca', 'mūrtimantrāṃśca', 1],       // mirror मूर्तिमन्त्र
  ['pradyāt', 'pradadyāt', 1],                     // mirror प्रदद्यात्
  // other IAST slips
  ['ityālakān', 'ityalakān', 1], ['alakāśodhanaṃ', 'alakaśodhanaṃ', 1],
  ['samācchādya, bhāve', 'samācchādya, abhāve', 1], ['ityāṅge', 'ityaṅge', 1],
  ['śālipīṣṭena', 'śālipiṣṭena', 1], ['mūrdhādīpāda', 'mūrdhādipāda', 1],
  ['śuddhistasthā', 'śuddhistathā', 1], ['pūrvvaddhautena', 'pūrvavaddhautena', 1],
  ['pūrvvacchuddhodakair', 'pūrvavacchuddhodakair', 1], ['uṣṇodakaiṛvā', 'uṣṇodakairvā', 1],
  ['saṃsnāpy pūrvadvastra', 'saṃsnāpya pūrvavadvastra', 1], ['saṃsnāpy,', 'saṃsnāpya,', 1],
  ['dhārayāabhiṣecayet', 'dhārayā abhiṣecayet', 1], ['yānāmāropya', 'yānamāropya', 1],
  ['ālayamalṅkṛtya', 'ālayamalaṅkṛtya', 1], ['śrībhūmidevatyāṃ', 'śrībhūmidevatyaṃ', 1],
];
let applied = 0;
for (const [from, to, exp] of [...DEVA_FIXES, ...IAST_FIXES]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

const chk = {
  applied,
  'PB markers (before/after)': pbBefore + '/' + (s.split('<!--PB-->').length - 1),
  'residual x': (s.match(/x/g)||[]).length,
  'residual ou': s.split('ou').length - 1,
  'residual praṣ/saṃṣ/sūṣ': s.split('praṣ').length-1 + s.split('saṃṣ').length-1 + s.split('sūṣ').length-1,
  'residual Latin-in-deva (ha/tad+deva)': (s.match(/\bha[ऀ-ॿ]|tad[ऀ-ॿ]/g)||[]).length,
  'residual deva-frag-in-iast (ल/ङ्/त्र etc in latin ctx)': (s.match(/[a-zāīū]ङ्k|sarval/g)||[]).length,
  'em bal': (s.match(/<em>/g)||[]).length + '/' + (s.match(/<\/em>/g)||[]).length,
  'strong bal': (s.match(/<strong>/g)||[]).length + '/' + (s.match(/<\/strong>/g)||[]).length,
  'p bal': (s.match(/<p>/g)||[]).length + '/' + (s.match(/<\/p>/g)||[]).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual x'] || chk['residual ou'] || chk['residual praṣ/saṃṣ/sūṣ']) throw new Error('residual defect');
if (chk['residual Latin-in-deva (ha/tad+deva)']) throw new Error('residual mojibake');
if ((s.split('<!--PB-->').length - 1) !== pbBefore) throw new Error('PB changed');
for (const k of ['em bal','strong bal','p bal']) { const [a,c]=chk[k].split('/'); if(a!==c) throw new Error(k+' unbalanced'); }

b.sanskrit = s;
fs.writeFileSync(SC + '/ch47-b-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
