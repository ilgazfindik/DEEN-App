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
| U01-S05–S07 base questions | 0 | 42 |
| U02–U15 | 0 | 1,400 |
| Active U01 questions and runtime variants | 0 | Pending inventory |
| German game UI, Quran and premium interface | 0 | Complete localization pending |

**Total: 58 / 1,500 base questions translated in staging; 0 German game questions published.**

The files `assets/i18n/questions/de/staging/U01-S01.json`, `U01-S02.json`, `U01-S03.json` and `U01-S04.json` retain original Turkish question metadata and a separate German display for each question. Multiple choice, true/false and fill-in-the-blank structure and correct-answer indices are preserved. `expert_approved`, `verified_by_religious_expert` and `native_reviewer_approved` are false.

## Gates and tests
- `node scripts/audit-german-staging.mjs` verifies all 58 source IDs across four stages, source metadata, blanks, options, correct answer indices, matching pair identity and the still-blocked German language manifest.
- Do **not** activate German gameplay or set `global_qa: passed` while any part of the 1,500-question bank, active runtime variations or screen translation is missing.

## Next slice
Continue with U01-S05 (16 questions), S06 (12), S07 (14) to complete the 42 remaining U01 base questions. Add German runtime variations, screen translation, real Chrome checks and linguistic/religious review before production readiness.

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
