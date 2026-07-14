// ch78 (Pavitrāropaṇa-vidhiḥ — the sacred-thread offering festival) reconciliation vs mUlam
// 078_pavitrAropaNavidhiH.md. Large documented chapter (27 blocks, chapters[77]): prose intro
// b1/b2, section bands, pattern-b verse b4/b11/b13/b15 (inline-em IAST in sanskrit) + pattern-a
// b6/b7/b8/b9/b17/b18/b19/b20/b21/b22 (separate iast) + colophon b23 (clean, present) + editorial
// prose b24/b25/b26. English per-block ALIGNED & UNTOUCHED (verify: 0 english diffs).
// DOMINANT: systematic "x"-for-"kṣ" romanization artifact (all 14 remaining x = kṣ this chapter;
// pradaxiṇa, axata, sarvaraxā, yaxa, praxālya, daxiṇa) — fixed by a global x→kṣ pass. PLUS 18
// targeted slips (Deva side clean unless noted):
//   b11 IAST gāyatriyā→gāyatryā, ārabhyā→ārabhya, āheret→āharet; b11 SHARED b/v विम्ब→बिम्ब +
//     vimba→bimba (bimba "icon"); b11 Deva द्वादशग्रन्धिं→द्वादशग्रन्थिं (ध→थ; IAST granthiṃ correct);
//   b13 IAST dhānayapīṭhe→dhānyapīṭhe, adhibhāsya→adhivāsya; b13 SHARED metathesis
//     प्रादिक्षण्य→प्रादक्षिण्य + prādixaṇya→prādakṣiṇya (mUlam+English "clockwise" prādakṣiṇya);
//   b15 IAST puṇyapūṣpādyaiḥ→puṇyapuṣpādyaiḥ, ṛtvijasca→ṛtvijaśca, dvādāśākṣaraṃ→dvādaśākṣaraṃ;
//   b19 IAST purassarām→purassaram; b20 IAST samāceret→samācaret, tattantmantram→tattanmantram;
//   b22 SHARED garble सप्तहाहं→सप्ताहं + saptahāhaṃ→saptāhaṃ (saptāhaṃ "seven days").
// LEFT as editorial (Deva=IAST cohere / English-endorsed): b13 आधारं हुत्वा (mUlam+following
//   आघारान्ते suggest āghāraṃ, but Deva=IAST=English all read ādhāra — cf ch25 precedent), the many
//   "(or …)" variant notes, sodakāṃ (fem agreement), mahāhavis/pañcahavis (havis s-stem sandhi).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[77];
if (ch.number !== 78) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount] — targeted (non-x) fixes; run BEFORE global x→kṣ
const FIXES = [
  [11, 'sanskrit', 'gāyatriyā',       'gāyatryā',        1], // IAST (Deva गायत्र्या)
  [11, 'sanskrit', 'ārabhyā jān',     'ārabhya jān',     1], // IAST gerund spurious ā (Deva आरभ्य)
  [11, 'sanskrit', 'āheret',          'āharet',          1], // IAST (Deva आहरेत्)
  [11, 'sanskrit', 'विम्ब',           'बिम्ब',           1], // Deva b/v (bimba "icon"; mUlam बिम्ब)
  [11, 'sanskrit', 'vimba',           'bimba',           1], // IAST mirror
  [11, 'sanskrit', 'द्वादशग्रन्धिं',   'द्वादशग्रन्थिं',   1], // Deva ध→थ (IAST granthiṃ correct)
  [13, 'sanskrit', 'dhānayapīṭhe',    'dhānyapīṭhe',     1], // IAST spurious a (Deva धान्यपीठे)
  [13, 'sanskrit', 'adhibhāsya',      'adhivāsya',       1], // IAST bh→v (Deva अधिवास्य)
  [13, 'sanskrit', 'प्रादिक्षण्य',     'प्रादक्षिण्य',     1], // Deva metathesis (prādakṣiṇya "clockwise")
  [13, 'sanskrit', 'prādixaṇya',      'prādakṣiṇya',     1], // IAST mirror (also resolves its x)
  [15, 'sanskrit', 'puṇyapūṣpādyaiḥ', 'puṇyapuṣpādyaiḥ', 1], // IAST ū→u (Deva पुष्प)
  [15, 'sanskrit', 'ṛtvijasca',       'ṛtvijaśca',       1], // IAST s→ś (Deva ऋत्विजश्च)
  [15, 'sanskrit', 'dvādāśākṣaraṃ',   'dvādaśākṣaraṃ',   1], // IAST spurious long ā (Deva द्वादशाक्षरं)
  [19, 'iast',     'purassarām',      'purassaram',      1], // IAST spurious long ā (Deva पुरस्सरम्)
  [20, 'iast',     'samāceret',       'samācaret',       1], // IAST ceret→caret (Deva समाचरेत्)
  [20, 'iast',     'tattantmantram',  'tattanmantram',   1], // IAST spurious t (Deva तत्तन्मन्त्रम्)
  [22, 'sanskrit', 'सप्तहाहं',         'सप्ताहं',          1], // Deva garble (saptāhaṃ "seven days")
  [22, 'iast',     'saptahāhaṃ',      'saptāhaṃ',        1], // IAST mirror
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

// global x→kṣ across all ch78 verse fields (every remaining x is kṣ; prādixaṇya handled above)
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

// residual checks across ch78 verse fields
let all=''; ch.blocks.forEach(b=>{ if(b.type==='verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
const resid = {
  x:(lat.match(/x/g)||[]).length, ou:(lat.match(/ou/g)||[]).length, z:(lat.match(/z/g)||[]).length,
  vimba:(all.match(/विम्ब/g)||[]).length, grandhi:(all.match(/ग्रन्धि/g)||[]).length,
  saptahaaha:(all.match(/सप्तहाहं/g)||[]).length, praadikshanya:(all.match(/प्रादिक्षण्य/g)||[]).length,
};
console.log(JSON.stringify(resid));
for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);

// markup balance on ALL ch78 verse blocks
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
