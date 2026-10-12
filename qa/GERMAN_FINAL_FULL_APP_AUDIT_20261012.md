# DEEN German final full-app locale audit — 2026-10-12

> **Deployment decision: BLOCKED.** This audit is intentionally not a religious, legal or native-language approval. A green staging CI does not mean the German application is ready for production.

## Verified inventory

| Surface | Verified status |
|---|---|
| German entry/onboarding | German copy exists; no evidence of an end-to-end approved production German lesson flow |
| English UI translation reference | 1087 source strings |
| German staged UI dictionaries | 1442 distinct German strings across twelve files |
| Source-key overlap with English reference | 1087/1087 |
| **English reference keys without German catalog match** | **0 (catalog only; runtime not certified)** |
| German strings outside English reference | 355 (dynamic, lesson, Quran controls and Premium screens) |
| German base question staging | 1,500 questions (not live/approved) |
| German active lesson questions | 1,484 source questions, source-matched in staging only |
| German stored runtime variants | 20, plus 100 legacy renderer records in staging |
| Quran Arabic and original audio | Unchanged; 90 canonical original ayahs |
| Quran German meaning drafts | 90/90, all without religious/native/rights approval |
| German production manifest | question_data=missing; global_qa=blocked; religious_expert_approved=false |
| German production DOM translation engine | Not wired to startup; only English and Arabic live renderers are invoked |
| German full-browser E2E QA | Not completed |

## Fixes implemented in staging during this audit

- Language-change rejection now uses **the target language** for its explanation, so selecting German from an existing Turkish profile does not show a Turkish-only blocked-language sheet.
- German not-ready message explains pending review and lists all available alternatives including English.
- Embedded SHA-256 startup asset hashes in `index.html` rebuilt for these changes; existing 67 versioned release-segment hashes were not touched.
- `scripts/audit-german-full-release-readiness.mjs` added to German CI: counts live-UI reference gaps, verifies the production blocker, and asserts all 90 Quran meaning drafts remain unapproved.


## Progress since initial audit

- **Batch 01 — 2026-10-12:** added 120 verified source-keyed German UI wording **drafts** for religious vocabulary, ablution/prayer/fasting labels, and first learning-unit headings to `assets/i18n/german-ui.reference-batch-01.staging.json`.
- 850 → **730** English UI reference keys without a German catalog mapping. Exact overlap is now **357/1,087**, with **712** distinct German staging labels across five dictionaries.
- These translations are not wired into a production German UI renderer, and religious/native German approval is still outstanding. The batch remains **staging-only** and cannot be deployed as a fully translated UI.
- `scripts/test-german-ui-reference-batch-01.mjs` checks all 120 exact source keys, English reference meanings, duplication, approval flags and fail-closed German release. `scripts/audit-german-full-release-readiness.mjs` inventories the 610 remaining keys.

- **Batch 02 — 2026-10-12:** added another **120 source-matched German UI drafts** for learning paths, review actions, faith and tawhid lesson titles to `assets/i18n/german-ui.reference-batch-02.staging.json`. Another 20 interpretation-sensitive headings were flagged for native German and subject-matter review. Reference coverage **357 → 477 / 1,087** and unmatched UI reference keys **730 → 610**. Total staged German UI labels **832** in six dictionaries. New `scripts/test-german-ui-reference-batch-02.mjs` checks both batches, no collisions, exact source keys and blocked release.

- **Batch 03 — 2026-10-12:** added **120 German UI reference drafts** for the Shahada, listening and sequencing exercises, tawhid, and introduction to Islam's five pillars. The first **360/850 missing baseline references** are covered; **490 are still unmatched**. German staging has **952 unique UI labels** across seven catalogs, of which **597/1,087** match the English baseline. Flagged **21** religious/context-dependent terms and **two inconsistent source references**: the Turkish key says 'Türkçe' while its English gloss says 'English'. Staging only; expert, native and rights gates remain blocked.

- **Batch 04 — 2026-10-12:** added **120 German staging labels** for pillars of Islam, prayer, zakāt, fasting, Hadsch and six articles of faith, including match/review/Challenge titles. All four remediation batches now cover **480/850** originally unmapped reference keys, leaving **370** missing. There are **1,072 staged German UI keys** across eight catalogs, **717/1,087** matching the English baseline. **20 religiously sensitive expressions** require native-language and Islamic scholarly review, especially Qadar/Qadāʾ and the distinction between faith principles and pillars. CI checks remain fail-closed; no runtime/deploy.

