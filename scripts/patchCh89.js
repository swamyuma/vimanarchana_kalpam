// ch89 (Bhūrādi-tattva-prakāśaḥ — the Sāṃkhya/Āgamic anatomy of the 25 tattvas: the 5 mahābhūtas
// composing the body, the 5 jñānendriyas + 5 karmendriyas + their viṣayas, the 4-fold antaḥkaraṇa &
// its seats, element-wise allocation of tissues/urges, the guṇa-triad & its realms, the 4 avasthās
// [jāgrat/svapna/suṣupti/turīya], culminating in the pañcaviṃśaty-ātmaka puruṣa) vs mUlam
// 089_bhUrAditattvaprakAshaH.md. chapters[88], 19 blocks: prose intro b1/b2, section bands
//   b3/b5/b9/b14/b16, verse b4 (pattern-b: inline-em IAST in sanskrit, iast EMPTY) + verse
//   b6/b7/b8/b10/b11/b12/b13 (pattern-a: separate sanskrit/iast), editorial Glossary b15 / Typo-table
//   b17 / Bibliography b18 LEFT untouched. English per-block ALIGNED & UNTOUCHED.
//
// DEFECT 1 (systematic, ch86-88 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs used
//   INCONSISTENTLY — normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none.
// DEFECT 2: 'x' used for क्ष (banned residual): b4 caxuḥ (चक्षुः), b7 xut (क्षुत्), b10 laxanāni (लक्षणानि ×3).
//
// TARGETED Deva↔IAST slips (mUlam-confirmed, Deva & IAST brought into agreement):
//   b4 tejasaccaxuḥ→tejasaścakṣuḥ (Deva तेजसश्चक्षुः: श्च not cc, क्ष not x);
//   b7 xut→kṣut (क्षुत्);
//   b10 laxanāni→lakṣaṇāni ×3 (लक्षणानि: क्ष + retroflex ण); ityadayo→ityādayo (Deva इत्यादयो, long ā);
//   b12 catuṣṭaya-mātra-yutaṃ→...yuktaṃ (svapna: Deva युक्तं + mUlam युक्तं; jāgrat युतं & suṣupti युता stay);
//       jīva-yaktam→jīva-yuktam (typo; Deva युक्तम्);
//   b13 daśendriyāni→daśendriyāṇi (Deva दशेन्द्रियाणि, retroflex ṇ — cf jñānendriyāṇi/karmendriyāṇi).
//
// STRUCTURAL: ch89 had NO colophon block (mUlam has one; Bibliography attests "…and Colophon"; ch82-88
//   neighbours display one). INSERTED a colophon verse after b13 (before the Glossary), ch86/87 format.
//   Block count 19→20.
//
// LEFT as editorial (Deva=IAST cohere; mUlam differs): catūrṣu (चतूर्षु long-ū, mUlam चतुर्षु); the ऽऽ
//   double-avagraha rendered as single ' in IAST (vacanā'dāna etc. — consistent editor convention);
//   tejas-for-agni fire-element wording; apparatus blocks (Glossary/Typo-table/Bibliography).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[88];
if (ch.number !== 89) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;
if (B.length !== 19) throw new Error('expected 19 blocks, got ' + B.length);

// (1) GLOBAL ō→o, ē→e across ALL verse blocks' sanskrit+iast (never english)
let go = 0, ge = 0;
B.forEach((b) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) {
    const v = b[f]; if (!v) continue;
    const no = (v.match(/ō/g) || []).length, ne = (v.match(/ē/g) || []).length;
    if (no) b[f] = b[f].split('ō').join('o');
    if (ne) b[f] = b[f].split('ē').join('e');
    go += no; ge += ne;
  }
});
console.log('global ō→o:', go, '| global ē→e:', ge);

