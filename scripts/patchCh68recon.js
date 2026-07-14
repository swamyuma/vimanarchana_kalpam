// ch68 (Utsava-prāyaścitta-vidhiḥ) Deva/IAST reconciliation. Operates ONLY on sanskrit+iast.
// Fix list derived from compareCh68.js (translit(Deva) vs IAST word-multiset diff), NOT the
// stale pre-written patchCh68.js (whose counts were wrong: viṣvakṣenaṃ is x5 not x2, etc.).
// English is handled separately by buildCh68eng.js. Benign convention diffs LEFT:
//   ṃ↔ṅ/m/n nasal assimilation (saṅkalpya, sampūjya, sandhānaṃ), hyphenation, ced/cet sandhi.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[67];
if (ch.number !== 68) throw new Error('wrong chapter ' + ch.number);
const verses = ch.blocks.filter(b => b.type === 'verse');
if (verses.length !== 49) throw new Error('expected 49 verses, got ' + verses.length);

// [from, to, expectedCount]. Order matters where noted.
const FIXES = [
  // ---- DEVA-side fixes ----
  ['व्याहतीश्च', 'व्याहृतीश्च', 2],                       // b9,b13 missing ृ (vyāhṛti)
  ['ध्वजावरोहण कारयेत्', 'ध्वजावरोहणं कारयेत्', 1],       // b47 dropped anusvāra
  ['विधिर्नामा', 'विधिर्नाम', 1],                          // b50 colophon nāmā->nāma
  // ---- viṣvaksena family (ORDER: -naṃ vṛddhi first, then vaiṣ kṣ->ks, then bare compound) ----
  ['viṣvakṣenaṃ', 'vaiṣvaksenaṃ', 5],                     // b17,b20,b23,b26,b29 (Deva वैष्वक्सेनं)
  ['vaiṣvakṣenaṃ', 'vaiṣvaksenaṃ', 1],                    // b6 (prefix ok, kṣ->ks)
  ['viṣvakṣena', 'viṣvaksena', 1],                        // b8 deity name in compound (Deva विष्वक्सेन)
  // ---- x / xṣ -> kṣ (specific tokens; total x = 11) ----
  ['haviraxṣakadevatyaṃ', 'havīrakṣakadevatyaṃ', 1],      // b29 (also havi->havī)
  ['baliraxṣakadevatyaṃ', 'balirakṣakadevatyaṃ', 2],      // b22,b32
  ['ācāryadaxṣiṇāṃ', 'ācāryadakṣiṇāṃ', 1],                // b15
  ['xipet', 'kṣipet', 2],                                 // b23
  ['axṣahantṛmantraṃ', 'akṣahantṛmantraṃ', 1],            // b23
  ['praxṣālya', 'prakṣālya', 1],                          // b28
  ['xṣamasve', 'kṣamasve', 1],                            // b30
  ['nixipya', 'nikṣipya', 1],                             // b34
  ['saṅxṣobhe', 'saṅkṣobhe', 1],                          // b36 (keep saṅ convention)
  // ---- ou -> au (GLOBAL, 15; no Deva/tag/entity contains 'ou') ----
  ['ou', 'au', 15],
  // ---- non-standard ō -> o (GLOBAL, 5) ----
  ['ō', 'o', 5],
  // ---- 'ea' garble deveaś -> deveś (3) ----
  ['deveaś', 'deveś', 3],
  // ---- dray -> dravy (GLOBAL, 5; balidraye/alaṅkāradrayeṣu×2/drayāṇi/tattaddrayaiḥ) ----
  ['dray', 'dravy', 5],
  // ---- patne -> patane (GLOBAL, 4; b36) ----
  ['patne', 'patane', 4],
  // ---- dropped word-final / gerund a ----
  ['kṛtva utsavaṃ', 'kṛtvā utsavaṃ', 1],                  // b4
  ['kṛtva, ajñānād', 'kṛtvā, ajñānād', 1],                // b5
  ['uddhṛty ', 'uddhṛtya ', 2],                           // b30,b32
  ['alaṅkṛty ', 'alaṅkṛtya ', 1],                         // b33
  ['saṃsnāpy,', 'saṃsnāpya,', 1],                         // b38
  // ---- vowel-length / word slips (IAST; Deva primary) ----
  ['uktāmāse', 'uktamāse', 1],                            // b5 header
  ['arthālobhād', 'arthalobhād', 1],                      // b5
  ['puruṣusūktaṃ', 'puruṣasūktaṃ', 1],                    // b6
  ['caurādyapahṛte', 'corādyapahṛte', 1],                 // b12 (Deva+mUlam cora)
  ['saura, saumyaṃ', 'sauraṃ, saumyaṃ', 1],               // b13 dropped anusvāra
  ['āgneyaṃ, bhūmidevatyaṃ', 'āgneyam, bhūmidevatyaṃ', 1],// b18 (Deva आग्नेयम्)
  ['āgneyaṃ, brāhmaṃ', 'āgneyam, brāhmaṃ', 1],            // b39 (Deva आग्नेयम्)
  ['tadutsavādhidaivatyaṃ', 'tadutsavādhidevatyaṃ', 1],   // b20 (Deva देवत्यं)
  ['śuddhoadakaiḥ', 'śuddhodakaiḥ', 2],                   // b16,b30
  ['uktākāle', 'uktakāle', 1],                            // b37 header
  ['varṣādhārā', 'varṣadhārā', 2],                        // b37,b38
  ['vīthyaṃntare', 'vīthyantare', 1],                     // b38 stray anusvāra
  ['anuktāsthāne', 'anuktasthāne', 1],                    // b23
  ['proṣya', 'prokṣya', 1],                               // b28
  ['tīrthasnānākāle', 'tīrthasnānakāle', 2],              // b45 header+body
  ['śayanā&#39;bhave', 'śayanā&#39;bhāve', 1],             // b44 header abhave->abhāve
];

