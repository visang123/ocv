"""Re-apply edge backdrop stripping to existing craft / magic powder PNG icons."""

import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from image_backdrop import strip_backdrop

DST_DIR = os.path.join(os.path.dirname(__file__), "..", "이미지")

FILES = [
    "craft-desk-inv.png",
    "craft-fence-inv.png",
    "craft-chair-inv.png",
    "craft-house-inv.png",
    "craft-desk-world.png",
    "craft-fence-world.png",
    "craft-chair-world.png",
    "craft-house-world.png",
    "magic-powder-yellow-inv.png",
    "magic-powder-white-inv.png",
    "magic-powder-brown-inv.png",
    "magic-powder-mixed-inv.png",
    "magic-powder-gray.png",
    "bucket-inv.png",
]


def main():
    for filename in FILES:
        path = os.path.join(DST_DIR, filename)
        if not os.path.isfile(path):
            print("skip (missing)", path)
            continue
        im = Image.open(path)
        out = strip_backdrop(im)
        out.save(path, optimize=True)
        print("wrote", path)


if __name__ == "__main__":
    main()
