// ch76 (Śānti-pañcaka-vidhiḥ — the five pacifications) reconciliation vs mUlam
// 076_shAntipanchakavidhiH.md. Documented chapter (26 blocks, chapters[75]): prose intro b1/b2,
// section bands, pattern-b verse b4/b6/b8/b10/b12/b14/b19 (inline-em IAST in sanskrit) + pattern-a
// b16/b17/b21/b22 (separate iast) + colophon b23 (clean, present) + editorial prose b24/b25.
// English per-block ALIGNED & UNTOUCHED (verify: 0 english diffs).
// DOMINANT ISSUE: systematic "x"-for-"kṣ" romanization artifact in the IAST (x is not valid IAST) —
// nixipya, pradaxiṇaṃ, saṃproxya, naxatre, bahuxīraṃ, praxālya, xīreṇa, navexita, kalaśa-xīraṃ,
// xīradhārayā, xīrasnānaṃ, bandhu-xaye, durbhixe → kṣ; the lone duḥxatraya → duḥkha (दुःख, x=kh).
// Plus ou→au (anāvṛṣṭou, śrāmaṇakāgnou, aupāsanāgnou), b/v (बिना→विना, बेतस→वेतस), and Deva↔IAST
// slips. Deva side clean in each; fixes touch the erroneous side (or both for shared b/v & non-words).
// LEFT as editorial (Deva=IAST cohere, plausible, mUlam differs, or explicit editor "(or …?)" notes):
//   b6 sampūraṃ (mUlam sampūrṇaṃ), b8 kumāre "(or … sthaṇḍile?)" & abhyajya (mUlam abhyarcya),
//   b10 saṅgā/sampūraṇa-karma reworded, b12 gṛtvā (mUlam gṛhītvā; a contraction), b21 mahāvṛṣṭi-nāśe
//   "(or mahāratha…?)". Padaccheda already thorough; conservative — no added splits.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[75];
if (ch.number !== 76) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount]
const FIXES = [
  // b6 (pattern-b)
  [6,  'sanskrit', 'ṣodaśa',           'ṣoḍaśa',            1], // IAST dental→retroflex ḍ (Deva षोडश)
  [6,  'sanskrit', 'nixipya',          'nikṣipya',          2], // x→kṣ (Deva निक्षिप्य)
  [6,  'sanskrit', 'gandhadravyāni',   'gandhadravyāṇi',    1], // IAST n→ṇ (Deva द्रव्याणि)
  // b8 (pattern-b)
  [8,  'sanskrit', 'pradaxiṇaṃ',       'pradakṣiṇaṃ',       1], // x→kṣ
  [8,  'sanskrit', 'saṃproxya',        'saṃprokṣya',        1], // x→kṣ (Deva संप्रोक्ष्य)
  [8,  'sanskrit', 'naxatre',          'nakṣatre',          1], // x→kṣ
  [8,  'sanskrit', 'निविद्य',           'निवेद्य',            1], // Deva इ→ए (IAST nivedya; havir-nivedya)
  [8,  'sanskrit', 'dattva',           'dattvā',            1], // IAST dropped macron (Deva दत्त्वा)
  // b10 (pattern-b)
  [10, 'sanskrit', 'anāvṛṣṭou',        'anāvṛṣṭau',         1], // ou→au (Deva अनावृष्टौ)
  [10, 'sanskrit', 'dhānayapīṭhe',     'dhānyapīṭhe',       1], // IAST spurious a (Deva धान्यपीठे)
  [10, 'sanskrit', 'बेतस',             'वेतस',              2], // Deva b/v (IAST vetasa; willow, cf 1st occurrence)
  // (b10 आज्येना→आज्येन handled separately below, after बेतस→वेतस, to avoid clashing with b8 sandhi आज्येना)
  // b12 (pattern-b)
  [12, 'sanskrit', 'bahuxīraṃ',        'bahukṣīraṃ',        1], // x→kṣ
  [12, 'sanskrit', 'praxālya',         'prakṣālya',         1], // x→kṣ
  [12, 'sanskrit', 'xīreṇa',           'kṣīreṇa',           1], // x→kṣ
  [12, 'sanskrit', 'navexita',         'navekṣita',         1], // x→kṣ
  [12, 'sanskrit', 'kalaśa-xīraṃ',     'kalaśa-kṣīraṃ',     1], // x→kṣ
  [12, 'sanskrit', 'xīradhārayā',      'kṣīradhārayā',      1], // x→kṣ
  [12, 'sanskrit', 'xīrasnānaṃ',       'kṣīrasnānaṃ',       1], // x→kṣ
  [12, 'sanskrit', 'आराधाय',           'आराध्य',            1], // Deva (IAST ārādhya; mUlam आराध्य)
  [12, 'sanskrit', 'āchādayet',        'ācchādayet',        1], // IAST single→double c (Deva आच्छादयेत्)
  [12, 'sanskrit', 'वर्षाथी',           'वर्षार्थी',          1], // Deva dropped र् (IAST varṣārthī)
  // b14 (pattern-b)
  [14, 'sanskrit', 'बिना',             'विना',              1], // Deva b/v (Skt vinā "without"; mUlam विना)
  [14, 'sanskrit', 'binā',             'vinā',              1], // IAST mirror
  [14, 'sanskrit', 'byarcya',          'bhyarcya',          1], // IAST dropped h ('byarcya→'bhyarcya; Deva अभ्यर्च्य)
  // b16 (pattern-a)
  [16, 'sanskrit', 'बिना',             'विना',              1], // Deva b/v
  [16, 'iast',     'binā',             'vinā',              1], // IAST mirror
  [16, 'iast',     'śrāmaṇakāgnou',    'śrāmaṇakāgnau',     1], // ou→au (Deva श्रामणकाग्नौ)
  // b17 (pattern-a)
  [17, 'iast',     'aupāsanāgnou',     'aupāsanāgnau',      1], // ou→au (Deva औपासनाग्नौ)
  // b19 (pattern-b)
  [19, 'sanskrit', 'dattva',           'dattvā',            1], // IAST dropped macron (Deva दत्त्वा)
  // b21 (pattern-a)
  [21, 'iast',     'parasena-abhibhave','parasenā-abhibhave',1], // IAST dropped ā (Deva परसेना; senā stem)
  [21, 'iast',     'bandhu-xaye',      'bandhu-kṣaye',      1], // x→kṣ (Deva क्षये)
  [21, 'iast',     'anāvṛṣṭou',        'anāvṛṣṭau',         1], // ou→au
  [21, 'iast',     'durbhixe',         'durbhikṣe',         1], // x→kṣ (Deva दुर्भिक्षे)
  [21, 'iast',     'duḥxa',            'duḥkha',            1], // x→kh (Deva दुःख "misery", NOT kṣ)
  // b22 (pattern-a)
  [22, 'sanskrit', 'नवाहमं',           'नवाहं',             1], // Deva spurious म (mUlam नवाहं)
  [22, 'iast',     'navāhamaṃ',        'navāhaṃ',           1], // IAST mirror
];

