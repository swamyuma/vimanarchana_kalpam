// Verify: compare patched reader vs backup. Expect changes ONLY in ch38 (idx35) block2.sanskrit;
// english byte-identical everywhere; no other chapter/field touched.
const fs = require('fs');
const READER = require('./load.js').READER;
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
const old = loadFrom(process.env.SC+"/ch38-backup.html");
if(cur.length!==old.length) throw new Error('chapter count changed');
let engDiffs=0, otherChDiffs=0, ch38FieldDiffs=[];
for(let ci=0;ci<cur.length;ci++){
  const a=cur[ci], b=old[ci];
  const ba=a.blocks||[], bb=b.blocks||[];
  if(ba.length!==bb.length){ console.log('BLOCK COUNT DIFF ch idx',ci); otherChDiffs++; continue; }
  for(let bi=0;bi<ba.length;bi++){
    for(const k of new Set([...Object.keys(ba[bi]),...Object.keys(bb[bi])])){
      if(JSON.stringify(ba[bi][k])!==JSON.stringify(bb[bi][k])){
        if(k==='english') engDiffs++;
        if(ci===37){ ch38FieldDiffs.push(`b${bi}.${k}`); }
        else { otherChDiffs++; console.log('UNEXPECTED diff ch idx',ci,'b',bi,'field',k); }
      }
    }
  }
}
console.log('english diffs (any chapter):', engDiffs);
console.log('diffs outside ch38:', otherChDiffs);
console.log('ch38 field diffs:', ch38FieldDiffs.join(', ') || '(none)');
// final residual sanity on ch38 b2
const sk=cur[37].blocks[2].sanskrit;
console.log('ch38 b2 residual ou:', sk.split('ou').length-1, ' manṭapa:', sk.split('manṭapa').length-1,
  ' em bal:', (sk.match(/<em>/g)||[]).length, '/', (sk.match(/<\/em>/g)||[]).length);
