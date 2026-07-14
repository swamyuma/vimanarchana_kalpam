// ch71 (Punar-Bālālaya-vidhiḥ) reconciliation. Documented chapter: prose intro (b1,b2),
// interleaved sections, verse blocks (pattern-a with separate iast; b15,b17,b25,b27 inline-em
// iast-empty); editorial prose b34/b35(glossary)/b36(typo-table) LEFT untouched. English
// per-block ALIGNED (no realign). Fixes from compareCh71.js (script-separated diff).
// LEFT benign: hyphenation/padaccheda, sandhi t/d & ḥ/r, word-final m/ṃ, avagraha ऽ artifacts.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[70];
if (ch.number !== 71) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount]
const FIXES = [
  [11, 'iast', 'vināṣe', 'vināśe', 2],                                   // Deva विनाशे (ś)
  // b13: shared Deva+IAST corruption बेरा->वेरा, बेरं->वैरं (non-words; mUlam+English "bera/icon")
  [13, 'sanskrit', 'वेराच्छक्तिम्', 'बेराच्छक्तिम्', 1],
  [13, 'iast',     'verācchaktiṃ',  'berācchaktiṃ',  1],
  [13, 'sanskrit', 'वैरं',          'बेरं',          1],
  [13, 'iast',     'vairaṃ',        'beraṃ',         1],
  // b15 (inline) ś/ṣ slips + spurious च् in Deva
  [15, 'sanskrit', 'ekāṃṣam', 'ekāṃśam', 1],
  [15, 'sanskrit', 'dvyaṃṣaṃ', 'dvyaṃśaṃ', 2],
  [15, 'sanskrit', 'tribhāgāṃṣa-īkṣitam', 'tribhāgāṃśa-ikṣitam', 1],
  [15, 'sanskrit', 'च्छन्नं', 'छन्नं', 1],                                // Deva spurious leading च्
  // b17 (inline) header IAST spurious ā
  [17, 'sanskrit', 'dhruvāpīṭha', 'dhruvapīṭha', 1],                     // Deva ध्रुवपीठ (short a)
  // b21 mantra-citation IAST slips
  [21, 'iast', 'adbhhiḥ', 'adbhiḥ', 1],                                  // double-h typo
  [21, 'iast', 'saṃsṛjantām', 'saṃsṛjyantām', 1],                       // Deva संसृज्यन्ताम्
  // b27 (inline): shared garble अग्निं विसृज्य -> अमिविसृज्य; retroflex slip
  [27, 'sanskrit', 'अमिविसृज्य', 'अग्निं विसृज्य', 1],
  [27, 'sanskrit', 'amivisyjya', 'agniṃ visṛjya', 1],
  [27, 'sanskrit', 'maṇtreṇa', 'mantreṇa', 1],                          // dental न्त्र
  // b29 Deva typo व->द (dīpād dīpam iva)
  [29, 'sanskrit', 'दीपाद्वीपमिव', 'दीपाद्दीपमिव', 1],
];

let applied = 0;
for (const [bi, f, from, to, exp] of FIXES) {
  const b = ch.blocks[bi];
  if (!b || b.type !== 'verse') throw new Error('block ' + bi + ' not a verse');
  const n = (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b${bi}.${f} "${from}": expected ${exp}, found ${n}`);
  b[f] = b[f].split(from).join(to);
  applied += n;
}
console.log('applied:', applied);

// residual sanity
const resid = {
  'vināṣe': (ch.blocks[11].iast.match(/vināṣe/g)||[]).length,
  'वेरा/वैरं(b13 deva)': ((ch.blocks[13].sanskrit).match(/वेरा|वैरं/g)||[]).length,
  'verā/vairaṃ(b13 iast)': ((ch.blocks[13].iast).match(/verā|vairaṃ/g)||[]).length,
  'ṃṣ(b15)': ((ch.blocks[15].sanskrit).match(/ṃṣ/g)||[]).length,
  'च्छन्नं(b15)': ((ch.blocks[15].sanskrit).match(/च्छन्नं/g)||[]).length,
  'amivi/maṇtr(b27)': ((ch.blocks[27].sanskrit).match(/amivi|maṇtre|अमिवि/g)||[]).length,
  'दीपाद्वीप(b29)': ((ch.blocks[29].sanskrit).match(/दीपाद्वीप/g)||[]).length,
};
console.log(JSON.stringify(resid));
for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);
// markup balance on touched blocks
for (const bi of [11,13,15,17,21,27,29]) for (const f of ['sanskrit','iast']) {
  const v = ch.blocks[bi][f] || '';
  for (const t of ['p','em','strong','blockquote']) {
    const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
    if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f} (${o}/${c})`);
  }
}
console.log('markup balanced.');
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
