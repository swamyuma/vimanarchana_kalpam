// Verify patched reader vs ch70-backup.html. Expect changes ONLY in ch70 (idx 69):
// b4.sanskrit, b6.iast, b9.sanskrit, b13.sanskrit. No english, nothing outside ch70.
const fs = require('fs');
const { READER } = require('./load.js');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/c44d901e-2846-4a3b-8d49-99f997a82741/scratchpad';
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch70-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0, ch70 = [];
for (let ci=0; ci<cur.length; ci++){
  const A=cur[ci].blocks||[], B=old[ci].blocks||[];
  if (A.length !== B.length){ console.log('BLOCK COUNT DIFF ch', ci); outside++; continue; }
  for (let bi=0; bi<A.length; bi++){
    for (const k of new Set([...Object.keys(A[bi]),...Object.keys(B[bi])])){
      if (JSON.stringify(A[bi][k]) !== JSON.stringify(B[bi][k])){
        if (ci===69) ch70.push(`b${bi}.${k}`);
        else { outside++; console.log('UNEXPECTED diff ch',ci,'b',bi,'field',k); }
      }
    }
  }
}
console.log('diffs outside ch70:', outside);
console.log('ch70 field diffs:', ch70.join(', '));
const expected = 'b13.sanskrit, b4.sanskrit, b6.iast, b9.sanskrit';
// markup balance on touched blocks
for (const bi of [4,6,9,13]) for (const f of ['sanskrit','iast']) {
  const v = cur[69].blocks[bi][f] || '';
  for (const t of ['p','em','strong','blockquote']) {
    const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
    if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
  }
}
console.log('markup balanced.');
if (outside) throw new Error('unexpected diffs outside ch70');
if (ch70.sort().join(', ') !== expected) throw new Error('ch70 diff set unexpected: '+ch70.sort().join(', '));
console.log('\nVERIFY OK');
