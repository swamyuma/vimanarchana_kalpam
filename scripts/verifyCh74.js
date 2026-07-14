// Verify patched reader vs ch74-backup.html. Expect: ALL chapters byte-identical EXCEPT ch74
// (idx 73), where: (a) exactly ONE new block inserted at idx 17 (colophon, colophon:true);
// (b) old blocks 0-16 map to new 0-16 with ONLY the 9 documented field diffs; (c) old blocks
// 17-19 map unchanged to new 18-20; (d) ZERO english changes to any pre-existing block.
const fs = require('fs');
const { READER } = require('./load.js');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/41d28562-670f-46b1-9d8f-e4a036187fcc/scratchpad';
function loadFrom(p){
  const html = fs.readFileSync(p,'utf8');
  const m='const VIMANARCHANA_CHAPTERS = '; const i=html.indexOf(m); const start=i+m.length;
  let d=0,j=start,inS=false,sc='',esc=false;
  for(;j<html.length;j++){const c=html[j];
    if(inS){if(esc){esc=false;continue;}if(c==='\\'){esc=true;continue;}if(c===sc){inS=false;}continue;}
    if(c==='"'||c==="'"||c==='`'){inS=true;sc=c;continue;}
    if(c==='[')d++;else if(c===']'){d--;if(d===0){j++;break;}}}
  return JSON.parse(html.slice(start,j));
}
const cur = loadFrom(READER), old = loadFrom(SC+'/ch74-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');

// 1) every chapter EXCEPT ch74 (idx 73) must be byte-identical
let outside = 0;
for (let ci=0; ci<cur.length; ci++){
  if (ci === 73) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); }
}
console.log('chapters changed outside ch74:', outside);

// 2) ch74 structure: +1 block, colophon at idx 17
const A = cur[73].blocks, B = old[73].blocks;
if (A.length !== B.length + 1) throw new Error(`ch74 block count: expected ${B.length+1}, got ${A.length}`);
const col = A[17];
if (!col.colophon || col.type !== 'verse' || col.label !== 'Colophon') throw new Error('idx 17 is not the colophon block');
if (!/इति श्रीवैखानसे.*चतुःसप्ततितमः पटलः.*७४/.test(col.sanskrit)) throw new Error('colophon Deva malformed');
if (!/iti śrī-vaikhānase.*catuḥsaptatitamaḥ paṭalaḥ.*74/.test(col.iast)) throw new Error('colophon IAST malformed');
if (!/Seventy-fourth Chapter/.test(col.english)) throw new Error('colophon English malformed');

// 3) map new→old (skip inserted idx 17) and diff fields
const EXPECTED = new Set(['b4.sanskrit','b8.iast','b9.iast','b11.sanskrit','b13.sanskrit','b16.iast']);
const seen = [], engChanged = [];
for (let ni=0; ni<A.length; ni++){
  if (ni === 17) continue;                 // inserted colophon, no old counterpart
  const oi = ni < 17 ? ni : ni - 1;        // shift after insertion
  const nb = A[ni], ob = B[oi];
  if (nb.type !== ob.type) throw new Error(`type mismatch new b${ni} vs old b${oi}`);
  for (const k of new Set([...Object.keys(nb),...Object.keys(ob)])){
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])){
      seen.push(`b${oi}.${k}`);
      if (k === 'english') engChanged.push(`b${oi}`);
    }
  }
}
console.log('ch74 pre-existing field diffs:', seen.sort().join(', ') || '(none)');
console.log('english diffs to pre-existing blocks (must be 0):', engChanged.length);
const seenSet = new Set(seen);
for (const e of seenSet) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED ch74 field diff: ' + e);
for (const e of EXPECTED) if (!seenSet.has(e)) throw new Error('MISSING expected ch74 field diff: ' + e);
if (engChanged.length) throw new Error('english changed on pre-existing block(s): ' + engChanged.join(','));

// 4) markup balance on every ch74 verse block
A.forEach((b, bi) => {
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

if (outside) throw new Error('unexpected diffs outside ch74');
console.log('\nVERIFY OK');
