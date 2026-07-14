// ch44 (Nava-ṣaṭ-pañca-mūrty-arcanā-vidhiḥ) reconciliation — PHASE 1: structural rebuild.
// b2 (verse, pattern-b, 16 PB markers). Defect: 8 <ul> regions have the `**   …*` lump-markup
// defect — each list's IAST (heading-em + per-<li> lines) is lumped inside the LAST <li> as
// `**   X*` markers (render literally). Also b2 line-58 Deva <li> is CORRUPTED (Latin text
// embedded where Devanagari should be). Phase 1: (a) rebuild each <ul> relocating the lumped IAST
// onto its correct <li> [convert `**   X*`->`<em>X</em>`], moving each list's IAST heading-em up
// into its preceding <p><strong>…</strong> heading; (b) fix the line-58 Latin-in-Deva corruption.
// VERIFY relocation content-preserving (devOnly + Latin-token multiset) BEFORE content fixes (phase 2).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/357a72e2-eb1c-4f8e-843a-248568ad40f5/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[43];
if (ch.number !== 44) throw new Error('wrong chapter ' + ch.number);
const b = ch.blocks[2];
if (b.type !== 'verse') throw new Error('b2 not verse');
const rawS = b.sanskrit;
let s = rawS;

// tokenizers for verification
const devOnly = str => (str.match(/[ऀ-ॿ।॥॰]/g) || []).join('');
const latinTokens = str => (str.replace(/<[^>]+>/g, ' ').replace(/&#39;|&amp;/g, ' ')
  .match(/[A-Za-zĀ-ſǍ-ǰḀ-ỿāīūṛṝḷḹṅñṭḍṇśṣṃḥ]+/g) || []).sort();

// ---- rebuild one <ul> (relocate lumped IAST). Returns {newUl, titleEm|null}. ----
function rebuildUL(ul) {
  const inner = ul.replace(/^<ul>\s*/, '').replace(/\s*<\/ul>$/, '');
  const items = [...inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1]);
  const n = items.length;
  const last = items[n - 1];
  const lines = last.split('\n');
  const di = lines.findIndex(l => { const t = l.trimStart(); return t.startsWith('<em') || t.startsWith('**'); });
  if (di < 0) throw new Error('no lumped block in last <li>');
  const lastDeva = lines.slice(0, di).join('\n');
  let lumped = lines.slice(di), titleEm = null;
  if (lumped[0].trimStart().startsWith('<em><strong>')) {
    titleEm = lumped[0].trim().replace(/^<em><strong>/, '').replace(/<\/strong><\/em>$/, '');
    lumped = lumped.slice(1);
  }
  const iast = lumped.map(l => '<em>' + l.replace(/^\s*\*\*\s*/, '').replace(/\*\s*$/, '') + '</em>');
  if (iast.length !== n) throw new Error(`ul li/iast mismatch: ${n} vs ${iast.length}`);
  const devaParts = items.slice(0, n - 1).concat([lastDeva]);
  const newItems = devaParts.map((d, i) => '<li>' + d + '<br>\n' + iast[i] + '</li>');
  return { newUl: '<ul>\n' + newItems.join('\n') + '\n</ul>', titleEm };
}

// pass 1: bare heading <p><strong>…</strong></p> immediately followed by <ul> (regions 1-6, 8)
let region1to8 = 0;
s = s.replace(/(<!--PB-->)?<p><strong>([^<]*)<\/strong><\/p>\n(<ul>[\s\S]*?<\/ul>)/g, (full, pb, head, ul) => {
  const { newUl, titleEm } = rebuildUL(ul);
  region1to8++;
  const p = (pb || '') + '<p><strong>' + head + '</strong>' +
    (titleEm ? '<br>\n<em><strong>' + titleEm + '</strong></em>' : '') + '</p>';
  return p + '\n' + newUl;
});
// pass 2: any remaining <ul> that still has lump markup (region 7 — no bare heading)
let region7 = 0;
s = s.replace(/<ul>[\s\S]*?<\/ul>/g, ul => {
  if (!ul.includes('**')) return ul;
  const { newUl } = rebuildUL(ul);
  region7++;
  return newUl;
});
console.log('rebuilt uls: pass1(bare-heading)=' + region1to8 + ' pass2(headless)=' + region7);

