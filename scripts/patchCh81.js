// ch81 (Anuṣṭhāna-kalpa-vidhiḥ — ritual-observance manual: ūrdhvapuṇḍra forehead marks, pavitra
// kuśa-ring, brāhma-snāna) reconciliation vs mUlam 081_anuShThAnakalpavidhiH.md. Documented chapter
// (20 blocks, chapters[80]): prose intro b1/b2, section bands, pattern-a verse b4/b5/b6/b10/b11/b12 +
// pattern-b b8/b14/b16 (inline-em IAST in sanskrit) + editorial prose b17/b18/b19 LEFT untouched.
// English per-block ALIGNED & UNTOUCHED. Fixes: global x→kṣ (daxiṇa ×6 b11, daxiṇakarṇe b14) +
// global ou→au (lalāṭādou, kukṣou ×2, bāhou ×2, nityādou, napuṃsakou); targeted Deva b8
// विष्णवालये→विष्ण्वालये (viṣṇu+ālaya; IAST viṣṇvālaye correct), b14 नपुसकौ→नपुंसकौ (missing anusvāra;
// IAST napuṃsakau correct, cf नपुंसकं earlier same block). Deva side otherwise clean.
// PLUS: inserted Colophon (absent from reader; mUlam has it) at index 17, ch70-80 style. Colophon
// name follows the mUlam colophon (Anuṣṭhāna-kalpa-vidhiḥ), which differs from the reader's long
// descriptive b0 title (Yajñādīnāṃ Viṣṇupūjāṅgatva-Ūrdhvapuṇḍra-Pavitra-Snāna-vidhiḥ).
// LEFT editorial: many "(or …)" variant notes (Deva side), b11 "(or apare)" dropped in IAST.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[80];
if (ch.number !== 81) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount] — targeted; run BEFORE global x/ou passes
const FIXES = [
  [8,  'sanskrit', 'विष्णवालये', 'विष्ण्वालये', 1], // Deva viṣṇava→viṣṇv (viṣṇu+ālaya; IAST viṣṇvālaye)
  [14, 'sanskrit', 'नपुसकौ',     'नपुंसकौ',      1], // Deva missing anusvāra (cf नपुंसकं; IAST napuṃsaka-)
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

// global x→kṣ and ou→au across ch81 verse fields
let xfixed = 0, oufixed = 0;
ch.blocks.forEach(b => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit','iast']) {
    if (!b[f]) continue;
    let nx = (b[f].match(/x/g)||[]).length; if (nx) { b[f] = b[f].split('x').join('kṣ'); xfixed += nx; }
    let no = (b[f].match(/ou/g)||[]).length; if (no) { b[f] = b[f].split('ou').join('au'); oufixed += no; }
  }
});
console.log('x→kṣ:', xfixed, '| ou→au:', oufixed);

// --- Insert Colophon block (mUlam: इति श्रीवैखानसे ... एकाशीतितमः पटलः ॥ ८१ ॥) ---
const COL_INDEX = 17;
if (ch.blocks[COL_INDEX].type !== 'prose') throw new Error('expected prose at index ' + COL_INDEX);
const hasCol = ch.blocks.some(b => b.colophon || /इति श्रीवैखानसे|iti śrī-vaikhānase/.test((b.sanskrit||'')+(b.iast||'')));
if (!hasCol) {
  ch.blocks.splice(COL_INDEX, 0, {
    type: 'verse', label: 'Colophon',
    sanskrit: '<blockquote>\n<p>(इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे अनुष्ठानकल्पविधिर्नाम एकाशीतितमः पटलः ॥८१॥)</p>\n</blockquote>\n',
    iast: '<blockquote>\n<p>(iti śrī-vaikhānase marīciprokte vimānārcanākalpe anuṣṭhānakalpavidhir-nāma ekāśītitamaḥ paṭalaḥ ||81||)</p>\n</blockquote>\n',
    english: '<ul>\n<li><strong>Colophon:</strong> (Thus ends the Eighty-first Chapter, titled <em>“The Rules of Ritual Observance”</em> (Anuṣṭhāna-kalpa-vidhiḥ), in the <em>Vimānārcanākalpa</em> of the <em>Vaikhānasa</em> school, compiled by Sage Marīci.)</li>\n</ul>\n',
    text: '> (इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे अनुष्ठानकल्पविधिर्नाम एकाशीतितमः पटलः ॥८१॥)\n> (iti śrī-vaikhānase marīciprokte vimānārcanākalpe anuṣṭhānakalpavidhir-nāma ekāśītitamaḥ paṭalaḥ ||81||)\n*   **Colophon:** (Thus ends the Eighty-first Chapter, titled *“The Rules of Ritual Observance”* (Anuṣṭhāna-kalpa-vidhiḥ), in the *Vimānārcanākalpa* of the *Vaikhānasa* school, compiled by Sage Marīci.)',
    colophon: true, num: null,
  });
  console.log('colophon inserted at', COL_INDEX, '| new block count:', ch.blocks.length);
} else console.log('colophon already present.');

// residual checks
let all=''; ch.blocks.forEach(b=>{ if(b.type==='verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
const resid = { x:(lat.match(/x/g)||[]).length, ou:(lat.match(/ou/g)||[]).length, z:(lat.match(/z/g)||[]).length,
  vishnava:(all.match(/विष्णवालये/g)||[]).length, napusaka:(all.match(/नपुसकौ/g)||[]).length };
console.log(JSON.stringify(resid));
for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);

// markup balance
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
