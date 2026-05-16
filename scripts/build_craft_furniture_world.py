"""Crop in-game craft furniture sprites from the reference sheet (left column)."""

from PIL import Image
import os

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
W, H = src.size

for filename, cx, cy, cell in ITEMS:
    half = cell // 2
    left = max(0, cx - half)
    top = max(0, cy - half)
    right = min(W, cx + half)
    bottom = min(H, cy + half)
    patch = src.crop((left, top, right, bottom))
    out = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
    paste_x = (cell - patch.width) // 2
    paste_y = (cell - patch.height) // 2
    out.paste(patch, (paste_x, paste_y), patch)
    dst = os.path.join(DST_DIR, filename)
    out.save(dst)
    print("wrote", dst)
