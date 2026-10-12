# DEEN German Completion — Resume Point (2026-10-12)

## Source of truth and safety
- Repo: `ilgazfindik/DEEN-App`, stacked [PR #55](https://github.com/ilgazfindik/DEEN-App/pull/55), branch `codex/german-runtime-u01-live-s01-s02-20261012`. Its base is `codex/german-final26-20261012`, not main.
- `main` last verified `38e990cb820bea80b67bd1e20a415087329aabe0`: the separately merged companion picker JavaScript hotfix, successfully deployed via [Pages run 38296761001](https://github.com/ilgazfindik/DEEN-App/actions/runs/38296761001).
- **German production must remain unavailable**: `assets/i18n/content-support.json` has `de.question_data=missing`, `de.global_qa=blocked`, and `de.religious_expert_approved=false`. Do not set approvals without signed reviewer evidence or release 90 untranslated/unchecked Quran meanings. Never modify original Arabic recitation.
- Previous QA-ready assets include 1,500 German base question drafts, 84 active U01, 20 stored U01 variants, 100 legacy variants, 1,452 UI reference translations (1,087 English reference keys), and 90 draft German Quran meanings. Status: **model drafts, human review pending**.

## Work completed after Astra's token interruption

1. **Authentic de-locale runtime acceptance harness**, not just a Turkish profile showing German questions:
   - `scripts/build-german-e2e-preview-config.mjs` verifies the production manifest is blocked, then generates a **disposable 127.0.0.1-only** manifest fixture with 114 staged German packs, every source SHA-256 pinned. Synthetic QA approval is injected **in browser memory only**. Neither the real manifest nor app release approvals are changed.
   - `scripts/test-german-true-locale-preview.mjs` selects Deutsch from the actual chooser; invokes real `DEEN_BOOT.prepare()`, validates 1,500/1,484 source-matched German questions (0 failed IDs), then enters real U01-S01. The engine selects 12 U01 questions and localizes questions **lazily**, one by one. All 12 German question renderings were checked, including fill blanks, matching, true/false and scenario types.
   - [Successful real-German runtime run 38307451645](https://github.com/ilgazfindik/DEEN-App/actions/runs/38307451645).

2. **True de-locale UI audit**:
   - Applied the existing 13-pack staging UI renderer *explicitly in the QA browser*. Scanned 997 real elements after German session boot; the five newly detected Turkish teaching-card strings were translated in `german-ui.dynamic.staging.mjs` and covered by dynamic tests. No generic rewriting of graded content/Arabic.
   - [Successful real de-locale UI run 38307900632](https://github.com/ilgazfindik/DEEN-App/actions/runs/38307900632): 997 scanned, 0 detected unresolved Turkish, 0 JS errors, Arabic/grade source unchanged.

3. **Real German correct-answer grading**:
   - Under `window.DEEN_APP_LOCALE.get()==='de'`, selecting the correctly translated German answer gave `session.correct=1`, the feedback panel opened, and source-matched German explanation was shown.
   - Found `Evet, doğru!` during true-German grading and fixed it to `Ja, richtig!`. The [new correct-answer Chromium run 38308368159](https://github.com/ilgazfindik/DEEN-App/actions/runs/38308368159) passed, preserving the exact German explanation and changing only the QA-only feedback chrome.
   - `Kısaca:` explanation wrapper is changed to `Kurz gesagt:` **only in the source-checked disposable QA context**; shipped content and grade signature are protected.

   - **Negative-answer branch also verified:** [Chromium run 38308765160](https://github.com/ilgazfindik/DEEN-App/actions/runs/38308765160) selected the wrong German answer in a fresh true-de U01 lesson; `session.correct===0`, feedback visible, 0 Turkish UI-signal residues after QA localization, explanation still source matched. Correct-answer tests were rerun in the same CI job and passed. The Turkish source wrappers are handled only by source-guarded disposable QA display logic, not by a globally enabled production renderer.
   - **Release gate unchanged:** human/native/rights approvals are still pending, so neither the runtime QA preview nor the UI QA overlay is available to live users.

4. **Qualified reviewer handoff**:
   - `scripts/export-german-human-review.mjs` creates review-pending JSONL records for all 1,704 German question versions and all 90 Quran meaning drafts, preserving source, display, stage, audit scope, approval fields, and licensing/attribution evidence gaps. A separate Actions artifact `german-review-required-1704-plus-90` is configured.
   - This dossier does **not** constitute native German, theologian, licensing, or Quran translation approval.

5. **CI**:
   - Updated `.github/workflows/german-browser-staging-qa.yml` to run the old preview, existing page navigation + 10-modal suite, full German question source audit, local manifest preview, real German bootstrap/render/grading, and reviewer export. All steps fail closed with evidence artifacts.

## Outstanding work (must not be misreported as completed)
- Verify the latest head SHA and passing status of the **new** end-to-end suite following the correct-answer toast change.
- Extend true-de test beyond U01-S01: wrong answer; subsequent stages; matching, fill, order interactions; feedback; review; results; fresh onboarding; language changes; offline/slow-network; mobile and desktop cross-regression.
- UI renderer is **QA opt-in** rather than a production-authorized complete German bridge; production manifestation remains intentionally blocked.
- Quran: 90 German ayah meanings are drafts with native, theological, source, attribution, and rights reviews still required. Audio/Arabic must remain untouched.
- Native German reviewer and qualified Islamic expert must sign off with evidence before any release flag changes; complete E2E and PR stack sequencing then release and verify GitHub Pages. **No German deployment occurred in this stage.**

## Resumption protocol
1. Verify branch HEAD and [PR #55](https://github.com/ilgazfindik/DEEN-App/pull/55), then inspect GitHub Actions for that exact commit.
2. Read `qa/GERMAN_COMPLETION_PROGRESS.md` and `qa/GERMAN_FINAL_FULL_APP_AUDIT_20261012.md`.
3. Resume at the first failing test; do not recreate the 1,704 translations or reset the PR stack.
4. Commit each verified fix, preserve all Arabic/Turkish/English assets and never self-approve religious content.

## Latest verified regression and remaining release blocker

- Last verified **real-German runtime + UI + correct and wrong grading**: [GitHub Actions 38308765160](https://github.com/ilgazfindik/DEEN-App/actions/runs/38308765160), `success`, run SHA `77f40f600b82782b4f460e40ee37ce72ef2691c8`. It includes 1,704 version source tests, actual 1,500/1,484 loaded content count, 12 U01-S01 question renderings, 997 element UI scan, correct and wrong grading, original Arabic protection, JS error collection, reviewer dossier generation.
- Review package artifact: see `german-review-required-1704-plus-90` on that Actions run. Expert/native/licensing status of all items remains **pending**.
- Unblocked engineering task: review and implement a **production-grade German UI and Quran translation bridge only after approval**, then run first-run onboarding, saved progress/language switches, matching/fill/sequence, end-of-stage, Quran/audio, all 15 units, screen readers and mobile/desktop regressions with the real `de` runtime. Current QA is **not** approval for real German deployment.

