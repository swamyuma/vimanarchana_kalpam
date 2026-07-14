// ch41 (Nityārcanā-vidhānam — daily worship) reconciliation. Single content block b2 (pattern-b).
// English (complete) untouched; NO colophon block (mUlam colophon out of editorial scope).
// Three <ul> lists (pañca-praṇāmāḥ 5, uttama/madhyama/adhama 3, pañcamūrti-viśeṣāḥ 5) had the
// `**...*` lump-markup defect (bullet IAST + the <p> heading IAST lumped in the last <li>) ->
// relocated via rebuildList (preserve the reader's exact romanization, only reposition).
// Char-level slips fixed FIRST (count-guarded), so the lumped lines are clean before relocation.
// Fixes cross-checked vs mUlam 041_nityArchanAvidhAnam.md + checkCh41.js (translit differ).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const SC = process.env.SC || 'C:/Users/umasu/AppData/Local/Temp/claude/C--Users-umasu-Documents-gate-files-vimanarchana-reader/d8af33e7-0305-4650-8bd1-76adeb5a85e5/scratchpad';

const { html, chapters, start, end } = load();
const ch = chapters[40];
if (ch.number !== 41) throw new Error('wrong chapter ' + ch.number);
const b = ch.blocks[2];
let s = b.sanskrit;

// (1) DEVA-side error (mirrored in IAST below).
const DEVA_FIXES = [
  ['पीठपाश्र्वे', 'पीठपार्श्वे', 1],   // metathesis पाश्र्व->पार्श्व (pārśva; cf correct भित्तिपार्श्वे)
];
// (2) IAST targeted fixes (mirrors + transliteration slips; incl. slips inside the lumped list lines).
const IAST_FIXES = [
  ['tadvaiṣṇuḥ', 'tadviṣṇuḥ', 2],                 // Deva तद्विष्णुः (vai->vi)
  ['tadvaiṣṇoḥ', 'tadviṣṇoḥ', 1],                 // Deva तद्विष्णोः
  ['vaiṣṇavasūktena', 'viṣṇusūktena', 1],         // Deva विष्णुसूक्तेन (list1 intro)
  ['mārjanayā', 'mārjanyā', 1],                   // Deva मार्जन्या
  ['vājanya&quot;', 'vājasya&quot;', 1],          // Deva वाजस्य
  ['śikhoद्वartanaṃ', 'śikhodvartanaṃ', 1],       // mojibake: Devanagari द्व embedded in IAST
  ['parimārjy,', 'parimārjya,', 1],               // dropped -a
  ['ālayadvara', 'ālayadvāra', 1],                // Deva आलय-द्वार (dvāra macron)
  ['iṣo&#39;ttā', 'iṣo&#39;ttvā', 1],              // Deva इषोऽत्त्वा (ttvā)
  ['ūrje&#39;ttā&quot;', 'ūrje&#39;ttvā&quot;', 1],// Deva ऊर्जेऽत्त्वा
  ['saṃsnāpy,', 'saṃsnāpya,', 1],                 // dropped -a gerund
  ['saṃyuktamentat', 'saṃyuktametat', 1],         // Deva संयुक्तमेतत् (spurious n)
  ['dhruvapadayoḥ', 'dhruvapādayoḥ', 1],          // Deva ध्रुवपादयोः (macron)
  ['āgneayādi', 'āgneyādi', 2],                   // Deva आग्नेयादि (eay->eyā)
  ['&quot;varāhaya,', '&quot;varāhāya,', 1],      // Deva वराहाय (macron)
  ['narasiṃhāya iśitātmane', 'nārasiṃhāya iśitātmane', 1], // Deva नारसिंहाय (macron)
  ['parito prāgādi', 'paritaḥ prāgādi', 1],       // Deva परितः visarga
  ['parito pūrvāt', 'paritaḥ pūrvāt', 1],         // Deva परितः
  ['parito;', 'paritaḥ;', 1],                     // Deva परितः
  ['praṇidhyou', 'praṇidhyau', 1],                // ou (also caught by global; targeted here is fine? keep to global)  -- REMOVE
  ['pāṣaṇdino', 'pāṣaṇḍino', 1],                  // Deva ण्ड retroflex (nd->ṇḍ)
  ['(paradena)', '(paradenā)', 1],                // Deva (परदेना) gloss macron
  ['praṇidhiṃ uddhṛty', 'praṇidhim uddhṛty', 1],  // Deva प्रणिधिम् (m not anusvāra); -y fixed next
  ['uddhṛty,', 'uddhṛtya,', 3],                   // dropped -a (praṇidhim/pātram/anuddhṛty)
  ['caturbhujuṃ', 'caturbhujaṃ', 1],              // Deva चतुर्भुजं (u->a)
  ['makuṭ-kuṇḍala', 'makuṭa-kuṇḍala', 1],         // Deva मकुट (dropped a)
  ['āvāhyet', 'āvāhayet', 2],                     // Deva आवाहयेत् (dropped a)
  ['tatrāseenam', 'tatra āsīnaṃ', 1],             // Deva तत्र आसीनं (garbled)
  ['yācet.', 'yāceta.', 1],                       // Deva याचेत
  ['nivedyet', 'nivedayet', 1],                   // Deva निवेदयेत् (dropped a)
  ['gandha-dhūp-dīpa', 'gandha-dhūpa-dīpa', 1],   // Deva धूप (dropped a)
  ['yathāikaḥ', 'yathaikaḥ', 1],                  // Deva यथैकः
  ['saṅkalpy pañca', 'saṅkalpya pañca', 1],       // dropped -a
  ['nāmābhireva', 'nāmabhireva', 1],              // Deva नामभिरेव (spurious macron)
  ['gomayeṇa', 'gomayena', 1],                    // Deva गोमयेन (dental n)
  ['nidhāy;', 'nidhāya;', 1],                     // dropped a
  ['nidhāy juhuyāt', 'nidhāya juhuyāt', 1],       // dropped a
  ['pālebhyāḥ', 'pālebhyaḥ', 2],                  // Deva पालेभ्यः (spurious macron)
  ['balyuddharāṇāni', 'balyuddharaṇāni', 1],      // Deva बल्युद्धरणानि
  ['dattva,', 'dattvā,', 2],                      // Deva दत्त्वा (macron)
  ['navasāṭpañca', 'navaṣaṭpañca', 1],            // Deva नवषट्पञ्च (list3 intro)
  ['kavāṭaṃ bandhayati.', 'kavāṭaṃ bandhayati (dvāraṃ pidadhāti).', 1], // restore dropped gloss (Deva has it)
  // slips inside the lumped list lines (checker skips these; fixed pre-relocation):
  ['sasamputaḥ', 'sasampuṭaḥ', 1],                // Deva ससम्पुटः (retroflex ṭ)
  ['janubhyāṃ', 'jānubhyāṃ', 1],                  // Deva जानुभ्यां (macron)
  ['pādyāi-havirantaiḥ', 'pādyādi-havirantaiḥ', 1], // Deva पाद्यादि (dropped di)
  ['pādyādi-dīpantaiḥ', 'pādyādi-dīpāntaiḥ', 1],  // Deva दीपान्तैः (macron)
  ['puruṣāmūrteḥ', 'puruṣamūrteḥ', 1],            // Deva पुरुषमूर्तेः (spurious macron)
  ['arghyādānaṃ', 'arghyadānaṃ', 4],              // Deva अर्घ्यदानं (spurious macron)
  ['pīṭhapāśrve', 'pīṭhapārśve', 1],              // mirror पाश्र्व->पार्श्व
];
// remove the accidental duplicate praṇidhyou entry (handled by global ou->au)
const IAST_FIXES2 = IAST_FIXES.filter(f => f[0] !== 'praṇidhyou');

