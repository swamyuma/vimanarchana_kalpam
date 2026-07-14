// ch40 (Devyoḥ Pṛthak Pratiṣṭhā / Vaivāhika-snapanotsava-balibera-pratiṣṭhā-vidhiḥ) reconciliation.
// Single content block b2 (pattern-b: Deva + inline <em> IAST per <p>). English (complete) untouched.
// b3 is the editor's Typographical Resolutions Table (authority on intended readings) — not touched.
// No colophon block (reader ends at "...labhed iti vijñāyate"; mUlam colophon out of editorial scope).
// Fixes cross-checked vs mUlam 040_vaivAhikasnapanotsavabaliberapratiShThAvidhiH.md + editor table.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/e28aea44-7500-4af2-9eac-df0010e61114/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[39];
if (ch.number !== 40) throw new Error('wrong chapter ' + ch.number);
const b = ch.blocks[2];
let s = b.sanskrit;

// (1) DEVA-side errors (each mirrored in IAST below).
const DEVA_FIXES = [
  ['वा अपी', 'वा अपि', 1],                    // अपी(long ī)->अपि; editor table cleaned "वा अपि"
  ['शकनुसूक्तं', 'शकुनसूक्तं', 1],              // metathesis: śakuna-sūkta (mUlam शकुनसूक्तं)
  ['कलशौः', 'कलशैः', 1],                       // instr.pl typo कलशौः->कलशैः (cf correct कलशैः in P5; mUlam)
  ['दीपाद्वीपम्', 'दीपाद्दीपम्', 1],            // व->द corruption; dīpād dīpam (English endorses, mUlam)
  ['अभ्यन्तरं तत्-पीठे', 'अभ्यन्तरे तत्-पीठे', 1], // loc. अभ्यन्तरे (mUlam + IAST + grammar; "in the pedestal")
];

// (2) IAST targeted fixes: mirrors of the Deva fixes + IAST-only transliteration slips.
//     kalaśouḥ done here BEFORE the global ou->au (so it becomes kalaśaiḥ, not kalaśauḥ).
const IAST_FIXES = [
  ['vā apī', 'vā api', 1],                     // mirror अपी->अपि
  ['śakanusūktaṃ', 'śakunasūktaṃ', 1],         // mirror शकनु->शकुन
  ['kalaśouḥ', 'kalaśaiḥ', 1],                 // mirror कलशौः->कलशैः (removes one 'ou')
  ['dīpādvīpam', 'dīpāddīpam', 1],             // mirror दीपाद्वीपम्->दीपाद्दीपम्
  ['śodhya', 'śodhayitvā', 1],                 // Deva शोधयित्वा (IAST wrote wrong word śodhya)
  ['ājyāhūtīḥ', 'ājyāhutīḥ', 1],               // Deva आज्याहुतीः short u
  ['arkamanḍalād', 'arkamaṇḍalād', 1],         // Deva ण्ड retroflex (n->ṇ)
  ['pādi-arghyāntam', 'pādyādi-arghyāntam', 1],// Deva पाद्यादि (dropped yā)
  ['yathākrameṇā ', 'yathākrameṇa ', 1],       // Deva यथाक्रमेण (spurious macron)
  ['cora-adi', 'cora-ādi', 1],                 // Deva चोर-आदि (dropped macron)
  ['ācāryadibhyo', 'ācāryādibhyo', 1],         // Deva आचार्यादिभ्यो (dropped macron)
  ['āsyāntam vā', 'āsyāntaṃ vā', 1],           // Deva आस्यान्तं anusvāra
  ['dattva,', 'dattvā,', 1],                   // Deva दत्त्वा (dropped macron)
  ['havis nivedya', 'haviḥ nivedya', 2],       // Deva हविः visarga
  ['pṛthag eva kārayet', 'pṛthag evaṃ kārayet', 1], // Deva पृथग् एवं anusvāra (mUlam एवं)
  // truncated gerunds (Deva has full -य; IAST dropped final a):
  ['āpūry,', 'āpūrya,', 1],
  ['saṃsthāpy,', 'saṃsthāpya,', 1],
  ['alaṅkṛty,', 'alaṅkṛtya,', 1],
  ['saṃsnāpy,', 'saṃsnāpya,', 3],
  ['saṃsnāpy abhyarcya', 'saṃsnāpya abhyarcya', 1],
  ['pratiṣṭhāpy,', 'pratiṣṭhāpya,', 3],
  ['pratiṣṭhāpy arcitaṃ', 'pratiṣṭhāpya arcitaṃ', 1],
];

let applied = 0;
function apply(list) {
  for (const [from, to, exp] of list) {
    const n = s.split(from).length - 1;
    if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
    s = s.split(from).join(to); applied += n;
  }
}
apply(DEVA_FIXES);
apply(IAST_FIXES);

// (3) global ou->au mojibake (Deva औ). After kalaśouḥ removed, expect 33.
const ouCount = s.split('ou').length - 1;
if (ouCount !== 33) throw new Error(`ou expected 33, found ${ouCount}`);
s = s.split('ou').join('au'); applied += ouCount;

// sanity checks
const truncGer = (s.replace(/<[^>]+>/g,' ').match(/[A-Za-zāīūṛṝḷṅñṇṭḍśṣṃḥ]+y(?=[,;\s])/g) || [])
  .filter(t => !/ya$/.test(t) && !/ay$/.test(t)); // any remaining bare -y token
const chk = {
  applied,
  'residual ou': s.split('ou').length - 1,
  'residual truncated -y gerunds': truncGer,
  'residual शकनु': s.split('शकनु').length - 1,
  'residual कलशौः': s.split('कलशौः').length - 1,
  'em bal': (s.match(/<em>/g)||[]).length + '/' + (s.match(/<\/em>/g)||[]).length,
  'strong bal': (s.match(/<strong>/g)||[]).length + '/' + (s.match(/<\/strong>/g)||[]).length,
  'p bal': (s.match(/<p>/g)||[]).length + '/' + (s.match(/<\/p>/g)||[]).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual ou'] || truncGer.length) throw new Error('residual defect');
const eb = chk['em bal'].split('/'); if (eb[0] !== eb[1]) throw new Error('em unbalanced');

b.sanskrit = s;
fs.writeFileSync(SC + '/ch40-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
