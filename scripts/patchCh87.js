// ch87 (Vaikuṇṭha-lakṣaṇam — the supreme Vaiṣṇava realm above the hiraṇmaya-maṇḍa: the four
// Viṣṇu-worlds Āmoda/Pramoda/Sammoda/Vaikuṇṭha & their forms Viṣṇu/Mahāviṣṇu/Sadāviṣṇu/Nārāyaṇa;
// the Lord's supremacy & creation by His own will [svalīlayā]; the birth of four-faced Brahmā from
// Nārāyaṇa's navel-lotus at pralaya) vs mUlam 087_vaikuNThalaxaNam.md. chapters[86], 14 blocks:
//   prose intro b1/b2, section bands b3/b5/b7, verse b4/b6 (pattern-b: inline-em IAST in sanskrit,
//   iast EMPTY) + verse b8 (pattern-a: separate sanskrit/iast) + editorial Glossary b9/b10,
//   Typo-table b11/b12, Bibliography b13 LEFT untouched. English per-block ALIGNED & UNTOUCHED.
//
// DEFECT 1 (systematic, the ch86/ch80/ch83 pattern): the verse IAST is riddled with NON-STANDARD
//   ō / ē macron glyphs (āmōdaḥ, pramōdaḥ, dēvair, lōkē, tōraṇa, gōpura, hēmamaya, vyōman, bhavēt,
//   caturmukhasyōtpattiḥ, ēkadā, brahmōdbhūtō, mahēśvara, sṛjēya, vāyōragniḥ, …) used INCONSISTENTLY
//   beside plain o/e — OCR/translit artifacts, not a convention (reader-wide standard = plain o/e).
//   NORMALIZED ō→o, ē→e in verse sanskrit+iast ONLY (never english — untouchable glosses keep their
//   own ō/ē per the ch83 rule). Scoped so Deva (no ō/ē) is untouched.
// DEFECT 2: 'x' used for क्ष (banned residual): b4 anabhilaxyaṃ (अनभिलक्ष्यं)→anabhilakṣyaṃ;
//   b6 sisṛxor (सिसृक्षोः)→sisṛkṣor.
//
// TARGETED Deva↔IAST slips (mUlam-confirmed, Deva & IAST brought into agreement):
//   b4 Deva सर्वेषामण्डानाम्युपरि→सर्वेषामण्डानामुपरि (spurious य्; IAST+English already read -nāmupari);
//   b4 IAST amṛtajalātaraṅga→amṛtajalataraṅga (spurious ā; Deva जलतरङ्ग);
//   b4 IAST parijanairyutaṃ→parijanaiḥ yutaṃ (padaccheda mirror; Deva परिजनैः युतं split w/ visarga);
//   b6 IAST svalīlayēva→svalīlayaiva (the ē is really ऐ; Deva स्वलीलयैव = svalīlayā+eva);
//   b6 IAST oṣadhībhya'nnam→oṣadhībhyo'nnam (dropped o; Deva ओषधीभ्योऽन्नम्).
//
// STRUCTURAL: ch87 had NO colophon block (mUlam has one; editor's Typo-table + Bibliography document
//   resolving it; every neighbouring ch 82-86 displays a colophon). INSERTED a colophon verse block
//   after b8 (before the Glossary), matching the ch86 house format; its English "thus ends" line is
//   NEW (adding, not altering). Block count 14→15.
//
// LEFT as editorial (Deva=IAST=English cohere; mUlam differs): the world ORDER आमोद/प्रमोद/सम्मोद
//   (mUlam आमोद/सम्मोद/प्रमोद) — reader internally consistent throughout; the Typo-table's own residual
//   नाम्युपरि cell (apparatus documentation, not verse — apparatus blocks LEFT untouched per ch86).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[86];
if (ch.number !== 87) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;
if (B.length !== 14) throw new Error('expected 14 blocks, got ' + B.length);

