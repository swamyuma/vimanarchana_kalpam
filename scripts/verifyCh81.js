// Verify patched reader vs ch81-backup.html. Expect: ALL chapters byte-identical EXCEPT ch81
// (idx 80): (a) ONE new block at idx 17 (colophon); (b) old b0-16 → new b0-16 with only
// b8/b10/b11/b14.sanskrit/iast changed; (c) old b17-19 → new b18-20 unchanged; (d) 0 english
// changes to pre-existing blocks; (e) no residual x/ou.
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch81-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci=0; ci<cur.length; ci++){ if (ci===80) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch81:', outside);
const A = cur[80].blocks, B = old[80].blocks;
if (A.length !== B.length + 1) throw new Error(`ch81 block count: expected ${B.length+1}, got ${A.length}`);
const col = A[17];
if (!col.colophon || col.type !== 'verse' || col.label !== 'Colophon') throw new Error('idx 17 not colophon');
if (!/इति श्रीवैखानसे.*एकाशीतितमः पटलः.*८१/.test(col.sanskrit)) throw new Error('colophon Deva malformed');
if (!/Eighty-first Chapter/.test(col.english)) throw new Error('colophon English malformed');
const EXPECTED = new Set(['b8.sanskrit','b10.iast','b11.iast','b14.sanskrit']);
const seen = new Set(); let engChanged = 0;
for (let ni=0; ni<A.length; ni++){ if (ni===17) continue;
  const oi = ni < 17 ? ni : ni - 1; const nb = A[ni], ob = B[oi];
  if (nb.type !== ob.type) throw new Error(`type mismatch new b${ni} vs old b${oi}`);
  for (const k of new Set([...Object.keys(nb),...Object.keys(ob)])){
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])){ seen.add(`b${oi}.${k}`); if (k==='english') engChanged++; } } }
console.log('ch81 pre-existing field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs to pre-existing (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED ch81 field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected ch81 field diff: ' + e);
if (engChanged) throw new Error('english changed on pre-existing block');
let allv=''; A.forEach(b=>{ if(b.type==='verse') allv += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = allv.replace(/<[^>]+>/g,' ');
if ((lat.match(/x/g)||[]).length) throw new Error('residual x');
if ((lat.match(/ou/g)||[]).length) throw new Error('residual ou');
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit','iast','english']) { const v = b[f] || '';
    for (const t of ['p','em','strong','blockquote','ul','li','ol']) {
      const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
      if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; no residual x/ou.');
if (outside) throw new Error('unexpected diffs outside ch81');
console.log('\nVERIFY OK');
