// Verify patched reader vs ch79-backup.html. Expect changes ONLY in ch79 (idx 78), in fields
// b4.sanskrit and b8.sanskrit; NO english changes; NO out-of-chapter changes; block count 13;
// no residual x/ou.
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch79-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0, ch79 = [], engChanged = 0;
for (let ci=0; ci<cur.length; ci++){
  const A=cur[ci].blocks||[], B=old[ci].blocks||[];
  if (A.length !== B.length){ console.log('BLOCK COUNT DIFF ch', ci); outside++; continue; }
  for (let bi=0; bi<A.length; bi++){
    for (const k of new Set([...Object.keys(A[bi]),...Object.keys(B[bi])])){
      if (JSON.stringify(A[bi][k]) !== JSON.stringify(B[bi][k])){
        if (k==='english') engChanged++;
        if (ci===78) ch79.push(`b${bi}.${k}`);
        else { outside++; console.log('UNEXPECTED diff ch',ci,'b',bi,'field',k); }
      }
    }
  }
}
console.log('diffs outside ch79:', outside);
console.log('english diffs (must be 0):', engChanged);
console.log('ch79 field diffs:', ch79.sort().join(', '));
const expected = 'b4.sanskrit, b8.sanskrit';
let allv=''; cur[78].blocks.forEach(b=>{ if(b.type==='verse') allv += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = allv.replace(/<[^>]+>/g,' ');
if ((lat.match(/x/g)||[]).length) throw new Error('residual x');
if ((lat.match(/ou/g)||[]).length) throw new Error('residual ou');
for (const bi of [4,6,8,9]) for (const f of ['sanskrit','iast']) {
  const v = cur[78].blocks[bi][f] || '';
  for (const t of ['p','em','strong','blockquote','ul','li','ol']) {
    const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
    if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
  }
}
console.log('markup balanced; no residual x/ou.');
if (outside) throw new Error('unexpected diffs outside ch79');
if (engChanged) throw new Error('english field changed');
if (ch79.sort().join(', ') !== expected) throw new Error('ch79 diff set unexpected: '+ch79.sort().join(', '));
console.log('\nVERIFY OK');
