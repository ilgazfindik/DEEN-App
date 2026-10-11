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
| U01 remaining base questions | 0 | 86 |
| U02–U15 | 0 | 1,400 |
| Active U01 questions and runtime variants | 0 | Pending inventory |
| German game UI, Quran and premium interface | 0 | Complete localization pending |

**Total: 14 / 1,500 base questions translated in staging; 0 German game questions published.**

The file `assets/i18n/questions/de/staging/U01-S01.json` retains original Turkish question metadata and a separate German display for each question. Multiple choice, true/false and fill-in-the-blank structure and correct-answer indices are preserved. `expert_approved`, `verified_by_religious_expert` and `native_reviewer_approved` are false.

## Gates and tests
- `node scripts/audit-german-staging.mjs` verifies all 14 source IDs, source metadata, blanks, options, correct answers and the still-blocked German language manifest.
- Do **not** activate German gameplay or set `global_qa: passed` while any part of the 1,500-question bank, active runtime variations or screen translation is missing.

## Next slice
Translate U01-S02 and remaining U01 questions in batches. Add German runtime variations, screen translation, real Chrome checks and linguistic/religious review before production readiness.
