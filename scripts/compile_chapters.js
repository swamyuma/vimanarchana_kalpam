const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const DIACRITICS = require('./diacritics.js');

// Scripts live in vimanarchana_reader/scripts/; source markdown and the output
// data file live one level up (../) and two levels up (../../video_transcript).
const srcDir = path.join(__dirname, '../../video_transcript');
const destDir = path.join(__dirname, '..');

// ---------------------------------------------------------------------------
// Parser
//
// Each chapter's markdown is parsed into an ordered array of `blocks`, one of:
//   { type: 'section', html, text }                       full-width heading band
//   { type: 'prose',   html, text }                       full-width band (intros, tables…)
//   { type: 'verse',   label, sanskrit, iast, english, text }   facing-page verse unit
//
// The reader renders a verse's `sanskrit`+`iast` on the left leaf and `english`
// on the right, row-locked. Two source patterns are recognised:
//   (a) bold-label triplet:  **Sanskrit (Devanagari):** / **Transliteration (IAST):** /
//                            **Translation (English):**   (inside #### Verse / Paragraph N)
//   (b) combined heading:    #### Sanskrit (Devanagari) & Transliteration (IAST)
//                            #### English Translation
// In pattern (b) the Devanagari and IAST are interleaved under one heading, so the
// whole left side lands in `sanskrit` and `iast` stays empty — the left leaf shows
// it either way.
// ---------------------------------------------------------------------------

const SANSKRIT_LABEL = /^\*\*Sanskrit \(Devanagari\):\*\*\s*$/;
const IAST_LABEL     = /^\*\*Transliteration \(IAST\):\*\*\s*$/;
const ENGLISH_LABEL  = /^\*\*Translation \(English\):\*\*\s*$/;

// Chapter title line — written with either one or two leading hashes across the
// corpus (e.g. "## Chapter 1: …" vs "# Chapter 44: …").
const CHAP_TITLE = /^#{1,2}\s+Chapter\s+\d+:\s*(.*)$/i;
const H3 = /^###\s+(.*)$/;
const H4 = /^####\s+(.*)$/;

function render(text) {
  const t = (text || '').trim();
  return t ? marked.parse(t) : '';
}

