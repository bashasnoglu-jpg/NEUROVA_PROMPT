from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1240, 1754  # roughly A4 at 150 DPI
BG_COLOR = (255, 253, 250)
TEXT_COLOR = (18, 18, 18)
ACCENT = (10, 122, 47)
FONT_PATH = "C:\\Windows\\Fonts\\Arial.ttf"

QR_ASSETS = [
    ("NEUROVA İstek Kütüphanesi", "printed-guides/prompt_library.png", "Prompt Library (Daily Use)"),
    ("Staff Guide (TR)", "printed-guides/staff_tr.png", "TR guide – günlük rutin"),
    ("Staff Guide (EN)", "printed-guides/staff_en.png", "EN guide – same workflow"),
    ("Reception Sales Playbook", "printed-guides/reception_playbook.png", "Reception sales plan"),
]


def create_mockup(output_path="printed-guides/qr-poster-mockup.png"):
    canvas = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(canvas)
    title_font = ImageFont.truetype(FONT_PATH, 48)
    heading_font = ImageFont.truetype(FONT_PATH, 28)
    body_font = ImageFont.truetype(FONT_PATH, 18)

    draw.text((WIDTH // 2, 60), "NEUROVA QR Pano • İstek Kütüphanesi", font=title_font, fill=TEXT_COLOR, anchor="mm")
    draw.line((140, 120, WIDTH - 140, 120), fill=ACCENT, width=4)

    y = 160
    card_w = (WIDTH - 260) // 2
    card_h = 260
    for i, (title, qr_path, sublabel) in enumerate(QR_ASSETS):
        x = 140 + (i % 2) * (card_w + 40)
        if i and i % 2 == 0:
            y += card_h + 40
        # card background
        draw.rectangle((x, y, x + card_w, y + card_h), fill=(255, 255, 255), outline=(220, 220, 220), width=1)
        draw.text((x + 12, y + 10), title, font=heading_font, fill=ACCENT)
        qr = Image.open(qr_path).convert("RGBA").resize((140, 140))
        canvas.paste(qr, (x + 20, y + 50), qr)
        draw.text((x + 180, y + 60), sublabel, font=body_font, fill=TEXT_COLOR)

    draw.text((WIDTH // 2, HEIGHT - 90), "QR’ları laminatla ve yanda önerilen alanlara as", font=body_font, fill=TEXT_COLOR, anchor="mm")
    draw.text((WIDTH // 2, HEIGHT - 60), "LAN IP: 192.168.1.20 → Firewall TCP 5500", font=body_font, fill=ACCENT, anchor="mm")
    canvas.save(output_path)


if __name__ == "__main__":
    create_mockup()
