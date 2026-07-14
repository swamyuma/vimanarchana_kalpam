// ch99 (Dhyāna-bheda-vidhiḥ — the 7th yoga-limb, meditation: dhyāna = jīvātman's contemplation of
// paramātman; niṣkala/sakala → nirguṇa (partless inner-light) & saguṇa (4 forms: Mahendra/Varuṇa +
// Agni/Arka/Soma maṇḍalas → Yajñamūrti/Viṣṇu/Nārāyaṇa)) vs mUlam 099_dhyAnabhedavidhiH.md.
// chapters[98], 14 blocks: prose intro b1/b2, section bands b3/b5/b10/b12, verse b4 (pattern-b:
//   inline-em IAST in sanskrit, iast EMPTY) + verse b6/b7/b8 (pattern-a) + colophon b9 (pattern-a —
//   ALREADY present but with EMPTY english → FILLED) + editorial Glossary b11 / Typo-table b13 LEFT
//   untouched. English ALIGNED & UNTOUCHED (except the empty colophon english, FILLED — an ADD).
//
// DEFECT 1 (systematic, ch86-98 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs —
//   normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none.
// DEFECT 2: 'x' for क्ष AND ख: क्ष → b4 vaxye/anabhilaxyaṃ/sūxmaḥ/virūpāxaḥ, b6 vaxye; ख → b6 kuṇḍalinīmuxaṃ.
//
// TARGETED Deva↔IAST slips (Deva/IAST disagree; IAST + mUlam correct):
//   b4 DEVA title ध्यानभेदविद्यिः→ध्यानभेदविधिः (विद्यि→विधि typo; IAST dhyānabhēdavidhiḥ);
//   b4 DEVA ज्वारूप→ज्वलरूप (dropped ल; IAST jvalarūpavat — reader uses jvala, cf mUlam ज्वाला);
//   b6 DEVA मण्डलम नुप्रविश्य→मण्डलम् अनुप्रविश्य ×2 (word-split/virama error; IAST maṇḍalam anupraviśya).
//
// No colophon insert (b9 present). No asterisk/lump-markup this chapter (grep=0).
//
// LEFT as editorial (Deva=IAST cohere; mUlam differs): the "(or …)" variants (yakāra/lakāra,
//   trividhaṃ/caturvidhaṃ, arka/agni), colophon lacking "(मातृकान्तरे ९४)"; apparatus blocks.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[98];
if (ch.number !== 99) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;
if (B.length !== 14) throw new Error('expected 14 blocks, got ' + B.length);

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
rep(4, 'sanskrit', 'vaxye', 'vakṣye', 1);                 // क्ष (वक्ष्ये)
rep(4, 'sanskrit', 'anabhilaxyaṃ', 'anabhilakṣyaṃ', 1);   // क्ष (अनभिलक्ष्यं)
rep(4, 'sanskrit', 'sūxmaḥ', 'sūkṣmaḥ', 1);               // क्ष (सूक्ष्मः)
rep(4, 'sanskrit', 'virūpāxaḥ', 'virūpākṣaḥ', 1);         // क्ष (विरूपाक्षः)
rep(4, 'sanskrit', 'ध्यानभेदविद्यिः', 'ध्यानभेदविधिः', 1); // Deva विद्यि→विधि
rep(4, 'sanskrit', 'ज्वारूप', 'ज्वलरूप', 1);              // Deva dropped ल (IAST jvala)
// b6 (pattern-a)
rep(6, 'iast', 'vaxye', 'vakṣye', 1);                     // क्ष (वक्ष्ये)
rep(6, 'iast', 'kuṇḍalinīmuxaṃ', 'kuṇḍalinīmukhaṃ', 1);   // ख (कुण्डलिनीमुखं)
rep(6, 'sanskrit', 'मण्डलम नुप्रविश्य', 'मण्डलम् अनुप्रविश्य', 2); // Deva word-split/virama ×2

// (3) FILL empty colophon b9 english (ADD; ch88/90/93 house style)
if (!B[9].colophon) throw new Error('b9 not colophon');
if ((B[9].english || '').trim() !== '') throw new Error('b9 english not empty');
B[9].english = '<ul>\n<li><strong>Colophon:</strong> Thus ends the Ninety-Ninth Chapter, named <em>Dhyāna-bheda-vidhiḥ</em> (Rules on the Classifications of Meditation), in the <em>Vimānārcanākalpa</em> declared by Sage Marīci in the Śrī Vaikhānasa tradition.</li>\n</ul>\n';
console.log('filled b9 colophon english.');

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
