// Global check: every chapter's exploded parts are tag-balanced. Usage: node pbVerifyAll.js
const { load } = require('./load.js');
const { getExploder } = require('./pbTools.js');
const { PB_MARKER, explodeBlocks } = getExploder();
const chapters = load().chapters;
const bal = (s, o, c) => (s.match(new RegExp(o, 'g')) || []).length === (s.match(new RegExp(c, 'g')) || []).length;
let bad = 0, withMarkers = 0;
for (const ch of chapters) {
  const parts = explodeBlocks(ch.blocks);
  const hasMark = ch.blocks.some(b => (b.sanskrit || '').includes(PB_MARKER));
  if (hasMark) withMarkers++;
  for (const p of parts) {
    if (p.type !== 'verse') continue;
    for (const f of ['sanskrit', 'english']) {
      const v = p[f] || '';
      for (const [o, c] of [['<em>', '</em>'], ['<strong>', '</strong>'], ['<li>', '</li>'], ['<ul>', '</ul>'], ['<p>', '</p>']]) {
        if (!bal(v, o, c)) { console.log(`ch${ch.number} part ${f} unbalanced ${o}`); bad++; }
      }
      if (v.includes(PB_MARKER)) { console.log(`ch${ch.number} residual marker in ${f}`); bad++; }
    }
  }
}
console.log(`chapters with markers: ${withMarkers} | balance failures: ${bad}`);
console.log(bad === 0 ? 'ALL PARTS BALANCED' : 'IMBALANCE FOUND');
process.exit(bad === 0 ? 0 : 1);
