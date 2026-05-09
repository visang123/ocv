"""Crop the user-provided butterfly art into a clean sprite sheet.

The source image has 3 rows (brown / yellow / white) and 5 wing-flap frames per
row, separated by labels on the left and ">" glyphs between frames. We:

1. Crop each butterfly into a uniform square cell.
2. Drop the dark navy background by alpha-keying low-luminance pixels.
3. Lay the cells out in a tight 5x3 sprite sheet at "이미지/butterfly-sheet.png".
"""

from PIL import Image
import os

SRC = (
    r"C:\Users\USER\.cursor\projects\c-Users-USER-Desktop-OVC\assets\\"
    r"c__Users_USER_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"5051453ebec3272e55d6a08d292c16f6_images_image-"
    r"e0300a18-5ec4-42a4-93f5-eef41b8654f1.png"
)
DST_DIR = r"C:\Users\USER\Desktop\OVC\이미지"
DST = os.path.join(DST_DIR, "butterfly-sheet.png")

CELL = 150
COLS = 5
ROWS = 3

# Empirically chosen centers for the 15 butterflies in the source image.
# Each row uses the same x-centers; rows are evenly spaced vertically.
ROW_CENTERS_Y = [110, 340, 575]
COL_CENTERS_X = [228, 400, 575, 750, 925]

centers = []
for cy in ROW_CENTERS_Y:
    for cx in COL_CENTERS_X:
        centers.append((cx, cy))

src = Image.open(SRC).convert("RGBA")
W, H = src.size

# Alpha-key the dark background so the butterflies sit cleanly on the world.
pixels = src.load()
for y in range(H):
    for x in range(W):
        r, g, b, _ = pixels[x, y]
        # Background is near-black navy. Glow + butterfly bodies are bright.
        # Smoothly fade out anything dark to avoid hard halos.
        lum = max(r, g, b)
        if lum < 35:
            pixels[x, y] = (r, g, b, 0)
        elif lum < 80:
            pixels[x, y] = (r, g, b, int((lum - 35) / 45 * 255))

sheet = Image.new("RGBA", (CELL * COLS, CELL * ROWS), (0, 0, 0, 0))

for idx, (cx, cy) in enumerate(centers):
    left = max(0, cx - CELL // 2)
    top = max(0, cy - CELL // 2)
    right = min(W, left + CELL)
    bottom = min(H, top + CELL)
    crop = src.crop((left, top, right, bottom))
    if crop.size != (CELL, CELL):
        # Pad to keep cells uniform.
        padded = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
        padded.paste(crop, (0, 0))
        crop = padded
    col = idx % COLS
    row = idx // COLS
    sheet.paste(crop, (col * CELL, row * CELL))

os.makedirs(DST_DIR, exist_ok=True)
sheet.save(DST, "PNG")
print(f"Wrote {DST} ({sheet.size})")
