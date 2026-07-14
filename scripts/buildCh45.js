// ch45 (Eka-berārcana / Nava-vidhārcana-vidhiḥ) reconciliation.
// b2 (verse, pattern-b, 9 PB markers = 10 spreads). Defect: 10 <ul> regions with the `**   …*`
// lump-markup defect (IAST heading-em [+ body-em for the last region] + per-<li> lines lumped inside
// the last <li>). PHASE 1 (structural, verified content-preserving): rebuild each <ul> relocating the
// lumped IAST onto its correct <li>, moving the list's IAST heading-em (and, for pūjā-bhāra, its
// body-em) up into the preceding <p> heading. PHASE 2: count-guarded content fixes.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/357a72e2-eb1c-4f8e-843a-248568ad40f5/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[44];
if (ch.number !== 45) throw new Error('wrong chapter ' + ch.number);
const b = ch.blocks[2];
if (b.type !== 'verse') throw new Error('b2 not verse');
const rawS = b.sanskrit;
let s = rawS;

const devOnly = str => (str.match(/[ऀ-ॿ।॥॰]/g) || []).join('');
const latinTokens = str => (str.replace(/<[^>]+>/g, ' ').replace(/&#39;|&amp;/g, ' ')
  .match(/[A-Za-zĀ-ſǍ-ǰḀ-ỿāīūṛṝḷḹṅñṭḍṇśṣṃḥ]+/g) || []).sort();

// rebuild one <ul>: returns {newUl, titleEm|null, bodyEms:[]}
function rebuildUL(ul) {
  const inner = ul.replace(/^<ul>\s*/, '').replace(/\s*<\/ul>$/, '');
  const items = [...inner.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1]);
  const n = items.length;
  const last = items[n - 1];
  const lines = last.split('\n');
  const di = lines.findIndex(l => { const t = l.trimStart(); return t.startsWith('<em') || t.startsWith('**'); });
  if (di < 0) throw new Error('no lumped block');
  const lastDeva = lines.slice(0, di).join('\n');
  let lumped = lines.slice(di), titleEm = null;
  if (lumped[0].trimStart().startsWith('<em><strong>')) {
    titleEm = lumped[0].trim().replace(/^<em><strong>/, '').replace(/<\/strong><\/em>$/, '');
    lumped = lumped.slice(1);
  }
  const bodyEms = [];
  while (lumped.length && lumped[0].trimStart().startsWith('<em>') && !lumped[0].includes('**')) {
    bodyEms.push(lumped.shift().trim());
  }
  // convert `**   X*` -> `<em>X</em>`; strip any inner <em> (line already italic via outer <em>)
  const iast = lumped.map(l => '<em>' + l.replace(/^\s*\*\*\s*/, '').replace(/\*\s*$/, '').replace(/<\/?em>/g, '') + '</em>');
  if (iast.length !== n) throw new Error(`ul li/iast mismatch: ${n} vs ${iast.length}`);
  const devaParts = items.slice(0, n - 1).concat([lastDeva]);
  const newItems = devaParts.map((d, i) => '<li>' + d + '<br>\n' + iast[i] + '</li>');
  return { newUl: '<ul>\n' + newItems.join('\n') + '\n</ul>', titleEm, bodyEms };
}

// PASS A: bare heading <p><strong>…</strong></p> + <ul> (the 9 numbered sections)
let passA = 0;
s = s.replace(/(<!--PB-->)?<p><strong>([^<]*)<\/strong><\/p>\n(<ul>[\s\S]*?<\/ul>)/g, (full, pb, head, ul) => {
  const { newUl, titleEm, bodyEms } = rebuildUL(ul);
  passA++;
  const emParts = (titleEm ? '<br>\n<em><strong>' + titleEm + '</strong></em>' : '') +
    bodyEms.map(be => '<br>\n' + be).join('');
  return (pb || '') + '<p><strong>' + head + '</strong>' + emParts + '</p>\n' + newUl;
});

// PASS B: pūjā-bhāra heading (has a Devanagari body) + <ul> (lumped has title-em + body-em)
let passB = 0;
s = s.replace(/(<p><strong>पूजा-भार[^<]*<\/strong>)<br>\n([^<]*)<\/p>\n(<ul>[\s\S]*?<\/ul>)/, (full, pOpen, devaBody, ul) => {
  const { newUl, titleEm, bodyEms } = rebuildUL(ul);
  passB++;
  return pOpen + '<br>\n' + devaBody + '<br>\n<em><strong>' + titleEm + '</strong></em>' +
    bodyEms.map(be => '<br>\n' + be).join('') + '</p>\n' + newUl;
});
console.log('rebuilt: passA(numbered)=' + passA + ' passB(pūjā-bhāra)=' + passB);

// verify structural rebuild content-preserving
if (devOnly(s) !== devOnly(rawS)) throw new Error('Devanagari changed by rebuild!');
if (latinTokens(s).join('|') !== latinTokens(rawS).join('|')) {
  const a = latinTokens(rawS), c = latinTokens(s);
  console.log('lost:', a.filter(x => !c.includes(x)).slice(0, 30));
  console.log('gained:', c.filter(x => !a.includes(x)).slice(0, 30));
  throw new Error('Latin-token multiset changed!');
}
if (s.includes('**') || (s.match(/\*/g) || []).length) throw new Error('residual asterisks');
console.log('rebuild OK: Devanagari + Latin-token multiset preserved, 0 residual asterisks.');

const devAfterStruct = devOnly(s);

