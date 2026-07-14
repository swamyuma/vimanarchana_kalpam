// ch70 (Bhaya-rakṣārtha-niṣkṛtiḥ / colophon: Bhṛgūkta-prāyaścitta; mUlam: Bhūguptoddhṛta)
// reconciliation. Mixed blocks: b4,b9 inline-<em>IAST (fix in sanskrit); b6 pattern-a (fix iast);
// b13 colophon (fix Deva). Chapter is very clean (0 glyph defects; carries its own typo-table).
// English per-block ALIGNED — no realignment. Fixes from compareCh70.js (script-separated diff).
// LEFT: colophon name भृगूक्त/bhṛgūkta (reader Deva+IAST+English all agree; diverges from mUlam
// भूगुप्तोद्धृत — editorial); hyphenation/padaccheda, sandhi t/d, word-final m/ṃ, avagraha.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[69];
if (ch.number !== 70) throw new Error('wrong chapter ' + ch.number);

// [blockIndex, field, from, to, expectedCount]
const FIXES = [
  [4,  'sanskrit', 'grāmasankule', 'grāmasaṅkule', 1],   // Deva ग्रामसङ्कुले (ṅ)
  [4,  'sanskrit', 'prāk-chirasāṃ', 'prāk-chirasaṃ', 1], // Deva प्राक्छिरसं (short a)
  [6,  'iast',     'smṛtā ', 'smṛtvā ', 1],              // Deva स्मृत्वा (dropped v)
  [9,  'sanskrit', 'aṣṭotta-raśataṃ', 'aṣṭottaraśataṃ', 1], // stray internal break
  [9,  'sanskrit', 'bodhayityā', 'bodhayitvā', 1],       // v->y typo
  [13, 'sanskrit', 'विमानार्चनाकल्ये', 'विमानार्चनाकल्पे', 1], // Deva typo कल्ये->कल्पे
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

// residual checks
const b13sk = ch.blocks[13].sanskrit;
console.log('residual कल्ये:', (b13sk.match(/कल्ये/g)||[]).length,
  ' bodhayityā:', ((ch.blocks[9].sanskrit).match(/bodhayityā/g)||[]).length,
  ' aṣṭotta-ra:', ((ch.blocks[9].sanskrit).match(/aṣṭotta-ra/g)||[]).length,
  ' grāmasankule:', ((ch.blocks[4].sanskrit).match(/grāmasankule/g)||[]).length,
  ' smṛtā(iast):', ((ch.blocks[6].iast).match(/smṛtā/g)||[]).length);
// markup balance on touched blocks
for (const bi of [4,6,9,13]) for (const f of ['sanskrit','iast']) {
  const v = ch.blocks[bi][f] || '';
  for (const t of ['p','em','strong','blockquote']) {
    const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
    if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f} (${o}/${c})`);
  }
}
console.log('markup balanced.');
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
