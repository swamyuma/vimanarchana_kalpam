// Enumerate suspect IAST/Deva tokens in ch68 verse blocks, per block, with counts.
const { load } = require('./load.js');
const { chapters } = load();
const ch = chapters[67];
if (ch.number !== 68) throw new Error('wrong ch ' + ch.number);
const verses = ch.blocks.filter(b => b.type === 'verse');
console.log('verse count:', verses.length);

function tokens(s) { return (s.replace(/<[^>]+>/g, ' ').match(/[A-Za-zĀ-ṿА-яĀ-ſḀ-ỿˉāīūṛṝḷṅñṭḍṇśṣ&#;0-9'’-]+/g) || []); }

// Suspect patterns to surface
const susIast = /(x|ou|ō|ē|ẽ|ea|āi|k[sṣ]en|ksen|dray|patne|ṛty |kṛty |snāpy|proṣya|varṣādhārā|uktāk|vīthyaṃ|anuktās|śuddhoa|kṛtva\b|byo|byā)/;
verses.forEach((b, i) => {
  const ia = b.iast || '';
  const sk = b.sanskrit || '';
  const flaggedI = tokens(ia).filter(t => susIast.test(t));
  if (flaggedI.length) console.log(`\n[v${i} / block${i+2}] IAST suspects:`, flaggedI.join('  |  '));
});

// Global counts of key patterns across sanskrit+iast
let all = '';
verses.forEach(b => { all += (b.sanskrit||'') + '' + (b.iast||'') + ''; });
const allLatin = all.replace(/<[^>]+>/g, ' ');
function ct(re){ return (all.match(re)||[]).length; }
function ctL(re){ return (allLatin.match(re)||[]).length; }
console.log('\n=== GLOBAL COUNTS (sanskrit+iast) ===');
console.log('viṣvakṣenaṃ :', ct(/viṣvakṣenaṃ/g));
console.log('vaiṣvakṣenaṃ:', ct(/vaiṣvakṣenaṃ/g));
console.log('viṣvakṣena(no ṃ, incl compound):', ct(/viṣvakṣena/g));
console.log('viṣvaksena :', ct(/viṣvaksena/g));
console.log('vaiṣvaksena:', ct(/vaiṣvaksena/g));
console.log("x (any) :", ct(/x/g));
console.log("ou :", ctL(/ou/g));
console.log("ō :", ctL(/ō/g), " ē:", ctL(/ē/g), " ea(deveaś etc):", ctL(/ea/g));
console.log("dray :", ct(/dray/g));
console.log("patne :", ct(/patne/g));
console.log("varṣādhārā :", ct(/varṣādhārā/g));
console.log("deveaś :", ct(/deveaś/g));
console.log("uktākāle :", ct(/uktākāle/g));
console.log("vīthyaṃntare :", ct(/vīthyaṃntare/g));
console.log("anuktāsthāne :", ct(/anuktāsthāne/g));
console.log("śuddhoadakaiḥ :", ct(/śuddhoadakaiḥ/g));
console.log("proṣya :", ct(/proṣya/g));
console.log("uddhṛty(+space) :", ct(/uddhṛty[ ,]/g), " alaṅkṛty:", ct(/alaṅkṛty[ ,]/g), " saṃsnāpy:", ct(/saṃsnāpy[ ,]/g), " uddhṛty':", ct(/uddhṛty '/g));
console.log("kṛtva (short, no ā) :", ct(/kṛtva\b/g));
console.log("ध्वजावरोहण क(no anusvara):", ct(/ध्वजावरोहण क/g));
console.log("backtick :", ct(/`/g), " asterisk-lump ** :", ct(/\*\*/g));
