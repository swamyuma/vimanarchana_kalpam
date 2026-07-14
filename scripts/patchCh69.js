// ch69 (Aspṛśya-sparśana-prāyaścitta-vidhiḥ) reconciliation. Structure: b2 = single mega-block,
// Deva + inline <em>IAST per <p>, PB-split (iast field EMPTY); b3 = separate colophon.
// English↔Sanskrit PB-parts already ALIGNED (37==37, verified) — NO realignment needed.
// Fixes derived from compareCh69.js (translit(Deva) vs inline-<em>IAST word diff).
// LEFT benign: ṃ↔ṅ/m/n assimilation (saṅkalpya, sampūjya, saṃbhave, saṃcaratsu, punassandhānaṃ,
//   īṅkārādīnśca), hyphenation, atha/aspṛśya sandhi split, pūrvavad/pūrvavat sandhi.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[68];
if (ch.number !== 69) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];

// b2.sanskrit fixes. ORDER: ō/ou globals first (some later targets depend on post-ou forms).
const FIX_B2 = [
  ['ō', 'o', 35],
  ['ou', 'au', 28],
  ['proṣ', 'prokṣ', 14],
  ['śuddhoa', 'śuddho', 9],
  ['saṃsnāpy', 'saṃsnāpya', 16],
  ['kalāśaiḥ', 'kalaśaiḥ', 10],
  ['darśene', 'darśane', 7],
  ['sargināṃ', 'sargiṇāṃ', 4],
  // x / xṣ (total x = 9)
  ['xṣipraṃ', 'kṣipraṃ', 1],
  ['raxṣaṇaṃ', 'rakṣaṇaṃ', 1],
  ['paxi', 'pakṣi', 1],
  ['mahāmaxṣik', 'mahāmakṣik', 2],   // STEM (mahāmaxṣikayute + mahāmaxṣikādi, boundary a/ā)
  ['ācāryadaxṣiṇāṃ', 'ācāryadakṣiṇāṃ', 1],
  ['induxṣay', 'indukṣay', 2],
  ['muxe', 'mukhe', 1],
  // word slips
  ['abhyuṣya', 'abhyukṣya', 1],
  ['dvītīye', 'dvitīye', 2],
  ['nirantarasāñcāre', 'nirantarasañcāre', 1],
  ['bālalaye', 'bālālaye', 3],
  ['pratiṣṭhāpy', 'pratiṣṭhāpya', 3],
  ['ālayadi', 'ālayādi', 2],
  ['deṣeṣu', 'deśeṣu', 2],
  ['raktastrīdṛṣṭe', 'raktastrīdarśane', 1],
  ['daśaśo', 'daśakṛtvo', 1],
  ['kukkutādīnāṃ', 'kukkuṭādīnāṃ', 1],
  ['dhruvaber-kautukādiṣu', 'dhruvabera-kautukādiṣu', 1],
  ['paryagnikṛtva', 'paryagnikṛtvā', 1],
  ['ālayabhyantarādau', 'ālayābhyantarādau', 1],   // after ou->au (was -ādou)
  ['pacanāsthāne', 'pacanasthāne', 1],
  ['mahāvāt-ativṛṣṭi', 'mahāvāta-ativṛṣṭi', 1],
  ['pañcagavyābhyaṃ', 'pañcagavyābhyāṃ', 1],
  ['pūrvokt-tāḍanādi', 'pūrvokta-tāḍanādi', 1],    // dropped linking a (after ō->o); cf pūrvoktadeśeṣu
];

let applied = 0;
function applyAll(obj, field, fixes){
  for (const [from, to, exp] of fixes){
    const n = (obj[field].split(from).length - 1);
    if (n !== exp) throw new Error(`COUNT "${from}" in ${field}: expected ${exp}, found ${n}`);
    obj[field] = obj[field].split(from).join(to);
    applied += n;
  }
}
applyAll(b2, 'sanskrit', FIX_B2);
// b3 colophon Deva: nāmā -> nāma
applyAll(b3, 'sanskrit', [['विधिर्नामा', 'विधिर्नाम', 1]]);

// residual checks on b2.sanskrit
const sk = b2.sanskrit;
const lat = sk.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'x': (sk.match(/x/g)||[]).length,
  'ou': (lat.match(/ou/g)||[]).length,
  'ō/ē': (lat.match(/[ōē]/g)||[]).length,
  'proṣ': (sk.match(/proṣ/g)||[]).length,
  'śuddhoa': (sk.match(/śuddhoa/g)||[]).length,
  'saṃsnāpy(no a)': (sk.match(/saṃsnāpy(?!a)/g)||[]).length,
  'kalāśaiḥ': (sk.match(/kalāśaiḥ/g)||[]).length,
  'darśene': (sk.match(/darśene/g)||[]).length,
  'sargināṃ': (sk.match(/sargināṃ/g)||[]).length,
  'backtick': (sk.match(/`/g)||[]).length,
  'deva नामा': (b3.sanskrit.match(/नामा/g)||[]).length,
};
console.log(JSON.stringify(chk, null, 1));
for (const k of Object.keys(chk)) if (k !== 'applied' && chk[k]) throw new Error('residual: ' + k);
// markup balance on b2/b3
for (const [b, tag] of [[b2,'b2'],[b3,'b3']]) for (const t of ['p','em','strong','blockquote','ul','li']) {
  const o = (b.sanskrit.match(new RegExp('<'+t+'\\b','g'))||[]).length;
  const c = (b.sanskrit.match(new RegExp('</'+t+'>','g'))||[]).length;
  if (o !== c) throw new Error(`<${t}> unbalanced in ${tag}.sanskrit (${o}/${c})`);
}
console.log('markup balanced.');
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
