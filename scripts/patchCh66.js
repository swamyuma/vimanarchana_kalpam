// ch66 (Nityārcanā-prāyaścitta + Bali-vidhi-prāyaścitta — expiations for daily-worship
// lapses: door-opening, cleaning, bathing, puṣpanyāsa, lamps, darśana defilements, missed
// worship 1 day→1 year, havis faults, and the bali round: missed circumambulations 1 day→
// 1 year, fallen bali, missing ornaments) reconciliation. Pattern-b: b2 content (56 <p>,
// 6 PB = 7 spreads), b3 Colophon. mUlam 066_balividhiH.md. english UNTOUCHED (separate field).
// DEVA FIXES: 'Raudraṃ (रौद्रं)'→'रौद्रं' [LATIN embedded in Deva with the Deva in the
// paren — new defect shape], कलैशः→कलशैः ×2 [metathesis; mUlam शताष्टकलशैः; line 53's
// अष्टचत्वारिंशत्कलशैः was already correct] + IAST kalaiśaḥ→kalaśaiḥ ×3.
// COLOPHON: BOTH b3.sanskrit and b3.iast had stray markdown fences '```' — removed (cf ch65).
// KEY IAST: dray→dravy ×7 [dropped v; Deva द्रव्य; mUlam द्रव्यैः], proṣya→prokṣya ×3 +
// proṣaṇaiah→prokṣaṇaiḥ [ṣ-for-kṣ], kṛtā→kṛtvā ×2 + smṛtā→smṛtvā [dropped v],
// śrībhūmidaivataṃ→daivatyaṃ ×8 + sarva ×2 + pariṣad + dhātrādi [Deva दैवत्यं; digdaivataṃ
// stays — Deva दिग्दैवतं], śuddhoadakaiḥ→śuddhodakaiḥ ×3, aiah ×7, ālaya-gat-→gata- ×2,
// vaiṣvakṣenaṃ→vaiṣvaksenaṃ [kṣ-for-s reversed!], balibhramoṇe→balibhramaṇe, mahāhavṣi→
// mahāhaviṣi, hīneṣvapya→hīneṣvapi, yacet→yācet, spṛṣṭa→spṛṣṭaṃ, alayaṃ→ālayaṃ ×2.
// LEFT (Deva=IAST consistent): tat-tad-devatyaṃ [Deva देवत्यं not दैवत्यं here], द्वैवारिकं
// [apparatus द्विवारिकं], digdaivataṃ ×2, निधाय [apparatus आधाय], many (मुद्रितपाठे …) parens.
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[65];
if (ch.number !== 66) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
const PB_BEFORE = (b2.sanskrit.match(/<!--PB-->/g) || []).length;
let s = b2.sanskrit;

