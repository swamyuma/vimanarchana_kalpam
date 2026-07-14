// Generic PB-marker inserter. Usage: node pbInsert.js <configPath> [--write]
// config JSON: { "chNum":44, "blockIdx":2, "sk":["<p><strong>...", ...], "en":["<li><p><strong>...", ...] }
// Inserts <!--PB--> before each anchor (count-guarded, each must occur exactly once),
// requires equal marker counts on both sides, writes, then the caller runs verifyPB.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const PB = '<!--PB-->';
const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const chap = chapters.find(c => c.number === cfg.chNum);
if (!chap) throw new Error('no chapter ' + cfg.chNum);
const b = chap.blocks[cfg.blockIdx];
if (!b || b.type !== 'verse') throw new Error(`block ${cfg.blockIdx} not a verse`);

function insert(field, anchors) {
  let s = b[field];
  for (const a of anchors) {
    const n = s.split(a).length - 1;
    if (n !== 1) throw new Error(`${field}: anchor ${JSON.stringify(a.slice(0,30))} found ${n} times (expected 1)`);
    s = s.split(a).join(PB + a);
  }
  return s;
}
if (cfg.sk && cfg.sk.length) b.sanskrit = insert('sanskrit', cfg.sk);
if (cfg.en && cfg.en.length) b.english = insert('english', cfg.en);
if (cfg.iast && cfg.iast.length) b.iast = insert('iast', cfg.iast);

const skN = (b.sanskrit||'').split(PB).length - 1;
const enN = (b.english||'').split(PB).length - 1;
const iaN = (b.iast||'').split(PB).length - 1;
console.log(`ch${cfg.chNum} b${cfg.blockIdx}: sk markers=${skN} en markers=${enN} iast markers=${iaN}`);
const nonEmpty = [['sk',skN,(b.sanskrit||'')],['en',enN,(b.english||'')],['iast',iaN,(b.iast||'')]].filter(x=>x[2]);
const counts = nonEmpty.filter(x=>x[1]>0).map(x=>x[1]);
if (counts.length && !counts.every(c=>c===counts[0])) throw new Error('marker counts differ across fields: ' + counts.join(','));
if (!counts.length) throw new Error('no markers inserted');

if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
