"""Make near-black sheet backgrounds transparent on inventory PNG icons."""

from collections import deque
from PIL import Image
import os

DST_DIR = os.path.join(os.path.dirname(__file__), "..", "이미지")

FILES = [
    "craft-desk-inv.png",
    "craft-fence-inv.png",
    "craft-chair-inv.png",
    "craft-house-inv.png",
    "magic-powder-yellow-inv.png",
    "magic-powder-white-inv.png",
    "magic-powder-brown-inv.png",
    "magic-powder-mixed-inv.png",
]

THRESHOLD = 32


def is_background_pixel(r, g, b, a):
    if a < 8:
        return True
    return r <= THRESHOLD and g <= THRESHOLD and b <= THRESHOLD


def flood_clear_background(im):
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)

    def idx(x, y):
        return y * w + x

    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_background_pixel(*px[x, y]) and not seen[idx(x, y)]:
                seen[idx(x, y)] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_background_pixel(*px[x, y]) and not seen[idx(x, y)]:
                seen[idx(x, y)] = 1
                q.append((x, y))

    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            i = idx(nx, ny)
            if seen[i]:
                continue
            if not is_background_pixel(*px[nx, ny]):
                continue
            seen[i] = 1
            q.append((nx, ny))
    return im


def main():
    for filename in FILES:
        path = os.path.join(DST_DIR, filename)
        if not os.path.isfile(path):
            print("skip (missing)", path)
            continue
        im = Image.open(path)
        out = flood_clear_background(im)
        out.save(path)
        print("wrote", path)


if __name__ == "__main__":
    main()