const FIXES = [
  // --- DEVA fixes ---
  ['Raudraṃ (रौद्रं)', 'रौद्रं', 1],
  ['कलैशः', 'कलशैः', 2],
  // --- IAST kalaiś metathesis (incl. aṣṭacatvāriṃśat/śatāṣṭa compounds) ---
  ['kalaiśaḥ', 'kalaśaiḥ', 3],
  // --- dray→dravy (Deva द्रव्य; no legit 'dray' in field) ---
  ['dray', 'dravy', 7],
  ['dravyaih ', 'dravyaiḥ ', 1],
  // --- daivata→daivatya per Deva दैवत्यं (digdaivataṃ = दिग्दैवतं stays) ---
  ['śrībhūmidaivataṃ', 'śrībhūmidaivatyaṃ', 8],
  ['sarvadaivataṃ', 'sarvadaivatyaṃ', 2],
  ['pariṣad-daivataṃ', 'pariṣad-daivatyaṃ', 1],
  ['dhātrādi-daivataṃ', 'dhātrādi-daivatyaṃ', 1],
  ['daivatyāṃ', 'daivatyaṃ', 1],
  // --- ṣ/kṣ confusions ---
  ['proṣaṇaiah', 'prokṣaṇaiḥ', 1], ['proṣya', 'prokṣya', 3],
  ['vaiṣvakṣenaṃ', 'vaiṣvaksenaṃ', 1],
  // --- x→kṣ ---
  ['daxiṇ', 'dakṣiṇ', 8], ['ālayābhimuxe', 'ālayābhimukhe', 1],
  ['axyuṇmeṣa', 'akṣyunmeṣa', 1], ['maxikā', 'makṣikā', 1],
  ['agnisaṃraxṇe', 'agnisaṃrakṣaṇe', 1], ['nixipya', 'nikṣipya', 1],
  ['devābhimuxe', 'devābhimukhe', 1],
  // --- 'ea' garble ---
  ['teanaiva', 'tenaiva', 1], ['yeanakeanacit', 'yenakenacit', 1],
  // --- non-standard ō ---
  ['kavāṭōdghāṭane', 'kavāṭodghāṭane', 1], ['yathōktahomaṃ', 'yathoktahomaṃ', 1],
  ['yathōktaṃ', 'yathoktaṃ', 1],
  // --- ou→au GLOBAL (tag-safe; field has NO English) ---
  ['ou', 'au', 18],
  // --- aiah / final-h (targeted vaiṣṇavaiśca FIRST) ---
  ['vaiṣṇavaiah ca', 'vaiṣṇavaiśca', 1],           // Deva वैष्णवैश्च
  ['aiah', 'aiḥ', 5],   // sarvopacāraiah keśādyaiah etaiah jalaiah mantraiah
  ['bhaveyuh', 'bhaveyuḥ', 1], ['mahāhavih', 'mahāhaviḥ', 1],
  ['prātahkāle', 'prātaḥkāle', 1],
  // --- dropped-v gerunds ---
  ['snānaṃ kṛtā', 'snānaṃ kṛtvā', 1], ['kṛtā tad', 'kṛtvā tad', 1], ['smṛtā', 'smṛtvā', 1],
  // --- misc slips (Deva primary, mUlam-confirmed) ---
  ['śuddhoadakaiḥ', 'śuddhodakaiḥ', 3],
  ['ālaya-gat-pariṣad', 'ālaya-gata-pariṣad', 2],  // Deva गत
  ['devam śatāṣṭa', 'devaṃ śatāṣṭa', 1],
  ['spṛṣṭa haviḥ', 'spṛṣṭaṃ haviḥ', 1],
  ['praṇamya yacet', 'praṇamya yācet', 1],          // Deva याचेत्
  ['mahāhavṣi', 'mahāhaviṣi', 1],
  ['hīneṣvapya', 'hīneṣvapi', 1],
  ['alayaṃ prada', 'ālayaṃ prada', 2],              // Deva आलयं
  ['balibhramoṇe', 'balibhramaṇe', 1],
  ['dattva', 'dattvā', 1],
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

// colophon: remove fences from BOTH fields, fill english
for (const f of ['sanskrit', 'iast']) {
  if ((b3[f].match(/```/g) || []).length !== 1) throw new Error('colophon fence not found in ' + f);
  b3[f] = b3[f].replace(/<br>\s*```/, '');
  if (b3[f].includes('`')) throw new Error('fence removal failed in ' + f);
  applied += 1;
}
if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
b3.english = '<ul>\n<li><p><em>Thus ends the sixty-sixth chapter, named &quot;The Rules of Expiation for Daily Worship and the Bali Offering&quot; (Nityārcanā-prāyaścitta-bali-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 66 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou/ea/ō/ē/ẽ/āi': (latin.match(/ou|ea|ō|ē|ẽ|āi/g) || []).length,
  'residual aiah/kalaiś/dray(?!v)/proṣ/daivatyāṃ': (s.match(/aiah|kalaiś|dray(?!v)|proṣ|daivatyāṃ/g) || []).length,
  'residual final-h': (latin.match(/[aāeiīouū]h(?=[\s,;.)&])/g) || []).length,
  'residual deva कलैशः/Latin-in-Deva': (s.match(/कलैशः|[A-Za-z]+ \(र/g) || []).length,
  'residual backtick (b2)': (s.match(/`/g) || []).length,
  'PB': (s.match(/<!--PB-->/g) || []).length + '/' + PB_BEFORE,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
for (const k of Object.keys(chk)) {
  if (k.startsWith('residual') && chk[k]) throw new Error('residual defect: ' + k);
}
for (const k of ['PB', 'em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' mismatch'); }

b2.sanskrit = s;
fs.writeFileSync(SC + '/ch66-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
