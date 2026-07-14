// Verify: patched reader vs ch48-backup.html. Expect changes ONLY in ch48 (idx47):
// b2.sanskrit (content fixes + restored final-para IAST), b3.iast (orphan -> proper colophon
// IAST), b3.english (empty -> "thus ends" line — the ONLY english diff, intended).
// PB markers intact; markup balanced; nothing outside ch48 touched.
const fs = require('fs');
const READER = require('./load.js').READER;
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/e4773e0a-a857-49b6-8a2f-7dacef2dd33b/scratchpad';
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
const old = loadFrom(SC+"/ch48-backup.html");
if(cur.length!==old.length) throw new Error('chapter count changed');
let engDiffs=0, otherChDiffs=0, chFieldDiffs=[];
for(let ci=0;ci<cur.length;ci++){
  const a=cur[ci], b=old[ci];
  const ba=a.blocks||[], bb=b.blocks||[];
  if(ba.length!==bb.length){ console.log('BLOCK COUNT DIFF ch idx',ci); otherChDiffs++; continue; }
  for(let bi=0;bi<ba.length;bi++){
    for(const k of new Set([...Object.keys(ba[bi]),...Object.keys(bb[bi])])){
      if(JSON.stringify(ba[bi][k])!==JSON.stringify(bb[bi][k])){
        if(k==='english') engDiffs++;
        if(ci===47){ chFieldDiffs.push(`b${bi}.${k}`); }
        else { otherChDiffs++; console.log('UNEXPECTED diff ch idx',ci,'b',bi,'field',k); }
      }
    }
  }
}
console.log('english diffs (any chapter):', engDiffs, '(expect 1: ch48 b3 colophon fill)');
console.log('diffs outside ch48:', otherChDiffs);
console.log('ch48 field diffs:', chFieldDiffs.join(', ') || '(none)');
const sk=cur[47].blocks[2].sanskrit, oldsk=old[47].blocks[2].sanskrit;
const latin = sk.replace(/<[^>]+>/g,' ');
console.log('ch48 b2 residual ou:', (latin.match(/[a-zāīūṛśṣṭḍṇ]ou|ou[a-zāīūṛśṣṭḍṇ]/g)||[]).length,
  ' residual x:', (sk.match(/x/g)||[]).length,
  ' PB old/new:', (oldsk.split('<!--PB-->').length-1)+'/'+(sk.split('<!--PB-->').length-1),
  ' em bal:', (sk.match(/<em>/g)||[]).length, '/', (sk.match(/<\/em>/g)||[]).length);
const b3=cur[47].blocks[3];
console.log('ch48 b3.iast is colophon:', b3.iast.includes('uttamottamādinavavidhirnāma aṣṭacatvāriṃśaḥ paṭalaḥ'),
  ' b3.english filled:', b3.english.length>0,
  ' old english empty:', old[47].blocks[3].english==='');
if(otherChDiffs || engDiffs!==1) throw new Error('verification FAILED');
console.log('VERIFY OK');
