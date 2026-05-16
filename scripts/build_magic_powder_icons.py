"""Crop magic powder inventory icons from the reference sheet."""

import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from image_backdrop import crop_centered

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

# Large jar sprite for HUD / legacy magic-powder-gray.png.
LARGE_ITEMS = [
    ("magic-powder-gray.png", 136, 263),
]

INV_CELL = 132
LARGE_CELL = 256


def main() -> None:
    src = Image.open(SRC).convert("RGBA")
    os.makedirs(DST_DIR, exist_ok=True)

    for filename, cx, cy in INV_ITEMS:
        out = crop_centered(src, cx, cy, INV_CELL)
        dst = os.path.join(DST_DIR, filename)
        out.save(dst, optimize=True)
        print("wrote", dst)

    for filename, cx, cy in LARGE_ITEMS:
        out = crop_centered(src, cx, cy, LARGE_CELL)
        dst = os.path.join(DST_DIR, filename)
        out.save(dst, optimize=True)
        print("wrote", dst)


if __name__ == "__main__":
    main()
