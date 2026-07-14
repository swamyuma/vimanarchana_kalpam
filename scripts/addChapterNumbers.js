// Prepend "Chapter N: " to the VISIBLE title band (blocks[0].text) of every chapter.
// Edits ONLY blocks[0].text — NOT chapter.title (the TOC line 12302 and breadcrumb line 12540
// already prepend chap.number, so editing chapter.title would DOUBLE it). Render path for the
// band is reader line 12331 <h2>${escapeHTML(b.text)}</h2>. Idempotent-guarded.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();

let changed = 0;
for (const c of chapters) {
  const b0 = c.blocks[0];
  if (!b0 || b0.type !== 'chapter-title') throw new Error('ch ' + c.number + ' b0 not chapter-title');
  if (/^Chapter\s+\d+:/.test(b0.text)) throw new Error('ch ' + c.number + ' already numbered: ' + b0.text);
  b0.text = `Chapter ${c.number}: ${b0.text}`;
  changed++;
}
console.log('chapters updated:', changed);
console.log('sample:', JSON.stringify(chapters[0].blocks[0].text));
console.log('sample:', JSON.stringify(chapters[40].blocks[0].text));
console.log('sample:', JSON.stringify(chapters[99].blocks[0].text));

if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
