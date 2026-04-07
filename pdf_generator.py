"""
PDF Generation for Threat Assessment Reports — Professional Enterprise Edition
Produces a polished, CISO-grade PDF using ReportLab.
"""

import io
import re
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus.flowables import Flowable


# ── Brand palette ────────────────────────────────────────────────────────────
NAVY        = colors.HexColor('#0B1E3D')
NAVY_LIGHT  = colors.HexColor('#1e3a5f')
BLUE        = colors.HexColor('#1D4ED8')
BLUE_MID    = colors.HexColor('#2563EB')
SLATE       = colors.HexColor('#475569')
SLATE_LIGHT = colors.HexColor('#94A3B8')
PAGE_GRAY   = colors.HexColor('#F1F5F9')
BORDER      = colors.HexColor('#E2E8F0')
WHITE       = colors.white
BLACK       = colors.HexColor('#0F172A')

C_CRITICAL  = colors.HexColor('#DC2626')
C_HIGH      = colors.HexColor('#EA580C')
C_MEDIUM    = colors.HexColor('#D97706')
C_LOW       = colors.HexColor('#16A34A')

BG_CRITICAL = colors.HexColor('#FEF2F2')
BG_HIGH     = colors.HexColor('#FFF7ED')
BG_MEDIUM   = colors.HexColor('#FFFBEB')
BG_LOW      = colors.HexColor('#F0FDF4')

SEV_COLOR = {'CRITICAL': C_CRITICAL, 'HIGH': C_HIGH, 'MEDIUM': C_MEDIUM, 'LOW': C_LOW}
SEV_BG    = {'CRITICAL': BG_CRITICAL, 'HIGH': BG_HIGH, 'MEDIUM': BG_MEDIUM, 'LOW': BG_LOW}

PAGE_W, PAGE_H = letter
MARGIN = 0.75 * inch
CONTENT_W = PAGE_W - 2 * MARGIN


# ── Custom flowables ─────────────────────────────────────────────────────────

class SectionDivider(Flowable):
    """A full-width horizontal rule with optional label."""
    def __init__(self, label="", color=NAVY, height=1.5):
        Flowable.__init__(self)
        self.label = label
        self.color = color
        self.line_height = height
        self.width = CONTENT_W
        self.height = 24 if label else 12

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.line_height)
        self.canv.line(0, self.height / 2, self.width, self.height / 2)
        if self.label:
            self.canv.setFillColor(self.color)
            self.canv.setFont('Helvetica-Bold', 7)
            self.canv.drawString(0, 2, self.label.upper())


class RiskBadge(Flowable):
    """Inline colored risk-level badge."""
    def __init__(self, level, w=72, h=18):
        Flowable.__init__(self)
        self.level = level.upper()
        self.width = w
        self.height = h

    def draw(self):
        c = self.canv
        col = SEV_COLOR.get(self.level, SLATE)
        bg  = SEV_BG.get(self.level, PAGE_GRAY)
        r = self.height / 2
        c.setFillColor(bg)
        c.setStrokeColor(col)
        c.setLineWidth(0.6)
        c.roundRect(0, 0, self.width, self.height, r, stroke=1, fill=1)
        c.setFillColor(col)
        c.setFont('Helvetica-Bold', 7)
        c.drawCentredString(self.width / 2, (self.height - 7) / 2 + 1, self.level)


