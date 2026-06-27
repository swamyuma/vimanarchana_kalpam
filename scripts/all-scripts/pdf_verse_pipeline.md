# PDF → Verse Pipeline (fully local, no frontier models)

A workflow to take a Sanskrit/Tamil PDF and produce, per verse:
**source script + IAST transliteration + English translation** — running
entirely on this machine (WSL Ubuntu, CPU-only, Tesseract already installed).

---

## Flowchart

```
                         ┌───────────────────────┐
                         │      INPUT: PDF        │
                         │  (e.g. Vimanarchana,   │
                         │   Lalita Sahasranama)  │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │  1. EXTRACT PAGES      │
                         │  pick page range       │
                         │  pdftk / pdfseparate   │
                         │  or pdftoppm -r 300     │
                         └───────────┬───────────┘
                                     │
                          ┌──────────┴───────────┐
                          │  Text layer present?  │
                          └─────┬───────────┬─────┘
                          YES   │           │   NO  (scanned / image)
                                ▼           ▼
                    ┌───────────────┐   ┌────────────────────────┐
                    │ 2a. pdftotext │   │ 2b. RENDER → PNG        │
                    │   (direct)    │   │   pdftoppm -png -r 300  │
                    └───────┬───────┘   └────────────┬───────────┘
                            │                        │
                            │                        ▼
                            │            ┌────────────────────────┐
                            │            │ 3. PREPROCESS image     │
                            │            │   convert -colorspace   │
                            │            │   Gray -threshold 50%   │
                            │            └────────────┬───────────┘
                            │                         │
                            │                         ▼
                            │            ┌────────────────────────┐
                            │            │ 4. OCR (Tesseract)      │
                            │            │   -l san  | tam | both  │
                            │            │   --psm 6               │
                            │            └────────────┬───────────┘
                            │                         │
                            └───────────┬─────────────┘
                                        ▼
                          ┌───────────────────────────┐
                          │ 5. CLEAN / SEGMENT TEXT     │
                          │   fix line breaks, split    │
                          │   into verses (॥ / numbers) │
                          │   (opt.) sandhi-split        │
                          └─────────────┬─────────────┘
                                        │
                  ┌─────────────────────┼─────────────────────┐
                  ▼                     ▼                       ▼
        ┌──────────────────┐ ┌───────────────────┐  ┌────────────────────┐
        │ 6a. KEEP SOURCE   │ │ 6b. TRANSLITERATE  │  │ 6c. TRANSLATE       │
        │  Devanagari /     │ │  Aksharamukha →    │  │  IndicTrans2 (local)│
        │  Tamil (verbatim) │ │  IAST / ISO-15919  │  │  → English          │
        │                   │ │  (deterministic)   │  │  (no frontier model)│
        └─────────┬────────┘ └─────────┬─────────┘  └──────────┬─────────┘
                  │                    │                        │
                  └─────────────────────┼───────────────────────┘
                                        ▼
                          ┌───────────────────────────┐
                          │ 7. ASSEMBLE MARKDOWN        │
                          │  per verse:                 │
                          │    • Devanagari / Tamil     │
                          │    • IAST transliteration   │
                          │    • English translation    │
                          └─────────────┬─────────────┘
                                        ▼
                          ┌───────────────────────────┐
                          │   OUTPUT: chapter.md        │
                          └───────────────────────────┘
```

| Stage | Tool | Notes |
|-------|------|-------|
| 1 Extract pages | `pdftoppm` / `pdfseparate` / `pdftk` | `-r 300` DPI for clean OCR |
| 2a Text layer | `pdftotext -layout` | only if PDF is born-digital |
| 2b Render | `pdftoppm -png -r 300` | for scanned PDFs |
| 3 Preprocess | ImageMagick `convert` | grayscale + threshold = big OCR gain |
| 4 OCR | `tesseract -l san+tam --psm 6` | `san` + `tam` already installed |
| 5 Clean/segment | script (+ optional sandhi splitter) | split on `॥` / verse numbers |
| 6b Transliterate | **aksharamukha** | deterministic, no model |
| 6c Translate | **IndicTrans2 (AI4Bharat)** | local NMT, CPU-capable |
| 7 Assemble | Python | one block per verse |

---

## The all-local stack (no frontier models)

