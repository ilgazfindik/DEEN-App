# English completion audit — 2026-10-11

Base main: `5daa0f487dce2823cce849ed57699646c043e4b9`. Branch: `codex/english-complete-20261011`.

## Verified
- Structural audit: 15 × 100 base questions, no translation-structure failures.
- Runtime pack audit: 84 live records, 20 variants, 100 legacy records.
- Manifest: 67 segment and 7 startup hashes match.
- JavaScript: 193 assembled inline scripts compile.

## Current work
- Real Chrome runs on Actions because local browser launch is blocked by socket permissions. No local browser test is recorded as passed.
- Audit legacy five-step Quran screens, dynamic grammar, accessibility and additional viewports.
- Eight duplicate source matching labels are preserved; exercise their actual matching controls before deciding whether they are defects.
- Religious expert and native reviewer approvals remain false; automated tests do not constitute either approval.

## Release gate
Pending browser evidence and independent UX review. Do not merge or deploy until the required gates pass.

## Resume checkpoint — legacy Quran module
- Baseline commit `bf9a760`: added Chrome capture of 161 surfaces (16 surahs × five learning steps, reveal, completion transition, memorization/reveal; seven arena types with feedback; 320/768/1440 widths).
- Actions `38167976816`: deep capture completed in real Chrome; downloaded and inspected DOM and Fatiha meaning screenshot. Capturing is not a language pass: baseline showed Turkish/mixed copy in legacy learning and memorization across all surahs.
- Root cause: these legacy routes were absent from previous tests; complete instructional strings were missing from English presentation and partial translations produced mixed sentences.
- Added complete learning/memorization copy, recall prompts, speaker labels, completion messages and counters. Arabic text and progress logic unchanged. Added a failing-on-residue gate to the deep test.
- Local Chrome remains blocked by socket permissions. Fixed Chrome run pending; do not merge/deploy.

### Legacy module verification
- Fix commit `d0faeb7`: Actions `38168306641` deep Quran Chrome test passed: 161 captures, zero detected Turkish residues, zero page errors, zero document-level horizontal overflow.
- Downloaded DOM/screenshots; visually reviewed Fatiha meaning and memorization. All five learning steps and first progressive memorization screens across 16 surahs are English.
- Extending checks to all 90 ayah learning entries, all five memorization levels, and final surah completion messages; these extended checks are not yet passed.

### Dynamic copy and duplicate matching module
- Corrected streak milestone remaining-days value (used milestone number instead of remaining number), singular/plural ayah/review/task/day/lesson/question labels, and arena pool labels.
- Keep surah names in surah headers instead of context-free question translations (e.g. Al-Ikhlas vs Sincerity).
- Added adversarial duplicate-label gameplay: all eight source records, selecting identical right labels with different hidden pair IDs. No labels or grading logic changed; Chrome result pending.

### Handoff follow-up — independent artifact verification
- Latest pre-change Actions `38168521636`: 11/11 completed successfully (10 real Chrome jobs plus structure).
- Inspected 379 actual Quran UI surfaces captured across 16 surahs, 90 ayahs, five memorization levels and seven arena types. Found unflagged ASCII-only mixed feedback `Correct. Devam edebilirsin.` in real successful arena answers, despite 0 Turkish-character leaks.
- Found `Sincerity` in the **surah identification** choice instead of the proper name `Al-Ikhlas`; source dictionary translates the religious concept correctly, but not the surah-choice context.
- Patched complete feedback before the generic translator, and use canonical surah names by the real choice value ID without modifying the question bank.
- Extended Chrome tests to check correct AND wrong outcomes for all seven Quran types, 64 real surah-choice sets, and both strings as release blockers.
- Validation for this follow-up commit pending; previous green checks must not be attributed to new changes.
