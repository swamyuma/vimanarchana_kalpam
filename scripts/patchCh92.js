// ch92 (Nāḍī-nirūpaṇam / Nāḍī-cakra — the subtle-channel network: 72,000 nāḍīs from the kanda, the 14
// principal ones, the three primary [iḍā/piṅgalā/suṣumnā] with their solar/lunar/liberation roles, and
// the paths & terminations of the remaining eleven, ending with the aśvattha-leaf-vein metaphor) vs
// mUlam 092_nADInirUpaNam.md. chapters[91], 11 blocks: prose intro b1/b2, section bands b3/b5/b7/b9,
//   verse b4/b6 (pattern-b: inline-em IAST in sanskrit, iast EMPTY), editorial Glossary b8 / Typo-table
//   b10 LEFT untouched. English per-block ALIGNED & UNTOUCHED.
//
// DEFECT 1 (systematic, ch86-91 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs —
//   normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none.
// DEFECT 2: 'x' for क्ष (all क्ष this chapter, no ख): b4 vaxye (वक्ष्ये); b6 daxiṇ ×6 (दक्षिण).
//
// TARGETED Deva↔IAST slips (mUlam-confirmed):
//   b4 IAST suṣumnāiva→suṣumnaiva (Deva सुषुम्नैव, merged ai);
//   b4 Deva आसाम्रादौ→आसामादौ (spurious र; IAST āsāmādau + typo-table आसाम् आदौ);
//   b4 Deva अन्तर्गुता→अन्तर्गता (गुता typo for गत; IAST already vīṇādaṇḍāntargatā).
//
// STRUCTURAL: ch92 had NO colophon block (mUlam has one; Typo-table documents resolving it; ch82-91
//   neighbours display one). INSERTED a colophon verse after b6 (before the Glossary), ch86/87 format.
//   Block count 11→12.  (mUlam's "(मातृकान्तरे ८५-प॰)" rendered as the clean house-style "(मातृकान्तरे ८५)".)
//
// LEFT as editorial (Deva=IAST cohere; mUlam differs): नाडीसंख्याः/nāḍīsaṅkhyāḥ (ṃ/ṅ anusvāra convention),
//   reader's वीणादण्डान्तर्गता (mUlam वीणादण्डान्तर्निर्गततन्त्री); the "(or …)" variants; kuhūr-madhye hyphen;
//   apparatus blocks (Glossary/Typo-table).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[91];
if (ch.number !== 92) throw new Error('wrong chapter ' + ch.number);
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

// (2) targeted (post-global) — pattern-b, all in the sanskrit field
function rep(bi, f, from, to, exp) {
  const b = B[bi];
  if (!b || b.type !== 'verse') throw new Error('block ' + bi + ' not a verse');
  const n = (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b${bi}.${f} "${from}": expected ${exp}, found ${n}`);
  b[f] = b[f].split(from).join(to);
}
// b4
rep(4, 'sanskrit', 'vaxye', 'vakṣye', 1);                 // क्ष (वक्ष्ये)
rep(4, 'sanskrit', 'suṣumnāiva', 'suṣumnaiva', 1);        // Deva सुषुम्नैव (merged ai)
rep(4, 'sanskrit', 'आसाम्रादौ', 'आसामादौ', 1);            // spurious र (आसाम् आदौ)
rep(4, 'sanskrit', 'न्तर्गुता', 'न्तर्गता', 1);            // गुता typo → गता (IAST antargatā)
// b6
rep(6, 'sanskrit', 'daxiṇ', 'dakṣiṇ', 6);                 // क्ष (दक्षिण ×6)

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
if (B[6].num !== 2) throw new Error('b6 not the channels verse');
if (B[7].type !== 'section') throw new Error('b7 not the Glossary section');
const colophon = {
  type: 'verse',
  label: 'Colophon',
  sanskrit: '<blockquote>\n<p><strong>इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे नाडीनिरूपणं नाम द्विनवतितमः पटलः ॥९२॥ (मातृकान्तरे ८५)</strong></p>\n</blockquote>\n',
  iast: '<blockquote>\n<p><strong>iti śrīvaikhānase marīciprokte vimānārcanākalpe nāḍīnirūpaṇaṃ nāma dvinavatitamaḥ paṭalaḥ ||92|| (mātṛkāntare 85)</strong></p>\n</blockquote>\n',
  english: '<ul>\n<li><strong>Colophon:</strong> Thus ends the Ninety-Second Chapter, named <em>Nāḍī-nirūpaṇam</em> (The Exposition of the Subtle Channels), in the <em>Vimānārcanākalpa</em> declared by Sage Marīci in the Śrī Vaikhānasa tradition.</li>\n</ul>\n',
  text: '> **इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे नाडीनिरूपणं नाम द्विनवतितमः पटलः ॥९२॥ (मातृकान्तरे ८५)**\n> **iti śrīvaikhānase marīciprokte vimānārcanākalpe nāḍīnirūpaṇaṃ nāma dvinavatitamaḥ paṭalaḥ ||92|| (mātṛkāntare 85)**\n*   **Colophon:** Thus ends the Ninety-Second Chapter, named *Nāḍī-nirūpaṇam* (The Exposition of the Subtle Channels), in the *Vimānārcanākalpa* declared by Sage Marīci in the Śrī Vaikhānasa tradition.',
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
