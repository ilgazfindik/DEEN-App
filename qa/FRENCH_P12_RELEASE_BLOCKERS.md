# DEEN — French P12 production readiness blockers

Status: staging only. No automated test can grant independent French language,
Islamic content or licensing signoff.

### Machine-readable review queue
qa/FRENCH_P12_HUMAN_REVIEW.staging.json tracks 11 independent acceptance areas.
All start pending. A submitted reference is not a verified signoff.

### Auditable release gate
Run:
    node scripts/audit-french-release-readiness.mjs

A green staging CI confirms FR stays blocked. To verify failure on a
hypothetical premature production release, run:
    FR_RELEASE_ENFORCE=1 node scripts/audit-french-release-readiness.mjs

### Candidate licensed French Quran meaning sources — no selection yet
QuranEnc official API and republication terms:
https://quranenc.com/en/home/api/
The source requires unchanged translation, attribution, edition version,
maintenance of transcript info, source updates, and restrictions on
inappropriate advertising. Review DEEN subscriptions and ads for compliance.

Quran Foundation developer terms:
https://api-docs.quran.com/legal/developer-terms/
In-app consumer display is distinguished from separately republishing
a dataset/content bundle. Static files in a public app require scrutiny.

Neither source is approved for DEEN merely because terms were found.
Select a specific edition and version, document permissions, and obtain
native French and independent Islamic content review before release.

### Remaining external dependencies
- ElevenLabs authorized API execution and 90 real audio word timestamps.
- Audio listening/tajwid and per-file commercial rights review.
- French meaning publisher/translator, allowed redistribution and license.
- U13 Turkish source matching, cross-language review and P10 policy copy.
- Real iOS/Safari, Android/Chrome and French-selected app QA, including
  navigation, accessibility, offline, grading, storage and rollback.
- Do not set fr.question_data, global_qa or expert status to passed.
