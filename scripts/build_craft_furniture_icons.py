"""Crop craft furniture inventory icons from the user reference sheet."""

from PIL import Image
import os

SRC = (
    r"C:\Users\USER\.cursor\projects\c-Users-USER-Desktop-OVC\assets\\"
    r"c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"5051453ebec3272e55d6a08d292c16f6_images_image-"
    r"c462c7f3-79c7-404f-9231-172e01a4a240.png"
)
DST_DIR = os.path.join(os.path.dirname(__file__), "..", "이미지")

# Inventory icon centers (right column) in the 682x1024 sheet.
ITEMS = [
    ("craft-desk-inv.png", 520, 128),
    ("craft-fence-inv.png", 520, 384),
    ("craft-chair-inv.png", 520, 640),
    ("craft-house-inv.png", 520, 896),
]

CELL = 148
HALF = CELL // 2

src = Image.open(SRC).convert("RGBA")
W, H = src.size

for filename, cx, cy in ITEMS:
    left = max(0, cx - HALF)
    top = max(0, cy - HALF)
    right = min(W, cx + HALF)
    bottom = min(H, cy + HALF)
    cell = src.crop((left, top, right, bottom))
    out = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    paste_x = (CELL - cell.width) // 2
    paste_y = (CELL - cell.height) // 2
    out.paste(cell, (paste_x, paste_y), cell)
    dst = os.path.join(DST_DIR, filename)
    out.save(dst)
    print("wrote", dst)
