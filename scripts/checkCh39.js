// Check ch38 b2 pattern-b <p> lines: translit(Deva line) vs following <em> line.
// Skips the `**...*` lumped lines (those get regenerated).
const S = 'C:/Users/umasu/Documents/gate-files/vimanarchana_reader/scripts/';
const { load } = require(S + 'load.js');
const { translit } = require(S + 'translit.js');
const sk = load().chapters[38].blocks[2].sanskrit;
const norm = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const lines = sk.split('\n');
for (let i = 0; i < lines.length - 1; i++) {
  const cur = lines[i], em = lines[i + 1];
  if (/^<em>/.test(cur) || cur.startsWith('**')) continue;
  if (!/^<em>/.test(em)) continue;
  if (!/[ऀ-ॿ]/.test(cur)) continue;
  const got = norm(translit(cur)), iast = norm(em);
  if (got === iast) continue;
  const g = got.split(' '), e = iast.split(' ');
  let out = [];
  let a=0,b=0;
  while(a<g.length&&b<e.length){
    if(g[a]===e[b]){a++;b++;continue;}
    let m=false;
    for(let k=1;k<=3&&!m;k++){ if(g[a+k]===e[b]){out.push('Δ+'+g.slice(a,a+k).join(' '));a+=k;m=true;} else if(g[a]===e[b+k]){out.push('Δ-'+e.slice(b,b+k).join(' '));b+=k;m=true;} }
    if(!m){out.push(JSON.stringify(g[a])+' vs '+JSON.stringify(e[b]));a++;b++;}
  }
  if(out.length) console.log('L'+(i+1)+': '+out.join(' | '));
}
