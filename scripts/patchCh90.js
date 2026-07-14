// ch90 (Deha-lakṣaṇam — subtle anatomy / inner spiritual geography: the 96-aṅgula body & prāṇa, the
// deha-madhya vahni-maṇḍala with Vaiśvānara, the navel kanda + 12-spoke cakra with the revolving jīva,
// the coiled kuṇḍalinī sealing the suṣumnā, the heart arka-bimba with Viṣṇu, the nose-tip candra-bimba
// with Nārāyaṇa, and the crown 16-petal śiraḥ-padma with Vāsudeva) vs mUlam 090_dehalaxaNam.md.
// chapters[89], 22 blocks: prose intro b1/b2, section bands b3/b5/b9/b11/b13/b15/b18/b20, verse b4/b10/
//   b12/b14/b16 (pattern-b: inline-em IAST in sanskrit, iast EMPTY), verse b6/b7/b8 (pattern-a:
//   separate sanskrit/iast), colophon b17 (pattern-a — ALREADY present, NO insert), editorial Glossary
//   b19 / Typo-table b21 LEFT untouched. English per-block ALIGNED & UNTOUCHED.
//
// DEFECT 1 (systematic, ch86-89 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs used
//   INCONSISTENTLY — normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none.
// DEFECT 2: 'x' used for BOTH क्ष AND ख (so each mapped per the Deva, not blindly):
//   क्ष → b4 laxaṇaṃ/vaxye/daxiṇ, b17 laxaṇaṃ;  ख → b12 naxa(नख)/muxaḥ(मुखः), b16 smeramuxaḥ/muxamūrdhva.
//
// TARGETED Deva↔IAST slips (mUlam-confirmed):
//   b4 IAST vatyangulo→vatyaṅgulo, dvyangulaṃ→dvyaṅgulaṃ (Deva अङ्गुल, ṅ — cf navāṅgula/caturaṅgula);
//   b4 IAST sarvābharaṇayutaḥ→sarvābharaṇayuktaḥ (Deva+mUlam युक्तः);
//   b14 IAST dalābhānetraḥ→dalābhanetraḥ (spurious ā; Deva दलाभनेत्रः);
//   b17 COLOPHON Deva विमानार्चनाकल्ये→विमानार्चनाकल्पे (कल्ये typo for कल्पे; IAST already reads kalpe).
//
// No colophon insert (b17 present). No ou artifacts.
//
// LEFT as editorial (Deva=IAST cohere; mUlam differs): reader हेमं (mUlam हेमाभं), वैश्वानरमूर्तिः (mUlam
//   यज्ञमूर्तिः), षण्नेत्रः (mUlam षण्णेत्रः), श्वेतोर्चिषं (mUlam श्वेतरोचिषं), the abridged deha-madhya clause,
//   colophon lacking "(मातृकान्तरे ८४)" (both sides omit it); apparatus blocks (Glossary/Typo-table).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[89];
if (ch.number !== 90) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;
if (B.length !== 22) throw new Error('expected 22 blocks, got ' + B.length);

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
// b4 (pattern-b: IAST inline in sanskrit)
rep(4, 'sanskrit', 'laxaṇaṃ', 'lakṣaṇaṃ', 1);                 // क्ष (देहलक्षणं)
rep(4, 'sanskrit', 'vaxye', 'vakṣye', 1);                     // क्ष (वक्ष्ये)
rep(4, 'sanskrit', 'daxiṇ', 'dakṣiṇ', 2);                     // क्ष (दक्षिण ×2)
rep(4, 'sanskrit', 'vatyangulo', 'vatyaṅgulo', 1);            // ṅ (षण्णवत्यङ्गुलो)
rep(4, 'sanskrit', 'dvyangulaṃ', 'dvyaṅgulaṃ', 1);            // ṅ (द्व्यङ्गुलं)
rep(4, 'sanskrit', 'sarvābharaṇayutaḥ', 'sarvābharaṇayuktaḥ', 1); // Deva+mUlam युक्तः
// b12 (pattern-b)
rep(12, 'sanskrit', 'naxa', 'nakha', 1);                      // ख (नख)
rep(12, 'sanskrit', 'muxaḥ', 'mukhaḥ', 1);                     // ख (मुखः)
// b14 (pattern-b)
rep(14, 'sanskrit', 'dalābhānetraḥ', 'dalābhanetraḥ', 1);     // spurious ā (दलाभनेत्रः)
// b16 (pattern-b)
rep(16, 'sanskrit', 'smeramuxaḥ', 'smeramukhaḥ', 1);          // ख (स्मेरमुखः)
rep(16, 'sanskrit', 'muxamūrdhva', 'mukhamūrdhva', 1);        // ख (अधोमुखमूर्ध्व)
// b17 (colophon pattern-a)
rep(17, 'sanskrit', 'विमानार्चनाकल्ये', 'विमानार्चनाकल्पे', 1); // कल्ये typo → कल्पे
rep(17, 'iast', 'laxaṇaṃ', 'lakṣaṇaṃ', 1);                    // क्ष (देहलक्षणं)

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
