// Surface IAST<->Deva mismatches by transliterating the Deva and diffing against the stored IAST.
// pattern-b: pair each <em> line with the preceding Deva line (within b.sanskrit).
// pattern-a: translit(b.sanskrit) vs b.iast (whole field).
const path = require('C:/Users/umasu/Documents/gate-files/vimanarchana_reader/scripts/load.js');
const { load } = path;
const { translit } = require('C:/Users/umasu/Documents/gate-files/vimanarchana_reader/scripts/translit.js');
const ch = load().chapters[36];

const stripTags = s => s.replace(/<[^>]+>/g, '');
const norm = s => stripTags(s).replace(/&#39;/g, '&#39;').replace(/\s+/g, ' ').trim();

function diffTokens(gotStr, iastStr, tag){
  const g = gotStr.split(/(\s+)/).filter(x=>x.trim());
  const e = iastStr.split(/(\s+)/).filter(x=>x.trim());
  const out = [];
  // simple alignment: walk both, when mismatch, report window
  let i=0,j=0;
  while(i<g.length && j<e.length){
    if(g[i]===e[j]){ i++; j++; continue; }
    // try resync: look ahead up to 3
    let matched=false;
    for(let k=1;k<=3 && !matched;k++){
      if(g[i+k]===e[j]){ out.push(`[${tag}] translit-extra: ${g.slice(i,i+k).join(' ')}`); i+=k; matched=true; }
      else if(g[i]===e[j+k]){ out.push(`[${tag}] iast-extra: ${e.slice(j,j+k).join(' ')}`); j+=k; matched=true; }
    }
    if(!matched){ out.push(`[${tag}] DEVA→${JSON.stringify(g[i])}  vs  IAST→${JSON.stringify(e[j])}`); i++; j++; }
  }
  return out;
}

const patternB = [2,10,12,14];
const patternA = [4,5,6,7,8,15];

for(const bi of patternB){
  const sk = ch.blocks[bi].sanskrit;
  const lines = sk.split('\n');
  const diffs = [];
  for(let i=0;i<lines.length-1;i++){
    const em = lines[i+1];
    if(/^<em>/.test(lines[i])) continue;         // current is already an em line
    if(!/^<em>/.test(em)) continue;              // next is not an em line
    if(!/[ऀ-ॿ]/.test(lines[i])) continue;         // current has no Deva
    const deva = norm(lines[i]);
    const iast = norm(em);
    const got = norm(translit(lines[i]));
    if(got !== iast) diffs.push(...diffTokens(got, iast, 'b'+bi+':L'+(i+1)));
  }
  console.log(`\n===== B${bi} (pattern-b) : ${diffs.length} token-diffs =====`);
  diffs.slice(0,60).forEach(d=>console.log('  '+d));
}

for(const bi of patternA){
  const b = ch.blocks[bi];
  const got = norm(translit(b.sanskrit));
  const iast = norm(b.iast);
  const diffs = diffTokens(got, iast, 'b'+bi);
  console.log(`\n===== B${bi} (pattern-a) : ${diffs.length} token-diffs =====`);
  diffs.slice(0,60).forEach(d=>console.log('  '+d));
}
