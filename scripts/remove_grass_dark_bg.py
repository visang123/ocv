"""가장자리와 연결된 짙은 배경(검정·거의 검정)만 투명 처리 — 4·5단계 풀 PNG."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "이미지"
FILES = ["grass-stage4-front.png", "grass-stage5-front.png", "grass-stage45-sheet.png"]
REF_TOL = 52


def sample_edge_backdrop_rgb(im: Image.Image, w: int, h: int) -> tuple[int, int, int]:
    """모서리에서 '배경'으로 보이는 첫 픽셀 RGB (투명·밝은 잎 제외)."""
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


def strip_backdrop(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    br, bg_, bb = sample_edge_backdrop_rgb(im, w, h)
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

    out = str(path)
    im.save(out, optimize=True)
    print("updated", out)


def main() -> None:
    for name in FILES:
        strip_backdrop(ROOT / name)


if __name__ == "__main__":
    main()