// ---- PHASE 2: content fixes (count-guarded) ----
const DEVA_FIX = [
  ['मनाऽभिमन्ता','मनोऽभिमन्ता',1],   // Deva मना->मनो to match IAST manobhimantā (mantra incipit)
];
const FIXES = [
  // x -> kṣ
  ['abhyuxya','abhyukṣya',1], ['praxālya','prakṣālya',1],
  // ou -> au (all Sanskrit; English glosses have no 'ou')
  ['rātrou','rātrau',8], ['ajasradīpou','ajasradīpau',1], ['annabalihomou','annabalihomau',1],
  ['dvou','dvau',1], ['koutukasya','kautukasya',1],
  // other IAST slips
  ['dattva','dattvā',5],                 // absolutive दत्त्वा
  ['tadvaiṣṇ','tadviṣṇ',2],              // vaiṣṇ->viṣṇ (tadviṣṇuḥ/oḥ)
  ['argyaṃ','arghyaṃ',1],                // dropped h; Deva अर्घ्यं
  ['viṣṇoḥnukam','viṣṇornukam',1],       // visarga sandhi; Deva विष्णोर्नुकम्
  ['tathāiva','tathaiva',2],             // āi->ai; Deva तथैव
  ['mantrahāvi','mantrahavi',2],         // extra ā; Deva मन्त्रहवि
  ['havirādanē','havirdāne',1],          // garble + ē glyph; Deva हविर्दाने
  ['balidānē','balidāne',1],             // ē glyph; Deva बलिदाने
  ['paṭodghāṭanē','paṭodghāṭane',1],     // ē glyph; Deva पटोद्घाटने
  ['balibhramaṇē','balibhramaṇe',1],     // ē glyph; Deva बलिभ्रमणे
  ['snānākāle','snānakāle',1],           // long ā->a; Deva स्नानकाले
  ['devarcana','devārcana',7],           // dropped ā; Deva देवार्चन
  ['devatarcana','devatārcana',1],       // dropped ā; Deva देवतार्चन
  ['vādayuktam','vādyayuktam',1],        // dropped y; Deva वाद्ययुक्तम्
  ['vādayutaṃ','vādyayutaṃ',1],          // dropped y; Deva वाद्ययुतं
  ['prabodhaghoṣa','prabodhanaghoṣa',1], // dropped na; Deva प्रबोधनघोष
  ['tadadya','tadasya',1],               // d->s; Deva तदस्य
  ['vārīścataṣṛbhiḥ','vārīścatasṛbhiḥ',1], // ṣ->s; Deva वारीश्चतसृभिः
  ['śundhadvam','śundhadhvam',1],        // dropped h; Deva शुन्धध्वम्
  ['padayoḥ','pādayoḥ',1],               // dropped ā; Deva पादयोः
  ['āḍhākārdham','āḍhakārdham',1],       // long ā->a; Deva आढकार्धम्
  ['gāyak-vāṃśika','gāyaka-vāṃśika',1],  // dropped a; Deva गायक-वांशिक
  ['ṣadajasradīpān','ṣaḍajasradīpān',1], // dental->retroflex; Deva षडजस्रदीपान्
  ['catvārīṃśat','catvāriṃśat',1],       // long ī->i; Deva चत्वारिंशत्
  ['deveśādidevanāṃ','deveśādidevānāṃ',1], // dropped ā; Deva देवेशादिदेवानां
  ['ṣadbhāraṃ','ṣaḍbhāraṃ',1],           // dental->retroflex; Deva षड्भारं
  ['catubhāraṃ','caturbhāraṃ',1],        // dropped r; Deva चतुर्भारं
];
let applied = 0;
for (const [from, to, exp] of [...DEVA_FIX, ...FIXES]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}
// deva changed only by the 1 mantra-incipit fix
const devRef = devAfterStruct.replace('मनाऽभिमन्ता','मनोऽभिमन्ता');
if (devOnly(s) !== devRef) throw new Error('unexpected Devanagari change in phase2');

const chk = {
  applied,
  'PB markers': s.split('<!--PB-->').length - 1,
  'residual x': (s.match(/x/g)||[]).length,          // expect 0
  'residual ou': s.split('ou').length - 1,           // expect 0 (all Sanskrit)
  'residual dattva(bare)': (s.match(/dattva(?!ā)/g)||[]).length,
  'residual ē glyph': (s.match(/ē/g)||[]).length,    // expect 0
  'em bal': (s.match(/<em>/g)||[]).length + '/' + (s.match(/<\/em>/g)||[]).length,
  'strong bal': (s.match(/<strong>/g)||[]).length + '/' + (s.match(/<\/strong>/g)||[]).length,
  'li bal': (s.match(/<li>/g)||[]).length + '/' + (s.match(/<\/li>/g)||[]).length,
  'ul bal': (s.match(/<ul>/g)||[]).length + '/' + (s.match(/<\/ul>/g)||[]).length,
  'p bal': (s.match(/<p>/g)||[]).length + '/' + (s.match(/<\/p>/g)||[]).length,
  'max em depth': (() => { let d=0,m=0; s.replace(/<\/?em>/g,t=>{d+=t==='<em>'?1:-1;m=Math.max(m,d);return t;}); return m; })(),
};
console.log(JSON.stringify(chk, null, 1));
if (chk['PB markers'] !== 9) throw new Error('PB != 9');
if (chk['residual x'] || chk['residual ou'] || chk['residual dattva(bare)'] || chk['residual ē glyph']) throw new Error('residual defect');
if (chk['max em depth'] !== 1) throw new Error('nested em (depth ' + chk['max em depth'] + ')!');
for (const k of ['em bal','strong bal','li bal','ul bal','p bal']) { const [a,c]=chk[k].split('/'); if(a!==c) throw new Error(k+' unbalanced'); }

b.sanskrit = s;
fs.writeFileSync(SC + '/ch45-b-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
