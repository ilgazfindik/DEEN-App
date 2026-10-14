# DEEN — Français P09: guarded runtime content integration

## Status and evidence
- Branch/PR: `codex/french-stage1-20261013` / [PR #57](https://github.com/ilgazfindik/DEEN-App/pull/57).
- Isolated assembled Chromium QA: [Actions #38583252686 — SUCCESS](https://github.com/ilgazfindik/DEEN-App/actions/runs/38583252686), mobile 390×844 + desktop 1280×820.
- Full source-pack/VM audit: [Actions #38582888951 — SUCCESS](https://github.com/ilgazfindik/DEEN-App/actions/runs/38582888951).
- **Production French remains blocked.** This does not certify real user-facing selection/reload or a finished French localization.

## Implemented
1. `assets/i18n/content.js`: real `DEEN_CONTENT_LOCALE.translateText()` now accepts French *when its packs have already passed the guarded content preload*. Previously it only accepted English and returned source text unchanged for French.
2. **Context-scoped French safety:** French helper text, questions, explanations, answers, list items and matched pairs are translated only when the original `session.questions[session.index].__deenSourceQuestion` is an exact source match to an existing French entry. If no active source question exists or the text is unknown, `translateText()` returns the original instead of using an unsafe language-wide glossary. English's existing global fallback remains unchanged.
3. Updated the pinned `content.js` SHA-256 inside `index.html`: `6aacded85c8c5fd092e4c33e3103ebf314fdbca4b7dbc609574845f5da95cdd5` → `276cc9eaa36e088dbf400aa3bbfc904838be4c380872ab7e1d04c474618b8059`.
4. `scripts/test-french-staging-preview.mjs`: real VM adapter checks source-validated French translations across question types (options, matching, sequence, fill blanks), source-tamper rejection, unknown-text fallback, lack-of-session fallback and Turkish unchanged.
5. `scripts/test-french-real-chromium-staging.mjs`: executes the original assembled app's `DEEN_CONTENT_LOCALE.translateText` for multiple-choice, matching, build-sequence and fill-blank questions. This is **not** a replacement-only DOM translation check.

## Confirmed results
- **1,500/1,500** foundational question translations and **1,484/1,484** active question source mappings preload and match in staging; the 18-pack fixture remains ephemeral and source-hash validated.
- **Mobile and desktop: four content categories plus missing-active-question fail-closed checks** passed. Native `questionLinked=true`, `explanationLinked=true`, `unchangedOnUnknown=true`. Multiple-choice correct-answer index preserved.
- Browser QA's existing French lesson grading and source-matched feedback passed on both viewports.
- Quran source preservation: **two Chromium viewports passed**, audio files present but **0/90 word-timing entries**, and no Quran French meaning release.
- P08 language-state persistence re-ran and passed on both viewports: `FR_P08_SUMMARY.status=passed`.
- The optional deliberate hot-swap test of other lesson types logged **2 forced-render warnings per viewport**. It is not evidence that all quiz modes/real navigation are fully regression-certified and remains a separate QA risk.

## Explicit release blockers / remaining P09–P10 scope
- `assets/i18n/content-support.json` **not changed**: `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false`. French must not be advertised as selectable production learning content.
- French UI labels (1,452 baseline and additional Quran labels) remain **staging preview mappings**, not completed production rendering. This work adds a source-scoped content bridge, not universal UI localization.
- Human native French, independent Islamic/religious, exact source and usage-rights review are not complete.
- Full real-app UI, multi-device, Safari/iOS and exhaustive 1,500-question grading regression are not complete.
- Arabic Quran verses, original Quran meaning, recitation files and rights metadata unchanged.
- **No merge to `main`, no Pages deploy.**
