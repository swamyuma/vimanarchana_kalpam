// Em-aware header dump for mapping. Usage: node pbHeaders.js <chNum> <blockIdx>
const { load } = require('./load.js');
const CH = parseInt(process.argv[2], 10), BI = parseInt(process.argv[3], 10);
const b = load().chapters.find(c => c.number === CH).blocks[BI];
const clean = s => s.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
console.log(`ch${CH} b${BI}  skLen=${(b.sanskrit||'').length} enLen=${(b.english||'').length}`);
console.log('--- SANSKRIT top-level <p><strong> headers (S#) ---');
[...(b.sanskrit||'').matchAll(/<p><strong>([\s\S]*?)<\/strong>/g)].forEach((m,i)=>{ if(/[ऀ-ॿ]/.test(m[1])) console.log(`S${i} ${clean(m[1]).slice(0,52)}`); });
console.log('--- SANSKRIT all top-level <p> starts (first 30 chars) [for prose] ---');
[...(b.sanskrit||'').matchAll(/<p>(?!<strong>)([\s\S]{0,34}?)(?:<|$)/g)].forEach((m,i)=>console.log(`  p: ${clean(m[1]).slice(0,34)}`));
console.log('--- ENGLISH top-level <li> section headers (E#, em-aware) ---');
[...(b.english||'').matchAll(/<(?:li|p)>(?:<p>)?<strong>([\s\S]*?)<\/strong>/g)].forEach((m,i)=>console.log(`E${i} ${clean(m[1]).slice(0,52)}`));
