// ch96 (Yama-niyama-āsana-prāṇāyāma-vidhiḥ — the first four aṣṭāṅga-yoga limbs: yoga defined as
// jīvātman-paramātman union; the 10 yamas & 10 niyamas; 9 āsanas [brāhma/svastika/padma/gomukha/siṃha/
// mukta/vīra/bhadra/mayūra] + their uttama/madhyama/adhama grading; and prāṇāyāma [rēcaka/pūraka/kumbhaka,
// the 16:64:32 mātrā ratio, fire/sun/moon-maṇḍala visualisation → Nārāyaṇa in the heart]) vs mUlam
// 096_yamaniyamAsanaprANAyAmavidhiH.md. chapters[95], 15 blocks: prose intro b1/b2, section bands
//   b3/b5/b8/b11/b13, verse b4/b9 (pattern-b: inline-em IAST in sanskrit, iast EMPTY) + verse b6/b7
//   (pattern-a) + colophon b10 (pattern-a — ALREADY present, has english) + editorial Glossary b12 /
//   Typo-table b14 LEFT untouched. English ALIGNED & UNTOUCHED.
//
// DEFECT 1 (systematic, ch86-95 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs —
//   normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none.
// DEFECT 2: 'x' for क्ष AND ख (mapped per the Deva):
//   क्ष → vaxye/laxanam(b4), daxiṇ×5/prexaṇ×2/nixipya/nirīxya(b6);
//   ख  → gomux×2(b6 गोमुख), gomuxa(b7), kuṇḍalinīmuxaṃ/ūrdhvamuxaṃ(b9 …मुखं).
//
// TARGETED Deva↔IAST character slips (Deva clearly correct):
//   b6 vāmāpaṇiṃ→vāmapāṇiṃ (macron misplacement; Deva वामपाणिं); ūrorupiri→ūrvorupari (dropped व + piri→pari;
//     Deva ऊर्वोरुपरि); pādo→pādau (dual au; Deva पादौ); karatāle→karatale (spurious ā; Deva करतले);
//   b9 tatrashaṃ→tatrasthaṃ (sth; Deva तत्रस्थं); yāvaccakyaṃ→yāvacchakyaṃ (cch; Deva यावच्छक्यं);
//     niḥśvāsānirodhaḥ→niḥśvāsanirodhaḥ (spurious ā; Deva निःश्वासनिरोधः);
//   b10 COLOPHON Deva श्रीवैखांनसे→श्रीवैखानसे & नांम→नाम (spurious anusvāras; IAST already śrīvaikhānase/nāma).
//
// No colophon insert (b10 present). LEFT: reader's (or …) variants, redundant "(nābhau)" paren echo in
//   b9 (word itself correct — an editorial paren, not a char slip), colophon lacking "(मातृकान्तरे ९१)";
//   apparatus blocks (Glossary/Typo-table); english's own ō/ē.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[95];
if (ch.number !== 96) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;
if (B.length !== 15) throw new Error('expected 15 blocks, got ' + B.length);

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
rep(4, 'sanskrit', 'vaxye', 'vakṣye', 1);        // क्ष (वक्ष्ये)
rep(4, 'sanskrit', 'laxanam', 'lakṣaṇam', 2);    // क्ष + retroflex ण (लक्षणम् ×2)
// b6 (pattern-a iast)
rep(6, 'iast', 'daxiṇ', 'dakṣiṇ', 5);            // क्ष (दक्षिण ×5)
rep(6, 'iast', 'gomux', 'gomukh', 2);            // ख (गोमुख ×2)
rep(6, 'iast', 'prexaṇ', 'prekṣaṇ', 2);          // क्ष (प्रेक्षण ×2)
rep(6, 'iast', 'nixipya', 'nikṣipya', 1);        // क्ष (निक्षिप्य)
rep(6, 'iast', 'nirīxya', 'nirīkṣya', 1);        // क्ष (निरीक्ष्य)
rep(6, 'iast', 'vāmāpaṇiṃ', 'vāmapāṇiṃ', 1);     // macron placement (वामपाणिं)
rep(6, 'iast', 'ūrorupiri', 'ūrvorupari', 1);    // dropped व + piri→pari (ऊर्वोरुपरि)
rep(6, 'iast', 'pādo daṇḍavad', 'pādau daṇḍavad', 1); // dual au (पादौ)
rep(6, 'iast', 'karatāle', 'karatale', 1);       // spurious ā (करतले)
// b7 (pattern-a iast)
rep(7, 'iast', 'gomuxa', 'gomukha', 1);          // ख (गोमुख)
// b9 (pattern-b sanskrit)
rep(9, 'sanskrit', 'kuṇḍalinīmuxaṃ', 'kuṇḍalinīmukhaṃ', 1); // ख (कुण्डलिनीमुखं)
rep(9, 'sanskrit', 'ūrdhvamuxaṃ', 'ūrdhvamukhaṃ', 1);       // ख (ऊर्ध्वमुखं)
rep(9, 'sanskrit', 'tatrashaṃ', 'tatrasthaṃ', 1);           // sth (तत्रस्थं)
rep(9, 'sanskrit', 'yāvaccakyaṃ', 'yāvacchakyaṃ', 1);       // cch (यावच्छक्यं)
rep(9, 'sanskrit', 'niḥśvāsānirodhaḥ', 'niḥśvāsanirodhaḥ', 1); // spurious ā (निःश्वासनिरोधः)
// b10 (colophon Deva)
rep(10, 'sanskrit', 'वैखांनसे', 'वैखानसे', 1);   // spurious anusvāra
rep(10, 'sanskrit', 'नांम', 'नाम', 1);           // spurious anusvāra

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