let applied = 0;
function apply(list) {
  for (const [from, to, exp] of list) {
    const n = s.split(from).length - 1;
    if (n !== exp) throw new Error(`COUNT "${from}": expected ${exp}, found ${n}`);
    s = s.split(from).join(to); applied += n;
  }
}
apply(DEVA_FIXES);
apply(IAST_FIXES2);

// (3) multi-char + mojibake globals (count-guarded)
for (const [from, to, exp] of [
  ['madyāh', 'madhyāh', 4],                       // Deva मध्याह्न (dropped h)
  ['snapan-utsav-bali-ber', 'snapana-utsava-bali-ber', 2], // dropped a's
  ['haviṣpātr', 'haviḥpātr', 3],                  // Deva हविःपात्र visarga
]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`GLOBAL "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}
// ou->au (Deva औ) and x->kṣ (Deva क्ष) — verified all tokens are Sanskrit (no English 'ou'/'x')
for (const [from, to, exp] of [['ou', 'au', 21], ['x', 'kṣ', 11]]) {
  const n = s.split(from).length - 1;
  if (n !== exp) throw new Error(`GLOBAL "${from}": expected ${exp}, found ${n}`);
  s = s.split(from).join(to); applied += n;
}

// (4) relocate the three lump-defect lists into proper interleaved pattern-b.
function emify(line) {
  let t = line.replace(/<\/li>\s*$/, '').trim();
  t = t.replace(/^\*\*\s*/, '').replace(/\*\s*$/, '');
  t = t.replace(/<em>/g, '<strong>').replace(/<\/em>/g, '</strong>'); // avoid nested <em>
  return '<em>' + t + '</em>';
}
const emToStrong = x => x.replace(/<em>/g, '<strong>').replace(/<\/em>/g, '</strong>');
function rebuildList(str, pAnchor) {
  const pStart = str.indexOf(pAnchor);
  if (pStart < 0) throw new Error('anchor not found: ' + pAnchor);
  const pEnd = str.indexOf('</p>', pStart) + 4;
  const ulStart = str.indexOf('<ul>', pEnd);
  const ulEnd = str.indexOf('</ul>', ulStart) + 5;
  const pInner = str.slice(pStart + 3, pEnd - 4);
  const ulInner = str.slice(ulStart + 4, ulEnd - 5);
  const items = ulInner.split('<li>').slice(1);
  const devaBullets = [], lumped = [];
  items.forEach((it, i) => {
    if (i < items.length - 1) {
      devaBullets.push(emToStrong(it.split('</li>')[0].trim()));
    } else {
      const parts = it.split('\n');
      devaBullets.push(emToStrong(parts[0].replace(/<\/li>[\s\S]*$/, '').trim()));
      for (const l of parts.slice(1)) { const t = l.trim(); if (t) lumped.push(t); }
    }
  });
  const iastLabel = lumped.find(l => /^<em><strong>/.test(l));
  const iastIntro = lumped.find(l => /^<em>/.test(l) && !/^<em><strong>/.test(l));
  const bulletIast = lumped.filter(l => l.startsWith('**'));
  if (bulletIast.length !== devaBullets.length)
    throw new Error(`bullet mismatch @${pAnchor}: ${devaBullets.length} deva vs ${bulletIast.length} iast`);
  // rebuild <p>
  const hasLabel = pInner.startsWith('<strong>');
  let pNew;
  if (hasLabel) {
    const bi = pInner.indexOf('<br>');
    const devaLabel = pInner.slice(0, bi), devaIntro = pInner.slice(bi + 4).trim();
    pNew = `<p>${devaLabel}<br>\n${devaIntro}<br>\n${iastLabel}<br>\n${iastIntro}</p>`;
  } else {
    pNew = `<p>${pInner.trim()}<br>\n${iastIntro}</p>`;
  }
  // rebuild <ul>
  const lis = devaBullets.map((d, i) => `<li>${d}<br>\n${emify(bulletIast[i])}</li>`);
  const ulNew = `<ul>\n${lis.join('\n')}\n</ul>`;
  return str.slice(0, pStart) + pNew + '\n' + ulNew + str.slice(ulEnd);
}
s = rebuildList(s, '<p><strong>पञ्च-प्रणामाः -</strong>');
s = rebuildList(s, '<p>मध्याह्ने सायाह्ने च पूर्ववद् उद्घाटयति');
s = rebuildList(s, '<p><strong>पञ्चमूर्ति-अर्चन-विशेषाः -</strong>');

// sanity
const truncGer = (s.replace(/<[^>]+>/g, ' ').match(/[A-Za-zāīūṛṝḷṅñṇṭḍśṣṃḥ]+y(?=[,;\s])/g) || [])
  .filter(t => !/ya$/.test(t) && !/ay$/.test(t));
const chk = {
  applied,
  'residual **': (s.match(/\*\*/g) || []).length,
  'residual ou': s.split('ou').length - 1,
  'residual x': s.split('x').length - 1,
  'residual truncated -y': truncGer,
  'residual देवनागरी-in-latin': (s.match(/[A-Za-z][ऀ-ॿ]/g) || []).length,
  'em bal': (s.match(/<em>/g) || []).length + '/' + (s.match(/<\/em>/g) || []).length,
  'strong bal': (s.match(/<strong>/g) || []).length + '/' + (s.match(/<\/strong>/g) || []).length,
  'li bal': (s.match(/<li>/g) || []).length + '/' + (s.match(/<\/li>/g) || []).length,
  'p bal': (s.match(/<p>/g) || []).length + '/' + (s.match(/<\/p>/g) || []).length,
};
console.log(JSON.stringify(chk, null, 1));
if (chk['residual **'] || chk['residual ou'] || chk['residual x'] || truncGer.length || chk['residual देवनागरी-in-latin'])
  throw new Error('residual defect');
for (const k of ['em bal', 'strong bal', 'li bal', 'p bal']) { const [a, c] = chk[k].split('/'); if (a !== c) throw new Error(k + ' unbalanced'); }

b.sanskrit = s;
fs.writeFileSync(SC + '/ch41-b2-sanskrit-NEW.txt', s);
if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
