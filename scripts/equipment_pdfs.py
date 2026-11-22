"""Append the shared equipment rules to the revised Oathbound PDFs.

Run from the repository root with Node.js, PyMuPDF, and ReportLab available:
    python scripts/equipment_pdfs.py
"""

import io
import json
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

import pymupdf
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "output" / "pdf"


def read_equipment():
    script = """
        global.window = { OB: {} };
        require('./js/equipment.js');
        const { GEAR_RULES: rules, EQUIPMENT, gearMeta } = window.OB;
        console.log(JSON.stringify({
            rules, items: EQUIPMENT.map(item => ({...item, meta: gearMeta(item)}))
        }));
    """
    return json.loads(subprocess.check_output(["node", "-e", script], cwd=ROOT))


INK = colors.HexColor("#20201f")
GRAY = colors.HexColor("#555551")
PAPER = colors.HexColor("#f1f0ee")
BODY = ParagraphStyle("body", fontName="Times-Roman", fontSize=11, leading=13.5, textColor=INK)
LABEL = ParagraphStyle("label", fontName="Helvetica-Bold", fontSize=8.2, leading=11, textColor=GRAY)


def paragraph(pdf, text, x, top, width, style=BODY):
    block = Paragraph(escape(text), style)
    _, height = block.wrap(width, 750)
    block.drawOn(pdf, x, top - height)
    return top - height


def page_frame(pdf, book, page, title, subtitle):
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(44, 748, book.upper() + "  /  EQUIPMENT")
    pdf.setFont("Helvetica-Bold", 27)
    pdf.drawString(44, 711, title)
    paragraph(pdf, subtitle, 44, 694, 524)
    pdf.setStrokeColor(INK)
    pdf.line(44, 660, 568, 660)
    pdf.line(44, 50, 568, 50)
    pdf.setFont("Helvetica", 8)
    pdf.drawString(44, 36, "OATHBOUND  /  EQUIPMENT SUPPLEMENT")
    pdf.drawRightString(568, 36, str(page))


def supplement(book, first_page, data):
    stream = io.BytesIO()
    pdf = canvas.Canvas(stream, pagesize=(612, 792))
    page_frame(pdf, book, first_page, "Equipment and relics",
               "Carry named gear. Equip what you can use. Discover items with powers tied to the world and its people.")
    top = 638
    for heading, rule in data["rules"]:
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(44, top, heading)
        top = paragraph(pdf, rule, 44, top - 8, 524) - 24
    example = ("A guardian wears Wayfarer Mail and an attuned Ring of Banked Embers. A burning blade hits for 3 harm. "
               "The guardian marks one use of the ring and rolls Endure Harm with 2 incoming harm. The mail remains ready.")
    pdf.setFillColor(PAPER)
    pdf.rect(44, top - 76, 524, 85, fill=1, stroke=0)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(56, top - 10, "Example at the table")
    assert paragraph(pdf, example, 56, top - 18, 500) > max(62, top - 76)
    pdf.showPage()

    page_frame(pdf, book, first_page + 1, "Equipment catalog",
               "Record the item's name, slot, attunement, and used state on your sheet or an index card.")
    columns = (data["items"][:6], data["items"][6:])
    for x, items in zip((44, 314), columns):
        top = 640
        for item in items:
            pdf.setFillColor(INK)
            pdf.setFont("Helvetica-Bold", 11)
            pdf.drawString(x, top, item["name"])
            top = paragraph(pdf, item["meta"], x, top - 6, 254, LABEL)
            top = paragraph(pdf, item["text"], x, top - 3, 254)
            pdf.setStrokeColor(colors.HexColor("#d1d0cc"))
            pdf.line(x, top - 7, x + 254, top - 7)
            top -= 25
        assert top > 58
    pdf.showPage()
    pdf.save()
    return stream.getvalue()


def update_pdf(stem, book, reference_page, data):
    source = PDF_DIR / (stem + "_Revised.pdf")
    dest = PDF_DIR / (stem + "_Equipment.pdf")
    with pymupdf.open(source) as doc:
        first_page = len(doc)
        with pymupdf.open(stream=supplement(book, first_page + 1, data), filetype="pdf") as appendix:
            doc.insert_pdf(appendix)
        outline = doc.get_toc(simple=False)
        outline.extend([
            [1, "Equipment and relics", first_page + 1],
            [2, "Equipment catalog", first_page + 2],
        ])
        doc.set_toc(outline)
        page = doc[reference_page - 1]
        if reference_page == 25:
            area = pymupdf.Rect(53.8, 136.8, 301, 207.3)
            page.add_redact_annot(area, fill=False, cross_out=False)
            page.apply_redactions(images=0, graphics=0)
            assert page.insert_textbox(
                area,
                "Record named gear that matters to your character. Ordinary gear helps in the fiction. "
                "Weapons and special equipment can change harm, modify moves, or grant limited-use powers.",
                fontsize=9.1, fontname="tiro", lineheight=1.24,
            ) >= 0
        x, y = (54, 200) if reference_page == 25 else (44, 304)
        notice = pymupdf.Rect(x, y - 8, x + 245, y + 3)
        page.insert_text(
            (x, y), f"Equipment and relics: pages {first_page + 1}-{first_page + 2}.",
            fontsize=8, fontname="hebo", color=(0.2, 0.2, 0.2)
        )
        page.insert_link({"kind": pymupdf.LINK_GOTO, "from": notice, "page": first_page})
        doc.save(dest, garbage=3, deflate=True)
    print(dest)


if __name__ == "__main__":
    data = read_equipment()
    update_pdf("Oathbound_Core_Rulebook", "Core Rulebook", 25, data)
    update_pdf("Waystone_Oathbound_Reference", "Waystone reference", 5, data)
