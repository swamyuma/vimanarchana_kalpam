// Dump the paginated spreads of a chapter after explosion. Usage: node pbPairs.js <chNum>
// Prints each spread's first Sanskrit header vs first English header so L<->R pairing is visible.
const { load } = require('./load.js');
const { getExploder } = require('./pbTools.js');
const { explodeBlocks } = getExploder();
const CH = parseInt(process.argv[2], 10);
const chap = load().chapters.find(c => c.number === CH);
const blocks = explodeBlocks(chap.blocks);
const ranges = []; let start = 0;
for (let i = 0; i < blocks.length; i++) if (blocks[i].type === 'verse') { ranges.push([start, i + 1]); start = i + 1; }
if (start < blocks.length) ranges.push([start, blocks.length]);
const hdr = s => { const m = (s || '').match(/<strong>([\s\S]*?)<\/strong>/); return m ? m[1].replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim().slice(0, 44) : '(none)'; };
console.log(`ch${CH}: ${ranges.length} spreads`);
ranges.forEach((r, idx) => {
  const slice = blocks.slice(r[0], r[1]);
  const v = slice.find(b => b.type === 'verse');
  const extra = slice.filter(b => b.type !== 'verse').map(b => b.type).join('+');
  if (v) console.log(`  ${String(idx + 1).padStart(2)}/${ranges.length}  SK[ ${hdr(v.sanskrit).padEnd(44)} ]  EN[ ${hdr(v.english)} ]${extra ? '  (+' + extra + ')' : ''}`);
  else console.log(`  ${String(idx + 1).padStart(2)}/${ranges.length}  [${extra}]`);
});
