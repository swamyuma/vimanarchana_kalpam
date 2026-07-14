// Verify patched reader vs ch82-backup.html. Expect: ALL chapters byte-identical EXCEPT ch82
// (idx 81): (a) ONE new block at idx 7 (colophon); (b) old b0-6 → new b0-6 with only
// b4.sanskrit + b6.sanskrit changed; (c) old b7-9 → new b8-10 unchanged; (d) 0 english changes
// to pre-existing blocks; (e) no residual x/ou/z + no residual corruption tokens.
const fs = require('fs');
const { READER } = require('./load.js');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/2f117437-76b6-488f-8f8c-2f6d8388339d/scratchpad';
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch82-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci=0; ci<cur.length; ci++){ if (ci===81) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch82:', outside);
const A = cur[81].blocks, B = old[81].blocks;
if (A.length !== B.length + 1) throw new Error(`ch82 block count: expected ${B.length+1}, got ${A.length}`);
const COL = 7;
const col = A[COL];
if (!col.colophon || col.type !== 'verse' || col.label !== 'Colophon') throw new Error('idx 7 not colophon');
if (!/इति श्रीवैखानसे.*द्व्यशीतितमः पटलः.*८२/.test(col.sanskrit)) throw new Error('colophon Deva malformed');
if (!/dvyāśītitamaḥ paṭalaḥ .*82/.test(col.iast)) throw new Error('colophon IAST malformed');
if (!/Eighty-second Chapter/.test(col.english)) throw new Error('colophon English malformed');
const EXPECTED = new Set(['b4.sanskrit','b6.sanskrit']);
const seen = new Set(); let engChanged = 0;
for (let ni=0; ni<A.length; ni++){ if (ni===COL) continue;
  const oi = ni < COL ? ni : ni - 1; const nb = A[ni], ob = B[oi];
  if (nb.type !== ob.type) throw new Error(`type mismatch new b${ni} vs old b${oi}`);
  for (const k of new Set([...Object.keys(nb),...Object.keys(ob)])){
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])){ seen.add(`b${oi}.${k}`); if (k==='english') engChanged++; } } }
console.log('ch82 pre-existing field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs to pre-existing (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED ch82 field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected ch82 field diff: ' + e);
if (engChanged) throw new Error('english changed on pre-existing block');
// residuals
let allv=''; A.forEach(b=>{ if(b.type==='verse') allv += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = allv.replace(/<[^>]+>/g,' ');
if ((lat.match(/x/g)||[]).length) throw new Error('residual x');
if ((lat.match(/ou/g)||[]).length) throw new Error('residual ou');
if (/सहिरस्कां|sahiraskāṃ|tamasaspaṣi|uṣnig/.test(allv)) throw new Error('residual corruption token');
// applied-fix presence
if (!/adhidaivatāni/.test(A[4].sanskrit)) throw new Error('b4 fix missing');
for (const t of ['jagatyaḥ chandāṃsi','bhūrbhuvaḥsvarom','सशिरस्कां','saśiraskāṃ','tamasaspari','uṣṇig-kakubhaḥ'])
  if (!A[6].sanskrit.includes(t)) throw new Error('b6 fix missing: ' + t);
// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit','iast','english']) { const v = b[f] || '';
    for (const t of ['p','em','strong','blockquote','ul','li','ol']) {
      const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
      if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; no residual x/ou/corruption; fixes present.');
if (outside) throw new Error('unexpected diffs outside ch82');
console.log('\nVERIFY OK');
