"""
참고 시트(상단 선인장·하단 나무, 각 3열)에서 4·5단만 잘라
이미지/cactus-stage4-front.png, cactus-stage5-front.png,
이미지/tree-stage4-front.png, tree-stage5-front.png 로 저장.

열 1·2(중·우)만 수동 bbox로 잘라 화살표·인접 스프라이트를 제외하고,
배경 투명화 후 발밑 중심으로 재정렬한다.
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
SRC = ASSETS / "tree-cactus-stage-sheet.png"
OUT_DIR = ROOT / "이미지"
PAD = 8

# (left, top, right, bottom) in source sheet pixels — excludes arrows and labels
MANUAL_CROPS: dict[str, tuple[int, int, int, int]] = {
    "cactus-stage4-front": (365, 95, 568, 338),
    "cactus-stage5-front": (688, 95, 962, 338),
    "tree-stage4-front": (365, 419, 568, 664),
    "tree-stage5-front": (688, 419, 962, 664),
}


def key_near_black(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0 and r + g + b < 28 and max(r, g, b) < 18:
                px[x, y] = (0, 0, 0, 0)
    return im


def remove_yellow_arrow(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0 and r > 170 and g > 130 and b < 100 and r + g + b > 300:
                px[x, y] = (0, 0, 0, 0)
    return im


def alpha_bbox(im: Image.Image, alpha_threshold: int = 12) -> tuple[int, int, int, int] | None:
    px = im.load()
    w, h = im.size
    l, t, r, b = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            if px[x, y][3] >= alpha_threshold:
                found = True
                l = min(l, x)
                t = min(t, y)
                r = max(r, x + 1)
                b = max(b, y + 1)
    if not found:
        return None
    return l, t, r, b


def trim_alpha(im: Image.Image, pad: int = 4) -> Image.Image:
    bb = alpha_bbox(im)
    if not bb:
        return im
    l, t, r, b = bb
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


def foot_center_x(im: Image.Image) -> float:
    px = im.load()
    w, h = im.size
    y0 = int(h * 0.76)
    sx = sa = 0.0
    for y in range(y0, h):
        for x in range(w):
            a = px[x, y][3]
            if a < 24:
                continue
            sx += x * a
            sa += a
    if sa <= 0:
        bb = alpha_bbox(im)
        if not bb:
            return w / 2
        return (bb[0] + bb[2]) / 2
    return sx / sa


def recenter_on_foot(im: Image.Image, pad: int = PAD) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    cx = foot_center_x(im)
    new_w = max(w, int(round(cx * 2)), int(round((w - cx) * 2))) + pad * 2
    out = Image.new("RGBA", (new_w, h + pad), (0, 0, 0, 0))
    paste_x = int(round(new_w / 2 - cx))
    out.paste(im, (paste_x, 0), im)
    return out


def compute_anchor(im: Image.Image) -> dict[str, float | int]:
    w, h = im.size
    bb = alpha_bbox(im)
    foot_y = bb[3] if bb else h
    return {
        "srcW": w,
        "srcH": h,
        "centerX": round(w / 2, 1),
        "footY": foot_y,
    }


def process_patch(patch: Image.Image) -> Image.Image:
    out = key_near_black(patch)
    out = remove_yellow_arrow(out)
    out = trim_alpha(out)
    return recenter_on_foot(out)


def main() -> None:
    if not SRC.is_file():
        raise SystemExit("missing source image: " + str(SRC))
    im = Image.open(SRC).convert("RGBA")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    anchors: dict[str, dict[str, dict[str, float | int]]] = {"cactus": {}, "tree": {}}
    for name, box in MANUAL_CROPS.items():
        out = process_patch(im.crop(box))
        path = OUT_DIR / f"{name}.png"
        out.save(path, optimize=True)
        kind = "tree" if name.startswith("tree") else "cactus"
        tier = 4 if "stage4" in name else 5
        anchor = compute_anchor(out)
        anchors[kind][tier] = anchor
        print("wrote", path, out.size, anchor)
    print("\nMATURE_SPRITE_ANCHORS patch (tree/cactus):")
    print(json.dumps(anchors, indent=2))


if __name__ == "__main__":
    main()
