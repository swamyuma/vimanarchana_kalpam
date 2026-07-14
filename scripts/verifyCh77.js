// Verify patched reader vs ch77-backup.html. Expect: ALL chapters byte-identical EXCEPT ch77
// (idx 76), where: (a) exactly ONE new block inserted at idx 13 (colophon, colophon:true);
// (b) old blocks 0-12 map to new 0-12 with ONLY the documented sanskrit-field diffs (b4/b6/b8/
// b10/b12); (c) old blocks 13-15 map unchanged to new 14-16; (d) ZERO english changes to any
// pre-existing block; (e) no residual x/ou in ch77 verse fields.
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch77-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');

let outside = 0;
for (let ci=0; ci<cur.length; ci++){
  if (ci === 76) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); }
}
console.log('chapters changed outside ch77:', outside);

const A = cur[76].blocks, B = old[76].blocks;
if (A.length !== B.length + 1) throw new Error(`ch77 block count: expected ${B.length+1}, got ${A.length}`);
const col = A[13];
if (!col.colophon || col.type !== 'verse' || col.label !== 'Colophon') throw new Error('idx 13 is not the colophon block');
if (!/इति श्रीवैखानसे.*सप्तसप्ततितमः पटलः.*७७/.test(col.sanskrit)) throw new Error('colophon Deva malformed');
if (!/iti śrī-vaikhānase.*saptasaptatitamaḥ paṭalaḥ.*77/.test(col.iast)) throw new Error('colophon IAST malformed');
if (!/Seventy-seventh Chapter/.test(col.english)) throw new Error('colophon English malformed');

const EXPECTED = new Set(['b4.sanskrit','b6.sanskrit','b8.sanskrit','b10.sanskrit','b12.sanskrit']);
const seen = new Set(); let engChanged = 0;
for (let ni=0; ni<A.length; ni++){
  if (ni === 13) continue;
  const oi = ni < 13 ? ni : ni - 1;
  const nb = A[ni], ob = B[oi];
  if (nb.type !== ob.type) throw new Error(`type mismatch new b${ni} vs old b${oi}`);
  for (const k of new Set([...Object.keys(nb),...Object.keys(ob)])){
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])){
      seen.add(`b${oi}.${k}`);
      if (k === 'english') engChanged++;
    }
  }
}
console.log('ch77 pre-existing field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs to pre-existing blocks (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED ch77 field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected ch77 field diff: ' + e);
if (engChanged) throw new Error('english changed on pre-existing block(s)');

// residual x/ou
let allv=''; A.forEach(b=>{ if(b.type==='verse') allv += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = allv.replace(/<[^>]+>/g,' ');
if ((lat.match(/x/g)||[]).length) throw new Error('residual x');
if ((lat.match(/ou/g)||[]).length) throw new Error('residual ou');

// markup balance on every ch77 verse block
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
console.log('markup balanced; no residual x/ou.');
if (outside) throw new Error('unexpected diffs outside ch77');
console.log('\nVERIFY OK');
