from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).parent
OUTPUT = BASE / "assets" / "images" / "og-dagdev.png"

WIDTH, HEIGHT = 1200, 630

img = Image.new("RGB", (WIDTH, HEIGHT), "#04060f")
draw = ImageDraw.Draw(img)

for y in range(HEIGHT):
  ratio = y / HEIGHT
  r = int(5 + 5 * ratio)
  g = int(8 + 9 * ratio)
  b = int(18 + 14 * ratio)
  draw.line([(0, y), (WIDTH, y)], fill=(r * 10, g * 10, b * 10))

draw.rectangle([180, 120, 1020, 510], fill=(5, 8, 18), outline=(45, 212, 255), width=6)

try:
  font = ImageFont.truetype("arial.ttf", 96)
  sub_font = ImageFont.truetype("arial.ttf", 56)
except OSError:
  font = ImageFont.load_default()
  sub_font = font

draw.text((220, 220), "DagDev — Dagestan Dev", font=font, fill=(45, 212, 255))
draw.text((220, 330), "DevOps • Инфраструктура • Дагестан", font=sub_font, fill=(168, 85, 247))

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUTPUT, dpi=(144, 144))

