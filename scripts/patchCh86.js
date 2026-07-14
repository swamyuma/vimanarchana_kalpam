// ch86 (Sakala-vidhiḥ / Bhagavato Jagatsṛṣṭi — the MANIFEST [sakala] aspect of Brahman, complementing
// ch85's niṣkala: Viṣṇu becoming sakala like fire churned from wood / clay shaped on a potter's wheel;
// Śrī as His vibhūti / mūlaprakṛti; the twofold Prakṛti [cetana/acetana] and the rebirth cycle of jīvas)
// vs mUlam 086_sakalavidhiH.md. chapters[85], 15 blocks: prose intro b1/b2, section bands b3/b5/b7,
//   verse b4/b6/b8 (pattern-b: inline-em IAST in sanskrit, iast EMPTY) + colophon b9 (ALREADY present —
//   NO insert needed this chapter) + editorial prose b10-b11 Glossary / b12-b13 Typo-table / b14
//   Bibliography LEFT untouched. English per-block ALIGNED & UNTOUCHED (0 english diffs).
//
// The distinguishing defect: the IAST is riddled with NON-STANDARD ō / ē macron glyphs (niṣkalātmakō,
// dhyāna-mathanēna, sakalō, dēva ēkaḥ, paramō'vyayō, viṣṇōḥ, bhōktṛtvē, …) used INCONSISTENTLY — right
// beside plain o/e forms in the same clause (prakāśate, viśvatōmukho[o], devatā, bhavati). So they are
// OCR/transliteration artifacts, not a deliberate convention; the reader-wide standard (all 85 prior
// chapters) is plain o/e. NORMALIZED ō→o, ē→e (the ch13/15/18/23/80 precedent) in the verse
// sanskrit+iast fields only. NOTE: the UNTOUCHABLE english glosses retain their own ō/ē — LEFT per the
// never-touch-english rule (ch83 precedent); only the Deva/IAST in sanskrit/iast are normalized.
//
// PLUS one genuine TARGETED Deva↔IAST slip:
//   b6 IAST saṅkalpanurūpā→saṅkalpānurūpā : Deva सङ्कल्पानुरूपा (saṅkalpa+anurūpā → -pānu-, long ā); the
//     IAST dropped the macron. (English gloss also reads saṅkalpanurūpā — LEFT untouched.)
//
// No x / ou artifacts in this chapter (grep = 0). No colophon insert (b9 already the colophon).
//
// LEFT as editorial (Deva=IAST cohere; mUlam differs): b6 तदधीनाः/tadadhīnāḥ (mUlam तद्भिन्नाः), विष्णुविभूति-
//   (mUlam विष्णोर्विभूति-), तद्विभूताः स्त्रियः (mUlam तद्भिन्ना), कार्यकरणकर्तृत्वे (mUlam कार्यकारणकर्तृत्वे); b8 सदासक्ताः
//   (mUlam संश्लिष्टाः), प्राप्य निवर्तन्ते "(or प्राप्य वर्तन्ते)" variant; the bracketed Veda citations in the Deva.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[85];
if (ch.number !== 86) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount] — targeted (run BEFORE the global normalize)
const FIXES = [
  [6, 'sanskrit', 'saṅkalpanurūpā', 'saṅkalpānurūpā', 1], // dropped ā (Deva सङ्कल्पानुरूपा)
];
let applied = 0;
for (const [bi, f, from, to, exp] of FIXES) {
  const b = ch.blocks[bi];
  if (!b || b.type !== 'verse') throw new Error('block ' + bi + ' not a verse');
  const n = (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b${bi}.${f} "${from}": expected ${exp}, found ${n}`);
  b[f] = b[f].split(from).join(to);
  applied += n;
}
console.log('targeted fixes applied:', applied);

// GLOBAL ō→o, ē→e normalization, scoped to sanskrit + iast of verse blocks only (NEVER english)
let go = 0, ge = 0;
ch.blocks.forEach((b) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) {
    if (!b[f]) continue;
    const no = (b[f].match(/ō/g) || []).length;
    const ne = (b[f].match(/ē/g) || []).length;
    if (no) b[f] = b[f].split('ō').join('o');
    if (ne) b[f] = b[f].split('ē').join('e');
    go += no; ge += ne;
  }
});
console.log('global ō→o:', go, '| global ē→e:', ge);

// residual check: no ō / ē / x / ou left in any verse sanskrit/iast field (english left untouched)
ch.blocks.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) {
    if (!b[f]) continue;
    for (const bad of ['ō', 'ē', 'x']) if (b[f].includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
    if (/ou/.test(b[f])) throw new Error(`residual ou in b${bi}.${f}`);
  }
});
console.log('no residual ō/ē/x/ou in verse sanskrit/iast.');

// markup balance
ch.blocks.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) {
    const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length, c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
    }
  }
});
console.log('markup balanced.');

if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
