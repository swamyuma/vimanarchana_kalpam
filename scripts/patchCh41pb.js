// Insert <!--PB--> section-seam markers into ch41 (idx40) b2 sanskrit + english.
// 14 pages: P1=S1+S2/E1+E2 (intro+Entering merged), P3=S4/E4+E5 (Self-Purif+Nirmālya
// merged), rest 1:1. 13 markers each side, at top-level element boundaries so every
// slice is balanced HTML. Count-guarded; renders to identity when markers stripped.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const PB = '<!--PB-->';
const { html, chapters, start, end } = load();
const b = chapters[40].blocks[2];
if (chapters[40].number !== 41) throw new Error('wrong chapter');

// Sanskrit: insert before each of these 13 top-level Devanagari section headers
const SK_HEADERS = [
  '<p><strong>तीर्थजल',       // S3 Fetching Water
  '<p><strong>अर्चक',          // S4 Self-Purification (+Nirmālya body follows, no marker)
  '<p><strong>स्नपनं',         // S5 Bathing
  '<p><strong>परिक्रम',        // S6 Flower Placement
  '<p><strong>कौतुकपीठ',       // S7 Subsidiary Deities
  '<p><strong>अर्घ्यपात्र',    // S8 Vessels
  '<p><strong>आवाहन',          // S9 Invocation
  '<p><strong>द्वात्रिंशद्',   // S10 32 Services
  '<p><strong>हविर्दान',       // S11 Food
  '<p><strong>अग्निहोमः',      // S12 Fire Oblations
  '<p><strong>बलिदानं',        // S13 Balidāna
  '<p><strong>पञ्च-प्रणामाः',  // S14 Five Prostrations
  '<p><strong>पञ्चमूर्ति',     // S15 Five Images
];
// English is one root <ul>; each section is a top-level <li>. Insert the marker before
// the <li> (between list items) so parts split at ul-depth boundaries. E2 merged into
// E1, E5 (Nirmālya) merged into E4.
const EN_HEADERS = [
  '<li><p><strong>Fetching Water',                 // E3
  '<li><p><strong>Priest',                         // E4 (E5 Nirmālya follows, no marker)
  '<li><p><strong>Bathing the Movable',            // E6
  '<li><p><strong>Flower Placement',               // E7
  '<li><p><strong>Worship of the Subsidiary',      // E8
  '<li><p><strong>Preparation of the Worship',     // E9
  '<li><p><strong>Invocation',                     // E10
  '<li><p><strong>The 32 Services',                // E11
  '<li><p><strong>Offering of Food',               // E12
  '<li><p><strong>The Fire Oblations',             // E13
  '<li><p><strong>The Offering of Food to Guardians', // E14
  '<li><p><strong>The Five Prostrations',          // E15
  '<li><p><strong>Worship of the Five Images',     // E16
];

function insert(field, headers) {
  let s = b[field];
  for (const h of headers) {
    const n = s.split(h).length - 1;
    if (n !== 1) throw new Error(`${field}: header ${JSON.stringify(h)} found ${n} times (expected 1)`);
    s = s.split(h).join(PB + h);
  }
  return s;
}
b.sanskrit = insert('sanskrit', SK_HEADERS);
b.english  = insert('english', EN_HEADERS);

const skN = b.sanskrit.split(PB).length - 1, enN = b.english.split(PB).length - 1;
console.log('sanskrit markers:', skN, '| english markers:', enN, '(expect 13 / 13)');
if (skN !== 13 || enN !== 13) throw new Error('marker count mismatch');

if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
