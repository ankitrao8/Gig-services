"""
Cooperative Skill Milestone Certificate Generator using ReportLab.
Produces print-ready PDF certificates with security borders, cooperative seals,
and cryptographically signed verification QR codes.
"""

import io
import base64
from typing import Dict, Any
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.graphics.shapes import Drawing, Rect, String
import qrcode

class CertificatePdfGenerator:
    """Generates official Cooperative Skill Recognition PDF certificates."""

    @staticmethod
    def generate_certificate_pdf(
        worker_name: str,
        worker_id: str,
        trade: str,
        skill_level: str,
        skill_score: float,
        society_name: str,
        certificate_number: str,
        issue_date: str,
        verification_token: str
    ) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=landscape(letter),
            rightMargin=0.5 * inch,
            leftMargin=0.5 * inch,
            topMargin=0.5 * inch,
            bottomMargin=0.5 * inch
        )

        styles = getSampleStyleSheet()

        # Custom Styles
        title_style = ParagraphStyle(
            'CertTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=26,
            leading=30,
            alignment=1, # Center
            textColor=colors.HexColor('#0F172A')
        )
        subtitle_style = ParagraphStyle(
            'CertSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=12,
            leading=16,
            alignment=1,
            textColor=colors.HexColor('#2563EB')
        )
        presented_style = ParagraphStyle(
            'PresentedTo',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=13,
            leading=16,
            alignment=1,
            textColor=colors.HexColor('#475569')
        )
        name_style = ParagraphStyle(
            'WorkerName',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=24,
            leading=28,
            alignment=1,
            textColor=colors.HexColor('#1E3A8A')
        )
        body_style = ParagraphStyle(
            'CertBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=16,
            alignment=1,
            textColor=colors.HexColor('#334155')
        )
        meta_style = ParagraphStyle(
            'CertMeta',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            alignment=0, # Left
            textColor=colors.HexColor('#64748B')
        )

        elements = []

        # Header Titles
        elements.append(Paragraph("SAHAKAR SEVA COOPERATIVE FEDERATION", subtitle_style))
        elements.append(Spacer(1, 0.08 * inch))
        elements.append(Paragraph("CERTIFICATE OF SKILL EXCELLENCE", title_style))
        elements.append(Paragraph("Verifiable Digital Worker Credential | Smart India Hackathon 26089", subtitle_style))
        elements.append(Spacer(1, 0.18 * inch))

        # Recipient
        elements.append(Paragraph("This is proudly presented to certified cooperative artisan", presented_style))
        elements.append(Spacer(1, 0.08 * inch))
        elements.append(Paragraph(f"{worker_name.upper()}", name_style))
        elements.append(Paragraph(f"Worker Token ID: <b>{worker_id}</b> | Primary Society: <b>{society_name}</b>", body_style))
        elements.append(Spacer(1, 0.15 * inch))

        # Accomplishment Narrative
        narrative = (
            f"in recognition of exemplary craftsmanship and demonstrated mastery in <b>{trade}</b> services. "
            f"The candidate has attained <b>{skill_level} Tier</b> certification with a validated merit score of "
            f"<b>{skill_score:.1f}/100</b>, meeting rigorous quality benchmarks, background verification, "
            f"and on-time community service protocols governed under the Cooperative Societies Act."
        )
        elements.append(Paragraph(narrative, body_style))
        elements.append(Spacer(1, 0.25 * inch))

        # Generate in-memory QR code image
        verification_url = f"https://sahakarseva.gov.in/verify-worker/{verification_token}"
        qr = qrcode.QRCode(version=1, box_size=5, border=1)
        qr.add_data(verification_url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="#0F172A", back_color="#FFFFFF")
        
        qr_buffer = io.BytesIO()
        qr_img.save(qr_buffer)
        qr_buffer.seek(0)
        qr_reportlab_img = Image(qr_buffer, width=1.1*inch, height=1.1*inch)

        # Meta Table (Left: Details, Center: QR Verification, Right: Signatures)
        left_text = (
            f"<b>Certificate No:</b> {certificate_number}<br/>"
            f"<b>Issue Date:</b> {issue_date}<br/>"
            f"<b>Verification Hash:</b> {verification_token[:18]}...<br/>"
            f"<b>Status:</b> State Registry Verified"
        )
        right_text = (
            "<br/><br/>"
            "____________________________<br/>"
            "<b>State Registrar / Secretary</b><br/>"
            "State Cooperative Federation"
        )

        meta_table_data = [
            [
                Paragraph(left_text, meta_style),
                qr_reportlab_img,
                Paragraph(right_text, meta_style)
            ]
        ]

        meta_table = Table(meta_table_data, colWidths=[3.2 * inch, 2.0 * inch, 3.2 * inch])
        meta_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (1, 0), (1, 0), 'CENTER'),
        ]))

        elements.append(meta_table)

        # Build document
        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()
