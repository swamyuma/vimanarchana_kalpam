// ch61 (Bhū-parīkṣādi-prāyaścitta-vidhiḥ — expiations for defects/omissions from site-exam
// through plowing, first-brick, garbha-nyāsa, crown-brick, finished vimāna, plus anukta-
// prāyaścitta and the kautuka-without-dhruvabera abhicārika danger) reconciliation.
// Content-fix chapter (29 <p>, 9 PB = 10 spreads, NO lump-markup). b3 Colophon intact —
// filled empty english. mUlam 061_bhUparIxAdiprAyashchittavidhiH.md. english UNTOUCHED.
// DEVA FIX: आाराध्य→आराध्य [double-glyph आ+ा, same class as ुु/ेे — scan /आा/ too].
// DOMINANT IAST defect: daivatyāṃ-for-daivatyaṃ ×17 [Deva दैवत्यं neuter throughout; the
// reader's दैवत्य (vs mUlam देवत्य) is editorial & consistent, only the IAST -āṃ is wrong].
// KEY IAST fixes: samāceret→samācaret ×2, gogora/gogorēbhyo→gogaṇa/gogaṇebhyo [Deva गोगण],
// vaiṣvakseaṇ/viṣvakseaṇ→ṣvaksen ×4 [ea + ṇ-for-n], śakunaparicceda/dik-pariccedaṃ→ccheda
// [dropped h], adhomuṣe→adhomukhe, niṣfalaṃ→niṣphalaṃ [f], prathemēṣṭakādi→prathameṣṭakādi,
// palālābhārān→palālabhārān, vā saṃsthāpayet→vā sthāpayet [spurious saṃ; Deva+mUlam स्थापयेत्,
// cf ch10], xamasva→kṣamasva.
// DIVERGENCES LEFT (Deva=IAST consistent; mUlam differs; English silent/endorses):
// पञ्चाग्नौ [mUlam पद्माग्नौ; English "five fires" ENDORSES], देवानाम् आदिमं त्रीन् [mUlam
// आदिमन्त्रान्], ब्रह्मपद्यावट [mUlam ब्रह्मपद्मा], दैवत्य-for-देवत्य [editorial, chapter-wide],
// पददेवताबली हीने [mUlam बलौ], ध्यायान् [ध्यायन्], दशांशो [दशशो], वासव्यं [वासवं],
// व्याहृतीपर्यन्तं [व्याहृति], स्थूपिकीले नभस्तारे [mUlam तदाधारे], कलशक्रिया [apparatus कलभ],
// वैष्णवं आग्नेयं [mUlam वैघ्नम्], snapanālayā-āsthāna sandhi-resolution [mUlam ऽऽ; both
// readable, left], omitted mUlam दुर्दर्शं सौरं clause [editorial scope].
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/32b6359a-f445-400f-94c5-481f3091b6d1/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[60];
if (ch.number !== 61) throw new Error('wrong chapter ' + ch.number);
const b2 = ch.blocks[2], b3 = ch.blocks[3];
if (b2.type !== 'verse' || b3.label !== 'Colophon') throw new Error('unexpected block shape');
const PB_BEFORE = (b2.sanskrit.match(/<!--PB-->/g) || []).length;
let s = b2.sanskrit;