// ---- verify structural rebuild is content-preserving (relocation only) ----
if (devOnly(s) !== devOnly(rawS)) throw new Error('Devanagari changed by ul rebuild!');
if (latinTokens(s).join('|') !== latinTokens(rawS).join('|')) {
  const a = latinTokens(rawS), c = latinTokens(s);
  console.log('lost:', a.filter(x => !c.includes(x)).slice(0, 30));
  console.log('gained:', c.filter(x => !a.includes(x)).slice(0, 30));
  throw new Error('Latin-token multiset changed by ul rebuild!');
}
if (s.includes('**')) throw new Error('residual ** lump markers');
if ((s.match(/\*/g) || []).length) throw new Error('residual lone * markers');
console.log('ul rebuild OK: Devanagari + Latin-token multiset preserved, 0 residual asterisks.');

// ---- fix line-58 Latin-in-Deva corruption (Devanagari reconstruction) ----
const CORRUPT = "&#39;नārāyaṇaṃ kṛṣṇaṃ śauriyaṃ bhaktavatsalam&#39; iti nārāyaṇaṃ; adityaṃ pūrvavat; &#39;prajāpatiṃ pitāmahaṃ hemavarṇam aja&#39; (mudritapāṭhe ajānanam) iti prajāpatim.";
const CLEAN = "&#39;नारायणं कृष्णं शौरिं भक्तवत्सल&#39;मिति नारायणं; आदित्यं पूर्ववत्; &#39;प्रजापतिं पितामहं हेमवर्णम् अजम्&#39; (मुद्रितपाठे अजाननम्) इति प्रजापतिम्।";
{ const c = s.split(CORRUPT).length - 1; if (c !== 1) throw new Error('line58 corrupt count ' + c); }
s = s.split(CORRUPT).join(CLEAN);

const devAfterStruct = devOnly(s); // Deva now final (line-58 reconstructed); phase-2 is IAST-only

