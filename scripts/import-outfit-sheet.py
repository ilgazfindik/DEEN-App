#!/usr/bin/env python3
"""Turn a line-up sheet (the six companions side by side in one outfit, on a white background) into the
full-body outfit images the wardrobe uses: assets/companions/outfits/<animal>/<id>.webp, 512x768, transparent.

The sheet order is wolf, owl, turtle, eagle, cat, lion (left to right). Each figure is cut out by flooding the
white background in from the edges (the drawings have outlines, so white clothes stay), then scaled and placed
like that animal's default thobe (same height, feet on the same line, same centre), so every outfit stands in the
same spot in the room and the shop.

  python3 scripts/import-outfit-sheet.py SHEET --id ot_robe_navy_crescent [--preview preview.png]
"""
import argparse
import os
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

ORDER = ['wolf', 'owl', 'turtle', 'eagle', 'cat', 'lion']
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 512, 768


def background_mask(rgb, tol, pockets=True):
    """True where the pixel is white background reachable from the image border."""
    h, w, _ = rgb.shape
    near = (255 - rgb.min(axis=2)) <= tol
    mask = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if near[y, x] and not mask[y, x]:
                mask[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if near[y, x] and not mask[y, x]:
                mask[y, x] = True
                q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and near[ny, nx] and not mask[ny, nx]:
                mask[ny, nx] = True
                q.append((ny, nx))
    if not pockets:
        return mask
    # Pure white pockets closed in by the figure (between an arm and the body): flat, bright and not small.
    pure = (255 - rgb.min(axis=2)) <= 3
    seen = mask.copy()
    for y0 in range(h):
        for x0 in range(w):
            if pure[y0, x0] and not seen[y0, x0]:
                comp = [(y0, x0)]
                seen[y0, x0] = True
                i = 0
                while i < len(comp):
                    y, x = comp[i]
                    i += 1
                    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                        if 0 <= ny < h and 0 <= nx < w and pure[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            comp.append((ny, nx))
                if len(comp) >= 60:
                    ys, xs = zip(*comp)
                    mask[list(ys), list(xs)] = True
    return mask


def split_columns(fg):
    """Five cut lines between the six figures: the emptiest column near each sixth of the width."""
    h, w = fg.shape
    prof = fg.sum(axis=0)
    cuts = [0]
    for k in range(1, 6):
        c = int(w * k / 6)
        lo, hi = c - w // 14, c + w // 14
        cuts.append(lo + int(np.argmin(prof[lo:hi])))
    cuts.append(w)
    return cuts


def target_box(animal):
    ref = Image.open(os.path.join(ROOT, 'assets/companions/outfits', animal, 'ot_thobe.webp'))
    return ref.getbbox()


def place(figure, animal):
    x0, y0, x1, y1 = target_box(animal)
    th = y1 - y0
    s = th / figure.height
    fig = figure.resize((max(1, round(figure.width * s)), th), Image.LANCZOS)
    if s > 1.05:  # upscaled: bring the outlines back a little
        rgb = fig.convert('RGB').filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
        rgb.putalpha(fig.getchannel('A'))
        fig = rgb
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    cx = (x0 + x1) // 2
    left = max(0, min(W - fig.width, cx - fig.width // 2))
    canvas.alpha_composite(fig, (left, y0))
    return canvas


def run(sheet, oid, preview=None, tol=24, pockets=True):
    rgb = np.asarray(Image.open(sheet).convert('RGB')).astype(np.int16)
    bg = background_mask(rgb, tol, pockets)
    fg = ~bg
    alpha = Image.fromarray((fg * 255).astype('uint8'))
    # one pixel in from the edge (drops the light fringe), then a soft edge
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    img = Image.fromarray(rgb.astype('uint8')).convert('RGBA')
    img.putalpha(alpha)
    cuts = split_columns(np.asarray(alpha) > 128)
    outs = []
    for i, animal in enumerate(ORDER):
        part = img.crop((cuts[i], 0, cuts[i + 1], img.height))
        a = np.asarray(part.getchannel('A')) > 128
        # the largest blob is the figure (drops specks and bits of a neighbour)
        ys, xs = np.where(a)
        if not len(ys):
            raise SystemExit(f'{animal}: nothing found in column {i}')
        box = part.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
        fig = part.crop(box)
        out = place(fig, animal)
        path = os.path.join(ROOT, 'assets/companions/outfits', animal, oid + '.webp')
        out.save(path, 'WEBP', quality=90, method=6)
        outs.append(out)
    if preview:
        sheet_im = Image.new('RGB', (W * 6, H), (20, 28, 64))
        for i, o in enumerate(outs):
            sheet_im.paste(o, (i * W, 0), o)
        sheet_im.save(preview)
    return outs


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('sheet')
    ap.add_argument('--id', required=True)
    ap.add_argument('--preview')
    ap.add_argument('--tol', type=int, default=24)
    ap.add_argument('--no-pockets', action='store_true', help='keep closed-in white areas (all-white clothes)')
    a = ap.parse_args()
    run(a.sheet, a.id, a.preview, a.tol, not a.no_pockets)
    print('ok', a.id)
