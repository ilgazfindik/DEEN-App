#!/usr/bin/env python3
"""Make coloured copies of a white-robed companion picture (full dressed character, transparent, 512x768).

  python3 scripts/recolor-thobe.py --animal wolf
  (reads assets/companions/outfits/<animal>/<base>.webp, writes <base>_blue/beige/gray/olive.webp next to it)

Only the cloth is tinted (neutral near-white/grey pixels that belong to the robe's biggest connected piece plus its soft rim);
fur, skin, feathers and shell keep their colours, and the robe's folds and shading are preserved by multiplying."""
import argparse, importlib.util, os, sys
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("ex", os.path.join(HERE, "extract-outfit-layer.py"))
ex = importlib.util.module_from_spec(spec); spec.loader.exec_module(ex)

COLORS = {"blue": (86, 120, 168), "beige": (222, 196, 150), "gray": (98, 104, 114), "olive": (112, 122, 72)}


def robe_mask(rgba, core_sat=12, core_lum=196, rim_sat=22, rim_lum=140):
    a = np.asarray(rgba).astype(np.int16)
    rgb, al = a[..., :3], a[..., 3]
    sat = rgb.max(2) - rgb.min(2)
    lum = rgb.mean(2)
    core = (al > 200) & (sat < core_sat) & (lum > core_lum)
    core_img = Image.fromarray((core * 255).astype("uint8"), "L")
    core_img = ex.drop_specks(core_img, 0.6)           # keep only the robe, not white eye highlights or claws
    core_img = ex.fill_holes(core_img)
    grown = np.asarray(core_img.filter(ImageFilter.MaxFilter(9))) > 127
    ys = np.where(np.asarray(core_img) > 127)[0]
    top = ys.min() if len(ys) else 0
    H = al.shape[0]
    yy = np.arange(H)[:, None] * np.ones((1, al.shape[1]))
    rim = (al > 0) & (sat < rim_sat) & (lum > rim_lum) & (yy >= top)
    m = (np.asarray(core_img) > 127) | (grown & rim)
    return Image.fromarray((m * 255).astype("uint8"), "L").filter(ImageFilter.GaussianBlur(0.6))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--animal", required=True)
    ap.add_argument("--base", default="ot_thobe", help="file stem to recolour (default ot_thobe; use ot_thobe_kufi for the capped robe: the white cap stays white)")
    ap.add_argument("--preview")
    a = ap.parse_args()
    d = os.path.join(HERE, "..", "assets", "companions", "outfits", a.animal)
    src = Image.open(os.path.join(d, a.base + ".webp")).convert("RGBA")
    m = np.asarray(robe_mask(src)).astype(np.float32) / 255
    print(f"{a.animal}: robe covers {100 * (m > 0.5).mean():.1f}% of the canvas")
    arr = np.asarray(src).astype(np.float32)
    lum = np.clip(arr[..., :3].mean(2, keepdims=True) / 242.0, 0, 1.05)
    sheet = Image.new("RGBA", (512 * 4, 768), (20, 40, 48, 255))
    for i, (name, t) in enumerate(COLORS.items()):
        tinted = np.clip(lum * np.array(t, dtype=np.float32), 0, 255)
        out = arr.copy()
        out[..., :3] = arr[..., :3] * (1 - m[..., None]) + tinted * m[..., None]
        im = Image.fromarray(out.astype("uint8"), "RGBA")
        im.save(os.path.join(d, f"{a.base}_{name}.webp"), "WEBP", quality=88, method=6)
        sheet.alpha_composite(im, (512 * i, 0))
    if a.preview:
        sheet.convert("RGB").resize((1536, 576), Image.LANCZOS).save(a.preview)


if __name__ == "__main__":
    main()
