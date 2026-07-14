// ch77 (Tantra-saṅkarādi-sarvadoṣa-prāyaścitta-vidhiḥ — expiation for mixing worship systems &
// unspecified defects) reconciliation vs mUlam 077_sarvadoShaprAyashchittavidhiH.md. Documented
// chapter (16 blocks, chapters[76]): prose intro b1/b2, section bands, pattern-b verse
// b4/b6/b8/b10/b12 (inline-em IAST in sanskrit) + editorial prose b13 Glossary / b14 Typo-table /
// b15 Bibliography LEFT untouched. English per-block ALIGNED & UNTOUCHED (verify: 0 english diffs).
// 7 IAST fixes (all in the inline-em part of the sanskrit field): x→kṣ (dīxitair, ekāxarādi ×2),
// ou→au (abjāgnou ×2, vidhou, pauṇḍarīkāgnou), and a garbled token śatakaśaśair→śatakalaśair (b8;
// Deva शतकलशैः, -air is correct pre-voiced sandhi as in b12). Deva side clean throughout.
// PLUS: inserted the Colophon block (absent from reader; mUlam has the paṭala colophon) at index 13,
// matching ch70-74 convention (colophon:true, label 'Colophon', num null, parens per ch71/72/74).
// LEFT as editorial (Deva=IAST=English + glossary all cohere; mUlam differs): the reader reads
// आत्रेय/Ātreya (mUlam आग्नेय/Āgneya) and पाञ्चरात्रम् अपेयम् (mUlam आग्नेयम्) — a deliberate,
// self-consistent interpretation with its own glossary entry, NOT a transliteration slip; also
// नृपाणाम् "(or राष्ट्राणाम्)", शतकृत्वो (mUlam षट्कृत्वो), पूर्वोक्तेन (mUlam पुनस्तेन).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[76];
if (ch.number !== 77) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount]
const FIXES = [
  [4,  'sanskrit', 'abjāgnou',        'abjāgnau',        1], // ou→au (Deva अब्जाग्नौ)
  [6,  'sanskrit', 'dīxitair',        'dīkṣitair',       1], // x→kṣ (Deva दीक्षितैर्)
  [8,  'sanskrit', 'vidhou',          'vidhau',          1], // ou→au (Deva विधौ)
  [8,  'sanskrit', 'abjāgnou',        'abjāgnau',        1], // ou→au (Deva अब्जाग्नौ)
  [8,  'sanskrit', 'śatakaśaśair',    'śatakalaśair',    1], // garbled kaśaśa→kalaśa (Deva शतकलशैः; -air = pre-voiced sandhi)
  [10, 'sanskrit', 'pauṇḍarīkāgnou',  'pauṇḍarīkāgnau',  1], // ou→au (Deva पौण्डरीकाग्नौ)
  [10, 'sanskrit', 'ekāxarādi',       'ekākṣarādi',      1], // x→kṣ (Deva एकाक्षरादि)
  [12, 'sanskrit', 'ekāxarādi',       'ekākṣarādi',      1], // x→kṣ (Deva एकाक्षरादि)
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

// --- Insert Colophon block (mUlam: इति श्रीवैखानसे ... सप्तसप्ततितमः पटलः ॥ ७७ ॥) ---
// After last content verse (b12), before editorial apparatus (b13 Glossary). Style matches ch70-74.
const COL_INDEX = 13;
if (ch.blocks[COL_INDEX].type !== 'prose') throw new Error('expected prose (Glossary) at index ' + COL_INDEX);
const alreadyHasColophon = ch.blocks.some(b => b.colophon || /इति श्रीवैखानसे|iti śrī-vaikhānase/.test((b.sanskrit||'')+(b.iast||'')));
if (!alreadyHasColophon) {
  const colophon = {
    type: 'verse',
    label: 'Colophon',
    sanskrit: '<blockquote>\n<p>(इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे तन्त्रसङ्करादि-सर्वदोषप्रायश्चित्तविधिर्नाम सप्तसप्ततितमः पटलः ॥७७॥)</p>\n</blockquote>\n',
    iast: '<blockquote>\n<p>(iti śrī-vaikhānase marīciprokte vimānārcanākalpe tantrasaṅkarādi-sarvadoṣaprāyaścittavidhir-nāma saptasaptatitamaḥ paṭalaḥ ||77||)</p>\n</blockquote>\n',
    english: '<ul>\n<li><strong>Colophon:</strong> (Thus ends the Seventy-seventh Chapter, titled <em>“The Rules of Expiation for the Mixing of Worship Systems and all Unspecified Defects”</em> (Tantra-saṅkarādi-sarvadoṣa-prāyaścitta-vidhiḥ), in the <em>Vimānārcanākalpa</em> of the <em>Vaikhānasa</em> school, compiled by Sage Marīci.)</li>\n</ul>\n',
    text: '> (इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे तन्त्रसङ्करादि-सर्वदोषप्रायश्चित्तविधिर्नाम सप्तसप्ततितमः पटलः ॥७७॥)\n> (iti śrī-vaikhānase marīciprokte vimānārcanākalpe tantrasaṅkarādi-sarvadoṣaprāyaścittavidhir-nāma saptasaptatitamaḥ paṭalaḥ ||77||)\n*   **Colophon:** (Thus ends the Seventy-seventh Chapter, titled *“The Rules of Expiation for the Mixing of Worship Systems and all Unspecified Defects”* (Tantra-saṅkarādi-sarvadoṣa-prāyaścitta-vidhiḥ), in the *Vimānārcanākalpa* of the *Vaikhānasa* school, compiled by Sage Marīci.)',
    colophon: true,
    num: null,
  };
  ch.blocks.splice(COL_INDEX, 0, colophon);
  console.log('colophon inserted at index', COL_INDEX, '| new block count:', ch.blocks.length);
} else {
  console.log('colophon already present, skipping insert.');
}

// residual checks across ch77 verse fields
let all=''; ch.blocks.forEach(b=>{ if(b.type==='verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
const resid = { x:(lat.match(/x/g)||[]).length, ou:(lat.match(/ou/g)||[]).length, z:(lat.match(/z/g)||[]).length };
console.log(JSON.stringify(resid));
for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);

// markup balance on ALL ch77 verse blocks (incl. new colophon)
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
