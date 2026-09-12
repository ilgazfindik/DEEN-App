# DEEN v8.3.2 HF2E — Real Outfit Closet QA

## Scope
- Preserves the HF2B full real-avatar runtime: 86 male + 71 female = 157 avatar parts.
- Replaces the failed HF2C/HF2D outfit visual layer with a new independent HF2E closet runtime.
- Adds 12 curated male + 11 curated female real outfits to Giyinme Odası.
- Keeps the four existing economy outfit IDs authoritative for Gold / owned / equipped behavior.
- Maps those four legacy cards to the first four real outfit visuals and restores immediate live outfit preview.
- Persists the selected real visual outfit under `state.myWorld.avatarAssets.visualOutfit` without changing progression or economy schemas.
- Save persists the visual outfit; Cancel restores the pre-edit visual outfit.
- Saved real outfit is applied to Dünyam/profile real-avatar stacks.

## Asset transport hardening
- HF2E does not use the previously truncated large WebP release atlases.
- Male curated outfits are packed into a small 576x192 WebP (12 x 96px cells) transported as verified base64 text.
- Female curated outfits are packed into a small 480x160 WebP (11 x 80px cells + one empty slot) transported as verified base64 text.
- Runtime validates RIFF/WEBP signatures, declared byte length, browser decode and exact atlas dimensions before enabling the closet.

## Static QA
- HF2E closet runtime: `node --check` PASS.
- Curated source count: 12 male / 11 female.
- Atlas source assets decode successfully before upload.
- GitHub base64 files match the expected exact text blob SHA/size after upload.
- 27 unresolved composite clothing crops remain intentionally excluded.

## Preserved mechanics
- Gold prices, owned state, equipped legacy outfit state and purchase gates remain controlled by existing `DEEN_WORLD` / wardrobe logic.
- Avatar gender and all 157 avatar-part selections remain controlled by HF2B/v8.3.1.
- No room/decor state changes in HF2E.

## Live QA status
- GitHub Pages build/deploy must complete successfully after the release switch.
- Final wardrobe visual PASS is intentionally pending user verification on the live build: real thumbnails visible, 12/11 real closet cards visible, tap-to-preview working, and Save persistence working.
