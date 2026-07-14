// ch79 (Mārgaśīrṣa-dvādaśī-samārādhana-vidhiḥ — annual Margashirsha-12th expiation/worship)
// reconciliation vs mUlam 079_samArAdhanam.md. Small documented chapter (13 blocks, chapters[78]):
// prose intro b1/b2, section bands, pattern-b verse b4/b6/b8 (inline-em IAST in sanskrit) +
// colophon b9 (clean, present) + editorial prose b10/b11/b12 LEFT untouched. English per-block
// ALIGNED & UNTOUCHED (verify: 0 english diffs). VERY CLEAN — 5 fixes (all in sanskrit field;
// Deva side clean): x→kṣ (daxiṇe, pradaxiṇī, daxiṇāṃ — global pass, all kṣ); b4 viṣṇugāyatriyā→
// viṣṇugāyatryā (Deva गायत्र्या); b8 samāceret→samācaret (ceret→caret, Deva समाचरेत्).
// LEFT as editorial (Deva=IAST cohere / "(or …)" markers / inline annotations): b6 munibhyām gloss
// (Deva has "(Bhrigu and Marīci)" English annotation, IAST "(bhṛgu-marīcyoḥ)" — editorial gloss,
// not text), b6 upodakaṃ "(or upale)", b8 the many editorial rewordings vs mUlam.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[78];
if (ch.number !== 79) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount] — targeted (non-x); run BEFORE global x→kṣ
const FIXES = [
  [4, 'sanskrit', 'viṣṇugāyatriyā', 'viṣṇugāyatryā', 1], // IAST spurious i (Deva गायत्र्या)
  [8, 'sanskrit', 'samāceret',      'samācaret',      1], // IAST ceret→caret (Deva समाचरेत्)
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

// global x→kṣ across ch79 verse fields (all x = kṣ this chapter)
let xfixed = 0;
ch.blocks.forEach(b => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit','iast']) {
    if (!b[f]) continue;
    const n = (b[f].match(/x/g)||[]).length;
    if (n) { b[f] = b[f].split('x').join('kṣ'); xfixed += n; }
  }
});
console.log('x→kṣ replacements:', xfixed);

// residual checks
let all=''; ch.blocks.forEach(b=>{ if(b.type==='verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
const resid = { x:(lat.match(/x/g)||[]).length, ou:(lat.match(/ou/g)||[]).length, gaayatriyaa:(lat.match(/gāyatriyā/g)||[]).length, samaaceret:(lat.match(/samāceret/g)||[]).length };
console.log(JSON.stringify(resid));
for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);

// markup balance on ALL ch79 verse blocks
ch.blocks.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit','iast','english']) {
    const v = b[f] || '';
    for (const t of ['p','em','strong','blockquote','ul','li','ol']) {
      const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
      if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
    }
  }
});
console.log('markup balanced.');

if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
