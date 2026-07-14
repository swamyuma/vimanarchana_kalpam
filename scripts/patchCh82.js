// ch82 (Ṛṣi-chando'dhidevatā-vidhiḥ — the seers/meters/presiding deities of the twilight-worship
// [sandhyopāsana] mantras) reconciliation vs mUlam 082_RShiChando-dhidevatAvidhiH.md. Documented
// chapter (chapters[81], 10 blocks): prose intro b1/b2, section bands b3/b5, pattern-b verse b4/b6
// (inline-em IAST in sanskrit; iast field empty) + editorial prose b7 Glossary / b8 Typo-table /
// b9 Bibliography LEFT untouched. English per-block ALIGNED & UNTOUCHED. Small & clean.
//
// 7 fixes (all in the `sanskrit` field; NO x/ou/z artifacts present):
//   b4 IAST adhidevatāni→adhidaivatāni : title Deva reads अधिदैवतानि (dai; confirmed by editor's own
//        typo-table row + mUlam body ऋषिच्छन्दोऽधिदैवतानि ×2). IAST was missing the diphthong. (The
//        body's "adhidevatā ca" correctly matches its Deva अधिदेवता — left; only the -āni title slipped.)
//   b6 IAST jagatyāḥ→jagatyaḥ           : Deva जगत्यः (nom.pl. of जगती, short a); IAST had long ā.
//   b6 IAST bhūrbhuvahsvarom→bhūrbhuvaḥsvarom : Deva भूर्भुवःस्वरोम् — visarga ः written as plain h.
//   b6 SHARED सहिरस्कां→सशिरस्कां & sahiraskāṃ→saśiraskāṃ : ह-for-श corruption (हिरस् is a non-word);
//        the word is स-शिरस्क "with the (Gāyatrī-)śiras/head"; mUlam सशिरस्कां + English "Gayatri-shiras" confirm.
//   b6 IAST tamasaspaṣi→tamasaspari    : Deva तमसस्परि; the RV mantra "udvayaṃ tamasas pari" (ṣ→p slip).
//   b6 IAST uṣnig→uṣṇig                : Deva उष्णिग् (retroflex ṇ); spelled uṣṇig correctly in para 1.
//
// PLUS: inserted Colophon (ABSENT from reader — b6 ends at kārayet, next block is Glossary; the
// Bibliography's own page-map even notes "...to Section 2 and Colophon") at index 7, ch74/77/80/81
// convention. Colophon name follows the mUlam colophon (ऋषिछन्दोऽधिदेवताविधिः, using adhidevatā/de),
// which differs from the reader's descriptive b0 title (Sandhyopāsana-mantra-ṛṣi-chandas-devatā-vidhiḥ).
//
// LEFT as editorial/benign (Deva=IAST cohere; mUlam differs): b4 "अग्निः सूर्यः च" split vs IAST
// "sūryaśca" sandhi'd (both valid); b6 हिरण्यस्तूप (mUlam हिरण्यरूप), प्रजापतिः as prāṇāyāma seer
// (mUlam ब्रह्मा), त्रिरुच्चार्य जपेत् (mUlam त्रिर्जपेत्); all the "(or …)" variant notes.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[81];
if (ch.number !== 82) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount]
const FIXES = [
  [4, 'sanskrit', 'adhidevatāni',    'adhidaivatāni',    1], // title; Deva अधिदैवतानि
  [6, 'sanskrit', 'jagatyāḥ',        'jagatyaḥ',         1], // Deva जगत्यः short a
  [6, 'sanskrit', 'bhūrbhuvahsvarom','bhūrbhuvaḥsvarom', 1], // Deva भुवः visarga
  [6, 'sanskrit', 'सहिरस्कां',        'सशिरस्कां',         1], // SHARED corruption ह→श (Deva)
  [6, 'sanskrit', 'sahiraskāṃ',      'saśiraskāṃ',       1], // SHARED corruption ha→śa (IAST)
  [6, 'sanskrit', 'tamasaspaṣi',     'tamasaspari',      1], // Deva तमसस्परि (mantra ...tamasas pari)
  [6, 'sanskrit', 'uṣnig',           'uṣṇig',            1], // Deva उष्णिग् retroflex ṇ
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

// --- Insert Colophon block (mUlam: इति श्रीवैखानसे ... द्व्यशीतितमः पटलः ॥ ८२ ॥) ---
// After last content verse (b6), before editorial apparatus (b7 Glossary). Style matches ch74/77/80/81.
const COL_INDEX = 7;
if (ch.blocks[COL_INDEX].type !== 'prose') throw new Error('expected prose (Glossary) at index ' + COL_INDEX);
const hasCol = ch.blocks.some(b => b.colophon || /इति श्रीवैखानसे|iti śrī-vaikhānase/.test((b.sanskrit||'')+(b.iast||'')));
if (!hasCol) {
  ch.blocks.splice(COL_INDEX, 0, {
    type: 'verse', label: 'Colophon',
    sanskrit: '<blockquote>\n<p>(इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे ऋषि-च्छन्दः-अधिदेवता-विधिर्नाम द्व्यशीतितमः पटलः ॥८२॥)</p>\n</blockquote>\n',
    iast: '<blockquote>\n<p>(iti śrī-vaikhānase marīciprokte vimānārcanākalpe ṛṣi-cchandaḥ-adhidevatā-vidhir-nāma dvyāśītitamaḥ paṭalaḥ ||82||)</p>\n</blockquote>\n',
    english: '<ul>\n<li><strong>Colophon:</strong> (Thus ends the Eighty-second Chapter, titled <em>“The Rules concerning the Seers, Meters, and Presiding Deities of the Mantras”</em> (Ṛṣi-cchandaḥ-adhidevatā-vidhiḥ), in the <em>Vimānārcanākalpa</em> of the <em>Vaikhānasa</em> school, compiled by Sage Marīci.)</li>\n</ul>\n',
    text: '> (इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे ऋषि-च्छन्दः-अधिदेवता-विधिर्नाम द्व्यशीतितमः पटलः ॥८२॥)\n> (iti śrī-vaikhānase marīciprokte vimānārcanākalpe ṛṣi-cchandaḥ-adhidevatā-vidhir-nāma dvyāśītitamaḥ paṭalaḥ ||82||)\n*   **Colophon:** (Thus ends the Eighty-second Chapter, titled *“The Rules concerning the Seers, Meters, and Presiding Deities of the Mantras”* (Ṛṣi-cchandaḥ-adhidevatā-vidhiḥ), in the *Vimānārcanākalpa* of the *Vaikhānasa* school, compiled by Sage Marīci.)',
    colophon: true, num: null,
  });
  console.log('colophon inserted at', COL_INDEX, '| new block count:', ch.blocks.length);
} else console.log('colophon already present.');

// residual checks (must all be 0)
let all=''; ch.blocks.forEach(b=>{ if(b.type==='verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
const resid = { x:(lat.match(/x/g)||[]).length, ou:(lat.match(/ou/g)||[]).length, z:(lat.match(/z/g)||[]).length,
  sahiras:(all.match(/सहिरस्कां/g)||[]).length, sahira_iast:(all.match(/sahiraskāṃ/g)||[]).length,
  tamasaspasi:(all.match(/tamasaspaṣi/g)||[]).length, usnig:(all.match(/uṣnig/g)||[]).length };
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
