from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).parent
EXPORT_DIR = BASE / "exports" / "businesscards"
EXPORT_DIR.mkdir(parents=True, exist_ok=True)

CARD_MM = (96, 56)  # 90x50 + 3mm bleed с каждой стороны
DPI = 300
PX = (int(CARD_MM[0] / 25.4 * DPI), int(CARD_MM[1] / 25.4 * DPI))

PEOPLE = [
  {
    "slug": "kamil-ceo",
    "name": "Палачев Камиль",
    "title": "CEO | DagDev",
    "phone": "+7 (999) 000-01-01",
    "email": "kamil@dagdev.ru",
    "site": "dagdev.ru",
    "accent": ((45, 212, 255), (26, 72, 227)),
    "theme": "matte",
  },
  {
    "slug": "alik-cto",
    "name": "Алиханов Алик",
    "title": "CTO | DagDev",
    "phone": "+7 (999) 000-02-02",
    "email": "alik@dagdev.ru",
    "site": "dagdev.ru/cto",
    "accent": ((16, 185, 129), (168, 85, 247)),
    "theme": "neon",
  },
  {
    "slug": "shamil-cfo",
    "name": "Абдумеджидов Шамиль",
    "title": "CFO | DagDev",
    "phone": "+7 (999) 000-03-03",
    "email": "shamil@dagdev.ru",
    "site": "dagdev.ru/finance",
    "accent": ((14, 165, 233), (99, 102, 241)),
    "theme": "dark",
  },
]


def get_fonts():
  try:
    heading = ImageFont.truetype("arial.ttf", 86)
    text = ImageFont.truetype("arial.ttf", 48)
    small = ImageFont.truetype("arial.ttf", 40)
  except OSError:
    heading = text = small = ImageFont.load_default()
  return heading, text, small


def draw_card(person):
  heading, text_font, small_font = get_fonts()
  img = Image.new("RGB", PX, (5, 8, 18))
  draw = ImageDraw.Draw(img)

  grad_start, grad_end = person["accent"]
  for y in range(PX[1]):
    ratio = y / PX[1]
    r = int(grad_start[0] + (grad_end[0] - grad_start[0]) * ratio)
    g = int(grad_start[1] + (grad_end[1] - grad_start[1]) * ratio)
    b = int(grad_start[2] + (grad_end[2] - grad_start[2]) * ratio)
    draw.line([(0, y), (PX[0], y)], fill=(r, g, b))

  draw.rectangle([60, 60, PX[0] - 60, PX[1] - 60], outline=(255, 255, 255), width=4)
  draw.text((96, 110), "DagDev", fill=(5, 8, 18), font=heading)
  draw.text((96, 220), person["name"], fill="#04060f", font=text_font)
  draw.text((96, 290), person["title"], fill="#020617", font=small_font)
  draw.text((96, 370), person["phone"], fill="#020617", font=small_font)
  draw.text((96, 430), person["email"], fill="#020617", font=small_font)
  draw.text((96, 490), person["site"], fill="#020617", font=small_font)
  return img


def save_svg(person):
  svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{PX[0]}" height="{PX[1]}" viewBox="0 0 {PX[0]} {PX[1]}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgb{person['accent'][0]}" />
      <stop offset="100%" stop-color="rgb{person['accent'][1]}" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="60" fill="url(#grad)" />
  <text x="120" y="140" font-family="Manrope,Inter,sans-serif" font-size="96" fill="#050812">DagDev</text>
  <text x="120" y="240" font-family="Manrope,Inter,sans-serif" font-size="72" fill="#050812">{person['name']}</text>
  <text x="120" y="300" font-size="48" fill="#0f172a">{person['title']}</text>
  <text x="120" y="370" font-size="42" fill="#0f172a">{person['phone']}</text>
  <text x="120" y="420" font-size="42" fill="#0f172a">{person['email']}</text>
  <text x="120" y="470" font-size="42" fill="#0f172a">{person['site']}</text>
</svg>"""
  (EXPORT_DIR / f"{person['slug']}.svg").write_text(svg, encoding="utf-8")


def main():
  for person in PEOPLE:
    img = draw_card(person)
    img_cmyk = img.convert("CMYK")
    png_path = EXPORT_DIR / f"{person['slug']}.png"
    web_png_path = EXPORT_DIR / f"{person['slug']}-web.png"
    pdf_path = EXPORT_DIR / f"{person['slug']}.pdf"

    img.save(png_path, dpi=(DPI, DPI))
    img.copy().resize((900, 525), Image.LANCZOS).save(web_png_path, dpi=(72, 72))
    img_cmyk.save(pdf_path, "PDF", resolution=DPI)
    save_svg(person)


if __name__ == "__main__":
  main()

