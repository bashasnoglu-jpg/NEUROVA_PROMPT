from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem

sections = [
    (
        "1) Sales Flow",
        [
            "Goal: Need → Suggestion → Close (reservation).",
            "60-second questions (goal, guests, duration, date/time).",
            "Two options only: Ideal and Alternative.",
            'Closing line: "I can reserve ... for you. Shall we confirm it?"',
        ],
        "Mini hold + scheduled follow-up if guest asks to think.",
    ),
    (
        "2) Sales Script (TR)",
        [
            'Opening: "Hoş geldiniz. Sizin için en uygun ritüeli seçmem için 3 kısa soru sorayım."',
            'Needs: "İlk öncelik, süre tercihiniz 60 mı 90 mı, koku hassasiyetiniz var mı?"',
            "Suggestion: 'En uygun [Paket A] (… dk). Alternatif: [Paket B] (… dk).'",
            'Closing: "Bugün ... veya ... uygunum. Hangisini ayıralım?"',
            "Up-sell: 'Hot Stone / Aroma / Head add-on ile etkiyi yükseltebiliriz.'",
        ],
        None,
    ),
    (
        "3) Product + Package Rules",
        [
            "Basic: single treatment (60 min).",
            "Value: combo (Hammam + Massage / Recovery set).",
            "Premium: Signature / Couple / Prestige + upgrade.",
        ],
        "For undecided guests, value package closes easier.",
    ),
    (
        "4) Follow-up System",
        [
            "Tag each interaction: Lead source, intention, status, reason not booked.",
            "Hold → text within 2 hours; same-day evening reminder; next day alternative time.",
            "Always note why the guest hesitated (price/time/partner/hesitation).",
        ],
        None,
    ),
    (
        "5) KPIs",
        [
            "Daily lead count",
            "Conversion to booking %",
            "Average cart (single/combo/premium)",
            "Upgrade rate (Hot Stone etc.)",
            "No-show/cancel rate",
        ],
        None,
    ),
    (
        "6) Request Library Use",
        [
            "Show guest exactly 2 visuals/options (no overload).",
            'WhatsApp template: "Package name + 2 sentences + visual".',
            "Language auto-select via TR/EN filter.",
        ],
        None,
    ),
]


def make_pdf(path):
    doc = SimpleDocTemplate(
        path,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "Title", parent=styles["Title"], alignment=1, fontSize=20, spaceAfter=12
    )
    header_style = ParagraphStyle(
        "Header", parent=styles["Heading2"], fontSize=14, spaceAfter=6, leading=16
    )
    normal = ParagraphStyle("Normal", parent=styles["BodyText"], fontSize=11, leading=14)
    footer = ParagraphStyle("Footer", parent=styles["Normal"], fontSize=9, alignment=1)

    story = [
        Paragraph("NEUROVA İstek Kütüphanesi • Reception Sales Playbook v1.0", title_style),
        Spacer(1, 6),
    ]

    for heading, bullets, note in sections:
        story.append(Paragraph(heading, header_style))
        list_items = [
            ListItem(Paragraph(item, normal), leftIndent=12, bulletColor="#0a7a2f")
            for item in bullets
        ]
        story.append(ListFlowable(list_items, bulletType="1", start="1", leftIndent=6))
        if note:
            story.append(Spacer(1, 4))
            story.append(Paragraph(note, ParagraphStyle("Note", parent=styles["Italic"], fontSize=10)))
        story.append(Spacer(1, 6))
    story.append(Spacer(1, 10))
    story.append(
        Paragraph(
            "Operational model: One script, one flow, one tracking system.",
            footer,
        )
    )
    doc.build(story)


if __name__ == "__main__":
    make_pdf("printed-guides/reception-sales-playbook-v1.pdf")
