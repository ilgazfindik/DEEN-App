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
import argparse, os, sys
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


def drop_specks(mask_img, min_part):
    """Keep only connected pieces that are at least min_part of the largest piece."""
    from collections import deque
    m = np.asarray(mask_img) > 127
    lab = np.zeros(m.shape, dtype=np.int32)
    sizes = {}
    n = 0
    hgt, wid = m.shape
    for y0 in range(hgt):
        for x0 in range(wid):
            if m[y0, x0] and lab[y0, x0] == 0:
                n += 1
                lab[y0, x0] = n
                q = deque([(y0, x0)])
                c = 0
                while q:
                    y, x = q.popleft()
                    c += 1
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        yy, xx = y + dy, x + dx
                        if 0 <= yy < hgt and 0 <= xx < wid and m[yy, xx] and lab[yy, xx] == 0:
                            lab[yy, xx] = n
                            q.append((yy, xx))
                sizes[n] = c
    if not sizes:
        return mask_img
    big = max(sizes.values())
    keep = [k for k, v in sizes.items() if v >= big * min_part]
    out = np.isin(lab, keep)
    return Image.fromarray((out * 255).astype(np.uint8), "L")


def fill_holes(mask_img):
    """Fill enclosed holes (pixels where cloth and fur happened to match) inside the cut-out."""
    from collections import deque
    m = np.asarray(mask_img) > 127
    hgt, wid = m.shape
    outside = np.zeros(m.shape, dtype=bool)
    q = deque()
    for x in range(wid):
        for y in (0, hgt - 1):
            if not m[y, x] and not outside[y, x]:
                outside[y, x] = True; q.append((y, x))
    for y in range(hgt):
        for x in (0, wid - 1):
            if not m[y, x] and not outside[y, x]:
                outside[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            yy, xx = y + dy, x + dx
            if 0 <= yy < hgt and 0 <= xx < wid and not m[yy, xx] and not outside[yy, xx]:
                outside[yy, xx] = True; q.append((yy, xx))
    return Image.fromarray(((~outside) * 255).astype(np.uint8), "L")


def write_full(a, dressed):
    """Remove the solid background of a dressed character picture and keep the whole character."""
    arr_d = np.asarray(dressed.convert("RGB"), dtype=np.int16)
    corners = np.array([arr_d[2, 2], arr_d[2, -3], arr_d[-3, 2], arr_d[-3, -3]])
    bgc = np.median(corners, axis=0)
    tol = a.bg_tol if a.bg_tol_set else 3
    fg = np.abs(arr_d - bgc).max(axis=2) >= tol
    mask = Image.fromarray((fg * 255).astype(np.uint8), "L")
    mask = drop_specks(mask, a.min_part)
    mask = fill_holes(mask)
    mask = box(mask, (W, H), a.grow if a.grow is not None else -2)  # shave the light background halo off fur edges
    if a.feather > 0:
        mask = mask.filter(ImageFilter.GaussianBlur(a.feather))
    out_im = dressed.convert("RGBA")
    out_im.putalpha(mask)
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    out_im.save(a.out, "WEBP", quality=a.quality, method=6) if a.out.lower().endswith(".webp") else out_im.save(a.out)
    print(f"wrote {a.out}  (full character, background removed)")
    if a.preview:
        chk = Image.new("RGBA", (W, H))
        px = chk.load()
        for y in range(H):
            for x in range(W):
                v = 200 if ((x // 16) + (y // 16)) % 2 else 150
                px[x, y] = (v, v, v, 255)
        dark = Image.new("RGBA", (W, H), (20, 40, 48, 255))
        left = chk.copy(); left.alpha_composite(out_im); dark.alpha_composite(out_im)
        sheet = Image.new("RGBA", (W * 2 + 8, H), (0, 0, 0, 255))
        sheet.paste(left, (0, 0)); sheet.paste(dark, (W + 8, 0))
        sheet.convert("RGB").save(a.preview)
        print(f"wrote preview {a.preview}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base", required=False)
    ap.add_argument("--dressed", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--threshold", type=int, default=None, help="colour change (0-255) that counts as clothing (default 28; 60 when the dressed picture has a solid background)")
    ap.add_argument("--bg-tol", type=int, default=None, help="opaque-background pictures: how far from the background colour counts as clothing")
    ap.add_argument("--grow", type=int, default=None, help="pixels to grow (+) or shrink (-) the cut-out edge; default +2, or -1 when the dressed picture has a solid background (removes the background halo)")
    ap.add_argument("--fill-holes", action=argparse.BooleanOptionalAction, default=True, help="fill enclosed gaps inside the cut-out (default on)")
    ap.add_argument("--keep-color-tol", type=int, default=0, help="single-colour garments: drop cut-out pixels whose colour is further than this from the garment's median colour (removes leaked fur/skin; try 45). 0 = off")
    ap.add_argument("--full", action="store_true", help="body outfits: instead of a cut-out layer, write the WHOLE dressed character with its background removed (it then replaces the plain body picture; no bare fur can poke out around the clothes). --base is not needed")
    ap.add_argument("--min-part", type=float, default=0.04, help="drop separate specks smaller than this fraction of the largest piece (stray changes on face/fur)")
    ap.add_argument("--feather", type=float, default=1.2, help="edge softness in pixels")
    ap.add_argument("--preview", help="write a preview sheet (checkerboard | on base) to this PNG")
    ap.add_argument("--quality", type=int, default=88)
    a = ap.parse_args()
    a.bg_tol_set = a.bg_tol is not None
    if a.bg_tol is None:
        a.bg_tol = 7
    explicit_thr = a.threshold is not None

    if not a.full and not a.base:
        sys.exit('--base is required (unless you use --full)')
    dressed = load(a.dressed)
    if a.full:
        return write_full(a, dressed)
    base = load(a.base)
    dr_alpha = np.asarray(dressed.getchannel("A"))
    opaque = bool(dr_alpha.min() >= 250)
    if a.threshold is None:
        a.threshold = 60 if opaque else 28  # dressed picture has a solid background (e.g. white), not transparency
    if opaque:
        # Compare on the dressed picture's own background colour (sampled from its corners).
        arr_d = np.asarray(dressed.convert("RGB"), dtype=np.int16)
        corners = np.array([arr_d[2, 2], arr_d[2, -3], arr_d[-3, 2], arr_d[-3, -3]])
        bgc = tuple(int(v) for v in np.median(corners, axis=0))
        diff = np.abs(over(base, bgc) - arr_d).max(axis=2)
        # Anything that is not background-coloured and lies outside the plain animal's silhouette
        # (robe hems, wide sleeves) is clothing even when it is nearly the same colour as the background.
        fg = np.abs(arr_d - np.array(bgc, dtype=np.int16)).max(axis=2) >= a.bg_tol
        sil = base.getchannel("A").point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MaxFilter(5))
        outside = np.asarray(sil) == 0
        diff = np.where(outside & fg, np.maximum(diff, a.threshold), diff)
        print(f"dressed picture has an opaque background {bgc}; treating it as background")
    else:
        # Compare on two backgrounds so soft glow and transparent regions cannot hide a change.
        diff = np.zeros((H, W), dtype=np.int16)
        for bg in ((0, 0, 0), (255, 255, 255)):
            d = np.abs(over(base, bg) - over(dressed, bg)).max(axis=2)
            diff = np.maximum(diff, d)
    mask = Image.fromarray(((diff >= a.threshold) * 255).astype(np.uint8), "L")

    # Close pinholes (open then close with small kernels), then grow slightly for soft edges.
    mask = box(box(mask, (W, H), 2), (W, H), -2)   # close small gaps
    mask = box(box(mask, (W, H), -1), (W, H), 1)   # drop single-pixel specks
    grow = a.grow if a.grow is not None else (-1 if opaque else 2)
    mask = box(mask, (W, H), grow)
    if a.keep_color_tol > 0:
        rgb = np.asarray(dressed.convert('RGB'), dtype=np.int16)
        m0 = np.asarray(mask) > 127
        med = np.median(rgb[m0], axis=0)
        far = np.abs(rgb - med).max(axis=2) > a.keep_color_tol
        mask = Image.fromarray(((m0 & ~far) * 255).astype(np.uint8), 'L')
    mask = drop_specks(mask, a.min_part)
    if a.fill_holes:
        mask = fill_holes(mask)
    if a.feather > 0:
        mask = mask.filter(ImageFilter.GaussianBlur(a.feather))

    arr = np.asarray(mask, dtype=np.float32) / 255.0
    # Where the dressed picture itself is transparent there is nothing to show.
    if not opaque:
        arr *= np.asarray(dressed.getchannel("A"), dtype=np.float32) / 255.0
    layer = dressed.copy()
    layer.putalpha(Image.fromarray((arr * 255).astype(np.uint8), "L"))

    out = a.out
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
