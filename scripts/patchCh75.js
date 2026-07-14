// ch75 (Utpāta-śānti-vidhiḥ) reconciliation vs mUlam 075_utpAtashAntividhiH.md.
// Heavily-reconstructed "documented" chapter (30 blocks, chapters[74]): prose intro b1/b2,
// section bands, pattern-a verse b4/b5/b7/b9/b10/b11/b12/b14/b15/b17/b23/b24 (separate iast) +
// pattern-b b19/b21/b26 (inline-em IAST inside sanskrit) + colophon b27 (clean, present) +
// editorial prose b28 Glossary / b29 Typo-table LEFT untouched. English per-block ALIGNED &
// UNTOUCHED (verify: 0 english diffs). 13 fixes across 6 verse blocks:
//   glyph/transliteration slips (one side clearly a romanization error) — dattva→dattvā,
//   naimittikou→naimittikau, prāsādādou→prāsādādau (ou→au), caoṣadhīnāṃ→cauṣadhīnāṃ (ao→au),
//   anyadevalaye→anyadevālaye (dropped ā), rājā-rāṣṭra→rāja-rāṣṭra (spurious ā in dvandva);
//   Deva-only corruption — अद्भुतदानि→अद्भुतानि (spurious द);
//   SHARED Deva+IAST corruptions (non-word/incoherent, confirmed by mUlam + internal parallels) —
//   तद्वेर→तद्बेर/tadvera→tadbera (b/v; "beraṃ" used correctly 3 words earlier same sentence),
//   आलाभ्यन्तर→आलयाभ्यन्तर/ālābhyantareṣu→ālayābhyantareṣu (dropped य; mUlam ālaya-abhyantara,
//     cf. b21 garbhagṛhābhyantareṣu), भित्त्या→शिल्पिना/bhittyā→śilpinā (mUlam+b24 exact parallel
//     "śilpinā anyena vā"; the agent slot "X, or by another" cannot be "by a wall").
// LEFT as editorial divergences (Deva=IAST cohere, plausible reading, mUlam differs): b5 kartr-
//   adhikāriṇoḥ (mUlam ārādhaka; reader's own choice, cf. b19 ārādhaka), the pervasive kartr-
//   for कर्तृ transliteration (systemic, left per ch72/73 precedent), b10 mahāanāvṛṣṭi, b21
//   śaktyādikam (mUlam śāntyādikam; śakti is grammatical & plausibly refers to the śakti-
//   projection), b24 karkaraiḥ (mUlam śarkarā), and hyphenation (rāja-veśma vs राजवेश्म).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[74];
if (ch.number !== 75) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount, note]
const FIXES = [
  // b7 (pattern-a) — gerund macron
  [7,  'iast',     'dattva',            'dattvā',            1], // Deva दत्त्वा
  // b9 (pattern-a) — Deva spurious द
  [9,  'sanskrit', 'अद्भुतदानि',        'अद्भुतानि',         1], // IAST adbhutāni + English "three kinds"
  // b19 (pattern-b, inline em in sanskrit) — IAST slips
  [19, 'sanskrit', 'rājā-rāṣṭra',       'rāja-rāṣṭra',       1], // Deva राज (dvandva stem, spurious ā)
  [19, 'sanskrit', 'caoṣadhīnāṃ',       'cauṣadhīnāṃ',       1], // Deva चौषधीनां (ao→au)
  [19, 'sanskrit', 'anyadevalaye',      'anyadevālaye',      1], // Deva देवालये (dropped ā; cf rudrālaye etc.)
  // b21 (pattern-b) — shared b/v + ou + corrupt word
  [21, 'sanskrit', 'तद्वेरस्थां',        'तद्बेरस्थां',        1], // b/v; बेरं used correctly adjacent
  [21, 'sanskrit', 'tadverasthāṃ',      'tadberasthāṃ',      1], // IAST mirror
  [21, 'sanskrit', 'naimittikou',       'naimittikau',       1], // Deva नैमित्तिकौ (ou→au)
  [21, 'sanskrit', 'भित्त्या',          'शिल्पिना',          1], // mUlam+b24 "śilpinā anyena vā"; wall≠agent
  [21, 'sanskrit', 'bhittyā',           'śilpinā',           1], // IAST mirror
  // b23 (pattern-a) — shared dropped-य
  [23, 'sanskrit', 'आलाभ्यन्तरेषु',      'आलयाभ्यन्तरेषु',     1], // mUlam ālaya-abhyantara
  [23, 'iast',     'ālābhyantareṣu',    'ālayābhyantareṣu',  1], // IAST mirror
  // b24 (pattern-a) — ou→au
  [24, 'iast',     'prāsādādou',        'prāsādādau',        1], // Deva प्रासादादौ
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

// residual sanity checks across ch75 verse sanskrit+iast
let all=''; ch.blocks.forEach(b=>{ if(b.type==='verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
const resid = {
  ou: (lat.match(/ou/g)||[]).length,
  ao: (lat.match(/ao/g)||[]).length,
  tadvera: (all.match(/तद्वेर/g)||[]).length,
  aalaabhyantara: (all.match(/आलाभ्यन्तर/g)||[]).length,
  adbhutadaani: (all.match(/अद्भुतदानि/g)||[]).length,
  bhittya: (all.match(/भित्त्या/g)||[]).length,
  bhittya_lat: (lat.match(/bhittyā/g)||[]).length,
  alaabh_lat: (lat.match(/ālābhyantareṣu/g)||[]).length,
};
console.log(JSON.stringify(resid));
for (const k in resid) if (resid[k]) throw new Error('residual: ' + k);

// markup balance on ALL ch75 verse blocks
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
