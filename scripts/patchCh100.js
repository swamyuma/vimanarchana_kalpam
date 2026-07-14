// ch100 (Samādhi-bheda / Samādhi-vidhiḥ — the 8th & FINAL yoga-limb AND the epilogue of the whole
// Vimānārcanākalpa: samādhi = jīvātman-paramātman samāvasthā [heated-water simile] → jīvanmukti; the
// dehatyāga-prakāra [conscious death via haṃsa + suṣumnā + praṇava → sāyujya in Vaikuṇṭha]; and the
// grantha-upasaṃhāra affirming samūrtārcana of the pañca-mūrti) vs mUlam 100_samAdhibhedaH.md.
// chapters[99], 16 blocks: prose intro b1/b2, section bands b3/b5/b9/b12/b14, verse b4/b10 (pattern-b:
//   inline-em IAST in sanskrit, iast EMPTY) + verse b6/b7/b8 (pattern-a) + colophon b11 (pattern-a —
//   ALREADY present, has english, clean Deva incl. the "अयुतग्रन्थसंहितायां" saṃhitā name) + editorial
//   Glossary b13 / Typo-table b15 LEFT untouched. English ALIGNED & UNTOUCHED.
//
// ***FINAL CHAPTER — completes the 100-chapter Vimānārcanākalpa reconciliation deliverable.***
//
// DEFECT 1 (systematic, ch86-99 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs —
//   normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none.
// DEFECT 2: 'x' for क्ष AND ख: क्ष → b4 tallaxanaṃ(तल्लक्षणं क्ष+ण)/vaxye(वक्ष्ये), b6 praṇavāxareṇa(प्रणवाक्षरेण);
//   ख → b4 mayūxa (आदित्यमयूख, sun-ray).
//
// TARGETED slip: b6 IAST prānam āropya→prāṇam āropya (dental n→retroflex ṇ; Deva प्राणम् — the block's
//   other 3 prāṇam are already correct, so an intra-block inconsistency).
//
// No colophon insert (b11 present). No lump-markup (grep=0). No english fill (b11 english present).
//
// LEFT as editorial (english is untouchable): b8-english "utsृjati" (Devanagari ृ embedded in a
//   romanized gloss) & b10-english "pratimāṣu"/"nityā-" typos — all confined to english fields;
//   colophon lacking a numeric "(मातृकान्तरे ९६ प॰)"; apparatus blocks (Glossary/Typo-table).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[99];
if (ch.number !== 100) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;
if (B.length !== 16) throw new Error('expected 16 blocks, got ' + B.length);

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
// b4 (pattern-b sanskrit)
rep(4, 'sanskrit', 'tallaxanaṃ', 'tallakṣaṇaṃ', 1);   // क्ष + retroflex ण (तल्लक्षणं)
rep(4, 'sanskrit', 'vaxye', 'vakṣye', 1);             // क्ष (वक्ष्ये)
rep(4, 'sanskrit', 'mayūxa', 'mayūkha', 1);           // ख (आदित्यमयूख)
// b6 (pattern-a iast)
rep(6, 'iast', 'praṇavāxareṇa', 'praṇavākṣareṇa', 1); // क्ष (प्रणवाक्षरेण)
rep(6, 'iast', 'prānam āropya', 'prāṇam āropya', 1);  // retroflex ṇ (प्राणम्)

// residual check: no ō/ē/x/ou/asterisk in any verse sanskrit/iast (english untouched)
B.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) {
    const v = b[f]; if (!v) continue;
    for (const bad of ['ō', 'ē', 'x', '*']) if (v.includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
    if (/ou/.test(v)) throw new Error(`residual ou in b${bi}.${f}`);
  }
});
console.log('no residual ō/ē/x/ou/asterisk in verse sanskrit/iast.');

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
