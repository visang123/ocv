"""Crop in-game craft furniture sprites from the reference sheet (left column)."""

import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from image_backdrop import crop_centered

SRC = (
    r"C:\Users\USER\.cursor\projects\c-Users-USER-Desktop-OVC\assets\\"
    r"c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"5051453ebec3272e55d6a08d292c16f6_images_image-"
    r"f2656fac-2cbc-4d6a-ab55-9d318514b935.png"
)
DST_DIR = os.path.join(os.path.dirname(__file__), "..", "이미지")

# In-game sprite centers (left column) in the 682x1024 sheet.
ITEMS = [
    ("craft-desk-world.png", 168, 268, 200),
    ("craft-fence-world.png", 168, 496, 200),
    ("craft-chair-world.png", 168, 708, 200),
    ("craft-house-world.png", 168, 892, 240),
]

src = Image.open(SRC).convert("RGBA")

for filename, cx, cy, cell in ITEMS:
    out = crop_centered(src, cx, cy, cell)
    dst = os.path.join(DST_DIR, filename)
    out.save(dst, optimize=True)
    print("wrote", dst)
