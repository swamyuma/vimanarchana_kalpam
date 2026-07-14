// ch85 (Niṣkala-vidhiḥ / Tattvajñānopadeśa — the sages ask Marīci for tattva-jñāna-yoga; definition of
// "tattva" as the nature of Nārāyaṇa; the niṣkala [unmanifest, attributeless, transcendent] aspect of
// Brahman, illustrated by ghee-in-milk etc. and a chain of Upaniṣadic negations) vs mUlam
// 085_niShkalavidhiH.md. chapters[84], 13 blocks: prose intro b1/b2, section bands b3/b8, verse
//   b4/b5/b6/b7 (pattern-a: separate iast) + b9 (pattern-b: inline-em IAST in sanskrit, iast EMPTY) +
//   editorial prose b10 Glossary / b11 Typo-table / b12 Bibliography LEFT untouched. A philosophical
//   "documented" chapter; the reader's Deva is heavily cleaned/rephrased vs the corrupt run-together
//   mUlam — reconciled Deva↔IAST within the reader, only genuine slips + the x-artifacts fixed.
//   English per-block ALIGNED & UNTOUCHED (0 english diffs). VERY CLEAN.
//
// TARGETED fixes (run BEFORE the global x pass):
//   b5 Deva श्रोतुद्→श्रोतुम् : "to hear" (śrotum); द्→म् corruption. IAST śrotum + mUlam श्रोतुम् confirm.
//   b5 IAST saṅxapeṇoktaṃ→saṅkṣepeṇoktaṃ : Deva सङ्क्षेपेणोक्तं — x→kṣ AND a→e (saṅkṣepa "in brief";
//     "saṅkṣapa" is a non-word); done targeted so the vowel is caught, not just the x.
//   b9 IAST antarbahisca→antarbahiśca ×2 : Deva अन्तर्बहिश्च (bahis+ca → bahiś-ca, palatal श्च); the IAST
//     dental "sca" is an s→ś slip (both occurrences: the descriptive clause + the Nārāyaṇa śruti quote).
//
// GLOBAL x→kṣ (scoped to verse sanskrit+iast ONLY, never english): after the targeted saṅxapeṇoktaṃ fix,
//   the remaining 4 x are all plain kṣ — b5.iast samīxya→samīkṣya, b6.iast vaxye→vakṣye,
//   b9.sanskrit susūxmatvād→susūkṣmatvād + sūxma→sūkṣma (no नख/दुःख kh-cases). ou-count is 0 in this chapter.
//
// PLUS: Colophon ABSENT from reader (verse ends at b9 vijñāyate; next is Glossary b10) — INSERTED at
//   index 10, ch74/77/80/81/82/83/84 convention. Name = mUlam निष्कलविधिः / Niṣkala-vidhiḥ (differs from
//   the reader's descriptive b0 title Tattvajñānopadeśa-Niṣkala-vidhiḥ).
//
// LEFT as editorial/benign (Deva=IAST cohere; mUlam differs or is heavily rephrased): b5 "(or क्रिया-मार्गः)"
//   variant (mirrored in both, fine); b9 the whole negation-chain reworded vs mUlam (निरञ्जनः for mUlam
//   निराद्यन्तः; सर्वेश्वरः for सर्वशः; ध्येयः for दृश्यादृश्यः; उपलब्धव्यं विभुं for उपलब्ध...) — reader Deva=IAST=English
//   cohere & the Glossary endorses (e.g. Nirañjana, Vibhū entries), so LEFT; the "(or …)" & bracketed
//   Upaniṣad citations in the Deva; the b2-prose "Pañcāśītitemaḥ"/"ākaśāśarīraṃ" typos (prose, untouchable).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[84];
if (ch.number !== 85) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount] — targeted (run BEFORE the global x pass)
const FIXES = [
  [5, 'sanskrit', 'श्रोतुद्',        'श्रोतुम्',         1], // द्→म् (śrotum "to hear")
  [5, 'iast',     'saṅxapeṇoktaṃ',  'saṅkṣepeṇoktaṃ',  1], // x→kṣ + a→e (Deva सङ्क्षेपेणोक्तं)
  [9, 'sanskrit', 'antarbahisca',   'antarbahiśca',    2], // s→ś (Deva अन्तर्बहिश्च palatal श्च)
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

// GLOBAL x→kṣ and ou→au, scoped to sanskrit + iast of verse blocks only (NEVER english)
let gx = 0, gou = 0;
ch.blocks.forEach((b) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) {
    if (!b[f]) continue;
    const nx = (b[f].match(/x/g) || []).length;
    const nou = (b[f].match(/ou/g) || []).length;
    if (nx) b[f] = b[f].split('x').join('kṣ');
    if (nou) b[f] = b[f].split('ou').join('au');
    gx += nx; gou += nou;
  }
});
console.log('global x→kṣ:', gx, '| global ou→au:', gou);

// residual check: no x / ou left in any verse sanskrit/iast field (english left untouched)
ch.blocks.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) {
    if (!b[f]) continue;
    if (/x/.test(b[f])) throw new Error(`residual x in b${bi}.${f}`);
    if (/ou/.test(b[f])) throw new Error(`residual ou in b${bi}.${f}`);
  }
});
console.log('no residual x/ou in verse sanskrit/iast.');

// --- Insert Colophon (mUlam: इति श्रीवैखानसे ... निष्कलविधिर्नाम पञ्चाशीतितमः पटलः ॥ ८५ ॥) ---
const COL_INDEX = 10;
if (ch.blocks[COL_INDEX].type !== 'prose') throw new Error('expected prose (Glossary) at index ' + COL_INDEX);
const hasCol = ch.blocks.some(b => b.colophon || /इति श्रीवैखानसे|iti śrī-vaikhānase/.test((b.sanskrit || '') + (b.iast || '')));
if (!hasCol) {
  ch.blocks.splice(COL_INDEX, 0, {
    type: 'verse', label: 'Colophon',
    sanskrit: '<blockquote>\n<p>(इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे निष्कलविधिर्नाम पञ्चाशीतितमः पटलः ॥८५॥)</p>\n</blockquote>\n',
    iast: '<blockquote>\n<p>(iti śrī-vaikhānase marīciprokte vimānārcanākalpe niṣkalavidhirnāma pañcāśītitamaḥ paṭalaḥ ||85||)</p>\n</blockquote>\n',
    english: '<ul>\n<li><strong>Colophon:</strong> (Thus ends the Eighty-fifth Chapter, titled <em>“The Rules on the Unmanifest [Brahman]”</em> (Niṣkala-vidhiḥ), in the <em>Vimānārcanākalpa</em> of the <em>Vaikhānasa</em> school, compiled by Sage Marīci.)</li>\n</ul>\n',
    text: '> (इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे निष्कलविधिर्नाम पञ्चाशीतितमः पटलः ॥८५॥)\n> (iti śrī-vaikhānase marīciprokte vimānārcanākalpe niṣkalavidhirnāma pañcāśītitamaḥ paṭalaḥ ||85||)\n*   **Colophon:** (Thus ends the Eighty-fifth Chapter, titled *“The Rules on the Unmanifest [Brahman]”* (Niṣkala-vidhiḥ), in the *Vimānārcanākalpa* of the *Vaikhānasa* school, compiled by Sage Marīci.)',
    colophon: true, num: null,
  });
  console.log('colophon inserted at', COL_INDEX, '| new block count:', ch.blocks.length);
} else console.log('colophon already present.');

// markup balance
ch.blocks.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) {
    const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
    }
  }
});
console.log('markup balanced.');

if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