const refs = [];
verses.forEach(b => { refs.push([b, 'sanskrit']); refs.push([b, 'iast']); });
let applied = 0;
for (const [from, to, exp] of FIXES) {
  let n = 0;
  for (const [b, f] of refs) n += (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  for (const [b, f] of refs) if (b[f]) b[f] = b[f].split(from).join(to);
  applied += n;
}

let all = ''; refs.forEach(([b,f]) => { all += (b[f]||'') + '\n'; });
const allLatin = all.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (all.match(/x/g)||[]).length,
  'residual ou': (allLatin.match(/ou/g)||[]).length,
  'residual ō/ē': (allLatin.match(/[ōē]/g)||[]).length,
  'residual deveaś': (all.match(/deveaś/g)||[]).length,
  'residual dray(no v)': (all.match(/dray(?!v)/g)||[]).length,
  'residual kṣen/wrong-prefix': (all.match(/viṣvakṣen|vaiṣvakṣen/g)||[]).length,
  'residual deva व्याहती(no ृ)': (all.match(/व्याहती/g)||[]).length,
  'residual backtick': (all.match(/`/g)||[]).length,
};
console.log(JSON.stringify(chk, null, 1));
for (const k of Object.keys(chk)) if (k.startsWith('residual') && chk[k]) throw new Error('residual defect: ' + k);
verses.forEach((b,i) => { for (const f of ['sanskrit','iast']) {
  const v = b[f]||'';
  if ((v.match(/<p>/g)||[]).length !== (v.match(/<\/p>/g)||[]).length) throw new Error(`<p> unbalanced ${f} v${i}`);
  if ((v.match(/<strong>/g)||[]).length !== (v.match(/<\/strong>/g)||[]).length) throw new Error(`<strong> unbalanced ${f} v${i}`);
}});
console.log('markup balanced.');
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
