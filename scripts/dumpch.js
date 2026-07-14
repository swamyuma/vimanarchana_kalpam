const { load } = require('./load.js');
const n = parseInt(process.argv[2], 10); // chapter number (1-based index into array? no, by .number)
const { chapters } = load();
// chapters is array of chapter objects; find by number field or index
let ch = chapters.find(c => c.number === n || c.chapter === n || c.id === n);
let idx = chapters.indexOf(ch);
if (!ch) { ch = chapters[n-1]; idx = n-1; }
console.log('CHAPTER index', idx, 'keys:', Object.keys(ch).join(','));
const blocks = ch.blocks || ch.verses || ch.sections || [];
console.log('title:', ch.title || ch.name);
console.log('num blocks:', blocks.length);
blocks.forEach((b,i) => {
  console.log('\n===== BLOCK', i, 'keys:', Object.keys(b).join(',') , '=====');
  for (const k of Object.keys(b)) {
    const v = b[k];
    if (typeof v === 'string') console.log(`--[${k}]--\n${v}`);
    else console.log(`--[${k}]-- (${typeof v})`, JSON.stringify(v).slice(0,120));
  }
});