class CoverBand(Flowable):
    """Full-width navy cover header band."""
    def __init__(self, title, subtitle, rating, project, date, generated):
        Flowable.__init__(self)
        self.title     = title
        self.subtitle  = subtitle
        self.rating    = rating.upper()
        self.project   = project
        self.date      = date
        self.generated = generated
        self.width     = CONTENT_W
        self.height    = 3.6 * inch

    def draw(self):
        c = self.canv
        w, h = self.width, self.height

        # Navy background
        c.setFillColor(NAVY)
        c.rect(0, 0, w, h, stroke=0, fill=1)

        # Accent stripe (blue band at top)
        c.setFillColor(BLUE)
        c.rect(0, h - 8, w, 8, stroke=0, fill=1)

        # Left accent bar
        c.setFillColor(BLUE_MID)
        c.rect(0, 0, 4, h - 8, stroke=0, fill=1)

        # CONFIDENTIAL label
        c.setFillColor(colors.HexColor('#EF4444'))
        c.roundRect(w - 110, h - 48, 100, 20, 4, stroke=0, fill=1)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 8)
        c.drawCentredString(w - 60, h - 41, 'CONFIDENTIAL')

        # Title
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 28)
        c.drawString(24, h - 90, self.title)

        # Subtitle
        c.setFillColor(colors.HexColor('#93C5FD'))
        c.setFont('Helvetica', 13)
        c.drawString(24, h - 114, self.subtitle)

        # Divider line
        c.setStrokeColor(colors.HexColor('#1D4ED8'))
        c.setLineWidth(1)
        c.line(24, h - 130, w - 24, h - 130)

        # Risk rating box
        rating_col = SEV_COLOR.get(self.rating, C_HIGH)
        c.setFillColor(rating_col)
        c.roundRect(24, h - 200, 120, 58, 6, stroke=0, fill=1)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 9)
        c.drawCentredString(84, h - 153, 'OVERALL RISK')
        c.setFont('Helvetica-Bold', 20)
        c.drawCentredString(84, h - 178, self.rating)

        # Metadata grid
        meta = [
            ('PROJECT', self.project),
            ('DATE', self.date),
            ('GENERATED', self.generated),
        ]
        x = 165
        for label, val in meta:
            c.setFillColor(colors.HexColor('#94A3B8'))
            c.setFont('Helvetica', 7)
            c.drawString(x, h - 153, label)
            c.setFillColor(WHITE)
            c.setFont('Helvetica-Bold', 10)
            c.drawString(x, h - 168, val[:32])
            x += 155

        # Footer band
        c.setFillColor(colors.HexColor('#071428'))
        c.rect(0, 0, w, 32, stroke=0, fill=1)
        c.setFillColor(colors.HexColor('#475569'))
        c.setFont('Helvetica', 7)
        c.drawString(24, 11, 'ThreatVision AI  ·  Powered by Claude Sonnet')
        c.drawRightString(w - 24, 11, 'For authorized recipients only  ·  Do not distribute')


class PageHeaderFooter:
    """Draws consistent headers and footers on every page."""
    def __init__(self, project_name: str, report_date: str):
        self.project = project_name
        self.date    = report_date
        self._page   = 0

    def __call__(self, canvas, doc):
        canvas.saveState()
        w = PAGE_W
        m = MARGIN

        # ── Header ──────────────────────────────────────────────────────────
        # Navy stripe
        canvas.setFillColor(NAVY)
        canvas.rect(0, PAGE_H - 36, w, 36, stroke=0, fill=1)

        # Left: logo text
        canvas.setFillColor(WHITE)
        canvas.setFont('Helvetica-Bold', 8)
        canvas.drawString(m, PAGE_H - 22, 'THREATARC  ·  THREAT ASSESSMENT REPORT')

        # Center: project
        canvas.setFillColor(colors.HexColor('#93C5FD'))
        canvas.setFont('Helvetica', 8)
        canvas.drawCentredString(w / 2, PAGE_H - 22, self.project)

        # Right: CONFIDENTIAL
        canvas.setFillColor(colors.HexColor('#EF4444'))
        canvas.roundRect(w - m - 80, PAGE_H - 29, 80, 16, 3, stroke=0, fill=1)
        canvas.setFillColor(WHITE)
        canvas.setFont('Helvetica-Bold', 7)
        canvas.drawCentredString(w - m - 40, PAGE_H - 23, 'CONFIDENTIAL')

        # ── Footer ──────────────────────────────────────────────────────────
        canvas.setStrokeColor(BORDER)
        canvas.setLineWidth(0.5)
        canvas.line(m, 36, w - m, 36)

        canvas.setFillColor(SLATE)
        canvas.setFont('Helvetica', 7)
        canvas.drawString(m, 22, f'Generated {self.date}  ·  ThreatVision AI')
        canvas.drawCentredString(w / 2, 22, 'CONFIDENTIAL — For Authorized Recipients Only')
        canvas.setFont('Helvetica-Bold', 8)
        canvas.drawRightString(w - m, 22, f'Page {doc.page}')

        canvas.restoreState()


# ── Table helper ─────────────────────────────────────────────────────────────

