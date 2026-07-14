// Verify patched reader vs ch73-backup.html. Expect changes ONLY in ch73 (idx 72):
// b7.sanskrit, b9.iast, b15.sanskrit, b17.sanskrit. Nothing else; NO english changes.
const fs = require('fs');
const { READER } = require('./load.js');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/4176a843-faaa-4c90-9b94-e1f435d82e30/scratchpad';
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch73-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0, ch73 = [], engChanged = 0;
for (let ci=0; ci<cur.length; ci++){
  const A=cur[ci].blocks||[], B=old[ci].blocks||[];
  if (A.length !== B.length){ console.log('BLOCK COUNT DIFF ch', ci); outside++; continue; }
  for (let bi=0; bi<A.length; bi++){
    for (const k of new Set([...Object.keys(A[bi]),...Object.keys(B[bi])])){
      if (JSON.stringify(A[bi][k]) !== JSON.stringify(B[bi][k])){
        if (k==='english') engChanged++;
        if (ci===72) ch73.push(`b${bi}.${k}`);
        else { outside++; console.log('UNEXPECTED diff ch',ci,'b',bi,'field',k); }
      }
    }
  }
}
console.log('diffs outside ch73:', outside);
console.log('english diffs (must be 0):', engChanged);
console.log('ch73 field diffs:', ch73.sort().join(', '));
for (const bi of [7,9,15,17]) for (const f of ['sanskrit','iast']) {
  const v = cur[72].blocks[bi][f] || '';
  for (const t of ['p','em','strong','blockquote']) {
    const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
    if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
  }
}
console.log('markup balanced.');
const expected = 'b15.sanskrit, b17.sanskrit, b7.sanskrit, b9.iast';
if (outside) throw new Error('unexpected diffs outside ch73');
if (engChanged) throw new Error('english field changed');
if (ch73.sort().join(', ') !== expected) throw new Error('ch73 diff set unexpected: '+ch73.sort().join(', '));
console.log('\nVERIFY OK');