- **Batch 05 — 2026-10-12:** added **120 German staging labels** for classifying pillars vs faith articles, angels, divine knowledge, revelation, and holy scriptures. **600/850** originally missing reference keys now have German drafts; **250 remain**. German UI staging now has **1,192 distinct labels across nine catalogs**, with **837/1,087** source-reference key matches. **25 sensitive religious expressions** await native German and Islamic expert reviews; production is still blocked.

- **Batch 06 — 2026-10-12:** added another **120 German UI wording drafts**, covering prophets, the Hereafter, divine decree, prayer, ritual purity, fasting and first-run onboarding. Cumulative reference remediation: **720/850 source keys**, leaving **130** unmatched. Total: **1,312 unique staged UI translations** across ten catalogs, **957/1,087** English reference key matches and 355 other dynamically used strings. **20** religious terms require expert/native review. The batch's onboarding labels are staged only; runtime is NOT German enabled. CI validates all six batches and unchanged release gates.

- **Batch 07 — 2026-10-12:** added **120 independent German UI drafts** for the faith/worship section overview and learning goals, learning-series badges, review/progress, developer controls, expert-verification panel and lesson metadata to `assets/i18n/german-ui.reference-batch-07.staging.json`. All source keys and 120 English glosses are pinned to the unchanged baseline.
- The seven 120-key batches now remediate **840/850** originally missing baseline keys; **10** remain. Across eleven staged UI dictionaries there are **1,432 distinct German strings**, of which **1,077/1,087** align to English reference keys and 355 belong to dynamic/other UI surfaces.
- **38** doctrinal, review-status or potentially misleading interface expressions need explicit expert/native-language attention, particularly fiqh/mezhep, the distinction between learning points and worship, and the panel's Turkish translation label. The last label remains accurately marked *Turkish*, not deceptively called *German*.
- `scripts/test-german-ui-reference-batch-07.mjs` checks source ordering across all seven batches, reference gloss fidelity, numeric integrity, overlapping keys, the exact ten missing references and the unreleased manifest/Quran review state. CI now invokes this test and the full readiness counter covers all eleven staged dictionaries. **No main merge, production language activation or deploy.**

- **Batch 08 — 2026-10-12:** filled the last **10 source-identified German UI reference labels** in `assets/i18n/german-ui.reference-batch-08.staging.json`: section 1 final, mastery lock/heading, a fiqh school-differences disclaimer and six Latin-script surah titles. Original Arabic ayahs/audio unchanged.
- English-reference key coverage is now **1,087/1,087 (100% of this static catalog)**, with **0 catalog gaps**. There are **1,451 unique staged German UI labels in thirteen dictionaries**, including 355 dynamic/modern UI strings outside the reference baseline. This is **not** proof of German-only runtime screens.
- `scripts/test-german-ui-reference-batch-08.mjs` verifies the exact source ordering and English glosses across batches 01–08, count integrity, approved-language flags remaining false, unchanged Quran source metadata and no duplicate keys. The full-release audit now enforces zero reference gaps; CI invokes batch 08.
- All ten additions await native German/Islamic expert review, including the accuracy of romanized surah headings and the mezhep legal-differences note. **No production activation, qualified human signoff, main merge or deploy.**

## First German UI source-guarded DOM staging adapter — 2026-10-12

- Added `assets/i18n/german-ui.renderer.staging.mjs`, an **importable QA-only browser DOM adapter** over all 12 staged German UI dictionaries (1,442 unique source keys and 1,087/1,087 static reference-key coverage).
- The QA renderer translates **exact original Turkish text nodes and text-bearing attributes** (title, alt, placeholder, aria-label). It runs the existing German dynamic formatter for supported counters and dependent labels; it does **not** guess unknown translations or replace arbitrary substrings.
- It does not mutate Arabic Quran content and skips marked Arabic, editable, and explicitly excluded regions. It preserves surrounding whitespace; repeated passes are idempotent and new Turkish text generated by a redraw can be translated on the next explicit pass.
- The adapter refuses requests unless the caller passes `qaMode:true` and `locale:'de'`. It refuses missing/corrupted staged dictionary metadata, duplicate conflicting labels and publication flags inconsistent with staging. **Neither index.html nor boot.js loads this adapter**. `content-support.json` remains blocked for German gameplay.
- Added `qa/german-ui-staging-preview.html` as a **standalone static QA fixture**, not the live DEEN application. It tests representative onboarding, home, lesson, Quran, Premium and progress labels, preserving Arabic Quran lines, and reports unresolved Turkish labels.
- Added `scripts/test-german-ui-renderer-staging.mjs` in German CI for exact/dynamic strings, text and attribute passes, whitespace, unknown-label accounting, Arabic-exclusion, repeated render and language/release-gate rejection. QA preview can be opened locally from a checkout of the PR branch using a static HTTP server.
- **Not yet completed:** mounting this on the actual full app in a controlled release-candidate environment; observing every dynamically rendered screen; real Chrome/mobile E2E; source/signature-aware question feedback UI; human language/subject-matter and rights approval. There is **no full German production activation or deploy**.

