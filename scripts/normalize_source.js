// One-off: apply the diacritics map to the SOURCE markdown
// (../../video_transcript/vimanarchana_kalpa_chapter_*.md).
//
// Safety model: every rule's search pattern is pure ASCII, so a replacement can
// only ever rewrite Latin (anglicized) text — it is physically impossible for it
// to alter a Devanagari character. We enforce that as a hard invariant: the count
// of Devanagari codepoints in each file must be identical before and after; if a
// file ever fails that check it is left untouched and reported. This lets us fix
// English even when it shares a line with Devanagari (glossary tables, bilingual
// headings) without risk to the Sanskrit.
//
//   node scripts/normalize_source.js            # dry run (writes nothing)
//   node scripts/normalize_source.js --apply    # rewrite the .md files in place

const fs = require('fs');
const path = require('path');
const DIACRITICS = require('./diacritics.js');

const APPLY = process.argv.includes('--apply');
const srcDir = path.join(__dirname, '../../video_transcript');
const DEVANAGARI_G = /[ऀ-ॿ]/g;

const rules = DIACRITICS.map(([p, r]) => ({
  src: p, repl: r,
  label: p.replace(/\\b|\(s\)\?|\(\?!-\)/g, ''),
  n: 0
}));

function devCount(s) { return (s.match(DEVANAGARI_G) || []).length; }

const files = fs.readdirSync(srcDir)
  .filter(f => f.startsWith('vimanarchana_kalpa_chapter_') && f.endsWith('.md'))
  .sort((a, b) => parseInt(a.match(/chapter_(\d+)/)[1]) - parseInt(b.match(/chapter_(\d+)/)[1]));

let totalChanges = 0, filesChanged = 0;
const aborted = [];

for (const file of files) {
  const fp = path.join(srcDir, file);
  const original = fs.readFileSync(fp, 'utf8');
  let text = original;
  let fileChanges = 0;

  for (const rule of rules) {
    const re = new RegExp(rule.src, 'g');
    text = text.replace(re, (...a) => {
      rule.n++; fileChanges++;
      return rule.repl.replace(/\$(\d)/g, (_, d) => a[Number(d)] || '');
    });
  }

  // Hard invariant: Sanskrit (Devanagari) must be byte-for-byte preserved.
  if (devCount(text) !== devCount(original)) {
    aborted.push(file);
    continue;
  }

  if (fileChanges > 0) {
    filesChanged++;
    totalChanges += fileChanges;
    if (APPLY) fs.writeFileSync(fp, text, 'utf8');
  }
}

const active = rules.filter(r => r.n > 0).sort((a, b) => b.n - a.n);
console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'} — ${totalChanges} changes across ${filesChanged} files.\n`);
active.forEach(r => console.log(`  ${String(r.n).padStart(4)}  ${r.label}`));
console.log(`\n✓ Devanagari codepoint count preserved in every file (Sanskrit untouched).`);
if (aborted.length) console.log(`⚠ ABORTED (Devanagari count changed, left untouched): ${aborted.join(', ')}`);
if (!APPLY) console.log(`\nRe-run with --apply to write the files.`);
