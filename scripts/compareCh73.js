// ch73 (chapters[72]): unified script-separated diff (handles pattern-a + inline-em).
const { load } = require('./load.js');
const { translit } = require('./translit.js');
const { chapters } = load();
const ch = chapters[72];
if (ch.number !== 73) throw new Error('wrong ch ' + ch.number);

const clean = s => s.replace(/<[^>]+>/g,' ').replace(/&quot;|&#39;|&amp;|&mdash;|&nbsp;/g,' ');
const rmLatin = s => s.replace(/[A-Za-zĀ-ſḀ-ỿ]+/g,' ');
const rmDeva  = s => s.replace(/[ऀ-ॿ]+/g,' ');
const stripApp = s => s.replace(/\([^()\[\]]*मुद्रितपाठे[^()\[\]]*\)|\[[^()\[\]]*मुद्रितपाठे[^()\[\]]*\]/g,' ');
const words = s => (s.replace(/[।॥॰.,;:|()\[\]—…–"'’‘0-9॥]/g,' ').match(/[^\s]+/g)||[]).filter(w=>/[A-Za-zĀ-ſḀ-ỿ]/.test(w));

ch.blocks.forEach((b,bi) => {
  if (b.type !== 'verse') return;
  const devSrc = b.sanskrit || '';
  const iaSrc = (b.iast && b.iast.trim()) ? b.iast : b.sanskrit || '';
  const devWords = words(translit(stripApp(rmLatin(clean(devSrc)))));
  const iastWords = words(rmDeva(clean(iaSrc)));
  const D={},I={}; devWords.forEach(w=>D[w]=(D[w]||0)+1); iastWords.forEach(w=>I[w]=(I[w]||0)+1);
  const onlyD=[],onlyI=[];
  for(const k in D){const c=D[k]-(I[k]||0);for(let x=0;x<c;x++)onlyD.push(k);}
  for(const k in I){const c=I[k]-(D[k]||0);for(let x=0;x<c;x++)onlyI.push(k);}
  const mode = (b.iast && b.iast.trim()) ? 'pattern-a' : 'inline-em';
  if (onlyD.length || onlyI.length) {
    console.log(`\n[block ${bi}] (${mode}) ${b.label||(b.colophon?'colophon':'')}`);
    console.log('  Deva-only:', onlyD.join('  '));
    console.log('  IAST-only:', onlyI.join('  '));
  } else {
    console.log(`[block ${bi}] (${mode}) — clean`);
  }
});

// glyph scan across all verse sanskrit+iast
let all=''; ch.blocks.forEach(b=>{ if(b.type==='verse') all += (b.sanskrit||'')+' '+(b.iast||'')+' '; });
const lat = all.replace(/<[^>]+>/g,' ');
console.log('\n=== glyph counts (verse sanskrit+iast) ===');
console.log('x:', (all.match(/x/g)||[]).length, ' ou:', (lat.match(/ou/g)||[]).length,
  ' ō:', (lat.match(/ō/g)||[]).length, ' ē:', (lat.match(/ē/g)||[]).length,
  ' backtick:', (all.match(/`/g)||[]).length, ' asterisk**:', (all.match(/\*\*/g)||[]).length);
