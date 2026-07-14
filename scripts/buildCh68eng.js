// ch68 English realignment. The english column ran ahead of the sanskrit for blocks 2-32
// (title/incipit blocks had no english; sanskrit merged some double-sections). This shifts
// each block's english onto the block whose sanskrit it actually translates.
// Verse-index (v) map (verses[v] == ch.blocks[v+2]):
//   new[0]=TITLE(new)  new[1]=INCIPIT(new)  new[2]=old0  new[3]=old1  new[4]=merge(old2,old3)
//   new[v]=old[v-1] for v in 5..29    new[30]=merge(old29,old30)   new[v]=old[v] for v in 31..48
// NO english wording is rewritten: existing <li> items are relocated verbatim; merges just
// regroup two blocks' <li>s; two brand-new <li>s (title, incipit) are added.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[67];
if (ch.number !== 68) throw new Error('wrong chapter ' + ch.number);
const verses = ch.blocks.filter(b => b.type === 'verse');
if (verses.length !== 49) throw new Error('expected 49 verses, got ' + verses.length);

const lis = s => (s.match(/<li>[\s\S]*?<\/li>/g) || []);
const wrap = items => '<ul>\n' + items.join('\n') + '\n</ul>\n';
const merge = (a, b) => wrap([...lis(a), ...lis(b)]);

const TITLE_LI = '<li><strong>Chapter Heading:</strong> Here begins the sixty-eighth chapter, the <em>Utsava-prāyaścitta-vidhiḥ</em> (Rules of Expiation for Festivals).</li>';
const INCIPIT_LI = '<li><strong>Introduction:</strong> Now I shall expound the rules of expiation for festivals (<em>utsava-prāyaścitta</em>).</li>';

const old = verses.map(b => b.english || '');
// sanity: colophon (v48) must stay put
if (!/Colophon/.test(old[48])) throw new Error('v48 not colophon?');

const nu = new Array(49);
nu[0] = wrap([TITLE_LI]);
nu[1] = wrap([INCIPIT_LI]);
nu[2] = old[0];
nu[3] = old[1];
nu[4] = merge(old[2], old[3]);
for (let v = 5; v <= 29; v++) nu[v] = old[v - 1];
nu[30] = merge(old[29], old[30]);
for (let v = 31; v <= 48; v++) nu[v] = old[v];

// ---- verify BEFORE writing: <li> multiset preserved + exactly the 2 new items ----
const msBefore = {}, msAfter = {};
const add = (m, k) => (m[k] = (m[k] || 0) + 1);
old.forEach(s => lis(s).forEach(li => add(msBefore, li)));
nu.forEach(s => lis(s).forEach(li => add(msAfter, li)));
add(msBefore, TITLE_LI); add(msBefore, INCIPIT_LI);   // expected additions
let bad = 0;
for (const k of new Set([...Object.keys(msBefore), ...Object.keys(msAfter)])) {
  if ((msBefore[k] || 0) !== (msAfter[k] || 0)) { bad++; console.log('LI MULTISET MISMATCH:', (msAfter[k]||0)-(msBefore[k]||0), k.slice(0, 80)); }
}
if (bad) throw new Error('li multiset not preserved (' + bad + ')');
const totalBefore = old.reduce((n, s) => n + lis(s).length, 0);
const totalAfter = nu.reduce((n, s) => n + lis(s).length, 0);
console.log('total <li> before:', totalBefore, ' after:', totalAfter, ' (expect +2)');
if (totalAfter !== totalBefore + 2) throw new Error('li count off');

// ---- apply ----
verses.forEach((b, v) => { b.english = nu[v]; });

// ---- show new sanskrit-head vs english-head pairing for eyeball ----
const head = (s, re) => { const m = s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); return m.slice(0, 70); };
console.log('\n--- new pairing (v: SK-head || ENG-head) ---');
verses.forEach((b, v) => {
  console.log(`v${v}: ${head(b.sanskrit).padEnd(70)} || ${head(b.english)}`);
});

if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('\nWROTE reader.'); }
else console.log('\nDRY RUN (use --write).');
