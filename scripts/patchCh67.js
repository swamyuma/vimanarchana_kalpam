// ch67 (Snapana-prāyaścitta-vidhiḥ — ablution expiations: the 3 snapana kinds [nitya/
// naimittika/kāmya] & their lapses, snapana-hall placement, pratisara-bandha, kalaśa/
// material/mantra faults, contaminated vessels, substitute materials) reconciliation.
// Pattern-b: b2 content (30 <p>, 25 PB = 26 spreads), b3 Colophon. mUlam
// 067_snapanaprAyashchittavidhiH.md. english UNTOUCHED.
// DEVA FIXES: आधिके→अधिके [b2; standard प्रमाणहीने अधिके phrase, mUlam confirms; the
// nearby अधिकेषु was already correct], colophon विधिर्नामा→विधिर्नाम [spurious ā].
// KEY IAST: saptasastitamaḥ→saptaṣaṣṭitamaḥ ×2 [s-for-ṣ in header AND colophon],
// kalāś→kalaś ×8 [spurious ā; Deva कलश], dray→dravy ×9 [recurs ch66],
// viṣvakṣen/vaiṣvakṣen→sen ×2 [kṣ-for-s reversed, recurs ch66], daivatyāṃ→daivatyaṃ ×3,
// śrībhūmidaivataṃ→daivatyaṃ ×3 [Deva दैवत्यं], saṃṣodhya/sparṣaṇe→ś, snapayeet→snapayet.
// LEFT (Deva=IAST consistent): महीदेवत्यं [Deva देवत्यं], दिग्दैवत्य-मन्त्रांश्च [apparatus
// दिग्देवत्य], दर्भेषु [apparatus पर्वतेषु], many मुद्रितपाठे parens.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[66];
if (ch.number !== 67) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
const PB_BEFORE = (b2.sanskrit.match(/<!--PB-->/g) || []).length;
let s = b2.sanskrit;

const FIXES = [
  // --- DEVA fix ---
  ['आधिके', 'अधिके', 1],
  ['ādhike', 'adhike', 1],
  // --- header s-for-ṣ ---
  ['saptasastitamaḥ', 'saptaṣaṣṭitamaḥ', 1],
  // --- kalāś spurious ā (Deva कलश) ---
  ['kalāś', 'kalaś', 8],
  // --- dray→dravy (Deva द्रव्य; recurs ch66) ---
  ['dray', 'dravy', 9],
  // --- kṣ-for-s reversed (Deva विष्वक्सेन/वैष्वक्सेन) ---
  ['viṣvakṣen', 'viṣvaksen', 1], ['vaiṣvakṣen', 'vaiṣvaksen', 1],
  // --- daivata/daivatyāṃ→daivatyaṃ per Deva दैवत्यं ---
  ['śrībhūmidaivataṃ', 'śrībhūmidaivatyaṃ', 3],
  ['daivatyāṃ', 'daivatyaṃ', 3],
  // --- x→kṣ ---
  ['ālayābhimuxe', 'ālayābhimukhe', 1], ['daxiṇa', 'dakṣiṇa', 1], ['nixipet', 'nikṣipet', 1],
  // --- 'ea' garble ---
  ['āgneayādiṣu', 'āgneyādiṣu', 1], ['jaleana', 'jalena', 1],
  ['adhideavatāmantraṃ', 'adhidevatāmantraṃ', 1], ['yeanakeanacid', 'yenakenacid', 1],
  // --- non-standard ō/ē ---
  ['darbhēṣu', 'darbheṣu', 1], ['viparyāsōddhṛta', 'viparyāsoddhṛta', 1],
  ['yathōktasnapane', 'yathoktasnapane', 1],
  // --- ou→au GLOBAL (5: pūrvarātrou soudarśanaṃ soumyaṃ paṅktou nityāgnou; tag-safe) ---
  ['ou', 'au', 5],
  // --- aiah ---
  ['aiah', 'aiḥ', 2],
  // --- ṣ-for-ś ---
  ['saṃṣodhya', 'saṃśodhya', 1], ['sparṣaṇe', 'sparśane', 1],
  // --- misc ---
  ['śuddhoadak', 'śuddhodak', 2],
  ['snapayeet', 'snapayet', 1],
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

// colophon fixes + english fill
if ((b3.sanskrit.match(/विधिर्नामा/g) || []).length !== 1) throw new Error('colophon nāmā not found');
b3.sanskrit = b3.sanskrit.replace('विधिर्नामा', 'विधिर्नाम');
if ((b3.iast.match(/saptasastitamaḥ/g) || []).length !== 1) throw new Error('colophon sastitamaḥ not found');
b3.iast = b3.iast.replace('saptasastitamaḥ', 'saptaṣaṣṭitamaḥ');
applied += 2;
if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
b3.english = '<ul>\n<li><p><em>Thus ends the sixty-seventh chapter, named &quot;The Rules of Expiation for the Ablution Ceremony&quot; (Snapana-prāyaścitta-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 67 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou/ea/ō/ē/ẽ/āi': (latin.match(/ou|ea|ō|ē|ẽ|āi/g) || []).length,
  'residual aiah/kalāś/dray(?!v)/daivatyāṃ/kṣen': (s.match(/aiah|kalāś|dray(?!v)|daivatyāṃ|kṣen/g) || []).length,
  'residual final-h': (latin.match(/[aāeiīouū]h(?=[\s,;.)&])/g) || []).length,
  'residual deva आधिके': (s.match(/आधिके/g) || []).length,
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
fs.writeFileSync(SC + '/ch67-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