| Need | Local tool | Why |
|------|-----------|-----|
| Render/extract PDF | **poppler-utils** (`pdftoppm`, `pdftotext`) | standard, fast, CPU |
| Image cleanup | **ImageMagick** | threshold removes colored backgrounds |
| OCR | **Tesseract 5** (`san`, `tam`) | already installed; add `tessdata_best` for accuracy |
| (opt.) better OCR | **Surya OCR** | higher Indic accuracy, CPU-capable |
| Transliteration | **aksharamukha** (pip) | rule-based, 100% deterministic |
| (opt.) Sanskrit sandhi split | **vidyut** / **sanskrit_parser** | splits compounds → better NMT input |
| **Translation** | **IndicTrans2** (`ai4bharat/indictrans2-indic-en-dist-200M`) | only solid *free local* Sanskrit+Tamil→En NMT |

### Why IndicTrans2 (and its limits)
IndicTrans2 is AI4Bharat's open-source NMT covering all 22 scheduled Indian
languages, including **Sanskrit (`san_Deva`)** and **Tamil (`tam_Taml`)** ↔
**English (`eng_Latn`)**. It runs locally on CPU.

> ⚠️ **Honest caveat.** IndicTrans2 is trained on *modern prose*. Classical verse
> — dense Sanskrit ślokas with long compounds (*samāsa*) and poetic word order,
> or Sangam/medieval Tamil — will come out **literal and often wrong**. It is
> fine for gist and modern passages; it is **not** a substitute for a scholarly
> translation of *kāvya* or *śāstra*. Mitigations: (a) run a **sandhi-splitter**
> first so compounds are separated; (b) translate **line by line**, not whole
> verses; (c) treat output as a draft gloss.

---

## Install (once)

```bash
# system tools
sudo apt update
sudo apt install -y poppler-utils imagemagick tesseract-ocr

# (you already have san + tam; optional accuracy upgrade)
cd /usr/share/tesseract-ocr/5/tessdata
sudo wget -q https://github.com/tesseract-ocr/tessdata_best/raw/main/san.traineddata -O san_best.traineddata
sudo wget -q https://github.com/tesseract-ocr/tessdata_best/raw/main/tam.traineddata -O tam_best.traineddata

# python env
python3 -m venv ~/verse-env && source ~/verse-env/bin/activate
pip install --upgrade pip
pip install aksharamukha pillow
# IndicTrans2 (CPU): torch + transformers + the toolkit
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install transformers sentencepiece
pip install git+https://github.com/VarunGumma/IndicTransToolkit.git
```

---

## Script 1 — `pdf_to_text.sh`  (stages 1–4)

```bash
#!/usr/bin/env bash
# Usage: ./pdf_to_text.sh input.pdf 70 75 san   ->  pages 70-75, Sanskrit
set -euo pipefail
PDF="$1"; FIRST="$2"; LAST="$3"; LANG="${4:-san}"   # lang: san | tam | san+tam
WORK="$(basename "${PDF%.*}")_work"
mkdir -p "$WORK"

echo "[1] checking for text layer..."
if pdftotext -f "$FIRST" -l "$LAST" -layout "$PDF" - | grep -qE '\S'; then
    echo "    text layer found -> pdftotext (path 2a)"
    pdftotext -f "$FIRST" -l "$LAST" -layout "$PDF" "$WORK/raw.txt"
else
    echo "    no text layer -> render + OCR (path 2b)"
    echo "[2] rendering pages $FIRST-$LAST at 300 dpi..."
    pdftoppm -png -r 300 -f "$FIRST" -l "$LAST" "$PDF" "$WORK/page"
    : > "$WORK/raw.txt"
    for img in "$WORK"/page-*.png; do
        echo "[3] preprocessing $(basename "$img")..."
        convert "$img" -colorspace Gray -threshold 50% -bordercolor white -border 20 "${img%.png}_clean.png"
        echo "[4] OCR ($LANG)..."
        tesseract "${img%.png}_clean.png" stdout -l "$LANG" --psm 6 >> "$WORK/raw.txt"
        echo "" >> "$WORK/raw.txt"
    done
fi
echo "DONE -> $WORK/raw.txt"
```

## Script 2 — `verse_pipeline.py`  (stages 5–7)

