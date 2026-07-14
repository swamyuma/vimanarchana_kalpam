// Verify patched reader vs ch69-backup.html. Expect changes ONLY in ch69 (idx 68):
// b2.sanskrit + b3.sanskrit. NO english change, nothing outside ch69. PB alignment intact.
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch69-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0, ch69diffs = [];
for (let ci=0; ci<cur.length; ci++){
  const A=cur[ci].blocks||[], B=old[ci].blocks||[];
  if (A.length !== B.length){ console.log('BLOCK COUNT DIFF ch', ci); outside++; continue; }
  for (let bi=0; bi<A.length; bi++){
    for (const k of new Set([...Object.keys(A[bi]),...Object.keys(B[bi])])){
      if (JSON.stringify(A[bi][k]) !== JSON.stringify(B[bi][k])){
        if (ci===68) ch69diffs.push(`b${bi}.${k}`);
        else { outside++; console.log('UNEXPECTED diff ch',ci,'b',bi,'field',k); }
      }
    }
  }
}
console.log('diffs outside ch69:', outside);
console.log('ch69 field diffs:', ch69diffs.join(', '));
// PB alignment must hold (reader throws otherwise)
const PB='<!--PB-->';
const b2 = cur[68].blocks[2];
const skN = (b2.sanskrit||'').split(PB).length, enN = (b2.english||'').split(PB).length;
console.log('ch69 b2 PB-parts sanskrit/english:', skN, '/', enN, skN===enN?'OK':'*** MISMATCH ***');
// markup balance
for (const t of ['p','em','strong','blockquote','ul','li']) {
  const o=(b2.sanskrit.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(b2.sanskrit.match(new RegExp('</'+t+'>','g'))||[]).length;
  if (o!==c) throw new Error(`<${t}> unbalanced (${o}/${c})`);
}
console.log('markup balanced.');
const expected = 'b2.sanskrit, b3.sanskrit';
if (outside) throw new Error('unexpected diffs outside ch69');
if (skN !== enN) throw new Error('PB mismatch — reader would throw');
if (ch69diffs.sort().join(', ') !== expected) throw new Error('ch69 diff set unexpected: '+ch69diffs.join(', '));
console.log('\nVERIFY OK');
