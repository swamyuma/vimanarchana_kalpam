// Verify patched reader vs ch76-backup.html. Expect changes ONLY in ch76 (idx 75), in fields
// b6/b8/b10/b12/b14/b19/b22.sanskrit and b16/b17/b21/b22.iast; NO english changes anywhere;
// NO out-of-chapter changes; block count unchanged (26). Also assert no residual x/ou in ch76.
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch76-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');

let outside = 0, ch76 = [], engChanged = 0;
for (let ci=0; ci<cur.length; ci++){
  const A=cur[ci].blocks||[], B=old[ci].blocks||[];
  if (A.length !== B.length){ console.log('BLOCK COUNT DIFF ch', ci); outside++; continue; }
  for (let bi=0; bi<A.length; bi++){
    for (const k of new Set([...Object.keys(A[bi]),...Object.keys(B[bi])])){
      if (JSON.stringify(A[bi][k]) !== JSON.stringify(B[bi][k])){
        if (k==='english') engChanged++;
        if (ci===75) ch76.push(`b${bi}.${k}`);
        else { outside++; console.log('UNEXPECTED diff ch',ci,'b',bi,'field',k); }
      }
    }
  }
}
console.log('diffs outside ch76:', outside);
console.log('english diffs (must be 0):', engChanged);
console.log('ch76 field diffs:', ch76.sort().join(', '));

const expected = 'b10.sanskrit, b12.sanskrit, b14.sanskrit, b16.iast, b16.sanskrit, b17.iast, b19.sanskrit, b21.iast, b22.iast, b22.sanskrit, b6.sanskrit, b8.sanskrit';

// residual x/ou across ch76 verse fields
let all=''; cur[75].blocks.forEach(b=>{ if(b.type==='verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
if ((lat.match(/x/g)||[]).length) throw new Error('residual x in ch76');
if ((lat.match(/ou/g)||[]).length) throw new Error('residual ou in ch76');

// markup balance on touched blocks
for (const bi of [6,8,10,12,14,16,17,19,21,22]) for (const f of ['sanskrit','iast']) {
  const v = cur[75].blocks[bi][f] || '';
  for (const t of ['p','em','strong','blockquote','ul','li','ol']) {
    const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
    if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
  }
}
console.log('markup balanced; no residual x/ou.');
if (outside) throw new Error('unexpected diffs outside ch76');
if (engChanged) throw new Error('english field changed');
if (ch76.sort().join(', ') !== expected) throw new Error('ch76 diff set unexpected:\n  got: '+ch76.sort().join(', ')+'\n  exp: '+expected);
console.log('\nVERIFY OK');