const FIXES = [
  // --- DEVA fix: double-glyph आ+ा ---
  ['आाराध्य', 'आराध्य', 1],
  // --- daivatyāṃ→daivatyaṃ GLOBAL (Deva दैवत्यं neuter everywhere) ---
  ['daivatyāṃ', 'daivatyaṃ', 17],
  // --- 'ea' garble family (+ṇ-for-n in the ṣvaksena tokens) ---
  ['vaiṣvakseaṇ', 'vaiṣvaksen', 2], ['viṣvakseaṇ', 'viṣvaksen', 2],
  ['deaśe', 'deśe', 2], ['keaśa', 'keśa', 1], ['anuleapaneṣu', 'anulepaneṣu', 1],
  // --- non-standard ē/ō glyphs ---
  ['rajjucchēde', 'rajjucchede', 1], ['gogorēbhyo', 'gogaṇebhyo', 1], // + gogora garble
  ['prathemēṣṭakādi', 'prathameṣṭakādi', 1],                          // + e-for-a garble
  ['vyapōhya', 'vyapohya', 1], ['snānōdaka', 'snānodaka', 1],
  // --- ou→au GLOBAL (14 verified: soumya ×6, soudarśana ×2, souraṃ, loukikāgnou [2],
  //     bhūparīkṣādou, khananādou, pañcāgnou; field has NO English; tag-safe) ---
  ['ou', 'au', 14],
  // --- x→kṣ ---
  ['pāṃsuxaye', 'pāṃsukṣaye', 1], ['uktavṛxālābhe', 'uktavṛkṣālābhe', 2],
  ['axaśaṅkhe', 'akṣaśaṅkhe', 1], ['abhyuxya', 'abhyukṣya', 1],
  ['vaxye', 'vakṣye', 1], ['xamasva', 'kṣamasva', 1], ['daxiṇe', 'dakṣiṇe', 1],
  // --- ṣ-for-kh ---
  ['adhomuṣe', 'adhomukhe', 1],
  // --- word-final h→ḥ (vaṃśahānih BEFORE hānih) ---
  ['vyākhyāsyāmah', 'vyākhyāsyāmaḥ', 1], ['prāyah iti', 'prāyaḥ iti', 1],
  ['pratiṣedhah', 'pratiṣedhaḥ', 1], ['anapāyinoh', 'anapāyinoḥ', 1],
  ['vaṃśahānih', 'vaṃśahāniḥ', 1], ['hānih', 'hāniḥ', 1],
  ['puratah', 'purataḥ', 1], ['dadbhyah', 'dadbhyaḥ', 1],
  // --- āi→ai ---
  ['tathāiva', 'tathaiva', 1],
  // --- misc slips (Deva primary, mUlam-confirmed) ---
  ['samāceret', 'samācaret', 2],          // Deva समाचरेत्
  ['gogora-nivedane', 'gogaṇa-nivedane', 1], // Deva गोगण
  ['palālābhārān', 'palālabhārān', 1],    // Deva पलालभारान्
  ['śakunapariccedahīne', 'śakunaparicchedahīne', 1], // Deva परिच्छेद
  ['dik-pariccedaṃ', 'dik-paricchedaṃ', 1],
  ['niṣfalaṃ', 'niṣphalaṃ', 1],           // Deva निष्फलं
  ['vā saṃsthāpayet', 'vā sthāpayet', 1], // Deva वा स्थापयेत् (spurious saṃ; cf ch10)
];
let applied = 0;
for (const [from, to, exp] of FIXES) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

if (b3.english !== '') throw new Error('b3.english unexpectedly non-empty');
const NEW_B3_ENG = '<ul>\n<li><p><em>Thus ends the sixty-first chapter, named &quot;The Rules of Expiation from the Examination of the Site Onward&quot; (Bhū-parīkṣādi-prāyaścitta-vidhiḥ), in the Vimānārcanā-kalpa composed by Marīci in the Śrī Vaikhānasa tradition. || 61 ||</em></p>\n</li>\n</ul>\n';

const latin = s.replace(/<[^>]+>/g, ' ');
const chk = {
  applied,
  'residual x': (s.match(/x/g) || []).length,
  'residual ou/ea/ō/ē/āi': (latin.match(/ou|ea|ō|ē|āi/g) || []).length,
  'residual daivatyāṃ/gogor/muṣ': (s.match(/daivatyāṃ|gogor|muṣ/g) || []).length,
  'residual final-h': (latin.match(/[aāeiīouū]h(?=[\s,;.)&])/g) || []).length,
  'residual deva आा/ुु/ेे': (s.match(/आा|ुु|ेे/g) || []).length,
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
b3.english = NEW_B3_ENG;
fs.writeFileSync(SC + '/ch61-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
