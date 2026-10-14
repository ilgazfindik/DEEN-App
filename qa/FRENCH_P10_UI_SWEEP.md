# DEEN — Français P10: source-attested UI navigation sweep and safe fixes

## Final verified evidence (14 October 2026)

- **[GitHub Actions #38588251175 — SUCCESS](https://github.com/ilgazfindik/DEEN-App/actions/runs/38588251175)**, both Chromium 390×844 mobile and 1280×820 desktop.
- Independent source/Node validation included in this workflow; prior build/UI inventory also succeeded.
- Scoped to four actual user-clicked primary tabs, eight *function-opened* lazy panels, native French-selection attempt in settings, a set of lesson types, Quran reference flow and P08 persistence regression.
- `DEEN_FRENCH_STAGE_UI` is **loopback/QA-only**, with the original application language still `tr`. This does NOT prove user-facing production French is available or every possible app state is localized.

## Source-based Chromium inventory

| Distinct source tokens after QA preview | Mobile | Desktop |
|---|---:|---:|
| P10 before fixes | 298 | 298 |
| First UI correction | 214 | 214 |
| Source-guarded stage labels | 73 | 73 |
| Safe label and product copy cleanup | 54 | 54 |
| Final safe two-string correction | **52** | **52** |

This is a cumulative *unrecognized source-token* inventory, **not a count of visible translation defects**. The final 52 consist of **46 numbers/symbols**, **5 unchanged brand/technical/product identifiers** (`DEEN`, `XP`, `1000 XP`, `DEEN Premium`, `PREMIUM`) and **1 intentionally unlocalized doctrinal/product-policy description**, awaiting a native French and independent Islamic expert review.

Do **not** display “0 untranslated items” or “entire app French QA 100%”; the current P10 scope tests the above screens and dialogs, not all saved-user conditions, premium entitlements, locale-selected gameplay or accessibility/Safari states.

## Real code changes

- Added 71 source-attested static UI drafts to `assets/i18n/fr/ui.p10-browser-safe.staging.json`, covering settings, accessibility, progress, XP/store, account/profile and learning-path surface.
- Added 34 source-attested dynamic UI patterns to `assets/i18n/fr/ui.p10-browser-dynamic.staging.json`, including unit progression, lesson count, energy, daily target and stage-completion states.
- Routed both packs through the **isolated** `scripts/fr-preview-pack-builder.mjs` manifest and `assets/i18n/fr/staging-preview.js` source-keyed DOM preview. No source question, grading logic or production release flag changed during P10.
- Compound stage labels translate `{topic}` only if its exact source Turkish title exists in the already staged French UI dictionary; unknown labels fail closed rather than yielding mixed French/Turkish or invented religious terminology.
- Singular/plural guards handle `1 mini-leçon` independently from `5 minutes`, as well as `1 question`/`5 questions` and related counters.
- Tests assert unchanged Quran Arabic, original meaning/source license information, real lesson content/answer controls, and protected doctrinal product text.

## Verified behavioral regressions

- Native **settings dropdown** selected French on both viewports; real `DEEN_BOOT.changeLanguage('fr')` correctly refused the unapproved language and kept all progress and locale settings unchanged (`FR_P10_REAL_SETTINGS_BLOCK`).
- Real content adapter source matching from P09, 4/4 isolated gameplay scenarios, Quran 2/2 viewport flow and P08 XP/learning-state persistence round-trip all passed on final build.
- Remaining formal blockers: expert-reviewed doctrinal/product copy; independent religious and native French review; audio playback/rights and 0/90 word timing alignment; full release integration, Safari/iOS, authentic French reload and complete user-state coverage.
- `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` remain intact. **No merge to main and no GitHub Pages deploy**.

## Next stage

P11 should address Quran recitation/word timing and French meaning source licenses, then P12 independent full-device QA/expert signoffs and P13 only after release gates pass. Further P10 UI review is warranted for screens/states not exercised by the scripted navigation.
