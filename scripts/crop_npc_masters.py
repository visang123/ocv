"""Crop trade-master and alchemy-master from npc-concept-sheet (character only, no text)."""
from __future__ import annotations

import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "이미지")
SHEET = os.path.join(IMG, "npc-concept-sheet.png")

# Sheet coords: main illustration only (no bottom sprite row, no side text blocks).
CROPS = {
    "trade-master.png": (208, 18, 502, 348),
    "alchemy-master.png": (538, 22, 778, 348),
}


def remove_paper_background(im: Image.Image) -> Image.Image:
    out = im.convert("RGBA")
    px = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3
            spread = max(r, g, b) - min(r, g, b)
            if lum >= 248 and r >= 240 and g >= 240 and b >= 240:
                px[x, y] = (r, g, b, 0)
            elif lum >= 228 and spread <= 22 and r >= 210 and g >= 210 and b >= 210:
                px[x, y] = (r, g, b, 0)
    return out


def trim_alpha_bbox(im: Image.Image, pad: int = 2) -> Image.Image:
    alpha = im.split()[-1]
    bb = alpha.getbbox()
    if not bb:
        return im
    l, t, r, b = bb
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


def main() -> None:
    sheet = Image.open(SHEET).convert("RGBA")
    for filename, box in CROPS.items():
        cropped = sheet.crop(box)
        keyed = remove_paper_background(cropped)
        trimmed = trim_alpha_bbox(keyed, pad=3)
        out_path = os.path.join(IMG, filename)
        trimmed.save(out_path, "PNG", optimize=True)
        print("saved", out_path, "size", trimmed.size, "from box", box)


if __name__ == "__main__":
    main()
