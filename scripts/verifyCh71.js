// Verify patched reader vs ch71-backup.html. Expect changes ONLY in ch71 (idx 70), in the
// 8 touched fields; no english, nothing outside ch71.
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch71-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0, ch71 = [];
for (let ci=0; ci<cur.length; ci++){
  const A=cur[ci].blocks||[], B=old[ci].blocks||[];
  if (A.length !== B.length){ console.log('BLOCK COUNT DIFF ch', ci); outside++; continue; }
  for (let bi=0; bi<A.length; bi++){
    for (const k of new Set([...Object.keys(A[bi]),...Object.keys(B[bi])])){
      if (JSON.stringify(A[bi][k]) !== JSON.stringify(B[bi][k])){
        if (ci===70) ch71.push(`b${bi}.${k}`);
        else { outside++; console.log('UNEXPECTED diff ch',ci,'b',bi,'field',k); }
      }
    }
  }
}
console.log('diffs outside ch71:', outside);
console.log('ch71 field diffs:', ch71.sort().join(', '));
const expected = 'b11.iast, b13.iast, b13.sanskrit, b15.sanskrit, b17.sanskrit, b21.iast, b27.sanskrit, b29.sanskrit';
for (const bi of [11,13,15,17,21,27,29]) for (const f of ['sanskrit','iast']) {
  const v = cur[70].blocks[bi][f] || '';
  for (const t of ['p','em','strong','blockquote']) {
    const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
    if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
  }
}
console.log('markup balanced.');
if (outside) throw new Error('unexpected diffs outside ch71');
if (ch71.sort().join(', ') !== expected) throw new Error('ch71 diff set unexpected');
console.log('\nVERIFY OK');
