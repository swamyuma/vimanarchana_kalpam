// ch72 (Dhruva-bera-prāyaścitta-vidhiḥ) reconciliation. Documented chapter (prose intro +
// sections + pattern-a/inline-em verse blocks; editorial prose b34/b35/b36 LEFT). English
// per-block ALIGNED. Very clean — 5 fixes from compareCh72.js.
// NOTE: b28 english gloss has a mojibake "mण्डपे वा" (Latin m + Devanagari) — in the UNTOUCHABLE
// english field, LEFT per standing rule (flagged to user).
// LEFT benign: hyphenation/padaccheda, sandhi t/d & visarga↔r, word-final m/ṃ, avagraha.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[71];
if (ch.number !== 72) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount]
const FIXES = [
  [8,  'iast',     'āceret', 'ācaret', 1],                              // Deva आचरेत् (ceret->caret)
  [16, 'iast',     'āceret', 'ācaret', 1],
  [24, 'sanskrit', 'arcanāyāṃ vartamānāyām', 'arcane vartamāne', 1],    // Deva+mUlam neuter loc
  [28, 'sanskrit', 'varṇakṣayādou', 'varṇakṣayādau', 1],               // ou->au (Deva वर्णक्षयादौ)
  [30, 'sanskrit', 'kautukādin', 'kautukādīn', 1],                     // Deva कौतुकादीन् (long ī)
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
console.log('applied:', applied);

const resid = {
  'āceret': (ch.blocks[8].iast.match(/āceret/g)||[]).length + (ch.blocks[16].iast.match(/āceret/g)||[]).length,
  'arcanāyāṃ(b24)': (ch.blocks[24].sanskrit.match(/arcanāyāṃ/g)||[]).length,
  'ādou(b28)': (ch.blocks[28].sanskrit.match(/ādou/g)||[]).length,
  'kautukādin(b30)': (ch.blocks[30].sanskrit.match(/kautukādin\b/g)||[]).length,
};
console.log(JSON.stringify(resid));
for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);
for (const bi of [8,16,24,28,30]) for (const f of ['sanskrit','iast']) {
  const v = ch.blocks[bi][f] || '';
  for (const t of ['p','em','strong','blockquote']) {
    const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
    if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
  }
}
console.log('markup balanced.');
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
