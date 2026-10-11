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
