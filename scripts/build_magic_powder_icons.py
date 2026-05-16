"""Crop magic powder inventory icons from the reference sheet (black bg -> transparent)."""

from PIL import Image
import os

SRC = (
    r"C:\Users\USER\.cursor\projects\c-Users-USER-Desktop-OVC\assets\\"
    r"c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"5051453ebec3272e55d6a08d292c16f6_images_image-"
    r"4143a4ed-70fc-4952-b4aa-a6c1f1dc5edf.png"
)
DST_DIR = os.path.join(os.path.dirname(__file__), "..", "이미지")

# Bottom-row inventory icon centers (mixed/grey, yellow, white, brown).
INV_ITEMS = [
    ("magic-powder-mixed-inv.png", 127, 619),
    ("magic-powder-yellow-inv.png", 383, 619),
    ("magic-powder-white-inv.png", 639, 619),
    ("magic-powder-brown-inv.png", 895, 619),
]

# Large jar sprites for HUD / legacy magic-powder-gray.png.
LARGE_ITEMS = [
    ("magic-powder-gray.png", 136, 263),
]

INV_CELL = 132
LARGE_CELL = 256
BG_THRESHOLD = 28


def remove_dark_background(img: Image.Image, threshold: int = BG_THRESHOLD) -> Image.Image:
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                px[x, y] = (0, 0, 0, 0)
    return rgba


def crop_centered(src: Image.Image, cx: int, cy: int, cell: int) -> Image.Image:
    w, h = src.size
    half = cell // 2
    left = max(0, cx - half)
    top = max(0, cy - half)
    right = min(w, cx + half)
    bottom = min(h, cy + half)
    patch = remove_dark_background(src.crop((left, top, right, bottom)))
    out = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
    paste_x = (cell - patch.width) // 2
    paste_y = (cell - patch.height) // 2
    out.paste(patch, (paste_x, paste_y), patch)
    return out


def main() -> None:
    src = Image.open(SRC).convert("RGBA")
    os.makedirs(DST_DIR, exist_ok=True)

    for filename, cx, cy in INV_ITEMS:
        out = crop_centered(src, cx, cy, INV_CELL)
        dst = os.path.join(DST_DIR, filename)
        out.save(dst)
        print("wrote", dst)

    for filename, cx, cy in LARGE_ITEMS:
        out = crop_centered(src, cx, cy, LARGE_CELL)
        dst = os.path.join(DST_DIR, filename)
        out.save(dst)
        print("wrote", dst)


if __name__ == "__main__":
    main()
