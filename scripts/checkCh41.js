// Improved pairing: for each IAST *body* line (starts <em> but not <em><strong>), compare against
// the nearest preceding Deva-content line (not <em>, not **, not a pure <strong> label line).
const S = 'C:/Users/umasu/Documents/gate-files/vimanarchana_reader/scripts/';
const { load } = require(S + 'load.js');
const { translit } = require(S + 'translit.js');
const sk = load().chapters[40].blocks[2].sanskrit;
const norm = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const lines = sk.split('\n');
const isEmBody = l => /^<em>/.test(l) && !/^<em><strong>/.test(l);
const isDevaContent = l => /[ऀ-ॿ]/.test(l) && !/^<em/.test(l) && !l.startsWith('**') && !/<strong>/.test(l);
for (let i = 0; i < lines.length; i++) {
  if (!isEmBody(lines[i])) continue;
  // find preceding Deva-content line
  let j = i - 1;
  while (j >= 0 && !isDevaContent(lines[j])) j--;
  if (j < 0) continue;
  const got = norm(translit(lines[j])), iast = norm(lines[i]);
  if (got === iast) continue;
  const g = got.split(' '), e = iast.split(' ');
  let out = [], a = 0, b = 0;
  while (a < g.length && b < e.length) {
    if (g[a] === e[b]) { a++; b++; continue; }
    let m = false;
    for (let k = 1; k <= 3 && !m; k++) { if (g[a + k] === e[b]) { out.push('Δ+' + g.slice(a, a + k).join(' ')); a += k; m = true; } else if (g[a] === e[b + k]) { out.push('Δ-' + e.slice(b, b + k).join(' ')); b += k; m = true; } }
    if (!m) { out.push(JSON.stringify(g[a]) + ' vs ' + JSON.stringify(e[b])); a++; b++; }
  }
  if (out.length) console.log('L' + (j + 1) + '/' + (i + 1) + ': ' + out.join(' | '));
}
