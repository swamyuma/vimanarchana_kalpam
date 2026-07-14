// ch62 (Dhruvabera-sthāna-hīnādi-prāyaścitta-vidhiḥ — expiations for delayed dhruvabera
// installation [1-12 months, 12 years], limb-damage before/after jalādhivāsa, image made
// without śilā-grahaṇa, saṃskāra lapses after installation) reconciliation. SHORT content-fix
// chapter (13 <p>, NO PB — not oversized). b3 Colophon: filled empty english AND fixed a
// MIS-PLACED HYPHEN in BOTH scripts (ध्रुवबेरस्थाप-नहीनादि→ध्रुवबेरस्थापन-हीनादि /
// sthāpa-nahīnādi→sthāpana-hīnādi — sthāpana-hīna "omission of installation"; mUlam
// ध्रुवबेरस्थापनहीनादि). mUlam 062_prAyashchittavidhiH.md. english UNTOUCHED.
// b2 IAST fixes (Deva primary, mUlam-confirmed): daivatyāṃ→daivatyaṃ ×3 [recurs from ch61],
// ou→au ×4 (aṅgahānou ×2, bhūmou, abjāgnou), x→kṣ ×3 (daxiṇāṃ ×2, salaxaṇaṃ), dadbhyah→ḥ,
// samupūjya→sampūjya [Deva सम्पूज्य garble], dattva→dattvā ×3 [dropped final ā; Deva दत्त्वा],
// vimānanya→vimānasya [garble; Deva विमानस्य].
// DIVERGENCES LEFT (Deva=IAST consistent; mUlam differs): इतरथा अपरं (नवीनं) बेरं [mUlam
// सन्धानायोग्यं चेदपरं — reader expanded, paren gloss], अयुक्तं चेत् विधिवत् [mUlam no चेत्],
// संवत्सरान्तं पुनः स्थापयेत् [mUlam संवत्सरान्ते], वैष्णव-शान्तिं [apparatus वैष्ण-वशांतं],
// b2-header स्थानहीनादि vs colophon स्थापनहीनादि [both attested; left as-is].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[61];
if (ch.number !== 62) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
let s = b2.sanskrit;

const FIXES = [
  ['daivatyāṃ', 'daivatyaṃ', 3],
  ['ou', 'au', 4],              // aṅgahānou ×2, bhūmou, abjāgnou (no English in field; tag-safe)
  ['daxiṇāṃ', 'dakṣiṇāṃ', 2], ['salaxaṇaṃ', 'salakṣaṇaṃ', 1],
  ['dadbhyah', 'dadbhyaḥ', 1],
  ['samupūjya', 'sampūjya', 1], // Deva सम्पूज्य
  ['dattva', 'dattvā', 3],      // Deva दत्त्वा (count-guard proves no pre-existing dattvā)
  ['vimānanya', 'vimānasya', 1],
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

// Colophon hyphen fix (both scripts)
if ((b3.sanskrit.match(/स्थाप-नहीनादि/g) || []).length !== 1) throw new Error('b3 deva hyphen not found');
if ((b3.iast.match(/sthāpa-nahīnādi/g) || []).length !== 1) throw new Error('b3 iast hyphen not found');
const newB3sk = b3.sanskrit.replace('स्थाप-नहीनादि', 'स्थापन-हीनादि');
const newB3ia = b3.iast.replace('sthāpa-nahīnādi', 'sthāpana-hīnādi');
applied += 2;

if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the sixty-second chapter, named &quot;The Rules of Expiation for Omission of the Stationary Deity&#39;s Installation and the Rest&quot; (Dhruvabera-sthāpana-hīnādi-prāyaścitta-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 62 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou/ea/ō/ē/āi': (latin.match(/ou|ea|ō|ē|āi/g) || []).length,
  'residual daivatyāṃ/dattva,': (s.match(/daivatyāṃ|dattva,/g) || []).length,
  'residual final-h': (latin.match(/[aāeiīouū]h(?=[\s,;.)&])/g) || []).length,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
for (const k of Object.keys(chk)) {
  if (k.startsWith('residual') && chk[k]) throw new Error('residual defect: ' + k);
}
for (const k of ['em bal', 'strong bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' mismatch'); }

b2.sanskrit = s;
b3.sanskrit = newB3sk;
b3.iast = newB3ia;
b3.english = NEW_B3_ENG;
fs.writeFileSync(SC + '/ch62-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
