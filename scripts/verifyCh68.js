// Verify patched reader vs ch68-backup.html. Expect changes ONLY in ch68 (idx 67):
//  - sanskrit/iast: reconciliation fixes
//  - english: realignment (verse blocks 0..30 i.e. array blocks 2..32 change; 31..48 unchanged)
// No other chapter touched. Deva<->IAST residual = benign convention diffs only.
const fs = require('fs');
const { READER } = require('./load.js');
const { translit } = require('./translit.js');
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch68-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');

let outside = 0, skIa = [], engIdx = [];
for (let ci=0; ci<cur.length; ci++){
  const A=cur[ci].blocks||[], B=old[ci].blocks||[];
  if (A.length !== B.length){ console.log('BLOCK COUNT DIFF ch', ci); outside++; continue; }
  for (let bi=0; bi<A.length; bi++){
    for (const k of new Set([...Object.keys(A[bi]),...Object.keys(B[bi])])){
      if (JSON.stringify(A[bi][k]) !== JSON.stringify(B[bi][k])){
        if (ci!==67){ outside++; console.log('UNEXPECTED diff ch',ci,'b',bi,'field',k); }
        else if (k==='english') engIdx.push(bi);
        else skIa.push(`b${bi}.${k}`);
      }
    }
  }
}
console.log('diffs outside ch68:', outside);
console.log('ch68 sk/iast diffs:', skIa.join(', '));
console.log('ch68 english-changed block idxs:', engIdx.join(','));
// english should change exactly array-blocks 2..32
const expEng = []; for (let i=2;i<=32;i++) expEng.push(i);
if (engIdx.sort((a,b)=>a-b).join(',') !== expEng.join(',')) throw new Error('english change set unexpected');

// Deva<->IAST residual check (only benign convention diffs allowed)
const verses = cur[67].blocks.filter(b=>b.type==='verse');
const stripTags = s=>s.replace(/<[^>]+>/g,' ');
// strip ONLY leaf apparatus groups (no nested brackets/parens), so a genuine variant
// (...) clause containing an inner [मुद्रितपाठे ...] loses only the inner bracket.
const stripApp = s=>s.replace(/\([^()\[\]]*मुद्रितपाठे[^()\[\]]*\)|\[[^()\[\]]*मुद्रितपाठे[^()\[\]]*\]/g,' ');
const words = s=>(stripTags(s).replace(/&#39;|&quot;|&amp;/g,' ').replace(/[।॥॰.,;:|()\[\]—…–"']/g,' ').match(/[^\s]+/g)||[]).filter(w=>/[A-Za-zĀ-ſḀ-ỿ]/.test(w));
// benign: a Deva-token/IAST-token pair differing only by ṃ<->(ṅ|m|n), or ced/cet, or hyphenation
function benign(dev, ia){
  const norm = s=>s.replace(/[ṃṅnm]/g,'N').replace(/-/g,'');
  if (norm(dev)===norm(ia)) return true;                 // nasal-assimilation / hyphen
  if ((dev==='ced'&&ia==='cet')||(dev==='cet'&&ia==='ced')) return true;
  return false;
}
let realResidual = 0;
verses.forEach((b,v)=>{
  const dW = words(translit(stripApp(b.sanskrit||'')));
  const iW = words(b.iast||'');
  const D={},I={}; dW.forEach(w=>D[w]=(D[w]||0)+1); iW.forEach(w=>I[w]=(I[w]||0)+1);
  const onlyD=[],onlyI=[];
  for(const k in D){const n=D[k]-(I[k]||0);for(let x=0;x<n;x++)onlyD.push(k);}
  for(const k in I){const n=I[k]-(D[k]||0);for(let x=0;x<n;x++)onlyI.push(k);}
  // try to pair leftovers and check benign
  const dc=[...onlyD], icx=[...onlyI];
  for (let x=dc.length-1;x>=0;x--){
    for (let y=0;y<icx.length;y++){ if (benign(dc[x],icx[y])){ dc.splice(x,1); icx.splice(y,1); break; } }
  }
  if (dc.length||icx.length){ realResidual++; console.log(`  v${v} NON-benign: Deva[${dc.join(' ')}] IAST[${icx.join(' ')}]`); }
});
console.log('non-benign Deva/IAST residual blocks:', realResidual);

// markup + li sanity
let liTotal=0;
verses.forEach((b,v)=>{
  for (const f of ['sanskrit','iast','english']){ const s=b[f]||'';
    if((s.match(/<ul>/g)||[]).length!==(s.match(/<\/ul>/g)||[]).length) throw new Error('ul unbal '+f+' v'+v);
    if((s.match(/<li>/g)||[]).length!==(s.match(/<\/li>/g)||[]).length) throw new Error('li unbal '+f+' v'+v);
  }
  liTotal += (b.english.match(/<li>/g)||[]).length;
});
console.log('ch68 total english <li>:', liTotal, '(backup had 49; expect 51)');
if (outside || realResidual) throw new Error('VERIFY FAILED');
if (liTotal !== 51) throw new Error('li total off');
console.log('\nVERIFY OK');
