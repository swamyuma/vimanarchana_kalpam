// Dry run: report how many replacements the diacritics map would make across the
// English-language block fields. Writes nothing.
// Run from the reader root: node scripts/diacritics_report.js
const C = require('../chapters_data.js');
const DIACRITICS = require('./diacritics.js');

const rules = DIACRITICS.map(([p, r]) => ({ p, r, re: new RegExp(p, 'g'), n: 0, sample: null }));

// English-language fields per block type (NEVER sanskrit/iast).
function englishParts(b) {
  if (b.type === 'verse') return [b.english];
  if (b.type === 'section' || b.type === 'prose') return [b.html];
  if (b.type === 'chapter-title') return [b.text];
  return [];
}

for (const c of C) {
  for (const b of c.blocks) {
    for (const text of englishParts(b)) {
      if (!text) continue;
      for (const rule of rules) {
        rule.re.lastIndex = 0;
        const before = rule.n;
        text.replace(rule.re, (m, ...rest) => {
          rule.n++;
          if (!rule.sample) {
            const stripped = text.replace(/<[^>]+>/g, ' ');
            const idx = stripped.indexOf(m);
            if (idx >= 0) rule.sample = '…' + stripped.slice(Math.max(0, idx - 25), idx + m.length + 25).trim() + '…';
          }
          return m;
        });
      }
    }
  }
}

const active = rules.filter(r => r.n > 0).sort((a, b) => b.n - a.n);
const noop = rules.filter(r => r.n === 0);

console.log('Replacements that WOULD be made (English fields only):\n');
let total = 0;
for (const r of active) {
  total += r.n;
  const to = r.r.replace(/\$1/g, '');
  console.log(`  ${String(r.n).padStart(4)}  ${r.p.replace(/\\b|\(s\)\?/g, '')} → ${to}`);
  if (r.sample) console.log(`        e.g. ${r.sample}`);
}
console.log(`\n  TOTAL: ${total} replacements across ${active.length} terms.`);
if (noop.length) console.log(`  (no matches: ${noop.map(r => r.p.replace(/\\b|\(s\)\?/g, '')).join(', ')})`);
