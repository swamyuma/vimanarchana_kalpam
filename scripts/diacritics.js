// Anglicized → IAST diacritic normalization map for the ENGLISH-language text
// only (translation prose, section/chapter titles). It is never applied to the
// Sanskrit (Devanagari) or IAST fields — those are already authoritative.
//
// Each entry is [pattern, replacement]; pattern is a RegExp source string and is
// applied case-sensitively with the global flag. Word boundaries (\b) keep us
// from matching inside larger words (e.g. \bBrahma\b will not touch "Brahman").
// `(s)?` style captures preserve simple English plurals.
//
// Order matters only where one pattern is a prefix of another; longer/more
// specific patterns are listed first.

const DIACRITICS = [
  // — Deities & proper names —
  ['\\bVishnu\\b', 'Viṣṇu'],
  ['\\bKrishna\\b', 'Kṛṣṇa'],
  ['\\bShiva\\b', 'Śiva'],
  ['\\bNarayana\\b', 'Nārāyaṇa'],
  ['\\bMarichi\\b', 'Marīci'],
  ['\\bSrinivasa\\b', 'Śrīnivāsa'],    // listed before the bare "Sri" rule
  ['\\bBrahma\\b(?!-)', 'Brahmā'],     // creator-god only; "Brahman" (absolute) & "Brahma-*" compounds (neuter brahma-, e.g. brahma-sthāna) left alone
  ['\\bLakshmi\\b', 'Lakṣmī'],
  ['\\bGanesha\\b', 'Gaṇeśa'],
  ['\\bGaruda\\b', 'Garuḍa'],
  ['\\bPrajapati\\b', 'Prajāpati'],
  ['\\bPurusha\\b', 'Puruṣa'],
  ['\\bIshvara\\b', 'Īśvara'],
  ['\\bSudarshana\\b', 'Sudarśana'],
  ['\\bAnantha\\b', 'Ananta'],
  ['\\bVasudeva\\b', 'Vāsudeva'],
  ['\\bSankarshana\\b', 'Saṅkarṣaṇa'],
  ['\\bAditya\\b', 'Āditya'],
  ['\\bSurya\\b', 'Sūrya'],
  ['\\bVaruna\\b', 'Varuṇa'],
  ['\\bRishi(s)?\\b', 'Ṛṣi$1'],
  ['\\bDurga\\b', 'Durgā'],
  ['\\bKartikeya\\b', 'Kārtikeya'],
  ['\\bBhaskara\\b', 'Bhāskara'],
  ['\\bNirriti\\b', 'Nirṛti'],

  // — Scriptures & ritual vocabulary —
  ['\\bSruti(s)?\\b', 'Śruti$1'],
  ['\\bShruti(s)?\\b', 'Śruti$1'],
  ['\\bSmriti(s)?\\b', 'Smṛti$1'],
  ['\\bPanchabhautika\\b', 'Pañcabhautika'],
  ['\\bsukta\\b', 'sūkta'],
  ['\\bSukta\\b', 'Sūkta'],

  // — Schools, texts, structures, ritual terms —
  ['\\bVaikhanasa\\b', 'Vaikhānasa'],
  ['\\bAgama(s)?\\b', 'Āgama$1'],
  ['\\bVimana(s)?\\b', 'Vimāna$1'],
  ['\\bGarbhagriha\\b', 'Garbhagṛha'],
  ['\\bPrakara(s)?\\b', 'Prākāra$1'],
  ['\\bMurti(s)?\\b', 'Mūrti$1'],
  ['\\bPuja(s)?\\b', 'Pūjā$1'],
  ['\\bAbhisheka\\b', 'Abhiṣeka'],
  ['\\bPratishtha\\b', 'Pratiṣṭhā'],
  ['\\bSnana\\b', 'Snāna'],
  ['\\bMandapa(s)?\\b', 'Maṇḍapa$1'],
  ['\\bShri\\b', 'Śrī'],
  ['\\bSri\\b', 'Śrī'],
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DIACRITICS;
}
