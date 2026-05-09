"""Remove dark sheet backdrop from grass-stage4/5 PNGs (edge flood-fill)."""
from PIL import Image

ROOT = r"c:\Users\USER\Desktop\OVC\이미지"
FILES = ["grass-stage4-front.png", "grass-stage5-front.png"]
REF_TOL = 52


def strip_backdrop(path: str) -> None:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    br, bg_, bb = im.getpixel((0, 0))[:3]
    px = im.load()

    def like_bg(r: int, g: int, b: int) -> bool:
        if g > 72:
            return False
        if r + g + b > 175:
            return False
        return abs(r - br) + abs(g - bg_) + abs(b - bb) <= REF_TOL

    visited = bytearray(w * h)
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

    im.save(path, optimize=True)
    print("updated", path)


def main() -> None:
    for name in FILES:
        strip_backdrop(f"{ROOT}\\{name}")


if __name__ == "__main__":
    main()
