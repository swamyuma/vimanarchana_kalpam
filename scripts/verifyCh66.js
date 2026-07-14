// Verify: patched reader vs ch66-backup.html. Expect changes ONLY in ch66 (idx65):
// b2.sanskrit + b3.english (empty -> "thus ends" colophon line, the ONLY english diff).
const fs = require('fs');
const READER = require('./load.js').READER;
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';
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
const old = loadFrom(SC+"/ch66-backup.html");
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
        if(ci===65){ chFieldDiffs.push(`b${bi}.${k}`); }
        else { otherChDiffs++; console.log('UNEXPECTED diff ch idx',ci,'b',bi,'field',k); }
      }
    }
  }
}
console.log('english diffs (any chapter):', engDiffs, '(expect 1: ch66 b3 colophon fill)');
console.log('diffs outside ch66:', otherChDiffs);
console.log('ch66 field diffs:', chFieldDiffs.join(', ') || '(none)');
const sk=cur[65].blocks[2].sanskrit;
const latin = sk.replace(/<[^>]+>/g,' ');
console.log('ch66 b2 residual ou:', (latin.match(/[a-zāīūṛśṣṭḍṇ]ou|ou[a-zāīūṛśṣṭḍṇ]/g)||[]).length,
  ' residual x:', (sk.match(/x/g)||[]).length,
  ' PB:', (sk.match(/<!--PB-->/g)||[]).length,
  ' em bal:', (sk.match(/<em>/g)||[]).length, '/', (sk.match(/<\/em>/g)||[]).length);
console.log('b3.english filled:', cur[65].blocks[3].english.length>0, ' old empty:', old[65].blocks[3].english==='');
if(otherChDiffs || engDiffs!==1 || chFieldDiffs.sort().join(',')!=='b2.sanskrit,b3.english,b3.iast,b3.sanskrit') throw new Error('verification FAILED');
console.log('VERIFY OK');
