from PIL import Image

im = Image.open(r"c:\Users\USER\Desktop\OVC\이미지\grass-stage45-sheet.png")
w, h = im.size
thumb_h = int(h * 0.38)
thumb_y = h - thumb_h
col_w = w // 2
thumb_w = col_w // 4
for name, col in [("grass-stage4-front", 0), ("grass-stage5-front", 1)]:
    x0 = col * col_w
    box = (x0 + 2, thumb_y + 2, x0 + thumb_w - 2, h - 2)
    im.crop(box).save(rf"c:\Users\USER\Desktop\OVC\이미지\{name}.png")
    print(name, box)
