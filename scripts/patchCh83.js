// ch83 (Praṇava-svarūpam — the cosmic/phonetic nature & form of the Praṇava [Om]) reconciliation vs
// mUlam 083_praNavasvarUpam.md. chapters[82], 12 blocks: prose intro b1/b2, section bands b3/b7,
// pattern-a verse b4/b5/b6 (separate iast) + pattern-b verse b8 (the big Praṇava-puruṣa cosmic-anatomy
// block; inline-em IAST in sanskrit, iast field EMPTY) + editorial prose b9 Glossary / b10 Typo-table /
// b11 Bibliography LEFT untouched. English per-block ALIGNED & UNTOUCHED.
//
// 12 fixes across 2 fields (b6.iast, b8.sanskrit):
//   b6 IAST saṃyuktamp→saṃyuktam : spurious trailing p (Deva संयुक्तम्; cf ch18/78 spurious-consonant slips).
//   b8 x-artifacts — handled TARGETED (NOT a blind global x→kṣ) because नख "nails" needs kh, not kṣ:
//     sahasrāxaḥ→sahasrākṣaḥ (Deva सहस्राक्षः क्ष), caxuṣī→cakṣuṣī (चक्षुषी), naxatrāṇi→nakṣatrāṇi (नक्षत्राणि),
//     naxāḥ→nakhāḥ ×2 (Deva नखाः "nails", ख=kh — the ch76 duḥkha-type exception).
//   b8 ūrdhvalingaḥ→ūrdhvaliṅgaḥ : ṅ diacritic slip in the "(or …)" variant (Deva ऊर्ध्वलिङ्गः).
//   b8 global ou→au (scoped to b8.sanskrit): karṇou/aśvinou/oṣṭhou/vṛṣaṇou/mitrāvaruṇou → au.
//
// PLUS: inserted Colophon (ABSENT from reader — b8 ends at vijñāyate, next block is Glossary) at
// index 9, ch74/77/80/81/82 convention; name follows mUlam colophon (प्रणवस्वरूपं नाम / Praṇava-svarūpam).
//
// NOTE: block 8's UNTOUCHABLE english field retains the same x/ou artifacts inside its parenthetical
// IAST glosses (sahasrāxaḥ, caxuṣī, oṣṭhou, …) — LEFT per the never-touch-English rule (ch72 precedent);
// surfaced to user, not fixed. The Deva/IAST in the sanskrit field are now correct.
//
// LEFT as editorial/benign (Deva=IAST cohere; mUlam differs or is heavily rephrased): b4 अथातः/athāto
// visarga-sandhi (benign, cf ch72-82); many "(or …)" variant notes NOT mirrored into IAST (विष्णु-ब्रह्म-हराः,
// अङ्गानि, तनुः, रोमाणः, रोमाणि) — cf ch81 "(or apare)"; सहस्रोरुः (mUlam सहस्रोदरः), whole cosmic-anatomy
// list rewritten vs mUlam; the inline "(Taittiriya Aranyaka 10.64)" citation in b5.sanskrit Deva.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[82];
if (ch.number !== 83) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount] — targeted (run BEFORE the scoped ou pass)
const FIXES = [
  [6, 'iast',     'saṃyuktamp', 'saṃyuktam',   1], // spurious p (Deva संयुक्तम्)
  [8, 'sanskrit', 'sahasrāxaḥ', 'sahasrākṣaḥ',  1], // x→kṣ (सहस्राक्षः)
  [8, 'sanskrit', 'caxuṣī',     'cakṣuṣī',      1], // x→kṣ (चक्षुषी)
  [8, 'sanskrit', 'naxatrāṇi',  'nakṣatrāṇi',   1], // x→kṣ (नक्षत्राणि)
  [8, 'sanskrit', 'naxāḥ',      'nakhāḥ',       2], // x→kh! (नखाः "nails")
  [8, 'sanskrit', 'ūrdhvalingaḥ','ūrdhvaliṅgaḥ',1], // ṅ slip (ऊर्ध्वलिङ्गः, variant)
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

// global ou→au scoped to b8.sanskrit (all 5 are diphthong au; no Latin/English in this field)
{
  const b = ch.blocks[8];
  const no = (b.sanskrit.match(/ou/g) || []).length;
  if (no !== 5) throw new Error('b8.sanskrit ou expected 5, found ' + no);
  b.sanskrit = b.sanskrit.split('ou').join('au');
  console.log('b8 ou→au:', no);
}

// --- Insert Colophon (mUlam: इति श्रीवैखानसे ... प्रणवस्वरूपं नाम त्र्यशीतितमः पटलः ॥ ८३ ॥) ---
const COL_INDEX = 9;
if (ch.blocks[COL_INDEX].type !== 'prose') throw new Error('expected prose (Glossary) at index ' + COL_INDEX);
const hasCol = ch.blocks.some(b => b.colophon || /इति श्रीवैखानसे|iti śrī-vaikhānase/.test((b.sanskrit||'')+(b.iast||'')));
if (!hasCol) {
  ch.blocks.splice(COL_INDEX, 0, {
    type: 'verse', label: 'Colophon',
    sanskrit: '<blockquote>\n<p>(इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे प्रणवस्वरूपं नाम त्र्यशीतितमः पटलः ॥८३॥)</p>\n</blockquote>\n',
    iast: '<blockquote>\n<p>(iti śrī-vaikhānase marīciprokte vimānārcanākalpe praṇavasvarūpaṃ nāma tryaśītitamaḥ paṭalaḥ ||83||)</p>\n</blockquote>\n',
    english: '<ul>\n<li><strong>Colophon:</strong> (Thus ends the Eighty-third Chapter, titled <em>“The Nature and Form of the Praṇava (Om)”</em> (Praṇava-svarūpam), in the <em>Vimānārcanākalpa</em> of the <em>Vaikhānasa</em> school, compiled by Sage Marīci.)</li>\n</ul>\n',
    text: '> (इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे प्रणवस्वरूपं नाम त्र्यशीतितमः पटलः ॥८३॥)\n> (iti śrī-vaikhānase marīciprokte vimānārcanākalpe praṇavasvarūpaṃ nāma tryaśītitamaḥ paṭalaḥ ||83||)\n*   **Colophon:** (Thus ends the Eighty-third Chapter, titled *“The Nature and Form of the Praṇava (Om)”* (Praṇava-svarūpam), in the *Vimānārcanākalpa* of the *Vaikhānasa* school, compiled by Sage Marīci.)',
    colophon: true, num: null,
  });
  console.log('colophon inserted at', COL_INDEX, '| new block count:', ch.blocks.length);
} else console.log('colophon already present.');

// residual checks in the fields we edited (must be 0)
{
  const sk = ch.blocks[8].sanskrit.replace(/<[^>]+>/g,' ');
  const resid = { b8x:(sk.match(/x/g)||[]).length, b8ou:(sk.match(/ou/g)||[]).length,
    saṃyuktamp:(ch.blocks[6].iast.match(/saṃyuktamp/g)||[]).length };
  console.log(JSON.stringify(resid));
  for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);
}

// markup balance
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
