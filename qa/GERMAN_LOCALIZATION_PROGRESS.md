# DEEN — German localization progress

Last updated: 2026-10-12

## Product objective
- Priority: Germany, Austria and German-speaking Switzerland; family-friendly learning and future premium subscriptions.
- Language standard: natural Standard German with consistent **du** address.
- Keep Quranic Arabic scripture intact; qualified religious and German native-speaker review are **not yet performed**.

## Verified starting state
- Deutsch already exists in the entry language picker and has onboarding copy in `assets/i18n/locale.js`.
- `assets/i18n/content-support.json` marks German lessons as missing, global QA blocked.
- The runtime requires all 1,500 base and 1,484 live questions and will refuse incomplete language packs.
- English, Turkish and Arabic must remain untouched.

## Stage-by-stage progress

| Content | Completed | Remaining |
| --- | --- | --- |
| U01-S01 / 14 base questions | 14 staged | 0 |
| U01-S02 / 14 base questions | 14 staged | 0 |
| U01-S03 / 14 base questions | 14 staged | 0 |
| U01-S04 / 16 base questions | 16 staged | 0 |
| U01-S05 / 16 base questions | 16 staged | 0 |
| U01-S06 / 12 base questions | 12 staged | 0 |
| U01-S07 / 14 base questions | 14 staged | 0 |
| U02-S01 / 14 base questions | 14 staged | 0 |
| U02-S02 / 14 base questions | 14 staged | 0 |
| U02-S03 / 14 base questions | 14 staged | 0 |
| U02-S04 / 16 base questions | 16 staged | 0 |
| U02-S05 / 16 base questions | 16 staged | 0 |
| U02-S06 / 12 base questions | 12 staged | 0 |
| U02-S07 / 14 base questions | 14 staged | 0 |
| U03-S01 / 14 base questions | 14 staged | 0 |
| U03-S02 / 14 base questions | 14 staged | 0 |
| U03-S03 / 14 base questions | 14 staged | 0 |
| U03-S04 / 16 base questions | 16 staged | 0 |
| U03-S05 / 16 base questions | 16 staged | 0 |
| U03-S06 / 12 base questions | 12 staged | 0 |
| U03-S07 / 14 base questions | 14 staged | 0 |
| U04-S01 / 14 base questions | 14 staged | 0 |
| U04-S02 / 14 base questions | 14 staged | 0 |
| U04-S03 / 14 base questions | 14 staged | 0 |
| U04-S04 / 16 base questions | 16 staged | 0 |
| U04-S05 / 16 base questions | 16 staged | 0 |
| U04-S06–S07 base questions | 0 | 26 |
| U05–U15 | 0 | 1,100 |
| Active U01 questions and runtime variants | 0 | Pending inventory |
| German game UI, Quran and premium interface | 0 | Complete localization pending |

**Total: 374 / 1,500 base questions translated in staging; 0 German game questions published.**

The files `assets/i18n/questions/de/staging/U01-S01.json`, `U01-S02.json`, `U01-S03.json`, `U01-S04.json`, `U01-S05.json`, `U01-S06.json`, `U01-S07.json`, and U02-S01 through U02-S05 retain original Turkish question metadata and a separate German display for each question. Multiple choice, true/false and fill-in-the-blank structure and correct-answer indices are preserved. `expert_approved`, `verified_by_religious_expert` and `native_reviewer_approved` are false.

## Gates and tests
- `node scripts/audit-german-staging.mjs` verifies all 374 source IDs across twenty-six stages, source metadata, blanks, options, correct answer indices, matching pair identity and the still-blocked German language manifest.
- Do **not** activate German gameplay or set `global_qa: passed` while any part of the 1,500-question bank, active runtime variations or screen translation is missing.

## Next slice
The next 100-question batch is U04-S06 (12) + U04-S07 (14) + U05-S01 through U05-S05 (74). Keep German staging blocked until bank, runtime variants, UI, Quran and qualified reviews are complete. Add German runtime variations, screen translation, real Chrome checks and linguistic/religious review before production readiness.

## Latest stage batch: S02 and S03
- S02: 14 questions including three matching exercises and three fill-blank exercises.
- S03: 14 questions including six matching exercises and four missing-item questions.
- Structural coverage: stable IDs, same Turkish source snapshot, answer indices, blank counts, matching cardinality and label uniqueness.
- Native German and religious expert review remain pending. Status stays staging-only; no gameplay unlock and no user-content fallback.

## Latest stage batch: S04 — values in everyday life
- Added 16 German translations: 9 scenarios, 5 error-spotting tasks, 2 multiple-choice questions.
- German uses clear, child-friendly, Standard German for honesty, patience, respectful communication and responsible choices.
- Turkish source metadata, four answer choices per question, correct-answer position and activity types remain intact.
- No gameplay activation and no native-speaker or religious-expert approval is claimed. This remains an unreleased staging pack.

## Latest stage batch: S05 — apply what you learned
- Added 16 German staging translations: 3 multiple choice, 3 fill-blank, 3 true/false, 4 scenarios, 2 matching exercises and 1 error-spotting task.
- Preserved Turkish source fields, option order, correct-answer index, blank count and matching-cardinality/identity constraints. German explanations and stage instructions were also translated.
- Human German native-speaker and religious expert approval are **not** claimed. All German game screens and incomplete bank remain unavailable in runtime.

## Batch 100 — U01 closure and U02-S01 through S05
- Added **exactly 100 new base-question translations**: U01-S06/S07 (26) and U02-S01 through U02-S05 (74).
- Cumulative U01: **100/100**; U02: **74/100**; German staged bank: **174/1500**.
- All 12 stage packs preserve source snapshots, activity types, answer choice order and correct index, blank counts and matching structure.
- German remains staging-only, with no native or religious expert approval and no activation of German gameplay.

## Batch 100B — U02 closure and U03-S01 through S05
- Added **100 new translated questions**: U02-S06/S07 (26) and U03-S01 through U03-S05 (74).
- Overall staged: **274 / 1500**. U01 **100/100**, U02 **100/100**, U03 **74/100**.
- U03-S03 contains listening-style questions whose German translations are text-only and do **not** establish audio QA.
- U03-S04 contains sequence exercises. Their German cards retain the original correct ordering permutation; transliterated Arabic fragments are preserved, with a localized German-meaning sequence.
- No native German-speaker or qualified religious expert approval. German gameplay remains fail-closed.

## Batch 100C — U03 completion and U04-S01 through S05
- Added **exactly 100 new German basic questions**: U03-S06 and S07 (26) + U04-S01 through S05 (74).
- Cumulative staging: **374/1500**; U01, U02, and U03 are 100/100, U04 is 74/100.
- Included translated answer choices, explanations, matching pairs and Shahada listening/sequence prompt texts.
- Sequence permutations and fill-blank placeholder counts require release-gated structural verification. German listening translations are text-only and do not imply audio verification.
- German-native language review and religious expert review are outstanding. Incomplete German gameplay remains blocked.