def _inline_md(text: str) -> str:
    """Convert basic markdown inline formatting to ReportLab XML."""
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', str(text))
    text = re.sub(r'\*(.+?)\*',     r'<i>\1</i>', text)
    text = re.sub(r'`(.+?)`', r'<font face="Courier" size="7">\1</font>', text)
    text = re.sub(r'[^\x00-\x7F]', '', text)   # strip non-ASCII (emojis)

    for sev, hex_col in [('CRITICAL','#DC2626'),('HIGH','#EA580C'),
                         ('MEDIUM','#D97706'),('LOW','#16A34A'),
                         ('P0','#DC2626'),('P1','#EA580C'),('P2','#D97706')]:
        text = re.sub(
            rf'\b({sev})\b',
            f'<font color="{hex_col}"><b>\\1</b></font>',
            text
        )
    return text


def create_professional_table(table_data: list) -> Table | None:
    """Build a polished ReportLab table from a list-of-rows."""
    if not table_data or not table_data[0]:
        return None

    styles = getSampleStyleSheet()

    hdr_style = ParagraphStyle(
        'TblHdr', parent=styles['Normal'],
        fontSize=7, fontName='Helvetica-Bold',
        alignment=TA_CENTER, textColor=WHITE,
        leading=9, spaceAfter=0, spaceBefore=0,
    )
    cell_style = ParagraphStyle(
        'TblCell', parent=styles['Normal'],
        fontSize=7.5, fontName='Helvetica',
        alignment=TA_LEFT, textColor=colors.HexColor('#1E293B'),
        leading=10, spaceAfter=0, spaceBefore=0,
    )

    cleaned = []
    for r_idx, row in enumerate(table_data):
        cleaned_row = []
        for cell in row:
            text = _inline_md(cell)
            style = hdr_style if r_idx == 0 else cell_style
            cleaned_row.append(Paragraph(text, style))
        cleaned.append(cleaned_row)

    num_cols = len(cleaned[0])
    if num_cols == 0:
        return None

    # Column widths: give first col slightly more room
    if num_cols == 1:
        col_w = [CONTENT_W]
    elif num_cols <= 3:
        col_w = [CONTENT_W / num_cols] * num_cols
    else:
        first = 1.4 * inch
        rest  = (CONTENT_W - first) / (num_cols - 1)
        col_w = [first] + [rest] * (num_cols - 1)

    tbl = Table(cleaned, colWidths=col_w, repeatRows=1)
    tbl.setStyle(TableStyle([
        # Header
        ('BACKGROUND',    (0,0), (-1,0), NAVY),
        ('TEXTCOLOR',     (0,0), (-1,0), WHITE),
        ('FONTNAME',      (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE',      (0,0), (-1,0), 8),
        ('TOPPADDING',    (0,0), (-1,0), 7),
        ('BOTTOMPADDING', (0,0), (-1,0), 7),
        ('ALIGN',         (0,0), (-1,0), 'CENTER'),
        # Body
        ('BACKGROUND',    (0,1), (-1,-1), WHITE),
        ('ROWBACKGROUNDS',(0,1), (-1,-1), [WHITE, colors.HexColor('#F8FAFC')]),
        ('FONTNAME',      (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE',      (0,1), (-1,-1), 7.5),
        ('TOPPADDING',    (0,1), (-1,-1), 5),
        ('BOTTOMPADDING', (0,1), (-1,-1), 5),
        ('LEFTPADDING',   (0,0), (-1,-1), 8),
        ('RIGHTPADDING',  (0,0), (-1,-1), 8),
        ('VALIGN',        (0,0), (-1,-1), 'TOP'),
        # Borders
        ('LINEBELOW',     (0,0), (-1,0),  0.8, NAVY),
        ('LINEBELOW',     (0,1), (-1,-2), 0.3, BORDER),
        ('BOX',           (0,0), (-1,-1), 0.8, colors.HexColor('#CBD5E1')),
        ('ROUNDEDCORNERS',(0,0), (-1,-1), [4,4,4,4]),
    ]))
    return tbl


# ── Style factory ─────────────────────────────────────────────────────────────

def _make_styles():
    base = getSampleStyleSheet()

    def ps(name, **kw):
        return ParagraphStyle(name, parent=base['Normal'], **kw)

    return {
        'cover_legal': ps('CoverLegal',
            fontSize=8, textColor=colors.HexColor('#94A3B8'),
            alignment=TA_CENTER, spaceAfter=4,
        ),
        'h1': ps('H1Pro',
            fontSize=16, fontName='Helvetica-Bold',
            textColor=NAVY, spaceBefore=22, spaceAfter=6,
            borderPad=0,
        ),
        'h2': ps('H2Pro',
            fontSize=12, fontName='Helvetica-Bold',
            textColor=BLUE, spaceBefore=14, spaceAfter=5,
        ),
        'h3': ps('H3Pro',
            fontSize=10, fontName='Helvetica-Bold',
            textColor=colors.HexColor('#1E40AF'),
            spaceBefore=10, spaceAfter=4,
        ),
        'body': ps('BodyPro',
            fontSize=9, leading=13.5, fontName='Helvetica',
            textColor=colors.HexColor('#1E293B'),
            alignment=TA_JUSTIFY, spaceAfter=5,
        ),
        'bullet': ps('BulletPro',
            fontSize=9, leading=13, fontName='Helvetica',
            textColor=colors.HexColor('#1E293B'),
            leftIndent=14, spaceAfter=3,
            bulletIndent=4,
        ),
        'mono': ps('MonoPro',
            fontSize=8, leading=11, fontName='Courier',
            textColor=colors.HexColor('#334155'),
            backColor=colors.HexColor('#F8FAFC'),
            borderColor=BORDER, borderWidth=0.5, borderPad=6,
            spaceAfter=6,
        ),
        'caption': ps('CaptionPro',
            fontSize=7.5, fontName='Helvetica',
            textColor=SLATE_LIGHT, spaceAfter=4,
        ),
        'section_num': ps('SectionNum',
            fontSize=8, fontName='Helvetica-Bold',
            textColor=BLUE, spaceAfter=0, spaceBefore=0,
        ),
    }


# ── Main generator ────────────────────────────────────────────────────────────

def generate_pdf(report_content: str, project_name: str,
                 framework: str = 'MITRE ATT&CK') -> bytes:
    """
    Generate a professional, CISO-grade PDF from markdown report content.
    Returns raw PDF bytes.
    """
    buffer = io.BytesIO()
    now    = datetime.now()
    date_str = now.strftime('%B %d, %Y')
    ts_str   = now.strftime('%B %d, %Y  %I:%M %p UTC')

    # Page callback (header + footer)
    hf = PageHeaderFooter(project_name, ts_str)

    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        topMargin=MARGIN + 36,   # extra for header band
        bottomMargin=MARGIN + 24,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        title=f'Threat Assessment Report — {project_name}',
        author='ThreatVision AI',
        subject='Confidential Security Assessment',
    )

    styles = _make_styles()
    story  = []

    # ── Cover Page ──────────────────────────────────────────────────────────
    # Detect overall risk rating from content
    rating = 'HIGH'
    for sev in ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW'):
        if f'OVERALL RISK RATING: {sev}' in report_content.upper() or \
           f'overall_risk_rating.*{sev}' in report_content.lower():
            rating = sev
            break

    story.append(Spacer(1, 0.3 * inch))
    story.append(CoverBand(
        title     = 'Threat Assessment Report',
        subtitle  = f'{project_name}  ·  {framework}',
        rating    = rating,
        project   = project_name,
        date      = date_str,
        generated = ts_str,
    ))
    story.append(Spacer(1, 0.3 * inch))

    # Disclaimer box
    disclaimer_data = [[
        Paragraph(
            '<b>CONFIDENTIAL — AUTHORIZED USE ONLY.</b>  This report contains '
            'sensitive security information generated by ThreatVision AI. '
            'Distribution is restricted to named recipients only. '
            'Do not reproduce or forward without written authorization.',
            ParagraphStyle('Disc', parent=styles['body'],
                           fontSize=8, textColor=SLATE,
                           alignment=TA_JUSTIFY)
        )
    ]]
    disc_tbl = Table(disclaimer_data, colWidths=[CONTENT_W])
    disc_tbl.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX',           (0,0), (-1,-1), 0.8, BORDER),
        ('LINEAFTER',     (0,0), (0,-1),  3,   NAVY),
        ('TOPPADDING',    (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING',   (0,0), (-1,-1), 14),
        ('RIGHTPADDING',  (0,0), (-1,-1), 14),
    ]))
    story.append(disc_tbl)
    story.append(PageBreak())

    # ── Parse & render report content ───────────────────────────────────────
    lines        = report_content.split('\n')
    tbl_rows     = []
    in_table     = False
    in_code      = False
    code_lines   = []
    heading_buf  = []   # pending H1/H2 items kept with next content

    def flush_heading(extra=None):
        """Push buffered heading + optional first-content into story via KeepTogether."""
        nonlocal heading_buf
        if not heading_buf:
            if extra is not None:
                story.append(extra)
            return
        group = heading_buf + ([extra] if extra is not None else [])
        story.append(KeepTogether(group))
        heading_buf = []

    def flush_table():
        nonlocal tbl_rows, in_table
        if tbl_rows:
            t = create_professional_table(tbl_rows)
            if t:
                flush_heading(t)
                story.append(Spacer(1, 0.1 * inch))
            else:
                flush_heading()
        else:
            flush_heading()
        tbl_rows = []
        in_table = False

    def flush_code():
        nonlocal code_lines, in_code
        if code_lines:
            text = '\n'.join(code_lines)
            text = re.sub(r'[^\x00-\x7F]', '', text)
            story.append(Paragraph(text.replace('\n', '<br/>'), styles['mono']))
        code_lines = []
        in_code = False

    i = 0
    while i < len(lines):
        raw  = lines[i]
        line = raw.strip()
        i   += 1

        # Code fences
        if line.startswith('```'):
            if in_code:
                flush_code()
            else:
                flush_table()
                in_code = True
            continue
        if in_code:
            code_lines.append(re.sub(r'[^\x00-\x7F]', '', raw))
            continue

        # Table separator rows
        if re.match(r'^[\|\s\-:]+$', line) and '|' in line:
            continue

        # Empty line
        if not line:
            flush_table()
            story.append(Spacer(1, 0.08 * inch))
            continue

        # H1 — buffer with divider so it stays with following content
        if re.match(r'^# [^#]', line):
            flush_table()
            text = re.sub(r'^# ', '', line)
            text = re.sub(r'[^\x00-\x7F]', '', text).strip()
            heading_buf = [SectionDivider(color=NAVY), Spacer(1, 0.05 * inch), Paragraph(text, styles['h1'])]
            continue

        # H2 — buffer so heading never orphans from its table/paragraph
        if re.match(r'^## [^#]', line):
            flush_table()
            text = re.sub(r'^## ', '', line)
            text = re.sub(r'[^\x00-\x7F]', '', text).strip()
            heading_buf = [Paragraph(text, styles['h2']), SectionDivider(color=BLUE, height=0.5)]
            continue

        # H3
        if re.match(r'^### ', line):
            flush_table()
            text = re.sub(r'^### ', '', line)
            text = re.sub(r'[^\x00-\x7F]', '', text).strip()
            story.append(Paragraph(text, styles['h3']))
            continue

        # Table rows
        if '|' in line and line.count('|') >= 2:
            cells = [c.strip() for c in line.split('|') if c.strip()]
            if cells:
                in_table = True
                tbl_rows.append(cells)
                # Chunk very long tables
                if len(tbl_rows) > 20 and len(tbl_rows) % 20 == 0:
                    header = tbl_rows[0]
                    flush_table()
                    tbl_rows = [header]
            continue

        # Bullet / numbered list
        if re.match(r'^[\-\*\+] ', line) or re.match(r'^\d+\. ', line):
            flush_table()
            text = re.sub(r'^[\-\*\+] ', '', line)
            text = re.sub(r'^\d+\. ', '', text)
            text = _inline_md(text)
            flush_heading(Paragraph(f'\u2022  {text}', styles['bullet']))
            continue

        # Regular paragraph
        flush_table()
        text = _inline_md(line)
        flush_heading(Paragraph(text, styles['body']))

    # Flush remainders
    flush_table()
    flush_heading()
    flush_code()

    # ── Build PDF ────────────────────────────────────────────────────────────
    doc.build(story, onFirstPage=hf, onLaterPages=hf)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
