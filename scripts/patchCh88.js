// ch88 (Dehotpatti-vidhiḥ — embryology / origin of the physical body: threefold digestion of food
// [urine/faeces/semen-ovum], conception by vāyu + daiva, day-by-day & month-by-month gestation, the
// seven dhātus, and the śukra/śoṇita balance determining sex & complexion) vs mUlam
// 088_dehotpattividhiH.md. chapters[87], 17 blocks: prose intro b1/b2, section bands b3/b7/b9/b12/b14,
//   verse b4/b5/b6 (pattern-a: separate sanskrit/iast), verse b8/b10 (pattern-b: inline-em IAST in
//   sanskrit, iast EMPTY), colophon b11 (pattern-a — ALREADY present, NO insert), editorial Glossary
//   b13 / Typo-table b15 / Bibliography b16 LEFT untouched. English per-block ALIGNED & UNTOUCHED.
//
// DEFECT (systematic, the ch86/87 pattern): the verse IAST is riddled with NON-STANDARD ō/ē macron
//   glyphs (dēhōtpatti, ōṣadhībhyō, ēkaṃ, śōṇitaṃ, kṣīrē, māyāśrayō, daivayōgēna, ēkarātrōṣitaṃ,
//   māsē, dēhaṃ, rētōmayāni, śukrādhikē, dvayōḥ, tayōrēkō, …incl. the colophon śrīvaikhānasē etc.)
//   used INCONSISTENTLY beside plain o/e — OCR/translit artifacts (reader-wide standard = plain o/e).
//   NORMALIZED ō→o, ē→e across ALL verse blocks' sanskrit+iast ONLY (never english — untouchable
//   glosses keep their own ō/ē per the ch83 rule). Deva (sanskrit of pattern-a) has no ō/ē → untouched.
//
// TARGETED Deva↔IAST slips (mUlam-confirmed, Deva & IAST brought into agreement):
//   b6 IAST paren rētasāṃ→retasaḥ : Deva रेतसः (visarga, gen.sg.) not anusvāra+ā;
//   b8 माषद्वये/māṣadvaye→मासद्वये/māsadvaye : "two MONTHS" (मास, dental s) — every other month-word in
//     the same enumeration is मास; mUlam मासद्वये + the English gloss + the editor's own "(or māsadvayē)"
//     variant all confirm; retroflex ष is an internal-inconsistency typo. The redundant "(or māsadvaye)"
//     paren is dropped;
//   b10 IAST garbhāvarṇaḥ→garbhavarṇaḥ : spurious ā (Deva गर्भवर्णः);
//   b10 IAST paren garbhagarbhavarṇaḥ→garbhavikāraḥ : garbled dittography (Deva गर्भविकारः).
//
// No x / ou artifacts (grep = 0). No colophon insert (b11 already present).
//
// LEFT as editorial (Deva=IAST=English cohere; mUlam differs): reader's ABRIDGED / re-ordered night
//   sequence (चतुरात्रोषितं बन्धं… vs mUlam's fuller 1-10 पेशल/घन/व्यूह/बन्ध/… list); शरीरकृतिः (no ā, vs
//   mUlam शरीराकृतिः — Deva=IAST=English all agree); all the "(or …)" variant annotations; the
//   apparatus blocks (Glossary/Typo-table/Bibliography).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[87];
if (ch.number !== 88) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;
if (B.length !== 17) throw new Error('expected 17 blocks, got ' + B.length);

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

// (2) targeted (run AFTER global; strings are post-normalization)
function rep(bi, f, from, to, exp) {
  const b = B[bi];
  if (!b || b.type !== 'verse') throw new Error('block ' + bi + ' not a verse');
  const n = (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b${bi}.${f} "${from}": expected ${exp}, found ${n}`);
  b[f] = b[f].split(from).join(to);
}
rep(6, 'iast', 'retasāṃ', 'retasaḥ', 1);                                   // Deva रेतसः बीजं
rep(8, 'sanskrit', 'माषद्वये', 'मासद्वये', 1);                             // "two months" मास (dental)
rep(8, 'sanskrit', 'māṣadvaye (or māsadvaye)', 'māsadvaye', 1);            // drop redundant variant
rep(10, 'sanskrit', 'garbhagarbhavarṇaḥ', 'garbhavikāraḥ', 1);            // garbled paren (Deva गर्भविकारः)
rep(10, 'sanskrit', 'garbhāvarṇaḥ', 'garbhavarṇaḥ', 1);                    // spurious ā (Deva गर्भवर्णः)

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