## Real legacy lesson DOM integration QA — 2026-10-12

- Inspected the **actual release asset** `release/v9.9.3-direct/segment-01.txt`, not just the isolated HTML fixture. Verified real `#lesson`, `#quizView`, `#qStage`, `#qMeta`, `#questionText`, `#answerArea`, `#feedbackTitle`, `#feedbackText`, `#resultView`, `#finalStrengths` and `#finalReview` selector identities in CI.
- **Critical translation safety fix:** the staging DOM adapter now excludes answer/source-signature-sensitive lesson sections (`#questionText`, `#answerArea`, `#feedbackText`, feedback body and result concept fields), question-arena alternatives, Quran meaning and Arabic text surfaces. Generic UI dictionary replacement MUST NOT modify graded question answers; they require the separate source-verified German question adapter.
- Static source inventory identified nine real lesson shell strings absent from the 1,442-key catalog. Added `assets/i18n/german-ui.real-lesson.staging.json` with the exact nine Turkish source labels and drafted German copies, tied to the shipped `#lesson` source markup; `scripts/test-german-ui-renderer-staging.mjs` checks the exact source strings still exist in `segment-01.txt`.
- Added a source-guarded `Ünite N · Aşama M` number formatter to the existing dynamic staging module with tests for units 1 and 15. A standalone `gün` next to `#lessonStreakMini` is **context-sensitive** and is now rendered as *Tag* for one day or *Tage* for other integer day counts in QA; unknown counts remain untranslated rather than guessed. `DEEN`, `XP` and `COMBO` are preserved international tokens, not Turkish leaks.
- The **QA staging inventory now contains 1,451 unique German interface mappings in 13 dictionaries**, covering all 1,087 English baseline references and 364 additional strings outside that static reference. This is **not** a production German-screen completeness measurement.
- The staged renderer and test suites remain inaccessible from `index.html`/`boot.js`; `de.question_data=missing`, `de.global_qa=blocked` are unchanged. **No main merge or live deployment.**

## Remaining release blockers (priority order)

1. **Verify all runtime UI strings and connect an approved renderer.** The initial 850 missing English-reference keys now have German staging drafts, but the baseline is not an exhaustive inventory of live/dynamic UI; browser/state-dependent Turkish leftovers must still be identified and handled.
2. **Install a German DOM/runtime UI renderer** equivalent in quality to the English renderer, including dynamic values, result panels, progression, profile, Premium and every Quran control. The current startup injects English and Arabic rendering, not a released German renderer.
3. **Complete independent religious/native German review** of 1,500 base questions, live variants and 90 Quran meaning drafts, maintaining exact right-answer source identity, Qur'an verse identity and unmodified Arabic recitation.
4. **Complete rights/copyright and source attribution review** of Quran meaning publication and any other translated religious content.
5. **Run real mobile and desktop Chrome E2E on a full German release candidate**, including first-run language selection, changing language while logged in, all tabs, multiple question types, wrong/correct feedback, audio, results, Premium, Quran, review and profile.
6. **Only after those gates and explicit QA acceptance**, update release manifest and assets, verify startup hashes, merge to main and inspect the actual GitHub Pages URL.

## Remaining unmatched baseline UI reference keys

**0 / 1,087.** All static English-reference keys have German staging entries after batches 01–08. The 10 keys listed after batch 07 have been individually translated. This is catalog inventory coverage, **not verified native German wording approval or full interactive UI coverage**.

## Audit scope limitation

The catalog comparison uses the English reference file, which is not itself a complete enumeration of every dynamically assembled Turkish screen string. Runtime/browser QA may still reveal **additional** Turkish strings. The zero count above therefore does **not** certify German-only UI runtime coverage.

**Do not merge or deploy the German release until all blocker conditions are cleared.**