// ---- PHASE 2: content fixes (count-guarded). All IAST-side (Deva already final). ----
const X_FIXES = [ // x -> kṣ (all 14 x-tokens are Sanskrit; NO English 'x' in field)
  ['abhyuxya','abhyukṣya',1], ['axaranyāsou','akṣaranyāsau',1], ['daxasutāṃ','dakṣasutāṃ',1],
  ['ekāxarādyaiḥ','ekākṣarādyaiḥ',1], ['haviraxakam','haviḥrakṣakam',1], ['laxmīm','lakṣmīm',1],
  ['nixipya','nikṣipya',1], ['nyaxa','nyakṣa',1], ['praxālya','prakṣālya',1],
  ['puṣparaxakaṃ','puṣparakṣakaṃ',1], ['snānāyābhyuxaṇaṃ','snānāyābhyukṣaṇaṃ',1],
  ['sāxataṃ','sākṣataṃ',1], ['vṛxe','vṛkṣe',1], ['xatrāṃśca','kṣatrāṃśca',1],
];
const OU_FIXES = [ // ou -> au, STEM-targeted (NEVER global: English "Ground/Layout/Southern" have 'ou')
  ['koutuk','kautuk',9], ['śaṅkarou','śaṅkarau',3], ['brahmeśou','brahmeśau',3],
  ['mārkaṇḍeyou','mārkaṇḍeyau',2], ['kṣouṇīṃ','kṣauṇīṃ',2], ['pouṣṇīṃ','pauṣṇīṃ',2],
  ['goulya','gaulya',2], ['candrādityou','candrādityau',1],
];
const OTHER_FIXES = [
  ['dattva','dattvā',7],              // absolutive दत्त्वा (dropped macron)
  ['saṃsnāpy,','saṃsnāpya,',2],       // dropped final a; Deva संस्नाप्य
  ['uddhṛty,','uddhṛtya,',1],         // dropped final a; Deva उद्धृत्य
  ['idamaāpaḥ','idamāpaḥ',2],         // extra a; Deva इदमापः
  ['tadvaiṣṇuḥ','tadviṣṇuḥ',1],       // vaiṣṇ->viṣṇ; Deva तद्विष्णुः
  ['tadvaiṣṇoḥ','tadviṣṇoḥ',1],       // vaiṣṇ->viṣṇ; Deva तद्विष्णोः
  ['argyaṃ','arghyaṃ',5],             // dropped h; Deva अर्घ्यं (ityarghyaṃ)
  ['brahmajajñaṃ','brahmayajñaṃ',1],  // j->y; Deva ब्रह्मयज्ञं
  ['viṣṇoḥnukam','viṣṇornukam',1],    // visarga sandhi; Deva विष्णोर्नुकम्
  ['arcayeayuḥ','arcayeyuḥ',1],       // extra a; Deva अर्चयेयुः
  ['haviṣpātrāṇi','haviḥpātrāṇi',1],  // visarga; Deva हविःपात्राणि
  ['āgneayādi','āgneyādi',1],         // extra a; Deva आग्नेयादि
  ['kapilādi-namabhiḥ','kapilādi-nāmabhiḥ',1], // dropped macron; Deva नामभिः
  ['mantranjāsa','mantranyāsa',1],    // j->y; Deva मन्त्रन्यास
  ['aśaktāścet','aśaktaścet',1],      // long ā->a; Deva अशक्तश्चेत्
  ['uparitalet','uparitale',1],       // extra t; Deva उपरितले
  ['mukhamāṇṭapa','mukhamaṇṭapa',1],  // long ā->a; Deva मुखमण्टप
  ['śauriyaṃ','śauriṃ',1],            // extra ya; Deva शौरिं (line-58 pair)
];
let applied = 0;
for (const [from, to, exp] of [...X_FIXES, ...OU_FIXES, ...OTHER_FIXES]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

const chk = {
  applied,
  'PB markers': s.split('<!--PB-->').length - 1,
  'residual x': (s.match(/x/g)||[]).length,          // expect 0 (all were kṣ)
  'residual ou': s.split('ou').length - 1,           // expect 8 (English Ground/Layout×5/Southern/layout)
  'residual dattva(bare)': (s.match(/dattva(?!ā)/g)||[]).length, // expect 0
  'em bal': (s.match(/<em>/g)||[]).length + '/' + (s.match(/<\/em>/g)||[]).length,
  'strong bal': (s.match(/<strong>/g)||[]).length + '/' + (s.match(/<\/strong>/g)||[]).length,
  'li bal': (s.match(/<li>/g)||[]).length + '/' + (s.match(/<\/li>/g)||[]).length,
  'ul bal': (s.match(/<ul>/g)||[]).length + '/' + (s.match(/<\/ul>/g)||[]).length,
  'p bal': (s.match(/<p>/g)||[]).length + '/' + (s.match(/<\/p>/g)||[]).length,
  'residual latin-in-deva नā': s.split('नā').length - 1,
  'deva unchanged by phase2': devOnly(s) === devAfterStruct,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['PB markers'] !== 16) throw new Error('PB != 16');
if (chk['residual x'] !== 0) throw new Error('residual x');
if (chk['residual ou'] !== 8) throw new Error('residual ou != 8');
if (chk['residual dattva(bare)'] !== 0) throw new Error('residual dattva');
if (!chk['deva unchanged by phase2']) throw new Error('phase2 changed Devanagari!');
for (const k of ['em bal','strong bal','li bal','ul bal','p bal']) { const [a,c]=chk[k].split('/'); if(a!==c) throw new Error(k+' unbalanced'); }

b.sanskrit = s;
fs.writeFileSync(SC + '/ch44-b-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
