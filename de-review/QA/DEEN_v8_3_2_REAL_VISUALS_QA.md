# DEEN v8.3.2 — Real Clothing & Room Visuals QA

## Scope
- Externalized v8.3.1 avatar atlases (male/female WebP).
- Real outfit atlas thumbnails in Giyinme Odası.
- Real room assets in Oda Düzeni / room preview.
- Real decor thumbnails in room editor / shop.

## Asset counts
- Avatar: 86 male + 71 female = 157 runtime parts.
- Curated full outfits: 12 male + 11 female.
- Room/decor visuals: 96.

## Browser QA
- 360x800: wardrobe overflow 0, room overflow 0, console/page errors 0.
- 390x844: wardrobe overflow 0, room overflow 0, console/page errors 0.
- 412x915: wardrobe overflow 0, room overflow 0, console/page errors 0.
- Giyinme Odası outfit tab: 4 legacy economy items rendered with real outfit atlas thumbnails.
- Oda Düzeni: live real room layer rendered with 8 visual layers.
- Existing Gold/owned/equipped mechanics remain authoritative; v8.3.2 is a visual mapping layer.

## Notes
- 27 clothing crops remain likely composites and are intentionally excluded from runtime selection.
- Room visuals map onto existing decor types without changing prices, ownership, progression, or presets.