// ---- helper: guarded replace on a field ----
function rep(bi, f, from, to, exp) {
  const b = B[bi];
  if (!b || b.type !== 'verse') throw new Error('block ' + bi + ' not a verse');
  const n = (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b${bi}.${f} "${from}": expected ${exp}, found ${n}`);
  b[f] = b[f].split(from).join(to);
  return n;
}

// (1) Deva targeted: remove spurious य् in b4
rep(4, 'sanskrit', 'सर्वेषामण्डानाम्युपरि', 'सर्वेषामण्डानामुपरि', 1);

// (2) IAST targeted that MUST precede global ē→e: svalīlayēva (ē is really ऐ) → svalīlayaiva
rep(6, 'sanskrit', 'svalīlayēva', 'svalīlayaiva', 1);

// (3) GLOBAL ō→o, ē→e, scoped to verse sanskrit+iast ONLY (never english)
let go = 0, ge = 0;
for (const bi of [4, 6, 8]) {
  for (const f of ['sanskrit', 'iast']) {
    const v = B[bi][f];
    if (!v) continue;
    const no = (v.match(/ō/g) || []).length, ne = (v.match(/ē/g) || []).length;
    if (no) B[bi][f] = B[bi][f].split('ō').join('o');
    if (ne) B[bi][f] = B[bi][f].split('ē').join('e');
    go += no; ge += ne;
  }
}
console.log('global ō→o:', go, '| global ē→e:', ge);

// (4) post-global targeted IAST fixes
rep(4, 'sanskrit', 'anabhilaxyaṃ', 'anabhilakṣyaṃ', 1);      // x→kṣ (अनभिलक्ष्यं)
rep(4, 'sanskrit', 'amṛtajalātaraṅga', 'amṛtajalataraṅga', 1); // spurious ā (जलतरङ्ग)
rep(4, 'sanskrit', 'parijanairyutaṃ', 'parijanaiḥ yutaṃ', 1);  // padaccheda mirror (परिजनैः युतं)
rep(6, 'sanskrit', 'sisṛxor', 'sisṛkṣor', 1);                  // x→kṣ (सिसृक्षोः)
rep(6, 'sanskrit', 'dhībhya&#39;nnam', 'dhībhyo&#39;nnam', 1);  // dropped o (ओषधीभ्योऽन्नम्)

// ---- residual check: no ō/ē/x/ou in verse sanskrit+iast (english left untouched) ----
for (const bi of [4, 6, 8]) {
  for (const f of ['sanskrit', 'iast']) {
    const v = B[bi][f]; if (!v) continue;
    for (const bad of ['ō', 'ē', 'x']) if (v.includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
    if (/ou/.test(v)) throw new Error(`residual ou in b${bi}.${f}`);
  }
}
console.log('no residual ō/ē/x/ou in verse sanskrit/iast.');

// ---- (5) INSERT colophon block after b8 (index 9), before the Glossary ----
if (B[8].num !== 3) throw new Error('b8 not the Brahmā verse');
if (B[9].type !== 'section') throw new Error('b9 not the Glossary section');
const colophon = {
  type: 'verse',
  label: 'Colophon',
  sanskrit: '<blockquote>\n<p><strong>इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे वैकुण्ठलक्षणं नाम सप्ताशीतितमः पटलः ॥८७॥ (मातृकान्तरे ८१)</strong></p>\n</blockquote>\n',
  iast: '<blockquote>\n<p><strong>iti śrīvaikhānase marīciprokte vimānārcanākalpe vaikuṇṭhalakṣaṇaṃ nāma saptāśītitamaḥ paṭalaḥ ||87|| (mātṛkāntare 81)</strong></p>\n</blockquote>\n',
  english: '<ul>\n<li><strong>Colophon:</strong> Thus ends the Eighty-Seventh Chapter, named <em>Vaikuṇṭha-lakṣaṇam</em> (Description of the Supreme Abode Vaikuṇṭha), in the <em>Vimānārcanākalpa</em> declared by Sage Marīci in the Śrī Vaikhānasa tradition.</li>\n</ul>\n',
  text: '> **इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे वैकुण्ठलक्षणं नाम सप्ताशीतितमः पटलः ॥८७॥ (मातृकान्तरे ८१)**\n> **iti śrīvaikhānase marīciprokte vimānārcanākalpe vaikuṇṭhalakṣaṇaṃ nāma saptāśītitamaḥ paṭalaḥ ||87|| (mātṛkāntare 81)**\n*   **Colophon:** Thus ends the Eighty-Seventh Chapter, named *Vaikuṇṭha-lakṣaṇam* (Description of the Supreme Abode Vaikuṇṭha), in the *Vimānārcanākalpa* declared by Sage Marīci in the Śrī Vaikhānasa tradition.',
  colophon: true,
  num: null,
};
B.splice(9, 0, colophon);
console.log('inserted colophon; block count now', B.length);

// ---- markup balance across all verse blocks ----
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
