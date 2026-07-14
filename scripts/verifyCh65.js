// Verify: patched reader vs ch65-backup.html. ch65 (idx64) is PATTERN-A (52 verses):
// expect diffs ONLY in ch65, ONLY in sanskrit/iast fields of verse blocks + exactly ONE
// english diff (b54 colophon fill, empty -> content). Nothing outside ch65.
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
const old = loadFrom(SC+"/ch65-backup.html");
if(cur.length!==old.length) throw new Error('chapter count changed');
let engDiffs=0, otherChDiffs=0, badFields=[], chDiffCount=0;
for(let ci=0;ci<cur.length;ci++){
  const ba=cur[ci].blocks||[], bb=old[ci].blocks||[];
  if(ba.length!==bb.length){ console.log('BLOCK COUNT DIFF ch idx',ci); otherChDiffs++; continue; }
  for(let bi=0;bi<ba.length;bi++){
    for(const k of new Set([...Object.keys(ba[bi]),...Object.keys(bb[bi])])){
      if(JSON.stringify(ba[bi][k])!==JSON.stringify(bb[bi][k])){
        if(ci!==64){ otherChDiffs++; console.log('UNEXPECTED diff ch idx',ci,'b',bi,'field',k); continue; }
        chDiffCount++;
        if(k==='english'){ engDiffs++; if(bb[bi][k]!=='') badFields.push(`b${bi}.english was non-empty`); }
        else if(k!=='sanskrit' && k!=='iast' && k!=='text'){ badFields.push(`b${bi}.${k}`); }
      }
    }
  }
}
console.log('ch65 field diffs:', chDiffCount, '| english diffs:', engDiffs, '(expect 1) | diffs outside ch65:', otherChDiffs);
console.log('unexpected fields:', badFields.join(', ') || '(none)');
const colo = cur[64].blocks[54];
console.log('colophon english filled:', colo.english.length>0, '| backtick gone:', !colo.iast.includes('`'));
if(otherChDiffs || engDiffs!==1 || badFields.length) throw new Error('verification FAILED');
console.log('VERIFY OK');
