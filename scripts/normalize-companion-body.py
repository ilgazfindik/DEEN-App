#!/usr/bin/env python3
"""Place a plain full-body companion render on the shared 512x768 gardırop canvas.

  python3 scripts/normalize-companion-body.py --animal wolf --src wolf_plain.webp

Writes assets/companions/<animal>/<animal>_body.webp and records how the picture was scaled/placed in
assets/companions/body-frames.json. extract-outfit-layer.py (--animal wolf) reads that file so dressed pictures made
from the same plain render land on the canvas in exactly the same place (hats, scarves and robes then line up).
Needs a transparent background. Every animal stands on the same baseline and is centred; width and height are fitted."""
import argparse, json, os, sys
import numpy as np
from PIL import Image

W, H = 512, 768
MARGIN_X, MARGIN_TOP, MARGIN_BOTTOM = 10, 8, 8
FRAMES = os.path.join(os.path.dirname(__file__), "..", "assets", "companions", "body-frames.json")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--animal", required=True)
    ap.add_argument("--src", required=True, help="plain render with a transparent background")
    ap.add_argument("--out", help="write a dressed full character here instead of the plain body (then body-frames.json is left alone)")
    ap.add_argument("--quality", type=int, default=88)
    a = ap.parse_args()
    im = Image.open(a.src).convert("RGBA")
    al = np.asarray(im.getchannel("A"))
    ys, xs = np.where(al > 24)
    if not len(xs):
        sys.exit("The picture has no visible pixels - is the background really transparent?")
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    bw, bh = x1 - x0, y1 - y0
    scale = min((W - 2 * MARGIN_X) / bw, (H - MARGIN_TOP - MARGIN_BOTTOM) / bh)
    nw, nh = round(im.width * scale), round(im.height * scale)
    dx = round(W / 2 - (x0 + bw / 2) * scale)
    dy = round(H - MARGIN_BOTTOM - y1 * scale)
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.alpha_composite(im.resize((nw, nh), Image.LANCZOS), (max(dx, 0), max(dy, 0))) if dx >= 0 and dy >= 0 else \
        canvas.paste(im.resize((nw, nh), Image.LANCZOS), (dx, dy))
    out = a.out or os.path.join(os.path.dirname(__file__), "..", "assets", "companions", a.animal, f"{a.animal}_body.webp")
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    canvas.save(out, "WEBP", quality=a.quality, method=6)
    if a.out:
        print(f"{a.animal}: wrote {a.out} ({os.path.getsize(out)//1024} KB)")
        return
    frames = {}
    if os.path.exists(FRAMES):
        frames = json.load(open(FRAMES, encoding="utf8"))
    frames[a.animal] = {"src": [im.width, im.height], "scale": round(scale, 5), "dx": dx, "dy": dy}
    json.dump(frames, open(FRAMES, "w", encoding="utf8"), indent=1, sort_keys=True)
    open(FRAMES, "a").write("\n")
    print(f"{a.animal}: {im.width}x{im.height} -> scale {scale:.3f}, offset ({dx},{dy}); wrote {os.path.relpath(out)} ({os.path.getsize(out)//1024} KB)")


if __name__ == "__main__":
    main()
