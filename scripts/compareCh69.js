// ch69: single mega-block b2 (Deva + inline <em>IAST per <p>, PB-split; iast field EMPTY)
// + b3 separate colophon (sanskrit/iast). Checks: (1) PB part-count sanskrit==english and
// per-part topic alignment; (2) Deva-vs-inlineIAST word-multiset diff for reconciliation.
const { load } = require('./load.js');
const { translit } = require('./translit.js');
const { chapters } = load();
const ch = chapters[68];
if (ch.number !== 69) throw new Error('wrong ch ' + ch.number);
const PB = '<!--PB-->';
const b2 = ch.blocks[2], b3 = ch.blocks[3];

// ---- (1) PB alignment ----
const skParts = (b2.sanskrit||'').split(PB);
const enParts = (b2.english||'').split(PB);
console.log('b2 sanskrit PB-parts:', skParts.length, ' english PB-parts:', enParts.length,
  skParts.length===enParts.length ? 'OK' : '*** MISMATCH ***');
const firstStrong = s => { const m = s.match(/<strong>([\s\S]*?)<\/strong>/); return m ? m[1].replace(/<[^>]+>/g,'').trim().slice(0,42) : '(none)'; };
console.log('\n--- per-part head (i: SK-strong || ENG-strong) ---');
const n = Math.max(skParts.length, enParts.length);
for (let i=0;i<n;i++){
  console.log(`${String(i).padStart(2)}: ${firstStrong(skParts[i]||'').padEnd(44)} || ${firstStrong(enParts[i]||'')}`);
}

// ---- (2) Deva vs inline-IAST word diff ----
const stripApp = s=>s.replace(/\([^()\[\]]*मुद्रितपाठे[^()\[\]]*\)|\[[^()\[\]]*मुद्रितपाठे[^()\[\]]*\]/g,' ');
const words = s=>(s.replace(/<[^>]+>/g,' ').replace(/&#39;|&quot;|&amp;/g,' ')
  .replace(/[।॥॰.,;:|()\[\]—…–"'’‘]/g,' ').match(/[^\s]+/g)||[]).filter(w=>/[A-Za-zĀ-ſḀ-ỿ]/.test(w));
function diffField(sk, iaField){
  // IAST = all <em> spans; Deva = sk with <em>..</em> removed
  const emSpans = (sk.match(/<em>[\s\S]*?<\/em>/g)||[]).join(' ');
  const devaOnly = sk.replace(/<em>[\s\S]*?<\/em>/g,' ');
  const iaText = iaField && iaField.trim() ? iaField : emSpans;   // b3 uses separate iast
  const devSrc = iaField && iaField.trim() ? sk : devaOnly;
  const dW = words(translit(stripApp(devSrc)));
  const iW = words(iaText);
  const D={},I={}; dW.forEach(w=>D[w]=(D[w]||0)+1); iW.forEach(w=>I[w]=(I[w]||0)+1);
  const onlyD=[],onlyI=[];
  for(const k in D){const c=D[k]-(I[k]||0);for(let x=0;x<c;x++)onlyD.push(k);}
  for(const k in I){const c=I[k]-(D[k]||0);for(let x=0;x<c;x++)onlyI.push(k);}
  return {onlyD,onlyI};
}
console.log('\n=== b2 Deva vs inline-IAST diff ===');
{ const {onlyD,onlyI}=diffField(b2.sanskrit||'', b2.iast||'');
  console.log('Deva-only (expect in IAST):', onlyD.join('  '));
  console.log('IAST-only (suspect)       :', onlyI.join('  ')); }
console.log('\n=== b3 (colophon) Deva vs IAST ===');
{ const {onlyD,onlyI}=diffField(b3.sanskrit||'', b3.iast||'');
  console.log('Deva-only:', onlyD.join('  '));
  console.log('IAST-only:', onlyI.join('  ')); }

// glyph scan over b2 sanskrit
const sk = b2.sanskrit||'';
const lat = sk.replace(/<[^>]+>/g,' ');
console.log('\n=== glyph counts (b2.sanskrit) ===');
console.log('x:', (sk.match(/x/g)||[]).length, ' ou:', (lat.match(/ou/g)||[]).length,
  ' ō:', (lat.match(/ō/g)||[]).length, ' ē:', (lat.match(/ē/g)||[]).length,
  ' oa(śuddhoa):', (lat.match(/oa/g)||[]).length, ' proṣ:', (sk.match(/proṣ/g)||[]).length,
  ' saṃsnāpy(no a):', (sk.match(/saṃsnāpy(?![a])/g)||[]).length, ' byo:', (sk.match(/byo/g)||[]).length,
  ' backtick:', (sk.match(/`/g)||[]).length);
