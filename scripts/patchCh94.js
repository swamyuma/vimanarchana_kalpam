// ch94 (Bhagavat-sāyujya-pradānam / the reader retitles it Saṃsāra-hetu-tattaraṇopāya-mokṣa-svarūpa —
// the cause of saṃsāra [bondage by the Lord's māyā], the means of crossing [refuge in Nārāyaṇa, grace
// → samyagjñāna], and the nature of mokṣa & its four grades sālokya/sāmīpya/sārūpya/sāyujya mapped to
// Āmoda/Pramoda/Sammoda/Vaikuṇṭha, ending in nitya-niṣevaṇa & parañjyotiḥ-praveśana) vs mUlam
// 094_bhagavatsAyujyapradAnam.md. chapters[93], 12 blocks: prose intro b1/b2, section bands b3/b5/b8/b10,
//   verse b4/b6 (pattern-b: inline-em IAST in sanskrit, iast EMPTY) + colophon b7 (pattern-a — ALREADY
//   present, has english) + editorial Glossary b9 / Typo-table b11 LEFT untouched. English ALIGNED &
//   UNTOUCHED.
//
// DEFECT 1 (systematic, ch86-93 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs —
//   normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none.
// DEFECT 2: 'x' for क्ष: b6 mōxa ×2 (मोक्ष: mōxasvarūpaṃ, mōxaḥ).
//
// TARGETED Deva↔IAST slips (mUlam/Deva-confirmed):
//   b4 IAST apunarāvruttikaṃ→apunarāvṛttikaṃ (vocalic ṛ; Deva अपुनरावृत्तिकं — the typo-table itself
//     carried the 'vru' slip, but the Deva has वृ);
//   b6 IAST paśyantisūrayaḥ→paśyanti sūrayaḥ (Deva पश्यन्ति सूरयः — dropped word-space in the śruti).
//
// No colophon insert (b7 present). No ख/ख्य/क्त x this chapter (grep confirms only क्ष in b6).
//
// LEFT as editorial (Deva=IAST cohere; mUlam differs): colophon भगवत्सायुज्य-विधानं (mUlam …प्रदानं; both
//   reader sides say vidhānaṃ), reader's retitled chapter heading, the "(or …)" variants, colophon
//   lacking "(मातृकान्तरे ८७)"; apparatus blocks (Glossary/Typo-table); english's own ō/ē & the
//   b7-english śruti gloss "paśyantisūrayaḥ" (english untouchable).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[93];
if (ch.number !== 94) throw new Error('wrong chapter ' + ch.number);
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
rep(4, 'sanskrit', 'apunarāvruttikaṃ', 'apunarāvṛttikaṃ', 1); // vocalic ṛ (अपुनरावृत्तिकं)
rep(6, 'sanskrit', 'mox', 'mokṣ', 2);                        // क्ष (मोक्ष ×2)
rep(6, 'sanskrit', 'paśyantisūrayaḥ', 'paśyanti sūrayaḥ', 1); // dropped word-space (Deva पश्यन्ति सूरयः)

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
