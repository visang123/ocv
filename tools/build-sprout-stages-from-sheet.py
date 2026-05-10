"""
Split a 3-across sprout reference sheet into stage1/2/3 PNGs, key black/dark to transparent,
upscale for in-game clarity, then save to ../이미지/
"""
from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow required: pip install Pillow", file=sys.stderr)
    sys.exit(1)


def black_to_transparent(im: Image.Image, thr: int = 32, edge: int = 78) -> Image.Image:
    """Near-black → transparent; slightly wider edge blend to remove leftover matte."""
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            m = max(r, g, b)
            if m <= thr:
                px[x, y] = (r, g, b, 0)
            elif m < edge:
                factor = (m - thr) / max(1, edge - thr)
                px[x, y] = (r, g, b, int(round(a * factor)))
    return im


def trim_alpha_bbox(im: Image.Image, pad: int = 2) -> Image.Image:
    im = im.convert("RGBA")
    bbox = im.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


def split_three_columns(im: Image.Image) -> list[Image.Image]:
    w, h = im.size
    col_w = w // 3
    out = []
    for i in range(3):
        x0 = i * col_w
        x1 = w if i == 2 else (i + 1) * col_w
        out.append(im.crop((x0, 0, x1, h)))
    return out


def crop_horizontal_center_fraction(im: Image.Image, frac: float = 0.82) -> Image.Image:
    w, h = im.size
    margin = (1.0 - frac) / 2.0
    x0 = int(round(w * margin))
    x1 = int(round(w * (1.0 - margin)))
    return im.crop((x0, 0, x1, h))


def upscale_if_small(im: Image.Image, min_short_edge: int = 420) -> Image.Image:
    w, h = im.size
    short = min(w, h)
    if short >= min_short_edge:
        return im
    scale = min_short_edge / float(short)
    nw = max(1, int(round(w * scale)))
    nh = max(1, int(round(h * scale)))
    return im.resize((nw, nh), Image.Resampling.LANCZOS)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    src = root / "assets" / "sprout-growth-sheet.png"
    if not src.is_file():
        legacy = Path(
            r"C:\Users\USER\.cursor\projects\c-Users-USER-Desktop-OVC\assets\c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_5051453ebec3272e55d6a08d292c16f6_images_image-a5547477-4544-4109-b462-62e6ca07fd5d.png"
        )
        if legacy.is_file():
            src = legacy
        else:
            print("Source sheet not found. Place sheet at:", root / "assets" / "sprout-growth-sheet.png", file=sys.stderr)
            sys.exit(1)

    out_dir = root / "이미지"
    out_dir.mkdir(parents=True, exist_ok=True)

    sheet = Image.open(src).convert("RGBA")
    cols = split_three_columns(sheet)
    names = ["sprout-stage1.png", "sprout-stage2.png", "sprout-stage3.png"]
    for name, col in zip(names, cols, strict=True):
        col = crop_horizontal_center_fraction(col, 0.82)
        keyed = black_to_transparent(col)
        trimmed = trim_alpha_bbox(keyed)
        scaled = upscale_if_small(trimmed)
        dest = out_dir / name
        scaled.save(dest, "PNG", optimize=True)
        print("Wrote", dest, scaled.size)


if __name__ == "__main__":
    main()
