"""Edge-connected backdrop removal for sheet-cropped PNG sprites."""

from __future__ import annotations

from PIL import Image

REF_TOL = 52


def sample_edge_backdrop_rgb(im: Image.Image, w: int, h: int) -> tuple[int, int, int]:
    px = im.load()
    border: list[tuple[int, int]] = []
    for x in range(w):
        border.append((x, 0))
        border.append((x, h - 1))
    for y in range(h):
        border.append((0, y))
        border.append((w - 1, y))
    for x, y in border:
        r, g, b, a = px[x, y]
        if a < 40:
            continue
        if g > 80:
            continue
        if r + g + b > 200:
            continue
        if max(r, g, b) < 55 or (r + g + b) < 160:
            return (r, g, b)
    r, g, b, _a = px[0, 0]
    return (r, g, b)


def strip_backdrop(im: Image.Image, ref_tol: int = REF_TOL) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    br, bg_, bb = sample_edge_backdrop_rgb(im, w, h)
    px = im.load()

    def like_bg(r: int, g: int, b: int) -> bool:
        if g > 72:
            return False
        if r + g + b > 175:
            return False
        return abs(r - br) + abs(g - bg_) + abs(b - bb) <= ref_tol

    stack: list[tuple[int, int]] = []

    def push(x: int, y: int) -> None:
        if x < 0 or y < 0 or x >= w or y >= h:
            return
        r, g, b, a = px[x, y]
        if a == 0 or not like_bg(r, g, b):
            return
        stack.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    visited = bytearray(w * h)
    while stack:
        x, y = stack.pop()
        i = y * w + x
        if visited[i]:
            continue
        visited[i] = 1
        r, g, b, a = px[x, y]
        if a == 0 or not like_bg(r, g, b):
            continue
        px[x, y] = (r, g, b, 0)
        push(x + 1, y)
        push(x - 1, y)
        push(x, y + 1)
        push(x, y - 1)
    return im


def crop_centered(
    src: Image.Image, cx: int, cy: int, cell: int, *, strip: bool = True
) -> Image.Image:
    w, h = src.size
    half = cell // 2
    left = max(0, cx - half)
    top = max(0, cy - half)
    right = min(w, cx + half)
    bottom = min(h, cy + half)
    patch = src.crop((left, top, right, bottom))
    if strip:
        patch = strip_backdrop(patch)
    out = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
    paste_x = (cell - patch.width) // 2
    paste_y = (cell - patch.height) // 2
    out.paste(patch, (paste_x, paste_y), patch)
    return out
