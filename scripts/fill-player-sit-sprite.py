"""Convert player-sit asset to solid white silhouette on transparent background."""
from collections import deque
from PIL import Image

path = r"이미지/player-sit-white.png"
# Re-load from backup outline if needed; process current file
im = Image.open(path).convert("RGBA")
w, h = im.size
px = im.load()


def lum(r, g, b):
    return (r + g + b) / 3


def is_outline(x, y):
    r, g, b, a = px[x, y]
    return a > 48 and lum(r, g, b) > 150


def can_flood_exterior(x, y):
    if is_outline(x, y):
        return False
    r, g, b, a = px[x, y]
    if a < 48:
        return True
    return lum(r, g, b) < 72


exterior = [[False] * w for _ in range(h)]
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if can_flood_exterior(x, y) and not exterior[y][x]:
            exterior[y][x] = True
            q.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if can_flood_exterior(x, y) and not exterior[y][x]:
            exterior[y][x] = True
            q.append((x, y))

while q:
    x, y = q.popleft()
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nx, ny = x + dx, y + dy
        if nx < 0 or ny < 0 or nx >= w or ny >= h:
            continue
        if exterior[ny][nx] or not can_flood_exterior(nx, ny):
            continue
        exterior[ny][nx] = True
        q.append((nx, ny))

out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
opx = out.load()
filled = 0
for y in range(h):
    for x in range(w):
        if not exterior[y][x]:
            opx[x, y] = (255, 255, 255, 255)
            filled += 1

out.save(path, optimize=True)
print("saved solid sit sprite:", w, "x", h, "pixels:", filled)
