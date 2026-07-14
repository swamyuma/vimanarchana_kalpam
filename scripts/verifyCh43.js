// Verify: patched reader vs ch43-backup.html. Expect changes ONLY in ch43 (idx42) block3.sanskrit;
// english byte-identical everywhere; no other chapter/field touched; PB markers intact.
const fs = require('fs');
const READER = require('./load.js').READER;
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/357a72e2-eb1c-4f8e-843a-248568ad40f5/scratchpad';
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
const cur = loadFrom(READER);
const old = loadFrom(SC+"/ch43-backup.html");
if(cur.length!==old.length) throw new Error('chapter count changed');
let engDiffs=0, otherChDiffs=0, ch43FieldDiffs=[];
for(let ci=0;ci<cur.length;ci++){
  const a=cur[ci], b=old[ci];
  const ba=a.blocks||[], bb=b.blocks||[];
  if(ba.length!==bb.length){ console.log('BLOCK COUNT DIFF ch idx',ci); otherChDiffs++; continue; }
  for(let bi=0;bi<ba.length;bi++){
    for(const k of new Set([...Object.keys(ba[bi]),...Object.keys(bb[bi])])){
      if(JSON.stringify(ba[bi][k])!==JSON.stringify(bb[bi][k])){
        if(k==='english') engDiffs++;
        if(ci===42){ ch43FieldDiffs.push(`b${bi}.${k}`); }
        else { otherChDiffs++; console.log('UNEXPECTED diff ch idx',ci,'b',bi,'field',k); }
      }
    }
  }
}
console.log('english diffs (any chapter):', engDiffs);
console.log('diffs outside ch43:', otherChDiffs);
console.log('ch43 field diffs:', ch43FieldDiffs.join(', ') || '(none)');
const sk=cur[42].blocks[3].sanskrit, oldsk=old[42].blocks[3].sanskrit;
console.log('ch43 b3 residual ou:', sk.split('ou').length-1,
  ' residual x:', (sk.match(/x/g)||[]).length,
  ' PB markers old/new:', (oldsk.split('<!--PB-->').length-1)+'/'+(sk.split('<!--PB-->').length-1),
  ' em bal:', (sk.match(/<em>/g)||[]).length, '/', (sk.match(/<\/em>/g)||[]).length);
