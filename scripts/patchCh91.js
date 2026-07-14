// ch91 (Hṛt-padma-madhya-dhyānam — meditation on the Lord in the heart-lotus: the 12-aṅgula lotus
// risen from the kanda with 8 aṣṭa-siddhi petals + Prakṛti pericarp + Vidyā filaments, blossoming
// upward by prāṇāyāma; the inner viśvārci fire & its slender golden flame [Mahānārāyaṇa-Up.]; the
// molten-gold four-armed Viṣṇu within; Śrī/Bhū consorts; Ṛgvedic authority for daily viṣṇv-arcana)
// vs mUlam 091_hRtpadmamadhyadhyAnam.md. chapters[90], 11 blocks: prose intro b1/b2, section bands
//   b3/b5/b7/b9, verse b4/b6 (pattern-b: inline-em IAST in sanskrit, iast EMPTY), editorial Glossary
//   b8 / Typo-table b10 LEFT untouched. English per-block ALIGNED & UNTOUCHED.
//
// DEFECT 1 (systematic, ch86-90 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs used
//   INCONSISTENTLY — normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none.
// DEFECT 2: 'x' used for BOTH ख AND क्ष (mapped per the Deva):
//   ख → b4 adhomuxaṃ/ūrdhvamuxaṃ/viśvatomuxaḥ (मुख);  क्ष → b4 padmāxaḥ (पद्माक्षः), b6 daxiṇ/caxuṣā.
//
// TARGETED Deva↔IAST slip: b4 vahnīśikhā→vahniśikhā (spurious long ī; Deva वह्निशिखा, mUlam+typo-table).
//
// STRUCTURAL: ch91 had NO colophon block (mUlam has one; the Typo-table documents resolving it; ch82-90
//   neighbours display one). INSERTED a colophon verse after b6 (before the Glossary), ch86/87 format,
//   keeping mUlam's distinctive note "(मातृकान्तरे पटलसमाप्तिर्नास्ति)" [the other MS lacks a chapter-end].
//   Block count 11→12.
//
// LEFT as editorial (Deva=IAST cohere; mUlam differs): reader इत्यष्टदलोपेतं (mUlam अष्टैश्वर्यदलोपेतं),
//   सुषुम्नानाड्यन्तं (mUlam सुज्ञाननालम्); hyphenation of prakṛtyātmaka-/vidyākēsara-; the mojibake ण in the
//   b6 ENGLISH gloss "tadviṣ<ण>ōḥ" (english is untouchable); apparatus blocks (Glossary/Typo-table).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[90];
if (ch.number !== 91) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;
if (B.length !== 11) throw new Error('expected 11 blocks, got ' + B.length);

// (1) GLOBAL ō→o, ē→e across ALL verse blocks' sanskrit+iast (never english)
let go = 0, ge = 0;
B.forEach((b) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) {
    const v = b[f]; if (!v) continue;
    const no = (v.match(/ō/g) || []).length, ne = (v.match(/ē/g) || []).length;
    if (no) b[f] = b[f].split('ō').join('o');
    if (ne) b[f] = b[f].split('ē').join('e');
    go += no; ge += ne;
  }
});
console.log('global ō→o:', go, '| global ē→e:', ge);

// (2) targeted (post-global) — all in the sanskrit field (pattern-b)
function rep(bi, f, from, to, exp) {
  const b = B[bi];
  if (!b || b.type !== 'verse') throw new Error('block ' + bi + ' not a verse');
  const n = (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b${bi}.${f} "${from}": expected ${exp}, found ${n}`);
  b[f] = b[f].split(from).join(to);
}
// b4
rep(4, 'sanskrit', 'adhomuxaṃ', 'adhomukhaṃ', 1);          // ख (अधोमुखं)
rep(4, 'sanskrit', 'ūrdhvamuxaṃ', 'ūrdhvamukhaṃ', 1);      // ख (ऊर्ध्वमुखं)
rep(4, 'sanskrit', 'viśvatomuxaḥ', 'viśvatomukhaḥ', 1);    // ख (विश्वतोमुखः)
rep(4, 'sanskrit', 'padmāxaḥ', 'padmākṣaḥ', 1);            // क्ष (पद्माक्षः)
rep(4, 'sanskrit', 'vahnīśikhā', 'vahniśikhā', 1);         // spurious ī (वह्निशिखा)
// b6
rep(6, 'sanskrit', 'daxiṇ', 'dakṣiṇ', 1);                 // क्ष (दक्षिण)
rep(6, 'sanskrit', 'caxuṣā', 'cakṣuṣā', 1);               // क्ष (चक्षुषा)

// residual check: no ō/ē/x/ou in any verse sanskrit/iast (english untouched)
B.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) {
    const v = b[f]; if (!v) continue;
    for (const bad of ['ō', 'ē', 'x']) if (v.includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
    if (/ou/.test(v)) throw new Error(`residual ou in b${bi}.${f}`);
  }
});
console.log('no residual ō/ē/x/ou in verse sanskrit/iast.');

// (3) INSERT colophon after b6 (index 7), before the Glossary
if (B[6].num !== 2) throw new Error('b6 not the worship verse');
if (B[7].type !== 'section') throw new Error('b7 not the Glossary section');
const colophon = {
  type: 'verse',
  label: 'Colophon',
  sanskrit: '<blockquote>\n<p><strong>इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे हृत्पद्ममध्यध्यानं नाम एकनवतितमः पटलः ॥९१॥ (मातृकान्तरे पटलसमाप्तिर्नास्ति)</strong></p>\n</blockquote>\n',
  iast: '<blockquote>\n<p><strong>iti śrīvaikhānase marīciprokte vimānārcanākalpe hṛtpadmamadhyadhyānaṃ nāma ekanavatitamaḥ paṭalaḥ ||91|| (mātṛkāntare paṭalasamāptirnāsti)</strong></p>\n</blockquote>\n',
  english: '<ul>\n<li><strong>Colophon:</strong> Thus ends the Ninety-First Chapter, named <em>Hṛt-padma-madhya-dhyānam</em> (Meditation in the Center of the Heart-Lotus), in the <em>Vimānārcanākalpa</em> declared by Sage Marīci in the Śrī Vaikhānasa tradition.</li>\n</ul>\n',
  text: '> **इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे हृत्पद्ममध्यध्यानं नाम एकनवतितमः पटलः ॥९१॥ (मातृकान्तरे पटलसमाप्तिर्नास्ति)**\n> **iti śrīvaikhānase marīciprokte vimānārcanākalpe hṛtpadmamadhyadhyānaṃ nāma ekanavatitamaḥ paṭalaḥ ||91|| (mātṛkāntare paṭalasamāptirnāsti)**\n*   **Colophon:** Thus ends the Ninety-First Chapter, named *Hṛt-padma-madhya-dhyānam* (Meditation in the Center of the Heart-Lotus), in the *Vimānārcanākalpa* declared by Sage Marīci in the Śrī Vaikhānasa tradition.',
  colophon: true,
  num: null,
};
B.splice(7, 0, colophon);
console.log('inserted colophon; block count now', B.length);

// markup balance
B.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) {
    const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length;
      const c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
    }
  }
});
console.log('markup balanced.');

if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
