// ch39 (Vimāna-pratiṣṭhā-vidhiḥ) reconciliation. Single content block b2 (pattern-b).
// One <ul> deity-placement list (9 bullets) had the `**...*` lump defect (bullets + heading IAST
// lumped/misplaced) -> regenerated via rebuildRegion (same as ch38). Rest: targeted <p>-line IAST
// slips. English (complete) untouched; no colophon block. Fixes from checkCh39b + mUlam 039.
const fs = require('fs');
const { load, writeBack } = require('./load.js');
const { translit } = require('./translit.js');
const WRITE = process.argv.includes('--write');

const { html, chapters, start, end } = load();
const ch = chapters[38];
if (ch.number !== 39) throw new Error('wrong chapter ' + ch.number);
const b = ch.blocks[2];
const devSeq = s => (s.match(/[ऀ-ॿ]/g) || []).join('');
const devBaseline = devSeq(b.sanskrit);
let s = b.sanskrit;

const FIXES = [
  ['manṭapa', 'maṇṭapa', 3],                         // Deva मण्टप retroflex (1 in <p>, 2 lumped/regen)
  ['parito prāgādi', 'paritaḥ prāgādi', 1],          // Deva परितः (L41; L33 "parito vā" = correct sandhi, left)
  ['parito kalpayet', 'paritaḥ kalpayet', 1],        // Deva परितः (L45)
  ['parito caturviṃśati', 'paritaḥ caturviṃśati', 1],// Deva परितः (L51)
  ['tat-parito śayyāvediṃ', 'tat-paritaḥ śayyāvediṃ', 1], // Deva तत्-परितः (L55)
  ['praṇidhou', 'praṇidhau', 2],                     // ou->au
  ['āpūry', 'āpūrya', 2],                            // Deva आपूर्य (āpūry,/adbhirāpūry,)
  ['abhimantry', 'abhimantrya', 2],                  // Deva अभिमन्त्र्य (ityabhimantry/iti abhimantry)
  ['dhānyarāśou', 'dhānyarāśau', 1],                 // ou->au
  ['puruṣusūktaṃ', 'puruṣasūktaṃ', 1],               // Deva पुरुषसूक्तं
  ['vṛṣa-āsyāyai', 'vṛṣa-āsyāya', 1],                // Deva वृष-आस्याय (dat.)
  ['padmamālāyaai', 'padmamālāyai', 1],              // typo yaai
  ['(ṛṣi', '(ṛ0', 1],                                // citation: Deva (ऋ० — Ṛgveda, not ṛṣi
  ['sarvouṣadhy', 'sarvauṣadhy', 1],                 // ou->au
  ['yathākratena', 'yathākrameṇa', 1],               // Deva यथाक्रमेण
  ['ghanṭāntam', 'ghaṇṭāntam', 1],                   // Deva घण्टान्तम् retroflex
  ['pūrvā tṛtīye', 'pūrvaṃ tṛtīye', 1],              // Deva पूर्वं
  ['sarvālaṅkārasamyaktam', 'sarvālaṅkārasaṃyuktam', 1], // Deva संयुक्तम्
  ['āvāhayeet', 'āvāhayet', 1],                      // double-e typo
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

// rebuildRegion (heading <p> + <ul>) -> interleaved pattern-b, via translit
function rebuildRegion(str, labelDeva) {
  const anchor = '<p><strong>' + labelDeva + '</strong>';
  const sp = str.indexOf(anchor);
  if (sp < 0) throw new Error('region not found: ' + labelDeva);
  const eu = str.indexOf('</ul>', sp);
  const region = str.slice(sp, eu + 5);
  const pm = region.match(/^<p><strong>([\s\S]*?)<\/strong><br>\n([\s\S]*?)<\/p>/);
  const devaLabel = pm[1], intro = pm[2].trim();
  const ulInner = region.match(/<ul>([\s\S]*)<\/ul>/)[1];
  const bullets = ulInner.split('<li>').slice(1).map(c => {
    let cut = c.length;
    for (const mk of ['<em>', '**', '</li>']) { const p = c.indexOf(mk); if (p >= 0) cut = Math.min(cut, p); }
    return c.slice(0, cut).replace(/\s+/g, ' ').trim();
  }).filter(x => x);
  let nb = `<p><strong>${devaLabel}</strong><br>\n${intro}<br>\n<em><strong>${translit(devaLabel)}</strong></em><br>\n<em>${translit(intro)}</em></p>\n<ul>\n`;
  for (const bd of bullets) nb += `<li>${bd}<br>\n<em>${translit(bd)}</em></li>\n`;
  nb += '</ul>';
  return { str: str.slice(0, sp) + nb + str.slice(eu + 5), n: bullets.length };
}
const r = rebuildRegion(s, 'विमान-प्रतिष्ठा-विधिः -');
s = r.str;

const chk = {
  applied, bullets: r.n,
  'deva preserved': devSeq(s) === devBaseline,
  'residual **': (s.match(/\*\*/g) || []).length,
  'residual manṭapa': (s.match(/manṭapa/g) || []).length,
  'residual parito (expect 1, the correct sandhi)': (s.match(/parito /g) || []).length,
  'em bal': (s.match(/<em>/g)||[]).length + '/' + (s.match(/<\/em>/g)||[]).length,
  'strong bal': (s.match(/<strong>/g)||[]).length + '/' + (s.match(/<\/strong>/g)||[]).length,
  'li bal': (s.match(/<li>/g)||[]).length + '/' + (s.match(/<\/li>/g)||[]).length,
};
console.log(JSON.stringify(chk, null, 1));
if (!chk['deva preserved']) throw new Error('Deva not preserved');
if (chk['residual **'] || chk['residual manṭapa']) throw new Error('residual defect');
if (chk['residual parito (expect 1, the correct sandhi)'] !== 1) throw new Error('parito count unexpected');
const eb = chk['em bal'].split('/'); if (eb[0] !== eb[1]) throw new Error('em unbalanced');

b.sanskrit = s;
fs.writeFileSync('C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/ecb2c958-5d22-4d36-aaff-65ed627cac0c/scratchpad/ch39-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(require('./load.js').READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN.');
