// ch36 b2 rebuild (Option B: full IAST rebuild).
// The Deva storey-bullets have NO IAST; their transliteration slots hold broken/misplaced
// English (`**   ...*`) that duplicates the separate `english` field. Plan:
//  1. Remove the `**...*` English lines + the `<em><strong>...Storey/tale...</strong></em>` headings
//     (preserve the `</li>` that some junk lines carry).
//  2. Fix first-para devyou->devyau.
//  3. Append `<br><em>translit(Deva)</em>` to every <li> bullet + the 2 trailing Deva <p> bodies.
//  Section-heading <p> (Deva + "(English)") left as navigational labels. English field untouched.
const fs = require('fs');
const { load, writeBack } = require('./load.js');
const { translit } = require('./translit.js');
const WRITE = process.argv.includes('--write');

const { html, chapters, start, end } = load();
const ch = chapters[35];
if (ch.number !== 36) throw new Error('wrong chapter ' + ch.number);
const b = ch.blocks[2];
if (b.type !== 'verse') throw new Error('b2 not verse');
const orig = b.sanskrit;

// --- devanagari-preservation baseline (only Deva chars, in order) ---
const devSeq = s => (s.match(/[ऀ-ॿ]/g) || []).join('');
// One intentional Deva fix: orphaned ो matra after hyphen (sandhi दक्षिणोत्तर split badly)
// -> दक्षिण-उत्तरयोः (independent उ). mUlam दक्षिणोत्तरयोः. Baseline includes this fix.
const DEVA_FIX = ['दक्षिण-ोत्तरयोः', 'दक्षिण-उत्तरयोः'];
const devBefore = devSeq(orig.split(DEVA_FIX[0]).join(DEVA_FIX[1]));

// ---- Step 1: strip junk lines ----
const lines = orig.split('\n');
const kept = [];
for (const ln of lines) {
  if (ln.startsWith('**')) {                    // broken English gloss
    if (ln.includes('</li>')) kept.push('</li>'); // preserve bullet close
    continue;
  }
  // storey transliteration heading: <em><strong>...Storey/tale...</strong></em>
  if (/^<em><strong>[^<]*(Storey|tale)[^<]*<\/strong><\/em>\s*$/.test(ln)) continue;
  kept.push(ln);
}
let s = kept.join('\n');

// ---- Step 1b: orphaned-matra Deva fix (before transliteration so IAST derives correctly) ----
{
  const n = s.split(DEVA_FIX[0]).length - 1;
  if (n !== 1) throw new Error('DEVA_FIX count ' + n);
  s = s.split(DEVA_FIX[0]).join(DEVA_FIX[1]);
}

// ---- Step 2: first-para IAST slip ----
{
  const n = s.split('devyou').length - 1;
  if (n !== 1) throw new Error('devyou count ' + n);
  s = s.split('devyou').join('devyau');
}

// ---- Step 3a: add IAST to each <li> (bullets currently Deva-only, no <em>) ----
s = s.replace(/<li>([\s\S]*?)<\/li>/g, (m, inner) => {
  if (/<em>/.test(inner)) return m;                 // already has IAST
  if (!/[ऀ-ॿ]/.test(inner)) return m;      // no Deva -> leave
  const body = inner.replace(/\s+$/,'').replace(/^\s+/,'');
  const iast = translit(body);
  return `<li>${body}<br>\n<em>${iast}</em></li>`;
});

// ---- Step 3b: Kautuka <p> (label + <br> + Deva body) ----
{
  const re = /<p><strong>ब्रह्मस्थाने कौतुकम् -<\/strong><br>\n([^<]*?)<\/p>/;
  const mm = s.match(re);
  if (!mm) throw new Error('Kautuka <p> not matched');
  const body = mm[1].trim();
  const labIast = translit('ब्रह्मस्थाने कौतुकम् -');
  const bodyIast = translit(body);
  s = s.replace(re,
    `<p><strong>ब्रह्मस्थाने कौतुकम् -</strong><br>\n${mm[1]}<br>\n<em><strong>${labIast}</strong></em><br>\n<em>${bodyIast}</em></p>`);
}

// ---- Step 3c: summary <p> (Deva body only, no strong) ----
{
  const re = /<p>(आदिमूर्तीनां[\s\S]*?)<\/p>/;
  const mm = s.match(re);
  if (!mm) throw new Error('summary <p> not matched');
  const body = mm[1].trim();
  const iast = translit(body);
  s = s.replace(re, `<p>${body}<br>\n<em>${iast}</em></p>`);
}

// ---- checks ----
const devAfter = devSeq(s);
const checks = {
  'devanagari preserved': devAfter === devBefore,
  'residual **': (s.match(/\*\*/g) || []).length,
  'residual single *': (s.match(/\*/g) || []).length,
  'em open': (s.match(/<em>/g) || []).length,
  'em close': (s.match(/<\/em>/g) || []).length,
  'strong open': (s.match(/<strong>/g) || []).length,
  'strong close': (s.match(/<\/strong>/g) || []).length,
  'li open': (s.match(/<li>/g) || []).length,
  'li close': (s.match(/<\/li>/g) || []).length,
  'stray ou (excl blockquote)': (s.replace(/blockquote/g,'').match(/ou/g) || []).length,
};
console.log(JSON.stringify(checks, null, 1));
if (!checks['devanagari preserved']) {
  // show first divergence
  for (let k=0;k<Math.max(devAfter.length,devBefore.length);k++){
    if (devAfter[k]!==devBefore[k]){ console.log('DEVA DIVERGE @',k, JSON.stringify(devBefore.slice(k-5,k+5)),'->',JSON.stringify(devAfter.slice(k-5,k+5))); break; }
  }
  throw new Error('Devanagari not preserved!');
}
if (checks['residual **'] !== 0) throw new Error('** remains');
if (checks['em open'] !== checks['em close']) throw new Error('em unbalanced');
if (checks['strong open'] !== checks['strong close']) throw new Error('strong unbalanced');
if (checks['li open'] !== checks['li close']) throw new Error('li unbalanced');

fs.writeFileSync('ch36-b2-sanskrit-NEW.txt', s);
if (WRITE) {
  b.sanskrit = s;
  fs.writeFileSync(require('./load.js').READER, writeBack(html, start, end, chapters));
  console.log('WROTE reader.');
} else {
  console.log('DRY RUN — wrote ch36-b2-sanskrit-NEW.txt for review.');
}
