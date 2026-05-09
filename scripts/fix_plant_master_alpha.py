"""Remove light background from plant-master.png and trim to character bbox."""
from PIL import Image
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = os.path.join(ROOT, "이미지", "plant-master.png")


def main():
    im = Image.open(path).convert("RGBA")
    pixels = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            lum = (r + g + b) / 3
            spread = max(r, g, b) - min(r, g)
            # Near-white paper
            if lum >= 248 and r >= 240 and g >= 240 and b >= 240:
                pixels[x, y] = (r, g, b, 0)
            # Light uniform gray (scanner / JPEG background)
            elif lum >= 228 and spread <= 22 and r >= 210 and g >= 210 and b >= 210:
                pixels[x, y] = (r, g, b, 0)
    bb = im.getbbox()
    if bb:
        im = im.crop(bb)
    im.save(path, "PNG", optimize=True)
    print("saved", path, "size", im.size, "bbox was", bb)


if __name__ == "__main__":
    main()
