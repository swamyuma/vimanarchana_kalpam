// Verify patched reader vs ch83-backup.html. Expect: ALL chapters byte-identical EXCEPT ch83
// (idx 82): (a) ONE new block at idx 9 (colophon); (b) old b0-8 → new b0-8 with only b6.iast +
// b8.sanskrit changed; (c) old b9-11 → new b10-12 unchanged; (d) 0 english changes to pre-existing
// blocks; (e) no residual x/ou in b8.sanskrit + no residual saṃyuktamp; fixes present.
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
const cur = loadFrom(READER), old = loadFrom(SC+'/ch83-backup.html');
if (cur.length !== old.length) throw new Error('chapter count changed');
let outside = 0;
for (let ci=0; ci<cur.length; ci++){ if (ci===82) continue;
  if (JSON.stringify(cur[ci]) !== JSON.stringify(old[ci])) { outside++; console.log('UNEXPECTED chapter diff idx', ci); } }
console.log('chapters changed outside ch83:', outside);
const A = cur[82].blocks, B = old[82].blocks;
if (A.length !== B.length + 1) throw new Error(`ch83 block count: expected ${B.length+1}, got ${A.length}`);
const COL = 9;
const col = A[COL];
if (!col.colophon || col.type !== 'verse' || col.label !== 'Colophon') throw new Error('idx 9 not colophon');
if (!/इति श्रीवैखानसे.*त्र्यशीतितमः पटलः.*८३/.test(col.sanskrit)) throw new Error('colophon Deva malformed');
if (!/tryaśītitamaḥ paṭalaḥ .*83/.test(col.iast)) throw new Error('colophon IAST malformed');
if (!/Eighty-third Chapter/.test(col.english)) throw new Error('colophon English malformed');
const EXPECTED = new Set(['b6.iast','b8.sanskrit']);
const seen = new Set(); let engChanged = 0;
for (let ni=0; ni<A.length; ni++){ if (ni===COL) continue;
  const oi = ni < COL ? ni : ni - 1; const nb = A[ni], ob = B[oi];
  if (nb.type !== ob.type) throw new Error(`type mismatch new b${ni} vs old b${oi}`);
  for (const k of new Set([...Object.keys(nb),...Object.keys(ob)])){
    if (JSON.stringify(nb[k]) !== JSON.stringify(ob[k])){ seen.add(`b${oi}.${k}`); if (k==='english') engChanged++; } } }
console.log('ch83 pre-existing field diffs:', [...seen].sort().join(', ') || '(none)');
console.log('english diffs to pre-existing (must be 0):', engChanged);
for (const e of seen) if (!EXPECTED.has(e)) throw new Error('UNEXPECTED ch83 field diff: ' + e);
for (const e of EXPECTED) if (!seen.has(e)) throw new Error('MISSING expected ch83 field diff: ' + e);
if (engChanged) throw new Error('english changed on pre-existing block');
// residuals in edited fields
const b8sk = A[8].sanskrit.replace(/<[^>]+>/g,' ');
if ((b8sk.match(/x/g)||[]).length) throw new Error('residual x in b8.sanskrit');
if ((b8sk.match(/ou/g)||[]).length) throw new Error('residual ou in b8.sanskrit');
if (/saṃyuktamp/.test(A[6].iast)) throw new Error('residual saṃyuktamp');
// applied-fix presence
if (!/saṃyuktam\b/.test(A[6].iast)) throw new Error('b6 fix missing');
for (const t of ['sahasrākṣaḥ','cakṣuṣī','nakṣatrāṇi','nakhāḥ','ūrdhvaliṅgaḥ','karṇau','aśvinau','oṣṭhau','vṛṣaṇau','mitrāvaruṇau'])
  if (!A[8].sanskrit.includes(t)) throw new Error('b8 fix missing: ' + t);
if ((A[8].sanskrit.split('nakhāḥ').length-1) !== 2) throw new Error('nakhāḥ count != 2');
// markup balance
A.forEach((b, bi) => { if (b.type !== 'verse') return;
  for (const f of ['sanskrit','iast','english']) { const v = b[f] || '';
    for (const t of ['p','em','strong','blockquote','ul','li','ol']) {
      const o=(v.match(new RegExp('<'+t+'\\b','g'))||[]).length, c=(v.match(new RegExp('</'+t+'>','g'))||[]).length;
      if (o!==c) throw new Error(`<${t}> unbalanced b${bi}.${f}`); } } });
console.log('markup balanced; no residual x/ou in b8.sanskrit; fixes present.');
if (outside) throw new Error('unexpected diffs outside ch83');
console.log('\nVERIFY OK');
