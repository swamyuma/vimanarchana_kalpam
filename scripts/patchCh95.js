// ch95 (Jñāna-svarūpa-nirūpaṇam / reader retitles it Caturvidha-bhagavat-samāśrayaṇa — the fourfold
// refuge [japa/huta/arcana/dhyāna], the preeminence of arcana, and the pañca-mūrti doctrine: Viṣṇu +
// Puruṣa/Satya/Acyuta/Aniruddha mapped to the 5 elements/fires/vāyus & the guṇas dharma/jñāna/aiśvarya/
// vairāgya, meditated via aṣṭāṅga-yoga) vs mUlam 095_jnAnasvarUpanirUpaNam.md. chapters[94], 12 blocks:
//   prose intro b1/b2, section bands b3/b5/b8/b10, verse b4/b6 (pattern-b: inline-em IAST in sanskrit,
//   iast EMPTY) + colophon b7 (pattern-a — ALREADY present, has english) + editorial Glossary b9 /
//   Typo-table b11 LEFT untouched. English ALIGNED & UNTOUCHED.
//
// DEFECT 1 (systematic, ch86-94 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs —
//   normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none.
// DEFECT 2: 'x' for क्ष: b4 aṣṭāxaraṃ (अष्टाक्षरं, the eight-syllable mantra). Only one x this chapter.
//
// No colophon insert (b7 present). No other Deva↔IAST slips: the dense śruti quotes & pañca-mūrti
// enumerations are internally consistent (Deva = translit of IAST) — the reader's editorial śruti
// reconstructions (e.g. tadviṣṇoḥ paramātmānudāyā caturguṇāya) differ from mUlam but cohere, LEFT.
//
// LEFT as editorial (Deva=IAST cohere; mUlam differs): reader's retitled chapter heading, the "(or …)"
//   variants (vairāgya/vīrya), reconstructed śrutis, colophon lacking "(मातृकान्तरे ८८)", english's own
//   ō/ē and its typos (puruṣu, tripāt — english untouchable); apparatus blocks.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[94];
if (ch.number !== 95) throw new Error('wrong chapter ' + ch.number);
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

// (2) targeted (post-global), pattern-b → sanskrit field
function rep(bi, f, from, to, exp) {
  const b = B[bi];
  if (!b || b.type !== 'verse') throw new Error('block ' + bi + ' not a verse');
  const n = (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b${bi}.${f} "${from}": expected ${exp}, found ${n}`);
  b[f] = b[f].split(from).join(to);
}
rep(4, 'sanskrit', 'aṣṭāxaraṃ', 'aṣṭākṣaraṃ', 1); // क्ष (अष्टाक्षरं)

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
