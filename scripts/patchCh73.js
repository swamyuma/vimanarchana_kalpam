// ch73 (Kautukādi-jīrṇa-bera-parityāga-vidhiḥ) reconciliation. Documented chapter (prose intro
// b1/b2 + sections + pattern-a b4/b5/b9 & inline-em verse blocks; editorial prose b18 Glossary,
// b19/b20 LEFT untouched). English per-block ALIGNED. 10 fixes from compareCh73.js, all
// glyph/spelling/mojibake, adjudicated vs mUlam 073_kautukAdijIrNaberaparityAgavidhiH.md.
// LEFT benign: hyphenation/padaccheda (b4 tat-tyāga, b5 sadyas/tad-bera, b9 aṅgādi-svarūpa),
// sandhi t/d (b15 pūrvavad), avagraha (b9 bāhavo'), and editorial divergence b5 kartr-adhikāriṇoḥ
// (reader Deva=IAST agree "adhikārin"; mUlam ārādhaka; English endorses adhikārin).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[72];
if (ch.number !== 73) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount, note]
const FIXES = [
  // b7 (inline-em): gerund/dittography slips
  [7,  'sanskrit', 'navavastreṇācchādyā', 'navavastreṇācchādya', 1], // IAST spurious ā (Deva आच्छाद्य gerund)
  [7,  'sanskrit', 'अद्द्भ्यः',            'अद्भ्यः',              1], // Deva dittography द्द→द (adbhyaḥ "to the waters")
  [7,  'sanskrit', 'dattva ālayaṃ',       'dattvā ālayaṃ',       1], // IAST dropped ā (Deva दत्त्वा)
  // b9 (pattern-a iast): corrupt token
  [9,  'iast',     'śirascatra',          'śiraścakra',          1], // Deva शिरश्चक्र, glossary śiras-cakra; catra→cakra
  // b15 (inline-em)
  [15, 'sanskrit', 'praxālya',            'prakṣālya',           1], // x→kṣ (Deva प्रक्षाल्य)
  [15, 'sanskrit', 'raokmaṃ',             'raukmaṃ',             1], // ao→au (Deva रौक्मं)
  [15, 'sanskrit', 'तद्रव्येण',            'तद्द्रव्येण',           1], // Deva missing द (mUlam तद्द्रव्येण, IAST tad-dravyeṇa)
  // b17 (inline-em)
  [17, 'sanskrit', 'kuḍyādou',            'kuḍyādau',            1], // ou→au (Deva कुड्यादौ)
  [17, 'sanskrit', 'आलेख्य',              'आलिख्य',              1], // Deva body ālekhya→ālikhya (header+IAST+mUlam आलिख्य)
  [17, 'sanskrit', 'āceret',              'ācaret',              1], // ceret→caret (Deva आचरेत्)
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

// residual glyph/token checks across ch73 verse sanskrit+iast
let all=''; ch.blocks.forEach(b=>{ if(b.type==='verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
const resid = {
  x: (all.match(/x/g)||[]).length,
  ou: (lat.match(/ou/g)||[]).length,
  ao: (lat.match(/ao/g)||[]).length,
  catra: (lat.match(/catra/g)||[]).length,
  addbhyah: (all.match(/अद्द्भ्यः/g)||[]).length,
  tadravyena: (all.match(/तद्रव्येण/g)||[]).length,
  aalekhya: (all.match(/आलेख्य/g)||[]).length,
  aaceret: (lat.match(/āceret/g)||[]).length,
};
console.log(JSON.stringify(resid));
for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);

// markup balance on touched blocks
for (const bi of [7,9,15,17]) for (const f of ['sanskrit','iast']) {
  const v = ch.blocks[bi][f] || '';
  for (const t of ['p','em','strong','blockquote']) {
    const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
    if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
  }
}
console.log('markup balanced.');
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
