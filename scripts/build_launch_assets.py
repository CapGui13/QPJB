"""Génère les visuels de lancement iOS et les icônes Android depuis l'icône QPJB vérifiée."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "launch"
OUT.mkdir(exist_ok=True)
BG = (192, 168, 220)
source = Image.open(ROOT / "apple-touch-icon-qpjb.png").convert("RGB")

def save_screen(width, height):
    screen = Image.new("RGB", (width, height), BG)
    size = round(min(width * .54, height * .36, 380))
    icon = source.resize((size, size), Image.Resampling.LANCZOS)
    screen.paste(icon, ((width - size) // 2, (height - size) // 2))
    screen.save(OUT / f"ios-{width}x{height}.png", optimize=True)

# Résolutions portrait physiques : iPhone 6/7/8, SE, Plus, X/XS/11,
# 12-16, Pro et Max ; inclut des modèles récents à écran plus grand.
for size in [
    (640,1136), (750,1334), (828,1792), (1080,1920),
    (1125,2436), (1170,2532), (1179,2556), (1206,2622),
    (1242,2208), (1242,2688), (1260,2736), (1284,2778),
    (1290,2796), (1320,2868), (1320,2870), (1320,2960),
]:
    save_screen(*size)

for n in (192, 512):
    source.resize((n,n), Image.Resampling.LANCZOS).save(
        OUT / f"icon-{n}.png", optimize=True)
print(f"Generated {len(list(OUT.glob('*.png')))} QPJB images")
