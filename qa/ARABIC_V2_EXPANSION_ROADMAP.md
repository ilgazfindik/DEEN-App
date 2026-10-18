# DEEN Arabic V2 — beginner-to-advanced question expansion

This is a **development roadmap**, not a claim that future question sets have shipped.

## Baseline and current staged work

- Existing packs A–F: **600 validated written questions**, 25 active written lessons, 2 independent listening lessons blocked until cleared audio.
- PR #125 / Pack G: **300 additional original written questions** (letters 56, harakat 81, sukūn/shadda/madd 81, MSA word segmentation/assembly 82).
- Target after Pack G integration: **900 questions** / 7 packs. Preserve the old 600 immutable IDs, spaced-repetition records and all learner XP/hearts.
- Pack G's everyday standard-Arabic spelling examples are *not* Qur'an quotations, translation, or recitation. Keep that distinction visible during pedagogy review.

## Next planned iterations — one verified batch at a time

| Step | Scope | Suggested next batch | Level |
| --- | --- | ---: | --- |
| H | Common basic nouns, pronouns, demonstratives and 5-language written meanings; recognition, comparison, distractor correction | +300 | A1 / beginner |
| I | Simple nominal sentences, adjective–noun agreement, basic prepositions and everyday word order; example-based feedback | +300 | A1–A2 |
| J | Past and present verbs, person/number markers, affirmative/negative and simple questions | +300 | A2 |
| K | Iḍāfa, definiteness, plurals, common verb patterns, sentence-level matching, error detection | +300 | A2–B1 |
| L | Longer authentic contexts, comprehension, grammar in context, multi-step questions and graduated written assessment | +300 | B1+ |

These are **targets**, not fabricated counts or finished assets. Advanced Qur'an examples and meanings must be source-attested, distinguished from original MSA examples, and human-reviewed. Do not invent verses, tafsir, or audio. Do not equate the planned written progression with full Arabic fluency.

## Incremental quality gates

1. Preserve old question IDs, answer IDs, old progress and data schema. A new bank must not disturb existing learner records.
2. Five locales: Turkish, English, Arabic, German, French for question, feedback, explanations and answer labels. Qur'an text must remain original Arabic.
3. Quiz variety: A–D, genuinely interactive matching, joining and progressively more complex question types supported by the real renderer. Do not multiply a single question merely by shuffling choices.
4. Audits: unique targets, correct options, rationale for every distractor, accurate grammar, age-appropriate scaffolding, 320/360/390 px real Chrome checks, RTL and offline boot integrity.
5. Signed manifest and service worker resources must be updated when production assets change. Do not merge or deploy after failed required QA.
6. Formal expert review for Arabic grammar, religious content, Qur'an transliteration/meaning and all new audio before claiming certified accuracy.

## Deferred audio handoff — only after written curriculum stabilizes

When the user asks for the final recording list, export **unique actual** needed sound assets, not every question, with Arabic script, optional transliteration, recording ID, stage, speaking style, approved-source notes and required rights. The inventory should cover outstanding letter names, short-vowel syllables, sukūn, shadda, long-vowel contrasts, word readings, then short phrases and sentences. Reuse validated recordings rather than requesting duplicates. **Do not block text-only exercises while audio is absent.**

## Current limit

Pack G expands the **existing** curriculum and is written-only. New advanced course chapters, separate teaching tips, additional interactive renderers and licensed recordings are **not** claimed as completed by Pack G.
