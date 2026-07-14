// Index-based PB inserter. Usage: node pbInsertIdx.js <configPath> [--write]
// config: { "chNum":39, "blockIdx":2, "skBreak":[1,2,...], "enBreak":[1,3,...] }
// skBreak/enBreak are indices (from pbAnalyze S#/E#) of section headers to break BEFORE.
// Inserts <!--PB--> before each named header; requires equal break counts. Index 0 is the
// first section (page start) — normally NOT included. Robust: locates headers the same way
// pbAnalyze does, no raw Devanagari passed in.
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

function skPositions(s) {
  const out = []; const re = /<p><strong>([^<]*?)<\/strong>/g; let m;
  while ((m = re.exec(s))) if (/[ऀ-ॿ]/.test(m[1])) out.push(m.index);
  return out;
}
function enPositions(s) {
  const out = []; const re = /<(?:li|p)>(?:<p>)?<strong>([^<]*?)<\/strong>/g; let m;
  while ((m = re.exec(s))) out.push(m.index);
  return out;
}
function insertAt(s, positions, breakIdx) {
  const chosen = breakIdx.map(i => { if (i < 0 || i >= positions.length) throw new Error('break idx ' + i + ' out of range (' + positions.length + ' headers)'); return positions[i]; });
  chosen.sort((a, c) => c - a); // descending, so splices don't shift earlier positions
  for (const pos of chosen) s = s.slice(0, pos) + PB + s.slice(pos);
  return s;
}
if (cfg.skBreak && cfg.skBreak.length) b.sanskrit = insertAt(b.sanskrit, skPositions(b.sanskrit), cfg.skBreak);
if (cfg.enBreak && cfg.enBreak.length) b.english = insertAt(b.english, enPositions(b.english), cfg.enBreak);

const skN = (b.sanskrit || '').split(PB).length - 1;
const enN = (b.english || '').split(PB).length - 1;
console.log(`ch${cfg.chNum} b${cfg.blockIdx}: sk markers=${skN} en markers=${enN} (pages=${skN + 1})`);
if (skN !== enN) throw new Error(`marker count mismatch sk=${skN} en=${enN}`);
if (skN === 0) throw new Error('no markers inserted');

if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
