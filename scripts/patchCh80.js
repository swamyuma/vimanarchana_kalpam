// ch80 (Āghārādi-adhidevāgnidhyāna-vidhiḥ — presiding deities of fire-implements & meditation on
// Agni's form) reconciliation vs mUlam 080_adhidevAgnidhyAnavidhiH.md. Documented chapter (12
// blocks, chapters[79]): prose intro b1/b2, section bands, pattern-b verse b4/b6/b8 (inline-em IAST
// in sanskrit) + editorial prose b9/b10/b11 LEFT untouched. English per-block ALIGNED & UNTOUCHED.
// Fixes: global x→kṣ (daxiṇa/axamālā/caxuṣi) + global ou→au (paridhou×5, mitrāvaruṇou, jvaladagnou);
// targeted: b4 juhvādaiśca→juhvādeśca (ai→e; Deva जुह्वादेश्च); b6 SHARED ṣadaxaṃ→ṣaḍakṣaṃ (x→kṣ AND
// d→ḍ; Deva षडक्षं), SHARED b/v अजबाहनं→अजवाहनं + ajabāhanaṃ→ajavāhanaṃ (vāhana "vehicle").
// PLUS: inserted the Colophon block (absent from reader; mUlam has it) at index 9, ch70-77 style;
// colophon name follows the mUlam colophon (Āghārādi-adhidevāgnidhyāna-vidhiḥ), which differs from
// the reader's descriptive b0 title (Agnikuṇḍādi-homopakaraṇa-devatā-vidhiḥ) — traditional vs editorial.
// LEFT editorial: b4 "(or …)" variant notes, ṣaḍakṣaṃ (mUlam ṣaṇṇetraṃ), khādiraṃ rāhavam (mUlam ब्राह्मं).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[79];
if (ch.number !== 80) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount] — targeted; run BEFORE the global x/ou passes
const FIXES = [
  [4, 'sanskrit', 'juhvādaiśca', 'juhvādeśca',  1], // IAST ai→e (Deva जुह्वादेश्च)
  [6, 'sanskrit', 'ṣadaxaṃ',     'ṣaḍakṣaṃ',    1], // IAST x→kṣ + d→ḍ (Deva षडक्षं "six-eyed")
  [6, 'sanskrit', 'अजबाहनं',     'अजवाहनं',     1], // Deva b/v (vāhana "vehicle"; mUlam अजवाहनं)
  [6, 'sanskrit', 'ajabāhanaṃ',  'ajavāhanaṃ',  1], // IAST mirror
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

// global x→kṣ and ou→au across ch80 verse fields
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

// --- Insert Colophon block (mUlam: इति श्रीवैखानसे ... अशीतितमः पटलः ॥ ८० ॥) ---
const COL_INDEX = 9;
if (ch.blocks[COL_INDEX].type !== 'prose') throw new Error('expected prose at index ' + COL_INDEX);
const hasCol = ch.blocks.some(b => b.colophon || /इति श्रीवैखानसे|iti śrī-vaikhānase/.test((b.sanskrit||'')+(b.iast||'')));
if (!hasCol) {
  ch.blocks.splice(COL_INDEX, 0, {
    type: 'verse', label: 'Colophon',
    sanskrit: '<blockquote>\n<p>(इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे आघारादि-अधिदेवाग्निध्यान-विधिर्नाम अशीतितमः पटलः ॥८०॥)</p>\n</blockquote>\n',
    iast: '<blockquote>\n<p>(iti śrī-vaikhānase marīciprokte vimānārcanākalpe āghārādi-adhidevāgnidhyāna-vidhir-nāma aśītitamaḥ paṭalaḥ ||80||)</p>\n</blockquote>\n',
    english: '<ul>\n<li><strong>Colophon:</strong> (Thus ends the Eightieth Chapter, titled <em>“The Rules for Meditation on the Presiding Fire-Deity, beginning with the Āghāra oblations”</em> (Āghārādi-adhidevāgnidhyāna-vidhiḥ), in the <em>Vimānārcanākalpa</em> of the <em>Vaikhānasa</em> school, compiled by Sage Marīci.)</li>\n</ul>\n',
    text: '> (इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे आघारादि-अधिदेवाग्निध्यान-विधिर्नाम अशीतितमः पटलः ॥८०॥)\n> (iti śrī-vaikhānase marīciprokte vimānārcanākalpe āghārādi-adhidevāgnidhyāna-vidhir-nāma aśītitamaḥ paṭalaḥ ||80||)\n*   **Colophon:** (Thus ends the Eightieth Chapter, titled *“The Rules for Meditation on the Presiding Fire-Deity, beginning with the Āghāra oblations”* (Āghārādi-adhidevāgnidhyāna-vidhiḥ), in the *Vimānārcanākalpa* of the *Vaikhānasa* school, compiled by Sage Marīci.)',
    colophon: true, num: null,
  });
  console.log('colophon inserted at', COL_INDEX, '| new block count:', ch.blocks.length);
} else console.log('colophon already present.');

// residual checks
let all=''; ch.blocks.forEach(b=>{ if(b.type==='verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
const resid = { x:(lat.match(/x/g)||[]).length, ou:(lat.match(/ou/g)||[]).length, z:(lat.match(/z/g)||[]).length,
  ajabaahana:(all.match(/अजबाहनं/g)||[]).length, ṣadaxa:(lat.match(/ṣadaxaṃ/g)||[]).length };
console.log(JSON.stringify(resid));
for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);

// markup balance on ALL ch80 verse blocks
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
