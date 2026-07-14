// Deterministic Devanagari -> IAST transliterator (this edition's conventions).
// - anusvāra ं -> ṃ uniformly (editor's dominant convention); candrabindu ँ -> ṃ
// - true half-nasals via virama (ङ्/ञ्/ण्/न्/म्) -> ṅ/ñ/ṇ/n/m
// - ।/॥/॰ -> "."  ; avagraha ऽ -> &#39; (reader's IAST apostrophe convention)
// - passes through everything non-Devanagari verbatim (HTML tags, Latin, punctuation, parens)
const CONS = {
  'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ',
  'च':'c','छ':'ch','ज':'j','झ':'jh','ञ':'ñ',
  'ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ',
  'त':'t','थ':'th','द':'d','ध':'dh','न':'n',
  'प':'p','फ':'ph','ब':'b','भ':'bh','म':'m',
  'य':'y','र':'r','ल':'l','व':'v',
  'श':'ś','ष':'ṣ','स':'s','ह':'h',
  'ळ':'ḷ','क़':'q','ख़':'kh','ग़':'g','ज़':'z','ड़':'ṛ','ढ़':'ṛh','फ़':'f','य़':'y',
};
const INDV = {
  'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'ṛ','ॠ':'ṝ','ऌ':'ḷ','ॡ':'ḹ',
  'ए':'e','ऐ':'ai','ओ':'o','औ':'au','ऎ':'e','ऒ':'o','ऍ':'e','ऑ':'o',
};
const MATRA = {
  'ा':'ā','ि':'i','ी':'ī','ु':'u','ू':'ū','ृ':'ṛ','ॄ':'ṝ','ॢ':'ḷ','ॣ':'ḹ',
  'े':'e','ै':'ai','ो':'o','ौ':'au','ॆ':'e','ॊ':'o','ॅ':'e','ॉ':'o',
};
const VIRAMA = '्';
const SIGN = { 'ं':'ṃ','ँ':'ṃ','ः':'ḥ','ऽ':'&#39;','ॐ':'oṃ' };
const DIGIT = { '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9' };
const PUNCT = { '।':'.','॥':'.','॰':'.' };

function isDeva(ch){ const c = ch.codePointAt(0); return c >= 0x0900 && c <= 0x097F; }

function translitRun(run){
  let out = '';
  let i = 0;
  while (i < run.length){
    const ch = run[i];
    if (CONS[ch] !== undefined){
      out += CONS[ch];
      const nx = run[i+1];
      if (nx === VIRAMA){ i += 2; continue; }            // conjunct/half — no vowel
      if (nx !== undefined && MATRA[nx] !== undefined){ out += MATRA[nx]; i += 2; continue; }
      out += 'a'; i += 1; continue;                       // inherent a
    }
    if (INDV[ch] !== undefined){ out += INDV[ch]; i++; continue; }
    if (SIGN[ch] !== undefined){ out += SIGN[ch]; i++; continue; }
    if (PUNCT[ch] !== undefined){ out += PUNCT[ch]; i++; continue; }
    if (DIGIT[ch] !== undefined){ out += DIGIT[ch]; i++; continue; }
    if (ch === VIRAMA){ i++; continue; }                  // stray virama
    if (MATRA[ch] !== undefined){ out += MATRA[ch]; i++; continue; } // stray matra
    out += ch; i++;                                       // any other Deva char: pass
  }
  return out;
}

function translit(s){
  let out = '';
  let i = 0;
  while (i < s.length){
    if (isDeva(s[i])){
      let j = i;
      while (j < s.length && (isDeva(s[j]))) j++;
      out += translitRun(s.slice(i, j));
      i = j;
    } else {
      out += s[i]; i++;
    }
  }
  // tidy: drop space before . or , produced by Deva "word ॥/।"
  out = out.replace(/[ \t]+([.,;])/g, '$1');
  return out;
}

module.exports = { translit, translitRun };
