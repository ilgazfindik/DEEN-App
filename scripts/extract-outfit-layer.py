#!/usr/bin/env python3
"""Cut a clothing layer out of an AI-dressed picture of a companion.

You give the tool the plain full-body picture (assets/companions/<animal>/<animal>_body.webp)
and a second picture of the SAME animal in the SAME pose wearing the outfit. It keeps only the
pixels that changed and writes a transparent 512x768 layer that stacks on the plain body.

  python3 scripts/extract-outfit-layer.py --base assets/companions/cat/cat_body.webp \
      --dressed cat_with_cap.png --out assets/companions/outfits/cat/ot_cap.webp \
      [--threshold 28] [--grow 2] [--feather 1.2] [--preview preview.png]

Tips: the closer the dressed picture's pose, size and framing are to the base, the cleaner the cut.
Open the --preview image (layer over a checkerboard, and layer over the base) before you use a layer.
"""
import argparse, sys
import numpy as np
from PIL import Image, ImageFilter

W, H = 512, 768


def load(path):
    im = Image.open(path).convert("RGBA")
    if im.size != (W, H):
        if abs(im.size[0] / im.size[1] - W / H) > 0.02:
            sys.exit(f"{path}: aspect ratio {im.size} differs from {W}x{H} (2:3). Crop/pad it to 2:3 first.")
        im = im.resize((W, H), Image.LANCZOS)
    return im


def over(im, bg):
    canvas = Image.new("RGBA", im.size, bg + (255,))
    canvas.alpha_composite(im)
    return np.asarray(canvas.convert("RGB"), dtype=np.int16)


def box(mask_img, size, grow):
    """Grow (grow>0) or shrink (grow<0) a binary mask using min/max filters."""
    k = abs(grow) * 2 + 1
    f = ImageFilter.MaxFilter(k) if grow > 0 else ImageFilter.MinFilter(k)
    return mask_img.filter(f) if grow else mask_img


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base", required=True)
    ap.add_argument("--dressed", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--threshold", type=int, default=28, help="colour change (0-255) that counts as clothing")
    ap.add_argument("--grow", type=int, default=2, help="pixels to grow the cut-out to catch soft edges")
    ap.add_argument("--feather", type=float, default=1.2, help="edge softness in pixels")
    ap.add_argument("--preview", help="write a preview sheet (checkerboard | on base) to this PNG")
    ap.add_argument("--quality", type=int, default=88)
    a = ap.parse_args()

    base, dressed = load(a.base), load(a.dressed)
    # Compare on two backgrounds so soft glow and transparent regions cannot hide a change.
    diff = np.zeros((H, W), dtype=np.int16)
    for bg in ((0, 0, 0), (255, 255, 255)):
        d = np.abs(over(base, bg) - over(dressed, bg)).max(axis=2)
        diff = np.maximum(diff, d)
    mask = Image.fromarray(((diff >= a.threshold) * 255).astype(np.uint8), "L")

    # Close pinholes (open then close with small kernels), then grow slightly for soft edges.
    mask = box(box(mask, (W, H), 2), (W, H), -2)   # close small gaps
    mask = box(box(mask, (W, H), -1), (W, H), 1)   # drop single-pixel specks
    mask = box(mask, (W, H), a.grow)
    if a.feather > 0:
        mask = mask.filter(ImageFilter.GaussianBlur(a.feather))

    arr = np.asarray(mask, dtype=np.float32) / 255.0
    # Where the dressed picture itself is transparent there is nothing to show.
    arr *= np.asarray(dressed.getchannel("A"), dtype=np.float32) / 255.0
    layer = dressed.copy()
    layer.putalpha(Image.fromarray((arr * 255).astype(np.uint8), "L"))

    out = a.out
    import os
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    if out.lower().endswith(".webp"):
        layer.save(out, "WEBP", quality=a.quality, method=6)
    else:
        layer.save(out)
    kept = float((arr > 0.5).mean()) * 100
    print(f"wrote {out}  ({kept:.1f}% of the canvas is clothing)")
    if kept < 0.3:
        print("WARNING: almost nothing changed - is the dressed picture really different / aligned?")
    if kept > 45:
        print("WARNING: a huge area changed - the pose or framing probably differs from the base.")

    if a.preview:
        tile = 16
        chk = Image.new("RGBA", (W, H))
        px = chk.load()
        for y in range(H):
            for x in range(W):
                v = 200 if ((x // tile) + (y // tile)) % 2 else 150
                px[x, y] = (v, v, v, 255)
        left = chk.copy(); left.alpha_composite(layer)
        right = Image.new("RGBA", (W, H), (20, 40, 48, 255)); right.alpha_composite(base); right.alpha_composite(layer)
        sheet = Image.new("RGBA", (W * 2 + 8, H), (0, 0, 0, 255))
        sheet.paste(left, (0, 0)); sheet.paste(right, (W + 8, 0))
        sheet.convert("RGB").save(a.preview)
        print(f"wrote preview {a.preview}")


if __name__ == "__main__":
    main()
