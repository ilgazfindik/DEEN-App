# DEEN — Français: Quran UI P07 classification and verified preview fixes

## Evidence
- PR: https://github.com/ilgazfindik/DEEN-App/pull/57
- Source snapshot: Chromium Actions #38577834940 (baseline, 48 mobile source tokens)
- Final Chromium Actions: https://github.com/ilgazfindik/DEEN-App/actions/runs/38579078376 (passed, mobile 390×844 and desktop 1280×820)
- Scope: **QA-only loopback French preview**, with the app's actual language still Turkish. **No production French feature launch**.

## Changes
- Added two **source-attested**, QA-only templates to `assets/i18n/fr/ui.quran-browser-dynamic.staging.json`: 
  - `Ustalık %{n}` → `Maîtrise : {n} %`
  - `{n}/{n} ayet {n}/{n} + Solid` → `{n}/{n} versets · {n}/{n} + solide`
- The composite progress string agrees with **the verse total (second count)**, not the trailing confidence/mastery count: `0/1 ayet 5/5 + Solid` → `0/1 verset · 5/5 + solide`.
- QA date renderer handles **all 12 observed Turkish abbreviated-month formats** without changing the app's Turkish date source: `14 Eki` → `14 oct.`; January and December endpoints tested.
- QA builder and Node/browser assertions now recognize **17 Quran dynamic templates** (previously 15), in addition to the unchanged 54 source-validated Quran static UI drafts and 1452 baseline static UI keys.
- Browser evidence reports every residual unrecognized source text, categorizes it, and fails if any new unknown/unreviewed label appears.

## Verified actual Chromium classification (each viewport)
| Category | Count | Release treatment |
|---|---:|---|
| Numbers and decorative symbols | 34 | Not translation strings |
| Language labels (self-names) | 5 | Preserve for selection clarity |
| Original audio/meaning source and rights attribution | 5 | Preserve; independently review rights |
| DEEN brand | 1 | Preserve |
| Original Turkish Quran meaning | 1 | **Do not translate/claim approved** |
| Unknown or unreviewed visible source | **0** | CI fails if nonzero |
| **Total source tokens not mapped to French** | **46** | Classified, not 46 outstanding translation defects |

The baseline 48→46 count is measured on the mobile route. Browser results on both viewports now classify 46/46 remaining tokens. No new source meaning or rights approvals were granted.

## Release limitations and next work
- No Arabic verse, existing Turkish Quran meaning, audio bytes, license metadata, grading or progress state changed.
- Real Quran playback and per-word audio sync **remain unapproved**: 90 MP3 headers are present, but the current timing manifest has 0/90 word alignments.
- French app locale selection still **not genuinely enabled**: isolated preview overlays the Turkish locale; XP, streak and learning progress preservation under a real locale-switch have not yet been end-to-end certified.
- Native-French editing and independent Islamic content/rights review are still required. `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false`; do not merge to `main` or deploy Pages.
