// ch38 (Dvi-tri-mūrti-sthāpana-vidhiḥ) reconciliation. Single content block b2 (pattern-b).
// Regular <p> lines: targeted IAST slips + 4 dropped Deva parenthetical glosses restored.
// Three <ul> lists (dvimūrti / trimūrti / Brahmā-iconography) had the `**...*` lump-markup
// defect (IAST lumped + misplaced inside the last <li>, plus the heading <p>'s IAST stranded)
// -> regenerated as proper interleaved pattern-b via translit.js. English (complete) untouched.
// No colophon block. All fixes confirmed by the checker + mUlam 038.
const fs = require('fs');
const { load, writeBack } = require('./load.js');
const { translit } = require('./translit.js');
const WRITE = process.argv.includes('--write');

const { html, chapters, start, end } = load();
const ch = chapters[37];
if (ch.number !== 38) throw new Error('wrong chapter ' + ch.number);
const b = ch.blocks[2];
if (b.type !== 'verse') throw new Error('b2 not verse');

const devSeq = s => (s.match(/[ऀ-ॿ]/g) || []).join('');
const devBaseline = devSeq(b.sanskrit);   // no Deva changes in ch38
let s = b.sanskrit;

// ---- Step 1: targeted IAST fixes over the whole field (region-lumped IAST is regenerated after) ----
const FIXES = [
  ['manṭapa', 'maṇṭapa', 4],                    // Deva मण्टप retroflex (2 in <p>, 2 in regions)
  ['ādou', 'ādau', 1],                          // ou->au
  ['adhivāsou', 'adhivāsau', 1],
  ['sannidhou', 'sannidhau', 1],
  ['praṇidhou', 'praṇidhau', 2],
  ['devyou', 'devyau', 3],                       // 2 in <p>, 1 in region
  ['yāgāśālā', 'yāgaśālā', 3],                    // yāga-śālā (spurious ā)
  ['havis ', 'haviḥ ', 3],                       // Deva हविः (visarga, not -s)
  ['parivārālayaṃ', 'pariṣadālayaṃ', 1],         // Deva परिषदालयं (mUlam परिषदम्)
  ['sabtabhiḥ', 'saptabhiḥ', 1],                 // Deva सप्तभिः
  ['pāvaka naḥ', 'pāvakā naḥ', 1],               // Deva पावका (long ā)
  // dropped Deva parenthetical glosses restored to IAST (Deva richer than IAST):
  ['śvetābja-śataṃ ghṛtena', 'śvetābja-śataṃ (100 śveta-kamalāni) ghṛtena', 1],
  ['aṣṭottaraśataṃ hutvā', 'aṣṭottaraśataṃ (108) hutvā', 1],
  ['hareḥ iva', 'hareḥ (viṣṇoḥ) iva', 1],
  ['sarasvatī&#39; &#39;maho', 'sarasvatī&#39; (ṛ0 1-9-6) &#39;maho', 1],
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b2 "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to);
  applied += n;
}

// ---- Step 2: regenerate the 3 <ul> regions (heading <p> + <ul>) as interleaved pattern-b ----
function rebuildRegion(str, labelDeva) {
  const anchor = '<p><strong>' + labelDeva + '</strong>';
  const sp = str.indexOf(anchor);
  if (sp < 0) throw new Error('region not found: ' + labelDeva);
  const eu = str.indexOf('</ul>', sp);
  if (eu < 0) throw new Error('</ul> not found for ' + labelDeva);
  const region = str.slice(sp, eu + 5);
  const pm = region.match(/^<p><strong>([\s\S]*?)<\/strong><br>\n([\s\S]*?)<\/p>/);
  if (!pm) throw new Error('heading <p> parse fail: ' + labelDeva);
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
  return { str: str.slice(0, sp) + nb + str.slice(eu + 5), nBullets: bullets.length };
}
let regenInfo = [];
for (const label of ['द्विमूर्ति-स्थापन-विधिः -', 'त्रिमूर्ति-स्थापन-विधिः -', 'ब्रह्मणः मूर्ति-लक्षणम् (Iconography of Brahmā) -']) {
  const r = rebuildRegion(s, label);
  s = r.str; regenInfo.push(label.slice(0,10) + ':' + r.nBullets);
}

// ---- checks ----
const chk = {
  applied,
  regen: regenInfo.join(', '),
  'deva preserved': devSeq(s) === devBaseline,
  'residual **': (s.match(/\*\*/g) || []).length,
  'residual manṭapa': (s.match(/manṭapa/g) || []).length,
  'em bal': (s.match(/<em>/g)||[]).length + '/' + (s.match(/<\/em>/g)||[]).length,
  'strong bal': (s.match(/<strong>/g)||[]).length + '/' + (s.match(/<\/strong>/g)||[]).length,
  'li bal': (s.match(/<li>/g)||[]).length + '/' + (s.match(/<\/li>/g)||[]).length,
};
console.log(JSON.stringify(chk, null, 1));
if (!chk['deva preserved']) throw new Error('Devanagari not preserved');
if (chk['residual **'] !== 0) throw new Error('** remains');
if (chk['residual manṭapa'] !== 0) throw new Error('manṭapa remains');
const eb = chk['em bal'].split('/'); if (eb[0] !== eb[1]) throw new Error('em unbalanced');

b.sanskrit = s;
fs.writeFileSync('C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/ecb2c958-5d22-4d36-aaff-65ed627cac0c/scratchpad/ch38-b2-sanskrit-NEW.txt', s);
if (WRITE) {
  fs.writeFileSync(require('./load.js').READER, writeBack(html, start, end, chapters));
  console.log('WROTE reader.');
} else {
  console.log('DRY RUN (pass --write). Wrote ch38-b2-sanskrit-NEW.txt.');
}
