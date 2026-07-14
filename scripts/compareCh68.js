// Per-block Deva->IAST diff for ch68. Strips (मुद्रितपाठे ...) / [मुद्रितपाठे ...] apparatus
// (IAST omits those), transliterates Deva, compares word multisets vs the IAST field.
const { load } = require('./load.js');
const { translit } = require('./translit.js');
const { chapters } = load();
const ch = chapters[67];
const verses = ch.blocks.filter(b => b.type === 'verse');

function stripTags(s){ return s.replace(/<[^>]+>/g, ' '); }
function stripApparatus(s){
  // remove ( ... मुद्रितपाठे ... ) and [ ... मुद्रितपाठे ... ] groups
  return s.replace(/[\(\[][^\)\]]*मुद्रितपाठे[^\)\]]*[\)\]]/g, ' ');
}
function words(s){
  return (stripTags(s)
    .replace(/&#39;|&quot;|&amp;/g, ' ')
    .replace(/[।॥॰.,;:|()\[\]—…–—”“‘’"']/g, ' ')
    .match(/[^\s]+/g) || [])
    .filter(w => /[A-Za-zĀ-ſḀ-ỿ]/.test(w)); // keep tokens with Latin letters
}
function multiset(arr){ const m = new Map(); for (const x of arr) m.set(x, (m.get(x)||0)+1); return m; }
function diff(aWords, bWords){ // returns {onlyDeva, onlyIast}
  const A = multiset(aWords), B = multiset(bWords);
  const onlyDeva=[], onlyIast=[];
  for (const [k,v] of A){ const d = v - (B.get(k)||0); for(let i=0;i<d;i++) onlyDeva.push(k); }
  for (const [k,v] of B){ const d = v - (A.get(k)||0); for(let i=0;i<d;i++) onlyIast.push(k); }
  return { onlyDeva, onlyIast };
}

let total = 0;
verses.forEach((b, i) => {
  const devClean = stripApparatus(b.sanskrit || '');
  const devT = translit(devClean);
  const dW = words(devT);
  const iW = words(b.iast || '');
  const { onlyDeva, onlyIast } = diff(dW, iW);
  if (onlyDeva.length || onlyIast.length) {
    total++;
    console.log(`\n[v${i}/block${i+2}]`);
    if (onlyDeva.length) console.log('  Deva-only (expected in IAST):', onlyDeva.join('  '));
    if (onlyIast.length) console.log('  IAST-only (suspect)         :', onlyIast.join('  '));
  }
});
console.log('\nblocks with diffs:', total);
