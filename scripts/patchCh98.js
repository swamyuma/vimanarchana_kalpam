// ch98 (Dhāraṇā-vidhiḥ — the 6th yoga-limb, concentration: the 8 forms of dhāraṇā, then the 5
// elemental dhāraṇās [earth/water/fire/wind/space, each with its bīja Laṃ/Vaṃ/Raṃ/Yaṃ/Haṃ, body-zone,
// and mūrti Aniruddha/Acyuta/Satya/Puruṣa/Viṣṇu], culminating in the paramānanda-vigraha of Nārāyaṇa)
// vs mUlam 098_dhAraNAvidhiH.md. chapters[97], 12 blocks: prose intro b1/b2, section bands b3/b5/b8/b10,
//   verse b4/b6 (pattern-b: inline-em IAST in sanskrit, iast EMPTY) + colophon b7 (pattern-a — ALREADY
//   present, has english) + editorial Glossary b9 / Typo-table b11 LEFT untouched. English UNTOUCHED.
//
// DEFECT 1 (systematic, ch86-97 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs —
//   normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none. (No x this chapter.)
// DEFECT 2 (markup): b4 has the recurring `**   …*` LUMP-MARKUP defect (ch12/15/18/20 class) — the
//   pañcabhūta-dhāraṇā IAST sub-list (pṛthivī/ab/agni lines) is wrapped in `**   …*` markdown that
//   renders literally instead of as italics. Repaired 3 lines (9 asterisks → 0) via
//   /\*\*[ ]+([^*\n]+?)\*/g → '<em>$1</em>' (string-replace honoring $1; visually inspected).
//
// TARGETED Deva↔IAST slip: b4 Deva हृदवान्तम्→हृदयान्तम् (व→य; IAST hṛdayāntaṃ + mUlam पायोर्हृदयान्तम्).
//
// No colophon insert (b7 present, Deva clean). LEFT: reader's "9." item-numbering under an "aṣṭadhā"
//   (eightfold) head (Deva=IAST=English cohere), the "(अब्-स्थानं)"/"(रेफबीज-)" variant parens, colophon
//   lacking "(मातृकान्तरे ९३)"; apparatus blocks (Glossary/Typo-table).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[97];
if (ch.number !== 98) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;
if (B.length !== 12) throw new Error('expected 12 blocks, got ' + B.length);

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

// (2) b4 MARKUP REPAIR: `**   …*` → `<em>…</em>` (3 lines). $1-preserving string replace via callback? No —
//     use .replace with a function to honor captured group safely (the $1-callback lesson).
const b4 = B[4];
const before = (b4.sanskrit.match(/\*/g) || []).length;
if (before !== 9) throw new Error('b4 expected 9 asterisks, found ' + before);
b4.sanskrit = b4.sanskrit.replace(/\*\*[ ]+([^*\n]+?)\*/g, (m, g1) => '<em>' + g1 + '</em>');
const after = (b4.sanskrit.match(/\*/g) || []).length;
if (after !== 0) throw new Error('b4 asterisks remain: ' + after);
console.log('b4 lump-markup repaired: 9 asterisks -> 0.');

// (3) targeted Deva slip
function rep(bi, f, from, to, exp) {
  const b = B[bi];
  const n = (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b${bi}.${f} "${from}": expected ${exp}, found ${n}`);
  b[f] = b[f].split(from).join(to);
}
rep(4, 'sanskrit', 'हृदवान्तम्', 'हृदयान्तम्', 1); // व→य (IAST hṛdayāntaṃ)

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
