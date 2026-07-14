// ch74 (Ācārya-saṅkara-yogabhogādi-saṅkara-vidhiḥ) reconciliation vs mUlam
// 074_AchAryasankarayogabhogAdisankaravidhiH.md. Documented chapter: prose intro b1/b2 +
// section bands + verse blocks b4/b6/b11 (inline-em IAST in sanskrit) & b8/b9/b13/b14/b16
// (pattern-a separate iast). Editorial prose b17 Glossary / b18 Typo-table / b19 Bibliography
// LEFT untouched. English per-block already aligned & UNTOUCHED (verify: 0 english diffs).
// 9 targeted fixes (2 Deva, 7 IAST), all glyph/spelling/transliteration slips confirmed vs
// Deva↔IAST↔English three-way + mUlam. PLUS: inserted a Colophon block (absent from reader;
// mUlam has the paṭala colophon) at index 17, matching ch70-72 colophon convention.
// Padaccheda: chapter already thoroughly pre-split by the editor (long enumerations hyphenated,
// sandhi resolved); conservative pass adds NO further splits (would diverge from editor style).
// LEFT as editorial divergences from mUlam (Deva=IAST=English all consistent): b4 karṣaṇākāle
// (mUlam karṣaṇakāle), b4 bhrātaraṃ (mUlam naptāraṃ), b4 kuryāt (mUlam kārayet), b6 tannāma patre
// (mUlam tadrūpaṃ paṭe), b6 namasya (mUlam namaskṛtya), b6 paradhāmasu (mUlam prāpteṣu), b6
// tadanujñayā (mUlam tadvidhinā), b9 saṃyute (mUlam saṃyukte; saṃyuta is a valid form), b9 rewording,
// b11 snapana (mUlam snāpana), b13 mahad (mUlam mahattaro), b16 snapana (mUlam snāpana).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[73];
if (ch.number !== 74) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount, note]
const FIXES = [
  // b4 (inline-em verse §1)
  [4,  'sanskrit', 'विशेषाच्चनादीनि', 'विशेषार्चनादीनि', 1], // Deva र्च→च्च corruption (IAST viśeṣārcana + English "special worships" correct; mUlam विशेषार्चनादीनि)
  [4,  'sanskrit', 'tacchicyaṃ',      'tacchiṣyaṃ',      1], // IAST ṣy→cy (Deva तच्छिष्यं, English śiṣyaṃ)
  [4,  'sanskrit', 'praśicyaṃ',       'praśiṣyaṃ',       1], // IAST ṣy→cy (Deva प्रशिष्यं, English praśiṣyaṃ)
  // b8 (pattern-a §3 v1) title
  [8,  'iast',     'pratiṣṭhākāraṇe', 'pratiṣṭhākaraṇe', 1], // IAST spurious long ā (Deva प्रतिष्ठाकरणे = act of establishing, not "cause")
  // b9 (pattern-a §3 v2)
  [9,  'iast',     'vināśascet',      'vināśaścet',      1], // IAST s→ś (Deva विनाशश्चेत्)
  // b11 (inline-em §4)
  [11, 'sanskrit', 'sthānakāśana',    'sthānakāsana',    1], // IAST title ś→s (Deva स्थानकासन = sthānaka-āsana)
  [11, 'sanskrit', 'utsavamaśīnaṃ',   'utsavam āsīnaṃ',  1], // IAST aśīnaṃ→āsīnaṃ (Deva उत्सवम् आसीनं "seated")
  // b13 (pattern-a §5 v1) title
  [13, 'sanskrit', 'अवतारदीनां',      'अवतारादीनां',     1], // Deva title dropped ā (IAST avatārādīnāṃ + English "the various incarnations")
  // b16 (pattern-a §6 v1) title
  [16, 'iast',     'saṅkarye',        'sāṅkarye',        1], // IAST missing long ā (Deva साङ्कर्ये = sāṅkarya vṛddhi-deriv.)
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
console.log('targeted fixes applied:', applied);

// --- Insert Colophon block (mUlam: इति श्रीवैखानसे ... चतुस्सप्ततितमः पटलः ॥ ७४ ॥) ---
// Placed after the last content verse (b16) and before the editorial apparatus (b17 Glossary).
// Style matches ch70-72 (colophon:true, label 'Colophon', num null, parens per ch71/72).
const COL_INDEX = 17;
if (ch.blocks[COL_INDEX].type !== 'prose') throw new Error('expected prose (Glossary) at index ' + COL_INDEX);
const alreadyHasColophon = ch.blocks.some(b => b.colophon || /इति श्रीवैखानसे|iti śrī-vaikhānase/.test((b.sanskrit||'')+(b.iast||'')));
if (!alreadyHasColophon) {
  const colophon = {
    type: 'verse',
    label: 'Colophon',
    sanskrit: '<blockquote>\n<p>(इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे आचार्यसङ्कर-योगभोगादिसङ्कर-विधिर्नाम चतुःसप्ततितमः पटलः ॥७४॥)</p>\n</blockquote>\n',
    iast: '<blockquote>\n<p>(iti śrī-vaikhānase marīciprokte vimānārcanākalpe ācāryasaṅkara-yogabhogādisaṅkara-vidhir-nāma catuḥsaptatitamaḥ paṭalaḥ ||74||)</p>\n</blockquote>\n',
    english: '<ul>\n<li><strong>Colophon:</strong> (Thus ends the Seventy-fourth Chapter, titled <em>“The Rules concerning the Substitution of Priests, and the Mixing of the Yoga/Bhoga Paths and Icon Configurations”</em> (Ācārya-saṅkara-yogabhogādi-saṅkara-vidhiḥ), in the <em>Vimānārcanākalpa</em> of the <em>Vaikhānasa</em> school, compiled by Sage Marīci.)</li>\n</ul>\n',
    text: '> (इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे आचार्यसङ्कर-योगभोगादिसङ्कर-विधिर्नाम चतुःसप्ततितमः पटलः ॥७४॥)\n> (iti śrī-vaikhānase marīciprokte vimānārcanākalpe ācāryasaṅkara-yogabhogādisaṅkara-vidhir-nāma catuḥsaptatitamaḥ paṭalaḥ ||74||)\n*   **Colophon:** (Thus ends the Seventy-fourth Chapter, titled *“The Rules concerning the Substitution of Priests, and the Mixing of the Yoga/Bhoga Paths and Icon Configurations”* (Ācārya-saṅkara-yogabhogādi-saṅkara-vidhiḥ), in the *Vimānārcanākalpa* of the *Vaikhānasa* school, compiled by Sage Marīci.)',
    colophon: true,
    num: null,
  };
  ch.blocks.splice(COL_INDEX, 0, colophon);
  console.log('colophon inserted at index', COL_INDEX, '| new block count:', ch.blocks.length);
} else {
  console.log('colophon already present, skipping insert.');
}

// --- residual sanity checks on touched verse blocks ---
let all = ''; ch.blocks.forEach(b => { if (b.type === 'verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
const resid = {
  vishesacca: (all.match(/विशेषाच्चनादीनि/g)||[]).length,
  tacchicya: (lat.match(/tacchicyaṃ/g)||[]).length,
  prashicya: (lat.match(/praśicyaṃ/g)||[]).length,
  karane_long: (lat.match(/pratiṣṭhākāraṇe/g)||[]).length,
  vinasascet: (lat.match(/vināśascet/g)||[]).length,
  sthanakasha: (lat.match(/sthānakāśana/g)||[]).length,
  ashinam: (lat.match(/utsavamaśīnaṃ/g)||[]).length,
  avataradinam: (all.match(/अवतारदीनां/g)||[]).length,
};
console.log(JSON.stringify(resid));
for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);

// markup balance across ALL ch74 verse blocks (incl. new colophon)
ch.blocks.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit','iast','english']) {
    const v = b[f] || '';
    for (const t of ['p','em','strong','blockquote','ul','li','ol']) {
      const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
      if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
    }
  }
});
console.log('markup balanced.');

if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
