// Analyze an oversized verse block's section seams. Usage: node pbAnalyze.js <chNum> [blockIdx]
// If blockIdx omitted, picks the largest verse block. Prints Sanskrit top-level section
// headers and English section headers (nested-ul-aware) so seams can be mapped by hand.
const { load } = require('./load.js');
const CH = parseInt(process.argv[2], 10);
const chap = load().chapters.find(c => c.number === CH);
if (!chap) throw new Error('no chapter ' + CH);
let bi = process.argv[3] != null ? parseInt(process.argv[3], 10) : -1;
if (bi < 0) { let mx = -1; chap.blocks.forEach((b, i) => { if (b.type === 'verse' && (b.sanskrit || '').length > mx) { mx = (b.sanskrit || '').length; bi = i; } }); }
const b = chap.blocks[bi];
const clean = s => s.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
console.log(`ch${CH} block[${bi}] type=${b.type} num=${b.num} skLen=${(b.sanskrit||'').length} enLen=${(b.english||'').length} iastLen=${(b.iast||'').length}`);

// SANSKRIT top-level Devanagari section headers: <p><strong>देव...</strong>
console.log('\n--- SANSKRIT section headers (anchor form shown) ---');
const skHeads = [...(b.sanskrit||'').matchAll(/<p><strong>([^<]*?)<\/strong>/g)].filter(m => /[ऀ-ॿ]/.test(m[1]));
skHeads.forEach((m, i) => console.log(`  S${i}  <p><strong>${clean(m[1]).slice(0,40)}`));

// ENGLISH section headers: <strong>...:</strong> — detect whether <li>-wrapped or <p>-wrapped
console.log('\n--- ENGLISH section headers (anchor form shown) ---');
const en = b.english || '';
const enHeads = [...en.matchAll(/<(li|p)>(?:<p>)?<strong>([^<]*?)<\/strong>/g)];
enHeads.forEach((m, i) => {
  const wrap = en.slice(m.index).startsWith('<li><p><strong>') ? '<li><p><strong>'
    : en.slice(m.index).startsWith('<li><strong>') ? '<li><strong>'
    : en.slice(m.index).startsWith('<p><strong>') ? '<p><strong>' : m[0].slice(0, 15);
  console.log(`  E${i}  ${wrap}${clean(m[2]).slice(0,42)}`);
});
console.log(`\ncounts: SK headers=${skHeads.length}  EN headers=${enHeads.length}`);
