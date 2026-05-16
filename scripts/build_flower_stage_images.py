"""
참고 시트(가로 2열: 4단·5단 꽃)를 잘라 배경을 제거해
이미지/flower-stage4-front.png, 이미지/flower-stage5-front.png 로 저장.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(
    r"C:\Users\USER\.cursor\projects\c-Users-USER-Desktop-OVC\assets"
    r"\c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_5051453ebec3272e55d6a08d292c16f6_images_image-b0f53da4-b81f-4cc3-ad1d-fec897bb4c2c.png"
)
OUT_DIR = ROOT / "이미지"
TOP_TRIM_RATIO = 0.12
COL_MARGIN = 6
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


def strip_backdrop(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    br, bg_, bb = sample_edge_backdrop_rgb(im, w, h)
    px = im.load()

    def like_bg(r: int, g: int, b: int) -> bool:
        if g > 72:
            return False
        if r + g + b > 175:
            return False
        return abs(r - br) + abs(g - bg_) + abs(b - bb) <= REF_TOL

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


def main() -> None:
    if not SRC.is_file():
        raise SystemExit("missing source image: " + str(SRC))
    im = Image.open(SRC).convert("RGBA")
    w, h = im.size
    col_w = w // 2
    trim_y = int(h * TOP_TRIM_RATIO)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for col, name in [(0, "flower-stage4-front"), (1, "flower-stage5-front")]:
        x0 = col * col_w + COL_MARGIN
        x1 = (col + 1) * col_w - COL_MARGIN
        crop = im.crop((x0, trim_y, x1, h))
        out = strip_backdrop(crop)
        path = OUT_DIR / f"{name}.png"
        out.save(path, optimize=True)
        print("wrote", path, out.size)


if __name__ == "__main__":
    main()
