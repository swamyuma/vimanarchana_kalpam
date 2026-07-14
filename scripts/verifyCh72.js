// Verify patched reader vs ch72-backup.html. Expect changes ONLY in ch72 (idx 71):
// b8.iast, b16.iast, b24.sanskrit, b28.sanskrit, b30.sanskrit. Nothing else.
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch72-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0, ch72 = [];
for (let ci=0; ci<cur.length; ci++){
  const A=cur[ci].blocks||[], B=old[ci].blocks||[];
  if (A.length !== B.length){ console.log('BLOCK COUNT DIFF ch', ci); outside++; continue; }
  for (let bi=0; bi<A.length; bi++){
    for (const k of new Set([...Object.keys(A[bi]),...Object.keys(B[bi])])){
      if (JSON.stringify(A[bi][k]) !== JSON.stringify(B[bi][k])){
        if (ci===71) ch72.push(`b${bi}.${k}`);
        else { outside++; console.log('UNEXPECTED diff ch',ci,'b',bi,'field',k); }
      }
    }
  }
}
console.log('diffs outside ch72:', outside);
console.log('ch72 field diffs:', ch72.sort().join(', '));
for (const bi of [8,16,24,28,30]) for (const f of ['sanskrit','iast']) {
  const v = cur[71].blocks[bi][f] || '';
  for (const t of ['p','em','strong','blockquote']) {
    const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
    if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
  }
}
console.log('markup balanced.');
const expected = 'b16.iast, b24.sanskrit, b28.sanskrit, b30.sanskrit, b8.iast';
if (outside) throw new Error('unexpected diffs outside ch72');
if (ch72.sort().join(', ') !== expected) throw new Error('ch72 diff set unexpected: '+ch72.sort().join(', '));
console.log('\nVERIFY OK');
