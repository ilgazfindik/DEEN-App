# DEEN v9.12.03 — Pickthall (1930) English translation QA

## Scope
- 16 surahs, 90 ayahs; English only. Existing Arabic and Turkish translations remain unchanged.
- English meanings were transcribed from the Pickthall edition labeled `en.pickthall` (Tanzil text, 2010-09-04 transcription).
- English source rights: Marmaduke W. Pickthall, *The Meaning of the Glorious Koran* (1930), public domain in the U.S. and life+70 countries.
- Primary rights reference: https://commons.wikimedia.org/wiki/File:The_Meaning_of_the_Glorious_Koran_(1930).pdf
- Independent transcription: https://github.com/druvx13/Quran-data/blob/cairo/data/en.pickthall.tanzil.txt
- Transcription Git blob SHA: `ac39a0d7938e97f26a10bf8481b7e6407c4455a6`
- Public-domain proof: https://www.gutenberg.org/ebooks/16955
- Independent Project Gutenberg cross-check: https://www.gutenberg.org/cache/epub/16955/pg16955.txt

## Validation
- Source indexed verses: 6,236 / 6,236; chapters: 114 / 114.
- DEEN subcorpus selected: 90 / 90; surahs: 16 / 16; 0 missing verse IDs; 0 empty strings.
- Exact witness matches with Gutenberg's Pickthall column: 1:1, 1:2, 112:1, 112:2, 112:3, 112:4, 98:1, 98:2, 98:3
- Inline canonical FNV-1a UTF-16 checksum: `af731568` (guards against accidental asset alteration; not a cryptographic signature).
- Questions and answers pick the English record only when the app language is `en`; no Turkish fallback.
- The original `translation` (Turkish) and `arabic` record remain untouched; `translations.en` is an additive view.
- Repeated Arabic/meal safeguards from v9.12.01 remain in place.

## Review boundary
- `verification_status: production_ready` means the verse **source/index/text** checks passed for this historic edition.
- `expert_review_status: pending` and `religious_release_ready: false` are explicit; do not claim theologian approval.
- Pickthall's English is archaic; suitable as a historical sourced translation, not necessarily the best first choice for children.
- No new tafsir, AI paraphrase, TTS, or rights-uncleared English translation was generated.

## Per-surah mapping
| DEEN ID | Quran chapter | English verses |
|---|---:|---:|
| fatiha | 1 | 7 |
| ikhlas | 112 | 4 |
| falaq | 113 | 5 |
| nas | 114 | 6 |
| kafirun | 109 | 6 |
| nasr | 110 | 3 |
| masad | 111 | 5 |
| fil | 105 | 5 |
| quraysh | 106 | 4 |
| maun | 107 | 7 |
| sharh | 94 | 8 |
| tin | 95 | 8 |
| bayyina | 98 | 8 |
| zilzal | 99 | 8 |
| kawthar | 108 | 3 |
| asr | 103 | 3 |

## Source data caveats
- No exact English strings repeated within these 16 surahs.
