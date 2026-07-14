// ch84 (Sāvitrī-mantra-kalpa-vidhiḥ — the ritual science of the Sāvitrī/Gāyatrī mantra:
// cosmic form of the goddess, three-fold twilight dhyāna, 24-syllable varṇa-nyāsa on the body,
// per-syllable colors/deities/sin-cleansing fruits) vs mUlam 084_sAvitrImantrakalpavidhiH.md.
// chapters[83], 16 blocks: prose intro b1/b2, section bands b3/b5/b9/b11, verse blocks
//   b4/b10/b12 (pattern-b: inline-em IAST inside sanskrit, iast field EMPTY) +
//   b6/b7/b8 (pattern-a: separate iast) + editorial prose b13 Glossary / b14 Typo-table /
//   b15 Bibliography LEFT untouched. English per-block ALIGNED & UNTOUCHED.
//
// TARGETED fixes (run BEFORE the global x/ou passes):
//   b4 Deva पश्चिम्स्तृतीयः→पश्चिमस्तृतीयः : malformed halant म्+स्तृ (no vowel); IAST paścimastṛtīyaḥ confirms माs.
//   b4 IAST caturaśītitemaḥ→caturaśītitamaḥ : Deva चतुरशीतितमः (84th, -tama ordinal); te→ta slip.
//   b4 IAST gāyatriyāḥ→gāyatryāḥ : Deva गायत्र्याः (gen.); iya→ya (recurs ch78/79).
//   b4 IAST adhidevataṃ→adhidaivataṃ : Deva अधिदैवतं (dai); the ch82 de/dai class + mUlam अधिदैवतं.
//   b12 Deva पद्मशङ्काशं→पद्मसङ्काशं + IAST padmaśaṅkāśaṃ→padmasaṅkāśaṃ : श→स corruption (item14);
//     saṅkāśa "resembling" is the word (padma-śaṅkāśa is a non-word); confirmed by mUlam + the
//     chapter's own item22 शुद्धस्फटिक-सङ्काशं / śuddhasphaṭika-saṅkāśaṃ. SHARED Deva=IAST fix.
//   b12 IAST bhaxana→bhakṣaṇa ×2 (items 7 & 14) : Deva भक्षण has retroflex ण, so x→kṣ AND n→ṇ —
//     handled TARGETED before the global x→kṣ (which would leave the wrong dental "bhakṣana"); ch80 lesson.
//   b12 IAST bhūrbhuvahsvaḥ→bhūrbhuvaḥsuvaḥ : Deva भूर्भुवःसुवः — visarga ः written as plain h + missing u
//     (ch82 bhūrbhuvahsvarom class). IAST now = transliteration of the reader's Deva vyāhṛti.
//
// GLOBAL passes (scoped to verse sanskrit+iast ONLY, never english): x→kṣ, ou→au. After the targeted
//   bhaxana fix, every remaining x is plain kṣ (no नख/दुःख kh-cases in this chapter); every ou is au.
//
// PLUS: Colophon ABSENT from reader (verse ends at b12; next is Glossary b13) — INSERTED at index 13,
//   ch74/77/80/81/82/83 convention. Colophon name = mUlam सावित्रीमन्त्रकल्पविधिः / Sāvitrī-mantra-kalpa-vidhiḥ
//   (matches the reader's own b0 title this time).
//
// LEFT as editorial/benign (Deva=IAST cohere; mUlam differs or variant not mirrored):
//   b4 "(or वाणी)", "(or भूर्लोकाः)" and b10/b12 many "(or …)" variants NOT mirrored into IAST (cf ch81/83);
//   b10 item1 गुल्फे (or पादयोः) / gulpha-padayoḥ merge (English "ankles/feet" endorses);
//   items 19-23 word-final Deva ं vs IAST -kāram m (benign word-final m/ṃ, LEFT per ch72 precedent);
//   b12 item5 वह्निसवर्णं / vahnisavarṇaṃ (Deva=IAST; mUlam वह्निवर्णं "fire-colored" — savarṇa is a valid
//     word & English non-committal, LEFT).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[83];
if (ch.number !== 84) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount] — targeted (run BEFORE the global x/ou passes)
const FIXES = [
  [4,  'sanskrit', 'पश्चिम्स्तृतीयः',   'पश्चिमस्तृतीयः',    1], // Deva malformed halant
  [4,  'sanskrit', 'caturaśītitemaḥ',  'caturaśītitamaḥ',  1], // te→ta (Deva तमः)
  [4,  'sanskrit', 'gāyatriyāḥ',       'gāyatryāḥ',        1], // iya→ya (Deva गायत्र्याः)
  [4,  'sanskrit', 'adhidevataṃ',      'adhidaivataṃ',     1], // de→dai (Deva अधिदैवतं)
  [12, 'sanskrit', 'पद्मशङ्काशं',        'पद्मसङ्काशं',        1], // Deva श→स (item14)
  [12, 'sanskrit', 'padmaśaṅkāśaṃ',    'padmasaṅkāśaṃ',    1], // IAST mirror of above
  [12, 'sanskrit', 'bhaxana',          'bhakṣaṇa',         2], // x→kṣ AND n→ṇ (Deva भक्षण) — before global x
  [12, 'sanskrit', 'bhūrbhuvahsvaḥ',   'bhūrbhuvaḥsuvaḥ',  1], // visarga-h + missing u (Deva भूर्भुवःसुवः)
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

// residual check: no x / ou left in any verse sanskrit/iast field (english left untouched, may retain artifacts)
ch.blocks.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) {
    if (!b[f]) continue;
    if (/x/.test(b[f])) throw new Error(`residual x in b${bi}.${f}`);
    if (/ou/.test(b[f])) throw new Error(`residual ou in b${bi}.${f}`);
  }
});
console.log('no residual x/ou in verse sanskrit/iast.');

