#!/usr/bin/env python3
"""
Convert 'Compilado - Old Infærnum.pdf' to a structured markdown file.
Strategy:
  - Use pdfplumber for text + bounding-box info
  - Infer headings by font size / boldness / all-caps heuristics
  - Detect tables and render them as markdown tables
  - Preserve paragraphs and lists
"""

import pdfplumber
import re
import sys
from pathlib import Path

PDF_PATH = Path(__file__).parent / "Compilado - Old Infærnum.pdf"
OUT_PATH  = Path(__file__).parent / "Compilado - Old Infærnum.md"

H1_SIZE   = 20   # pt – tune if needed
H2_SIZE   = 16
H3_SIZE   = 13
BODY_SIZE = 10   # baseline


def clean(text: str) -> str:
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "–").replace("\u2014", "—")
    text = text.replace("\u00e6", "æ").replace("\u00c6", "Æ")
    text = text.replace("\u00f8", "ø").replace("\u00d8", "Ø")
    text = text.replace("\u00e5", "å").replace("\u00c5", "Å")
    # collapse multiple spaces
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()


def word_size(word: dict) -> float:
    """Return font size for a pdfplumber word dict."""
    return word.get("size", BODY_SIZE) or BODY_SIZE


def word_bold(word: dict) -> bool:
    fontname = (word.get("fontname") or "").lower()
    return "bold" in fontname or "heavy" in fontname or "black" in fontname


def classify_line(words: list) -> str:
    """Return 'h1', 'h2', 'h3', or 'body'."""
    if not words:
        return "body"
    sizes = [word_size(w) for w in words]
    avg_size = sum(sizes) / len(sizes)
    text = " ".join(w["text"] for w in words)
    is_bold = all(word_bold(w) for w in words)
    is_upper = text == text.upper() and len(text) > 2

    if avg_size >= H1_SIZE or (is_upper and avg_size >= H2_SIZE):
        return "h1"
    if avg_size >= H2_SIZE or (is_bold and avg_size >= H3_SIZE):
        return "h2"
    if avg_size >= H3_SIZE or is_bold:
        return "h3"
    return "body"


def words_to_lines(words: list) -> list[tuple[str, str]]:
    """Group words into lines by vertical position → (kind, text)."""
    if not words:
        return []

    # sort by top, then x0
    words = sorted(words, key=lambda w: (round(w["top"], 1), w["x0"]))

    lines = []
    current_top = None
    current_words = []

    for w in words:
        top = round(w["top"], 1)
        if current_top is None or abs(top - current_top) < 3:
            current_top = top
            current_words.append(w)
        else:
            lines.append(current_words)
            current_words = [w]
            current_top = top
    if current_words:
        lines.append(current_words)

    result = []
    for line_words in lines:
        text = clean(" ".join(w["text"] for w in line_words))
        if not text:
            continue
        kind = classify_line(line_words)
        result.append((kind, text))
    return result


def table_to_markdown(table: list[list]) -> str:
    """Convert a pdfplumber table (list of rows) to markdown."""
    if not table:
        return ""
    rows = [[clean(str(cell or "")) for cell in row] for row in table]
    # column widths
    cols = max(len(r) for r in rows)
    widths = [0] * cols
    for row in rows:
        for i, cell in enumerate(row):
            widths[i] = max(widths[i], len(cell))

    def fmt_row(row):
        cells = []
        for i in range(cols):
            cell = row[i] if i < len(row) else ""
            cells.append(cell.ljust(widths[i]))
        return "| " + " | ".join(cells) + " |"

    lines = [fmt_row(rows[0])]
    lines.append("| " + " | ".join("-" * w for w in widths) + " |")
    for row in rows[1:]:
        lines.append(fmt_row(row))
    return "\n".join(lines)


def lines_to_markdown(lines: list[tuple[str, str]]) -> str:
    """Convert classified lines to markdown text."""
    md_parts = []
    prev_kind = None

    for kind, text in lines:
        if kind == "h1":
            md_parts.append(f"\n# {text}\n")
        elif kind == "h2":
            md_parts.append(f"\n## {text}\n")
        elif kind == "h3":
            md_parts.append(f"\n### {text}\n")
        else:
            # body text – try to merge short continuation lines
            if prev_kind == "body" and md_parts:
                last = md_parts[-1]
                # If last body ends without sentence terminator, join
                if last and not last.endswith(("\n", ".", "!", "?", ":", ";")):
                    md_parts[-1] = last + " " + text
                else:
                    md_parts.append(text)
            else:
                md_parts.append(text)
        prev_kind = kind

    return "\n\n".join(p.strip() for p in md_parts if p.strip())


def process_pdf(pdf_path: Path) -> str:
    sections = []

    with pdfplumber.open(pdf_path) as pdf:
        total = len(pdf.pages)
        print(f"Processando {total} páginas...", file=sys.stderr)

        for i, page in enumerate(pdf.pages, 1):
            print(f"  Página {i}/{total}", end="\r", file=sys.stderr)

            # Extract tables first and note their bboxes
            tables = page.find_tables()
            table_bboxes = [t.bbox for t in tables]

            # Words outside tables
            all_words = page.extract_words(
                extra_attrs=["fontname", "size"],
                use_text_flow=True,
            )

            def in_table(word):
                wx0, wy0, wx1, wy1 = word["x0"], word["top"], word["x1"], word["bottom"]
                for bx0, by0, bx1, by1 in table_bboxes:
                    if wx0 >= bx0 - 2 and wy0 >= by0 - 2 and wx1 <= bx1 + 2 and wy1 <= by1 + 2:
                        return True
                return False

            non_table_words = [w for w in all_words if not in_table(w)]

            # Convert words to heading/body lines
            text_lines = words_to_lines(non_table_words)
            page_md = lines_to_markdown(text_lines)

            # Insert tables at roughly correct position (append after text for simplicity)
            table_mds = []
            for t in tables:
                data = t.extract()
                if data:
                    table_mds.append(table_to_markdown(data))

            page_text = page_md
            if table_mds:
                page_text += "\n\n" + "\n\n".join(table_mds)

            if page_text.strip():
                sections.append(page_text.strip())

    print(f"\nConcluído!", file=sys.stderr)
    return "\n\n---\n\n".join(sections)


def main():
    print(f"PDF: {PDF_PATH}", file=sys.stderr)
    if not PDF_PATH.exists():
        print(f"ERRO: arquivo não encontrado: {PDF_PATH}", file=sys.stderr)
        sys.exit(1)

    md = process_pdf(PDF_PATH)

    # Write output
    OUT_PATH.write_text(md, encoding="utf-8")
    print(f"Markdown salvo em: {OUT_PATH}", file=sys.stderr)
    print(f"Tamanho: {len(md):,} caracteres / {len(md.splitlines()):,} linhas", file=sys.stderr)


if __name__ == "__main__":
    main()
