"""Slide "Dúvidas sobre CI" com QR code, no visual do CI Awards 2026 (verde-noite, dourado, Barlow Condensed, logo CI200 branco).

  python3 scripts/slide_duvidas.py "https://forms.office.com/r/XXXXXXX"
  python3 scripts/slide_duvidas.py            # sem link: gera a prévia com o espaço do QR marcado

Saída: out/slide-duvidas-ci.png (1920x1080) e out/slide-duvidas-ci.pptx (16:9, um slide).
"""
import base64
import io
import os
import random
import subprocess
import sys

import qrcode
from qrcode.constants import ERROR_CORRECT_H
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "out")
os.makedirs(OUT, exist_ok=True)
url = sys.argv[1].strip() if len(sys.argv) > 1 else ""


def b64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()


def qr_png(data: str) -> str:
    q = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=20, border=1)
    q.add_data(data)
    q.make(fit=True)
    img = q.make_image(fill_color="#0b2414", back_color="white").convert("RGBA")
    # selo com o ícone CI200 no centro (correção H aguenta ~30% de área coberta; usamos ~6%)
    w, h = img.size
    s = int(w * 0.24)
    badge = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(badge)
    d.rounded_rectangle((0, 0, s - 1, s - 1), radius=int(s * 0.22), fill="#0b2414", outline="white", width=max(4, s // 22))
    icon = Image.open(os.path.join(ROOT, "public/v10/ci200-icone.png")).convert("RGBA")
    iw = int(s * 0.74)
    icon = icon.resize((iw, int(icon.height * iw / icon.width)), Image.LANCZOS)
    badge.alpha_composite(icon, ((s - icon.width) // 2, (s - icon.height) // 2))
    img.alpha_composite(badge, ((w - s) // 2, (h - s) // 2))
    buf = io.BytesIO()
    img.save(buf, "PNG")
    return base64.b64encode(buf.getvalue()).decode()


random.seed(7)
dust = "".join(
    f'<i style="left:{random.uniform(0, 1920):.0f}px;top:{random.uniform(0, 1080):.0f}px;width:{(s := random.uniform(2, 6)):.1f}px;height:{s:.1f}px;opacity:{random.uniform(.12, .45):.2f}"></i>'
    for _ in range(70)
)
qr = (
    f'<img class="qr" src="data:image/png;base64,{qr_png(url)}" alt="">'
    if url
    else '<div class="qr ph">QR CODE<br><small>gerado com o link do formulário</small></div>'
)
short = url.replace("https://", "").replace("http://", "")
if len(short) > 46:
    short = short[:44] + "…"
fonts = lambda f: "file://" + os.path.join(ROOT, "public/fonts", f)

html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: Barlow; src: url({fonts("BarlowCondensed-800-normal.woff2")}); font-weight: 800; }}
@font-face {{ font-family: Barlow; src: url({fonts("BarlowCondensed-700-normal.woff2")}); font-weight: 700; }}
@font-face {{ font-family: Inter; src: url({fonts("Inter-var.woff2")}); font-weight: 100 900; }}
* {{ box-sizing: border-box; margin: 0; }}
body {{ width: 1920px; height: 1080px; overflow: hidden; background: #050b07; font-family: Inter, sans-serif; color: #ede8d8; position: relative; }}
.glow {{ position: absolute; inset: 0; background: radial-gradient(ellipse 55% 70% at 28% 55%, rgba(47,107,42,.42), transparent 70%), radial-gradient(ellipse 30% 40% at 76% 50%, rgba(240,207,99,.14), transparent 70%); }}
.lam {{ position: absolute; top: -100px; bottom: -100px; width: 220px; transform: skewX(-14deg); background: linear-gradient(180deg, rgba(20,48,26,.0), rgba(20,48,26,.55), rgba(20,48,26,0)); border-left: 2px solid rgba(240,207,99,.12); }}
.dust i {{ position: absolute; border-radius: 50%; background: #ffdc82; box-shadow: 0 0 8px rgba(255,210,110,.6); }}
.left {{ position: absolute; left: 150px; top: 150px; width: 1000px; display: flex; flex-direction: column; gap: 34px; }}
.eyebrow {{ display: flex; align-items: center; gap: 18px; font-size: 22px; font-weight: 600; letter-spacing: .34em; color: #d9c27a; }}
.eyebrow b {{ width: 70px; height: 2px; background: #f0cf63; }}
h1 {{ font-family: Barlow, sans-serif; font-weight: 800; font-size: 126px; line-height: .94; letter-spacing: .01em; text-transform: uppercase; background: linear-gradient(180deg, #fff6d0 0%, #f2cf63 48%, #c4942a 100%); -webkit-background-clip: text; color: transparent; filter: drop-shadow(0 8px 40px rgba(240,207,99,.25)); }}
p {{ font-size: 36px; line-height: 1.4; color: #e4dfcf; max-width: 900px; }}
p em {{ font-style: normal; color: #f0cf63; font-weight: 600; }}
.steps {{ display: flex; gap: 16px; margin-top: 6px; }}
.steps span {{ display: flex; align-items: center; gap: 14px; padding: 14px 24px; border: 1.5px solid rgba(240,207,99,.45); border-radius: 999px; font-size: 26px; font-weight: 500; color: #f3efe2; background: rgba(240,207,99,.06); }}
.steps b {{ font-family: Barlow, sans-serif; font-weight: 800; font-size: 30px; color: #050b07; background: #f0cf63; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; }}
.logo {{ position: absolute; left: 150px; bottom: 90px; display: flex; align-items: center; gap: 26px; }}
.logo img {{ height: 96px; filter: drop-shadow(0 0 14px rgba(255,255,255,.25)); }}
.logo div {{ font-size: 20px; letter-spacing: .3em; color: #a9b5a6; line-height: 1.6; }}
.card {{ position: absolute; right: 170px; top: 175px; width: 580px; display: flex; flex-direction: column; align-items: center; gap: 26px; }}
.frame {{ width: 580px; height: 580px; padding: 34px; border-radius: 40px; background: #ffffff; box-shadow: 0 0 0 6px #f0cf63, 0 0 80px rgba(240,207,99,.45), 0 40px 120px rgba(0,0,0,.6); }}
.qr {{ width: 100%; height: 100%; display: block; image-rendering: pixelated; }}
.ph {{ display: grid; place-content: center; text-align: center; border: 4px dashed #0b2414; border-radius: 16px; font-family: Barlow, sans-serif; font-weight: 800; font-size: 64px; color: #0b2414; line-height: 1; }}
.ph small {{ font-family: Inter, sans-serif; font-weight: 500; font-size: 22px; }}
.cta {{ font-family: Barlow, sans-serif; font-weight: 700; font-size: 44px; letter-spacing: .04em; text-transform: uppercase; color: #f3efe2; }}
.url {{ font-size: 22px; color: #a9b5a6; letter-spacing: .02em; }}
</style></head><body>
<div class="glow"></div>
<div class="lam" style="left:1180px"></div><div class="lam" style="left:1440px;opacity:.6"></div><div class="lam" style="left:1700px;opacity:.35"></div>
<div class="dust">{dust}</div>
<div class="left">
  <div class="eyebrow"><b></b>CI AWARDS 2026 · JOHN DEERE MONTENEGRO</div>
  <h1>Ficou com alguma<br>dúvida sobre CI?</h1>
  <p>Projetos, <em>A3</em>, <em>Ver e Agir</em>, o programa <em>CI200</em> ou como começar uma melhoria na sua área. Mande a sua pergunta: a gente responde.</p>
  <div class="steps"><span><b>1</b>Aponte a câmera</span><span><b>2</b>Escreva a dúvida</span><span><b>3</b>Envie</span></div>
</div>
<div class="logo"><img src="data:image/png;base64,{b64(os.path.join(ROOT, 'public/v10/ci200-branco.png'))}" alt=""><div>MELHORIA CONTÍNUA<br>É FEITA DE PESSOAS</div></div>
<div class="card">
  <div class="frame">{qr}</div>
  <div class="cta">Aponte a câmera do celular</div>
  {f'<div class="url">{short}</div>' if url else ''}
</div>
</body></html>"""

html_path = os.path.join(OUT, "slide-duvidas-ci.html")
png_path = os.path.join(OUT, "slide-duvidas-ci.png")
with open(html_path, "w") as f:
    f.write(html)

js = f"""const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage({{ viewport: {{ width: 1920, height: 1080 }} }});
await p.goto('file://{html_path}'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
await p.screenshot({{ path: '{png_path}' }}); await b.close(); }})();"""
subprocess.run(["node", "-e", js], check=True)

from pptx import Presentation
from pptx.util import Emu

prs = Presentation()
prs.slide_width, prs.slide_height = Emu(12192000), Emu(6858000)
slide = prs.slides.add_slide(prs.slide_layouts[6])
slide.shapes.add_picture(png_path, 0, 0, prs.slide_width, prs.slide_height)
if url:
    slide.notes_slide.notes_text_frame.text = f"Formulário de dúvidas sobre CI: {url}"
prs.save(os.path.join(OUT, "slide-duvidas-ci.pptx"))
os.remove(html_path)
print("ok", png_path, "com QR" if url else "sem link (prévia)")
