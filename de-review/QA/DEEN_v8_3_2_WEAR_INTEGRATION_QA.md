# DEEN v8.3.2 — Real Outfit Wear Integration QA

## Change
- Existing v8.3.2 real outfit thumbnails and room visual mapping are preserved.
- Added a dedicated real outfit wear atlas (`wear_outfits.webp`) containing four safe female and four safe male torso overlays mapped to the existing four economy outfit IDs.
- The selected wardrobe outfit is inserted directly after the real avatar base layer, so face, hair, hijab/headwear and accessories remain above the clothing layer.
- Saved/equipped outfit is also applied to Dünyam/profile avatar stacks.
- Existing Gold, owned/equipped, Save and Cancel mechanics are unchanged.
- Composite clothing assets remain excluded from direct runtime selection.

## Mapping
- `outfit_teal`
- `outfit_lavender`
- `outfit_navy`
- `outfit_cream`
- Female and male each have a distinct real PNG-derived overlay for all four IDs.

## Automated structural QA
- JavaScript syntax: PASS (`node --check`).
- Female default preview wear layer: PASS.
- World/equipped avatar wear layer: PASS.
- Layer order: `base_avatar -> real outfit -> hair/face/accessories`: PASS.
- Gender switch female -> male updates real outfit asset: PASS.
- Outfit preview switch teal -> navy updates real outfit asset: PASS.
- Browser page errors in isolated runtime test: 0.

## Runtime probe
`DEEN_REAL_WEAR.check()` reports version/revision, gender, equipped outfit, preview outfit, total worn avatar stacks and whether the wardrobe preview has an active real outfit layer.
