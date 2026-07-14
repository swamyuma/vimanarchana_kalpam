// ch97 (Pratyāhāra-vidhiḥ — the 5th yoga-limb, sensory withdrawal: its fivefold definition, the 18
// marma-sthānas + their aṅgula-distances, and the vāyu-śamana practice raising the breath up the
// suṣumnā to the brow-centre) vs mUlam 097_pratyAhAravidhiH.md. chapters[96], 15 blocks: prose intro
//   b1/b2, section bands b3/b5/b8/b11/b13, verse b4/b9 (pattern-b: inline-em IAST in sanskrit, iast
//   EMPTY) + verse b6/b7 (pattern-a) + colophon b10 (pattern-a — ALREADY present, has english) +
//   editorial Glossary b12 / Typo-table b14 LEFT untouched. English ALIGNED & UNTOUCHED.
//
// DEFECT 1 (systematic, ch86-96 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs —
//   normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none.
// DEFECT 2: 'x' for क्ष: b4 īxaṇam (ईक्षणम्); b6 tallaxanaṃ (तल्लक्षणं: क्ष+retroflex ण) & aximaṇḍala (अक्षि);
//   b7 aximaṇḍalaṃ (अक्षिमण्डलं).
//
// TARGETED slips:
//   b7 IAST dvyangulaṃ→dvyaṅgulaṃ ×6 & tryangulaṃ→tryaṅgulaṃ (n→ṅ, Deva द्व्यङ्गुल/त्र्यङ्गुल — the same
//     passage's daśāṅgula/caturaṅgula already use ṅ, so an intra-passage inconsistency);
//   b7 DEVA ङ्गुुल→ङ्गुल ×6 (double-ु matra typo — the ch30 defect; IAST side already single-u aṅgula).
//
// No colophon insert (b10 present, Deva clean this chapter). No ख/क्त x. b9/b10 need only ō/ē.
//
// LEFT as editorial (Deva=IAST cohere; mUlam differs): reader's marma list जानु-जानुमध्य (mUlam जानूरुमध्य)
//   & its divergent aṅgula measurements, the "(or …)" variants, a "daxiṇapādaṃ" mojibake confined to the
//   b7 ENGLISH gloss (untouchable), colophon lacking "(मातृकान्तरे ९२)"; apparatus blocks.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[96];
if (ch.number !== 97) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;
if (B.length !== 15) throw new Error('expected 15 blocks, got ' + B.length);

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

// (2) targeted (post-global)
function rep(bi, f, from, to, exp) {
  const b = B[bi];
  if (!b || b.type !== 'verse') throw new Error('block ' + bi + ' not a verse');
  const n = (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b${bi}.${f} "${from}": expected ${exp}, found ${n}`);
  b[f] = b[f].split(from).join(to);
}
rep(4, 'sanskrit', 'īxaṇam', 'īkṣaṇam', 1);              // क्ष (ईक्षणम्)
rep(6, 'iast', 'tallaxanaṃ', 'tallakṣaṇaṃ', 1);          // क्ष + retroflex ण (तल्लक्षणं)
rep(6, 'iast', 'aximaṇḍala', 'akṣimaṇḍala', 1);          // क्ष (अक्षिमण्डल)
rep(7, 'iast', 'aximaṇḍalaṃ', 'akṣimaṇḍalaṃ', 1);        // क्ष (अक्षिमण्डलं)
rep(7, 'iast', 'dvyangulaṃ', 'dvyaṅgulaṃ', 6);           // n→ṅ (द्व्यङ्गुल ×6)
rep(7, 'iast', 'tryangulaṃ', 'tryaṅgulaṃ', 1);           // n→ṅ (त्र्यङ्गुल)
rep(7, 'sanskrit', 'ङ्गुुल', 'ङ्गुल', 6);                // Deva double-ु matra typo ×6

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
