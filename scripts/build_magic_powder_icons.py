"""Crop colored magic powder inventory icons from the user reference sheet."""

from PIL import Image
import os

SRC = (
    r"C:\Users\USER\.cursor\projects\c-Users-USER-Desktop-OVC\assets\\"
    r"c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"5051453ebec3272e55d6a08d292c16f6_images_image-"
    r"da58d062-0134-4bdf-83ab-5d20ec86ed72.png"
)
DST_DIR = os.path.join(os.path.dirname(__file__), "..", "\uc774\ubbf8\uc9c0")

# Inventory icon centers (bottom row) in 1024x682 sheet: yellow | white | brown
ITEMS = [
    ("magic-powder-yellow-inv.png", 170, 555),
    ("magic-powder-white-inv.png", 512, 555),
    ("magic-powder-brown-inv.png", 852, 555),
]

CELL = 132
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

# Mixed icon: simple horizontal blend of the three crops for inventory
yellow = Image.open(os.path.join(DST_DIR, "magic-powder-yellow-inv.png")).convert("RGBA")
white = Image.open(os.path.join(DST_DIR, "magic-powder-white-inv.png")).convert("RGBA")
brown = Image.open(os.path.join(DST_DIR, "magic-powder-brown-inv.png")).convert("RGBA")
mixed = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
third = CELL // 3
for x in range(CELL):
    for y in range(CELL):
        if x < third:
            mixed.putpixel((x, y), yellow.getpixel((x, y)))
        elif x < third * 2:
            mixed.putpixel((x, y), white.getpixel((x - third, y)))
        else:
            mixed.putpixel((x, y), brown.getpixel((x - third * 2, y)))
mixed.save(os.path.join(DST_DIR, "magic-powder-mixed-inv.png"))
print("wrote mixed")