```python
#!/usr/bin/env python3
"""raw.txt (Devanagari/Tamil) -> markdown with IAST + local English translation.
Usage: python verse_pipeline.py work/raw.txt --src san_Deva --out chapter.md
"""
import argparse, re, sys
from aksharamukha import transliterate

# ---- transliteration (deterministic) -------------------------------------
def to_iast(text, src):
    frm = "Devanagari" if src.startswith("san") else "Tamil"
    return transliterate.process(frm, "IAST", text)

# ---- translation (IndicTrans2, fully local) -------------------------------
def load_translator():
    import torch
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    from IndicTransToolkit import IndicProcessor
    name = "ai4bharat/indictrans2-indic-en-dist-200M"   # small = CPU-friendly
    tok = AutoTokenizer.from_pretrained(name, trust_remote_code=True)
    mdl = AutoModelForSeq2SeqLM.from_pretrained(name, trust_remote_code=True)
    ip  = IndicProcessor(inference=True)
    def translate(lines, src):
        batch = ip.preprocess_batch(lines, src_lang=src, tgt_lang="eng_Latn")
        enc = tok(batch, truncation=True, padding="longest",
                  return_tensors="pt", max_length=256)
        with torch.no_grad():
            out = mdl.generate(**enc, num_beams=5, max_length=256)
        dec = tok.batch_decode(out, skip_special_tokens=True)
        return ip.postprocess_batch(dec, lang="eng_Latn")
    return translate

# ---- verse segmentation ---------------------------------------------------
def split_verses(text):
    # split on danda/double-danda or trailing verse numbers
    chunks = re.split(r'(?:॥|।।|\|\||\n\s*\n)', text)
    return [c.strip() for c in chunks if c.strip()]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("infile")
    ap.add_argument("--src", default="san_Deva", help="san_Deva | tam_Taml")
    ap.add_argument("--out", default="chapter.md")
    ap.add_argument("--no-translate", action="store_true")
    a = ap.parse_args()

    raw = open(a.infile, encoding="utf-8").read()
    verses = split_verses(raw)
    translate = None if a.no_translate else load_translator()

    with open(a.out, "w", encoding="utf-8") as f:
        for i, v in enumerate(verses, 1):
            iast = to_iast(v, a.src)
            f.write(f"## Verse {i}\n\n")
            f.write(f"**Source**\n```\n{v}\n```\n\n")
            f.write(f"**IAST**\n```\n{iast}\n```\n\n")
            if translate:
                # translate line by line for slightly better results on verse
                lines = [ln for ln in v.splitlines() if ln.strip()]
                eng = translate(lines, a.src)
                f.write("**English (IndicTrans2 — draft, verify)**\n")
                for e in eng:
                    f.write(f"> {e}\n")
                f.write("\n")
            f.write("---\n\n")
    print(f"wrote {len(verses)} verses -> {a.out}")

if __name__ == "__main__":
    main()
```

---

## Run it end to end

```bash
source ~/verse-env/bin/activate

# Sanskrit PDF, pages 70-75
./pdf_to_text.sh Vimanarchana_Kalpa_Sanskrit_TTD_1998.pdf 70 75 san
python verse_pipeline.py Vimanarchana_Kalpa_Sanskrit_TTD_1998_work/raw.txt \
       --src san_Deva --out vk_ch70.md

# Tamil PDF
./pdf_to_text.sh some_tamil.pdf 1 10 tam
python verse_pipeline.py some_tamil_work/raw.txt --src tam_Taml --out tamil.md

# transliteration only (skip the translation model entirely)
python verse_pipeline.py work/raw.txt --src san_Deva --no-translate --out translit.md
```

Language codes for `--src`: **Sanskrit = `san_Deva`**, **Tamil = `tam_Taml`**.

---

## Accuracy / quality levers (all local)

1. **Better OCR** → use `-l san_best` / `tam_best`, or switch stage 4 to **Surya
   OCR** (`pip install surya-ocr`; `surya_ocr clean.png --langs sa,ta`).
2. **Sandhi-split before translating** (Sanskrit): `pip install vidyut` and split
   compounds first — IndicTrans2 handles separated words far better than long
   *samāsa*.
3. **Translate line-by-line, beam search** (already in the script:
   `num_beams=5`) — fewer hallucinated merges than whole-verse input.
4. **Use the 1B model** (`indictrans2-indic-en-1B`) instead of `dist-200M` if you
   accept slower CPU runs — somewhat better quality, needs more RAM (~5–6 GB).
5. **Optional local LLM polish**: pipe IndicTrans2 output through a small Ollama
   model (`qwen2.5:7b`) to clean grammar — still no frontier model, but adds
   minutes per verse on CPU.

## Honest expectation setting

- **OCR + transliteration: excellent locally.** This part needs no frontier model
  and will be accurate on clean printed text.
- **Translation of classical verse: weak locally.** IndicTrans2 gives a literal
  draft, not a scholarly rendering. For publishable translation of *ślokas* /
  *kāvya*, a frontier model (or a human Sanskritist) remains far better. Use the
  local output as a first-pass gloss and flag it as such (the script labels every
  translation "draft, verify").
```

