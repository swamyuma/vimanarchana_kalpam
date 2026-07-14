// ch93 (Jīvodbhavaḥ — vital winds, the soul & its transmigration: the 10 vāyus [colours/seats/functions],
// the jīvātman & twofold karma & the descent-into-birth cycle, the pañcabhautika-pralaya [death], and
// the three post-mortem paths — naraka for the wicked, pitṛyāṇa/dhūmādi & devayāna/arcirādi) vs mUlam
// 093_jIvodbhavaH.md. chapters[92], 20 blocks: prose intro b1/b2, section bands b3/b7/b9/b11/b16/b18,
//   verse b4/b5/b6/b12/b13/b14 (pattern-a: separate sanskrit/iast) + verse b8/b10 (pattern-b: inline-em
//   IAST in sanskrit, iast EMPTY) + colophon b15 (pattern-a — ALREADY present) + editorial Glossary
//   b17 / Typo-table b19 LEFT untouched. English per-block ALIGNED & UNTOUCHED (except the empty
//   colophon english, FILLED below per the standing directive — an ADD, not an alteration).
//
// DEFECT 1 (systematic, ch86-92 pattern): verse IAST riddled with NON-STANDARD ō/ē macron glyphs —
//   normalized ō→o, ē→e in verse sanskrit+iast ONLY (never english). Deva has none.
// DEFECT 2: 'x' used for क्ष, ख, ख्य AND क्त (each mapped per the Deva, NOT blindly):
//   क्ष → xut(क्षुत् b6), karmaxayāt(क्षयात्), sūxma(सूक्ष्म b10/b14), aparapaxaṃ/daxiṇāyana(b13), śuklapax(b14);
//   ख  → muxanāsike(मुख b6), muxaiḥ/muxaṃ(मुख b10);
//   ख्य→ kīlālāxyaṃ(आख्यं)/śleṣmāxye(आख्ये)/pittāxya(आख्य)/muxyaprāṇa(मुख्य) b10;
//   क्त → vyāpārānmuxaḥ→muktaḥ (Deva आत्मीयव्यापारान्मुक्तः; cf the correctly-spelled svāśayānmuktaḥ same block).
//
// TARGETED Deva↔IAST slips (mUlam-confirmed):
//   b8 IAST aṇdaja→aṇḍaja (retroflex ḍ; Deva अण्डज); b8 Deva आकाशद्→आकाशाद् (ablative long ā; IAST ākāśād);
//   b10 IAST vāyusarvasroto→vāyuḥ sarvasroto (Deva वायुः … visarga+split);
//   b14 Deva भूर्दीन्→भूरादीन् (dropped आ; IAST bhūrādīn); b14 IAST gaccatīti→gacchatīti (dropped aspirate, Deva गच्छ).
//
// No colophon insert (b15 present). FILLED b15 empty english (colophon "Thus ends…" line, ch88/90 style).
//
// LEFT as editorial (Deva=IAST cohere; mUlam differs): reader's wind reorg (समान/उदान/व्यान seats),
//   चम्पयन्(mUlam कम्पयन्), संयोगादरूढो(mUlam प्रवृद्धो), वायुरात्मवान्(mUlam वायुरतिवेगो), colophon lacking
//   "(मातृकान्तरे ८६)"; apparatus blocks (Glossary/Typo-table).
const fs = require('fs');
const { load, writeBack, READER } = require('./load.js');
const WRITE = process.argv.includes('--write');
const { html, chapters, start, end } = load();
const ch = chapters[92];
if (ch.number !== 93) throw new Error('wrong chapter ' + ch.number);
const B = ch.blocks;
if (B.length !== 20) throw new Error('expected 20 blocks, got ' + B.length);

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
// b6 (pattern-a iast)
rep(6, 'iast', 'muxanāsike', 'mukhanāsike', 1);   // ख
rep(6, 'iast', 'xut', 'kṣut', 1);                 // क्ष
// b8 (pattern-b sanskrit)
rep(8, 'sanskrit', 'आकाशद्', 'आकाशाद्', 1);        // Deva ablative long ā
rep(8, 'sanskrit', 'aṇdaja', 'aṇḍaja', 1);        // retroflex ḍ (Deva अण्डज)
// b10 (pattern-b sanskrit)
rep(10, 'sanskrit', 'karmaxayāt', 'karmakṣayāt', 1);          // क्ष
rep(10, 'sanskrit', 'kīlālāxyaṃ', 'kīlālākhyaṃ', 1);          // ख्य
rep(10, 'sanskrit', 'śleṣmāxye', 'śleṣmākhye', 1);            // ख्य
rep(10, 'sanskrit', 'pittāxya', 'pittākhya', 1);              // ख्य
rep(10, 'sanskrit', 'vāyusarvasroto', 'vāyuḥ sarvasroto', 1); // visarga+split (Deva वायुः)
rep(10, 'sanskrit', 'muxaiḥ', 'mukhaiḥ', 1);                  // ख
rep(10, 'sanskrit', 'vyāpārānmuxaḥ', 'vyāpārānmuktaḥ', 1);    // क्त (Deva मुक्तः)
rep(10, 'sanskrit', 'muxaṃ', 'mukhaṃ', 1);                    // ख
rep(10, 'sanskrit', 'muxyaprāṇa', 'mukhyaprāṇa', 1);          // ख्य
rep(10, 'sanskrit', 'sūxmaśarīriṇaṃ', 'sūkṣmaśarīriṇaṃ', 1);  // क्ष
// b13 (pattern-a iast)
rep(13, 'iast', 'aparapaxaṃ', 'aparapakṣaṃ', 1);  // क्ष
rep(13, 'iast', 'daxiṇāyana', 'dakṣiṇāyana', 1);  // क्ष
// b14 (pattern-a)
rep(14, 'sanskrit', 'भूर्दीन्', 'भूरादीन्', 1);    // Deva dropped आ (IAST bhūrādīn)
rep(14, 'iast', 'sūxmadeha', 'sūkṣmadeha', 2);    // क्ष ×2
rep(14, 'iast', 'śuklapax', 'śuklapakṣ', 2);      // क्ष ×2
rep(14, 'iast', 'gaccatīti', 'gacchatīti', 1);    // dropped aspirate (Deva गच्छ)

// (3) FILL empty colophon b15 english (ADD; ch88/90 house style)
if (!B[15].colophon) throw new Error('b15 not colophon');
if ((B[15].english || '').trim() !== '') throw new Error('b15 english not empty');
B[15].english = '<ul>\n<li><strong>Colophon:</strong> Thus ends the Ninety-Third Chapter, named <em>Jīvodbhavaḥ</em> (The Origin and Transmigration of the Soul), in the <em>Vimānārcanākalpa</em> declared by Sage Marīci in the Śrī Vaikhānasa tradition.</li>\n</ul>\n';
console.log('filled b15 colophon english.');

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