function parseChapter(content, report) {
  const lines = content.split('\n');
  const blocks = [];
  let title = null;

  let prose = [];                       // raw md lines awaiting a flush
  let verse = null;                     // { label, sk:[], ia:[], en:[] }
  let field = null;                     // 'sk' | 'ia' | 'en' | null

  const flushProse = () => {
    const t = prose.join('\n').trim();
    if (t) blocks.push({ type: 'prose', html: marked.parse(t), text: t });
    prose = [];
  };

  const flushVerse = () => {
    if (verse && (verse.sk.length || verse.ia.length || verse.en.length)) {
      const sk = verse.sk.join('\n').trim();
      const ia = verse.ia.join('\n').trim();
      const en = verse.en.join('\n').trim();
      if (!sk && !ia) report.versesMissingSanskrit++;
      if (!en) report.versesMissingEnglish++;
      blocks.push({
        type: 'verse',
        label: verse.label || '',
        sanskrit: render(sk),
        iast: render(ia),
        english: render(en),
        text: [sk, ia, en].filter(Boolean).join('\n')
      });
      report.verses++;
    }
    verse = null;
    field = null;
  };

  const ensureVerse = (label) => {
    if (!verse) verse = { label: label || '', sk: [], ia: [], en: [] };
    else if (label && !verse.label) verse.label = label;
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    let m;

    if ((m = line.match(CHAP_TITLE))) {
      flushVerse(); flushProse();
      if (!title) title = m[1].trim();
      continue;                              // consume the title line itself
    }

    if ((m = line.match(H3))) {
      flushVerse(); flushProse();
      blocks.push({ type: 'section', html: marked.parse('### ' + m[1]), text: m[1].trim() });
      continue;
    }

    if ((m = line.match(H4))) {
      const h = m[1].trim();
      if (/Sanskrit.*Transliteration|Original Sanskrit|Cleaned.*Corrected Sanskrit/i.test(h)) {
        flushVerse(); flushProse();
        ensureVerse('');
        field = 'sk';
        continue;
      }
      if (/IAST Transliteration/i.test(h)) {   // standalone IAST heading (numbered variant)
        ensureVerse('');
        field = 'ia';
        continue;
      }
      if (/English Translation/i.test(h)) {
        ensureVerse('');
        field = 'en';
        continue;
      }
      if (/Verse\s*\/\s*Paragraph|^Verse\b|Paragraph/i.test(h)) {
        flushVerse(); flushProse();
        ensureVerse(h);
        field = null;
        continue;
      }
      if (/Colophon/i.test(h)) {
        flushVerse(); flushProse();
        ensureVerse('Colophon');
        field = null;
        continue;
      }
      // Unrecognised #### heading — keep its text as prose, flag for review.
      report.unknownHeadings.push(h);
      flushVerse();
      prose.push(line);
      continue;
    }

    if (SANSKRIT_LABEL.test(line)) {
      if (verse && verse.sk.length) flushVerse();  // a 2nd Sanskrit block ⇒ new verse
      ensureVerse('');
      field = 'sk';
      continue;
    }
    if (IAST_LABEL.test(line)) { ensureVerse(''); field = 'ia'; continue; }
    if (ENGLISH_LABEL.test(line)) { ensureVerse(''); field = 'en'; continue; }

    if (/^---+\s*$/.test(line)) {                  // hr — soft block boundary
      if (verse) flushVerse(); else flushProse();
      field = null;
      continue;
    }

    if (field && verse) verse[field].push(raw);
    else prose.push(raw);
  }

  flushVerse();
  flushProse();
  // Sequential per-chapter passage number, shown straddling the gutter so each
  // Sanskrit↔English pair shares one citation handle. Colophons are flagged
  // (labelled "Colophon" in the reader) rather than numbered.
  let vn = 0;
  for (const b of blocks) {
    if (b.type !== 'verse') continue;
    const isColophon = /colophon/i.test(b.label) || (!b.english && /विमानार्चनाकल्पे|श्रीवैखानसे/.test(b.text));
    if (isColophon) { b.colophon = true; b.num = null; }
    else b.num = ++vn;
  }
  // Open every chapter with a visible title band so the chapter is named in the
  // body, not only in the header bar.
  if (title) blocks.unshift({ type: 'chapter-title', text: title });
  return { title, blocks };
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

const files = fs.readdirSync(srcDir)
  .filter(f => f.startsWith('vimanarchana_kalpa_chapter_') && f.endsWith('.md'))
  .sort((a, b) => parseInt(a.match(/chapter_(\d+)/)[1]) - parseInt(b.match(/chapter_(\d+)/)[1]));

console.log(`Found ${files.length} chapter files. Processing...`);

const chapters = [];
const report = { verses: 0, versesMissingEnglish: 0, versesMissingSanskrit: 0, unknownHeadings: [] };
const lean = [];   // chapters whose verse count looks suspiciously low

files.forEach(file => {
  const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
  const number = parseInt(file.match(/chapter_(\d+)/)[1]);

  const before = report.verses;
  const { title, blocks } = parseChapter(content, report);
  const verseCount = report.verses - before;

  if (verseCount === 0) lean.push(number);

  chapters.push({
    number,
    title: title || `Chapter ${number}`,
    fileName: file,
    blocks
  });
});

// ---------------------------------------------------------------------------
// Diacritic normalization — anglicized → IAST, applied to ENGLISH-language text
// only (translation, titles, prose). Sanskrit/IAST fields are left untouched.
// ---------------------------------------------------------------------------
const diacriticRules = DIACRITICS.map(([p, r]) => ({ re: new RegExp(p, 'g'), r, label: p.replace(/\\b|\(s\)\?/g, ''), n: 0 }));

function applyDiacritics(text) {
  if (!text) return text;
  for (const rule of diacriticRules) {
    text = text.replace(rule.re, (...args) => {
      rule.n++;
      // Reconstruct replacement honoring $1 capture (English plural).
      return rule.r.replace(/\$(\d)/g, (_, d) => args[Number(d)] || '');
    });
  }
  return text;
}

chapters.forEach(c => {
  c.title = applyDiacritics(c.title);
  c.blocks.forEach(b => {
    if (b.type === 'verse') b.english = applyDiacritics(b.english);
    else if (b.type === 'section' || b.type === 'prose') b.html = applyDiacritics(b.html);
    else if (b.type === 'chapter-title') b.text = applyDiacritics(b.text);
  });
});

const diacriticTotal = diacriticRules.reduce((n, r) => n + r.n, 0);

const totalBlocks = chapters.reduce((n, c) => n + c.blocks.length, 0);

const destFile = path.join(destDir, 'chapters_data.js');
const jsContent = `// Automatically generated file containing all chapters of Vimānārcanākalpa
// Each chapter has an ordered \`blocks\` array: { type:'section'|'prose'|'verse', ... }.
const VIMANARCHANA_CHAPTERS = ${JSON.stringify(chapters, null, 2)};
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VIMANARCHANA_CHAPTERS;
}
`;
fs.writeFileSync(destFile, jsContent, 'utf8');

// ---------------------------------------------------------------------------
// Validator report
// ---------------------------------------------------------------------------
console.log(`\nCompiled ${chapters.length} chapters · ${totalBlocks} blocks · ${report.verses} verses.`);
console.log(`Verses missing English : ${report.versesMissingEnglish}`);
console.log(`Verses missing Sanskrit: ${report.versesMissingSanskrit}`);
console.log(`Diacritic normalizations applied (English text): ${diacriticTotal}`);
if (lean.length) console.log(`⚠ Chapters with ZERO parsed verses (review): ${lean.join(', ')}`);
if (report.unknownHeadings.length) {
  const uniq = [...new Set(report.unknownHeadings)];
  console.log(`⚠ Unrecognised #### headings kept as prose (${report.unknownHeadings.length} total, ${uniq.length} distinct):`);
  uniq.slice(0, 30).forEach(h => console.log(`    "${h}"`));
}
console.log(`\nWrote ${destFile}`);