// --- Insert Colophon (mUlam: इति श्रीवैखानसे ... सावित्रीमन्त्रकल्पविधिर्नाम चतुरशीतितमः पटलः ॥ ८४ ॥) ---
const COL_INDEX = 13;
if (ch.blocks[COL_INDEX].type !== 'prose') throw new Error('expected prose (Glossary) at index ' + COL_INDEX);
const hasCol = ch.blocks.some(b => b.colophon || /इति श्रीवैखानसे|iti śrī-vaikhānase/.test((b.sanskrit || '') + (b.iast || '')));
if (!hasCol) {
  ch.blocks.splice(COL_INDEX, 0, {
    type: 'verse', label: 'Colophon',
    sanskrit: '<blockquote>\n<p>(इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे सावित्रीमन्त्रकल्पविधिर्नाम चतुरशीतितमः पटलः ॥८४॥)</p>\n</blockquote>\n',
    iast: '<blockquote>\n<p>(iti śrī-vaikhānase marīciprokte vimānārcanākalpe sāvitrīmantrakalpavidhirnāma caturaśītitamaḥ paṭalaḥ ||84||)</p>\n</blockquote>\n',
    english: '<ul>\n<li><strong>Colophon:</strong> (Thus ends the Eighty-fourth Chapter, titled <em>“The Rules of the Ritual Science of the Sāvitrī (Gāyatrī) Mantra”</em> (Sāvitrī-mantra-kalpa-vidhiḥ), in the <em>Vimānārcanākalpa</em> of the <em>Vaikhānasa</em> school, compiled by Sage Marīci.)</li>\n</ul>\n',
    text: '> (इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे सावित्रीमन्त्रकल्पविधिर्नाम चतुरशीतितमः पटलः ॥८४॥)\n> (iti śrī-vaikhānase marīciprokte vimānārcanākalpe sāvitrīmantrakalpavidhirnāma caturaśītitamaḥ paṭalaḥ ||84||)\n*   **Colophon:** (Thus ends the Eighty-fourth Chapter, titled *“The Rules of the Ritual Science of the Sāvitrī (Gāyatrī) Mantra”* (Sāvitrī-mantra-kalpa-vidhiḥ), in the *Vimānārcanākalpa* of the *Vaikhānasa* school, compiled by Sage Marīci.)',
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
