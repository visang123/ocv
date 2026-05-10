"""
4·5단계 풀: 가로 2열 시트(왼=4레벨, 오른=5레벨)를 잘라
이미지/grass-stage4-front.png, 이미지/grass-stage5-front.png 로보냄.

원본은 이미지/grass-stage45-sheet.png (가로 짝수 픽셀 권장).
상단 배너(텍스트) 제거: 높이의 TOP_TRIM_RATIO 만큼 위를 잘라냄.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SHEET = ROOT / "이미지" / "grass-stage45-sheet.png"
TOP_TRIM_RATIO = 0.14
COL_MARGIN = 4


def main() -> None:
    im = Image.open(SHEET).convert("RGBA")
    w, h = im.size
    col_w = w // 2
    trim_y = int(h * TOP_TRIM_RATIO)
    for col, name in [(0, "grass-stage4-front"), (1, "grass-stage5-front")]:
        x0 = col * col_w + COL_MARGIN
        x1 = (col + 1) * col_w - COL_MARGIN
        box = (x0, trim_y, x1, h)
        out = ROOT / "이미지" / f"{name}.png"
        im.crop(box).save(out)
        print(out.name, box, out.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