// (2) targeted (post-global)
function rep(bi, f, from, to, exp) {
  const b = B[bi];
  if (!b || b.type !== 'verse') throw new Error('block ' + bi + ' not a verse');
  const n = (b[f] || '').split(from).length - 1;
  if (n !== exp) throw new Error(`COUNT b${bi}.${f} "${from}": expected ${exp}, found ${n}`);
  b[f] = b[f].split(from).join(to);
}
rep(4, 'sanskrit', 'tejasaccaxuḥ', 'tejasaścakṣuḥ', 1);   // श्च + क्ष (Deva तेजसश्चक्षुः)
rep(7, 'iast', 'xut', 'kṣut', 1);                         // क्षुत्
rep(10, 'iast', 'laxanāni', 'lakṣaṇāni', 3);              // लक्षणानि (क्ष + retroflex ण) ×3
rep(10, 'iast', 'ityadayo', 'ityādayo', 1);              // Deva इत्यादयो (long ā)
rep(12, 'iast', 'catuṣṭaya-mātra-yutaṃ', 'catuṣṭaya-mātra-yuktaṃ', 1); // svapna युक्तं
rep(12, 'iast', 'jīva-yaktam', 'jīva-yuktam', 1);        // typo (Deva युक्तम्)
rep(13, 'iast', 'daśendriyāni', 'daśendriyāṇi', 1);      // Deva दशेन्द्रियाणि (retroflex ṇ)

// residual check: no ō/ē/x/ou in any verse sanskrit/iast (english untouched)
B.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast']) {
    const v = b[f]; if (!v) continue;
    for (const bad of ['ō', 'ē', 'x']) if (v.includes(bad)) throw new Error(`residual ${bad} in b${bi}.${f}`);
    if (/ou/.test(v)) throw new Error(`residual ou in b${bi}.${f}`);
  }
});
console.log('no residual ō/ē/x/ou in verse sanskrit/iast.');

// (3) INSERT colophon after b13 (index 14), before the Glossary
if (B[13].num !== 8) throw new Error('b13 not the pañcaviṃśa verse');
if (B[14].type !== 'section') throw new Error('b14 not the Glossary section');
const colophon = {
  type: 'verse',
  label: 'Colophon',
  sanskrit: '<blockquote>\n<p><strong>इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे भूरादितत्त्वप्रकाशो नाम एकोननवतितमः पटलः ॥८९॥ (मातृकान्तरे ८३)</strong></p>\n</blockquote>\n',
  iast: '<blockquote>\n<p><strong>iti śrīvaikhānase marīciprokte vimānārcanākalpe bhūrāditattvaprakāśo nāma ekonanavatitamaḥ paṭalaḥ ||89|| (mātṛkāntare 83)</strong></p>\n</blockquote>\n',
  english: '<ul>\n<li><strong>Colophon:</strong> Thus ends the Eighty-Ninth Chapter, named <em>Bhūrādi-tattva-prakāśaḥ</em> (The Exposition of the Elements Beginning with Earth), in the <em>Vimānārcanākalpa</em> declared by Sage Marīci in the Śrī Vaikhānasa tradition.</li>\n</ul>\n',
  text: '> **इति श्रीवैखानसे मरीचिप्रोक्ते विमानार्चनाकल्पे भूरादितत्त्वप्रकाशो नाम एकोननवतितमः पटलः ॥८९॥ (मातृकान्तरे ८३)**\n> **iti śrīvaikhānase marīciprokte vimānārcanākalpe bhūrāditattvaprakāśo nāma ekonanavatitamaḥ paṭalaḥ ||89|| (mātṛkāntare 83)**\n*   **Colophon:** Thus ends the Eighty-Ninth Chapter, named *Bhūrādi-tattva-prakāśaḥ* (The Exposition of the Elements Beginning with Earth), in the *Vimānārcanākalpa* declared by Sage Marīci in the Śrī Vaikhānasa tradition.',
  colophon: true,
  num: null,
};
B.splice(14, 0, colophon);
console.log('inserted colophon; block count now', B.length);

// markup balance
B.forEach((b, bi) => {
  if (b.type !== 'verse') return;
  for (const f of ['sanskrit', 'iast', 'english']) {
    const v = b[f] || '';
    for (const t of ['p', 'em', 'strong', 'blockquote', 'ul', 'li', 'ol']) {
      const o = (v.match(new RegExp('<' + t + '\\b', 'g')) || []).length;
      const c = (v.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) throw new Error(`<${t}> unbalanced b${bi}.${f}`);
    }
  }
});
console.log('markup balanced.');

if (WRITE) { fs.writeFileSync(READER, writeBack(html, start, end, chapters)); console.log('WROTE reader.'); }
else console.log('DRY RUN (use --write).');
