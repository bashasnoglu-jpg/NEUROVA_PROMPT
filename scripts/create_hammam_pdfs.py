from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem

sections_tr = [
    ("Misafir İlişkisi", [
        "Teşekkür ederek ritüeli ve kullanılan malzemeyi hatırlat, kayda al.",
        "Olumluysa kısa 'görüşmek üzere' de; hassas nokta varsa yöneticiye bildir.",
        "Defekt varsa foto+kod (HAM_05) + kısa notu hızlıca kanalınızda paylaş."
    ]),
    ("Defekt & Hasar Bildirme", [
        "Çatlak/spill: önce güvenlik bariyeri, sonra fotoğrafla rapor, bakım talebi.",
        "Havuz/jakuzi alarmı varsa sistemi durdur, maintenance formu gir, alternatif oda hazırla.",
        "Su/is düzenleyici hatası olursa teknisyen çağır, kayıt tut, misafire alternatif sun."
    ]),
    ("Detaylı Temizlik Akışı", [
        "1. tur: Buhar camları, taş oturma, gözenekli yüzeyleri sırayla temizle.",
        "2. tur: Zeminlerdeki sıvıyı kurut, sertifikalı dezenfektanla sil.",
        "3. tur: Havuz kenarı, duş ve aksesuarları antiseptik solüsyonla geçir.",
        "4. tur: Hava arıtıcı, aroma difüzör, bitkisel malzemeleri yenile + çalkala.",
        "5. Her tur sonrası 'temizlik tamamlandı' etiketi yapıştır, notları gir."
    ]),
    ("Kaynaklar & Sürdürülebilirlik", [
        "Kimyasallar ve miktarları kaydedilsin, yanlış karışım olmasın.",
        "Kullanılan tekstiller kırmızı torba → çamaşırhane akışında.",
        "Lights/water kapandıktan sonra havalandır, misafir gelmeden kapıyı kapat."
    ])
]
sections_en = [
    ("Guest Interaction", [
        "Thank the guest and recap the ritual and ingredients used.",
        "If the guest is happy, say 'see you soon'; note any concerns and alert the manager.",
        "For defects, capture photo + code (HAM_05) + short note and send via WhatsApp/Slack."
    ]),
    ("Defect & Damage Reporting", [
        "Small cracks/spills: cordon the area, document with a photo, inform maintenance promptly.",
        "Pool/jacuzzi alerts: shut the system, log a maintenance request, and prepare an alternate room.",
        "Water/heating regulator fault: call the technician, log it, and offer a backup room."
    ]),
    ("Detailed Cleaning Rounds", [
        "Round 1: Clean the steam room glass, stone benches, textured walls, and rope doors.",
        "Round 2: Dry any liquids, then wipe the floor with certified disinfectant.",
        "Round 3: Sanitize pool edges, showers, towel trays, accessories with antiseptic.",
        "Round 4: Check the air purifier and aroma diffuser; refresh plants with fresh water.",
        "Round 5: Apply 'cleaning complete' tag and log notes in the digital form."
    ]),
    ("Resources & Sustainability", [
        "Record chemicals + amounts to avoid wrong mixtures.",
        "Put soiled textiles into red bags before sending to laundry.",
        "Ventilate after lights/water are off; keep doors closed until the next guest arrives."
    ])
]


def build_pdf(path, title, sections):
    doc = SimpleDocTemplate(
        path,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "TitleStyle", parent=styles["Title"], alignment=1, fontSize=20, spaceAfter=6
    )
    header_style = ParagraphStyle(
        "Header", parent=styles["Heading2"], fontSize=14, spaceAfter=4, underlineWidth=0
    )
    normal = ParagraphStyle("Normal", parent=styles["BodyText"], fontSize=11, leading=13)
    footer_style = ParagraphStyle(
        "Footer", parent=styles["Normal"], fontSize=9, alignment=1, textColor="#555555"
    )

    elements = [Paragraph(title, title_style), Spacer(1, 4)]
    for heading, items in sections:
        elements.append(Paragraph(heading, header_style))
        list_items = [ListItem(Paragraph(item, normal), leftIndent=12, bulletColor="#0a7a2f") for item in items]
        elements.append(ListFlowable(list_items, bulletType="1", start="1", leftIndent=6))
        elements.append(Spacer(1, 6))
    elements.append(Spacer(1, 10))
    elements.append(
        Paragraph(
            "Hammam Cleaning v1.0 | Run QA Tests weekly | SafeNote + checklist reminders.",
            footer_style,
        )
    )
    doc.build(elements)


build_pdf("hamam-cleaning-tr.pdf", "Hamam Ekibi – Kapanış & Temizlik", sections_tr)
build_pdf("hamam-cleaning-en.pdf", "Hammam Team – Closing & Cleaning Flow", sections_en)