// The b10 आज्येना→आज्येन fix needs care: "आज्येना" also occurs legitimately in b8 as sandhi
// (आज्येन+अष्टोत्तर). Handle it here scoped to b10 only, AFTER the बेतस→वेतस pass.
let applied = 0;
for (const [bi, f, from, to, exp] of FIXES) {
  if (from === to) continue; // skip no-op placeholders
  const b = ch.blocks[bi];
  if (!b || b.type !== 'verse') throw new Error('block ' + bi + ' not a verse');
  const n = (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b${bi}.${f} "${from}": expected ${exp}, found ${n}`);
  b[f] = b[f].split(from).join(to);
  applied += n;
}
// scoped b10 आज्येना→आज्येन (now that बेतस→वेतस done, target "आज्येन वेतस" context)
{
  const b = ch.blocks[10];
  const n = (b.sanskrit.match(/आज्येना वेतस/g)||[]).length;
  if (n !== 1) throw new Error('b10 "आज्येना वेतस" expected 1, found ' + n);
  b.sanskrit = b.sanskrit.replace('आज्येना वेतस', 'आज्येन वेतस');
  applied += 1;
}
console.log('targeted fixes applied:', applied);

// residual sanity checks across ch76 verse fields
let all=''; ch.blocks.forEach(b=>{ if(b.type==='verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
const resid = {
  x: (lat.match(/x/g)||[]).length,
  ou: (lat.match(/ou/g)||[]).length,
  z: (lat.match(/z/g)||[]).length,
  baina: (all.match(/बिना/g)||[]).length,
  betasa: (all.match(/बेतस/g)||[]).length,
  nividya: (all.match(/निविद्य/g)||[]).length,
  aaraadhaaya: (all.match(/आराधाय/g)||[]).length,
  varshaathii: (all.match(/वर्षाथी/g)||[]).length,
  navaahamam: (all.match(/नवाहमं/g)||[]).length,
  ajyenaa_betasa: (all.match(/आज्येना वेतस/g)||[]).length,
};
console.log(JSON.stringify(resid));
for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);

// markup balance on ALL ch76 verse blocks
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
