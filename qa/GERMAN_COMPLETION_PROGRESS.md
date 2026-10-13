# DEEN German Completion — Resume Point (2026-10-12)

## Source of truth and safety
- Repo: `ilgazfindik/DEEN-App`, stacked [PR #55](https://github.com/ilgazfindik/DEEN-App/pull/55), branch `codex/german-runtime-u01-live-s01-s02-20261012`. Its base is `codex/german-final26-20261012`, not main.
- `main` last verified `38e990cb820bea80b67bd1e20a415087329aabe0`: the separately merged companion picker JavaScript hotfix, successfully deployed via [Pages run 38296761001](https://github.com/ilgazfindik/DEEN-App/actions/runs/38296761001).
- **German production must remain unavailable**: `assets/i18n/content-support.json` has `de.question_data=missing`, `de.global_qa=blocked`, and `de.religious_expert_approved=false`. Do not set approvals without signed reviewer evidence or release 90 untranslated/unchecked Quran meanings. Never modify original Arabic recitation.
- Previous QA-ready assets include 1,500 German base question drafts, 84 active U01, 20 stored U01 variants, 100 legacy variants, 1,452 UI reference translations (1,087 English reference keys), and 90 draft German Quran meanings. Status: **model drafts, human review pending**.

## Work completed after Astra's token interruption

1. **Authentic de-locale runtime acceptance harness**, not just a Turkish profile showing German questions:
   - `scripts/build-german-e2e-preview-config.mjs` verifies the production manifest is blocked, then generates a **disposable 127.0.0.1-only** manifest fixture with 114 staged German packs, every source SHA-256 pinned. Synthetic QA approval is injected **in browser memory only**. Neither the real manifest nor app release approvals are changed.
   - `scripts/test-german-true-locale-preview.mjs` selects Deutsch from the actual chooser; invokes real `DEEN_BOOT.prepare()`, validates 1,500/1,484 source-matched German questions (0 failed IDs), then enters real U01-S01. The engine selects 12 U01 questions and localizes questions **lazily**, one by one. All 12 German question renderings were checked, including fill blanks, matching, true/false and scenario types.
   - [Successful real-German runtime run 38307451645](https://github.com/ilgazfindik/DEEN-App/actions/runs/38307451645).

2. **True de-locale UI audit**:
   - Applied the existing 13-pack staging UI renderer *explicitly in the QA browser*. Scanned 997 real elements after German session boot; the five newly detected Turkish teaching-card strings were translated in `german-ui.dynamic.staging.mjs` and covered by dynamic tests. No generic rewriting of graded content/Arabic.
   - [Successful real de-locale UI run 38307900632](https://github.com/ilgazfindik/DEEN-App/actions/runs/38307900632): 997 scanned, 0 detected unresolved Turkish, 0 JS errors, Arabic/grade source unchanged.

3. **Real German correct-answer grading**:
   - Under `window.DEEN_APP_LOCALE.get()==='de'`, selecting the correctly translated German answer gave `session.correct=1`, the feedback panel opened, and source-matched German explanation was shown.
   - Found `Evet, doğru!` during true-German grading and fixed it to `Ja, richtig!`. The [new correct-answer Chromium run 38308368159](https://github.com/ilgazfindik/DEEN-App/actions/runs/38308368159) passed, preserving the exact German explanation and changing only the QA-only feedback chrome.
   - `Kısaca:` explanation wrapper is changed to `Kurz gesagt:` **only in the source-checked disposable QA context**; shipped content and grade signature are protected.

   - **Negative-answer branch also verified:** [Chromium run 38308765160](https://github.com/ilgazfindik/DEEN-App/actions/runs/38308765160) selected the wrong German answer in a fresh true-de U01 lesson; `session.correct===0`, feedback visible, 0 Turkish UI-signal residues after QA localization, explanation still source matched. Correct-answer tests were rerun in the same CI job and passed. The Turkish source wrappers are handled only by source-guarded disposable QA display logic, not by a globally enabled production renderer.
   - **Release gate unchanged:** human/native/rights approvals are still pending, so neither the runtime QA preview nor the UI QA overlay is available to live users.

4. **Qualified reviewer handoff**:
   - `scripts/export-german-human-review.mjs` creates review-pending JSONL records for all 1,704 German question versions and all 90 Quran meaning drafts, preserving source, display, stage, audit scope, approval fields, and licensing/attribution evidence gaps. A separate Actions artifact `german-review-required-1704-plus-90` is configured.
   - This dossier does **not** constitute native German, theologian, licensing, or Quran translation approval.

5. **CI**:
   - Updated `.github/workflows/german-browser-staging-qa.yml` to run the old preview, existing page navigation + 10-modal suite, full German question source audit, local manifest preview, real German bootstrap/render/grading, and reviewer export. All steps fail closed with evidence artifacts.

## Outstanding work (must not be misreported as completed)
- Verify the latest head SHA and passing status of the **new** end-to-end suite following the correct-answer toast change.
- Extend true-de test beyond U01-S01: wrong answer; subsequent stages; matching, fill, order interactions; feedback; review; results; fresh onboarding; language changes; offline/slow-network; mobile and desktop cross-regression.
- UI renderer is **QA opt-in** rather than a production-authorized complete German bridge; production manifestation remains intentionally blocked.
- Quran: 90 German ayah meanings are drafts with native, theological, source, attribution, and rights reviews still required. Audio/Arabic must remain untouched.
- Native German reviewer and qualified Islamic expert must sign off with evidence before any release flag changes; complete E2E and PR stack sequencing then release and verify GitHub Pages. **No German deployment occurred in this stage.**

## Resumption protocol
1. Verify branch HEAD and [PR #55](https://github.com/ilgazfindik/DEEN-App/pull/55), then inspect GitHub Actions for that exact commit.
2. Read `qa/GERMAN_COMPLETION_PROGRESS.md` and `qa/GERMAN_FINAL_FULL_APP_AUDIT_20261012.md`.
3. Resume at the first failing test; do not recreate the 1,704 translations or reset the PR stack.
4. Commit each verified fix, preserve all Arabic/Turkish/English assets and never self-approve religious content.

## Latest verified regression and remaining release blocker

- Last verified **real-German runtime + UI + correct and wrong grading**: [GitHub Actions 38308765160](https://github.com/ilgazfindik/DEEN-App/actions/runs/38308765160), `success`, run SHA `77f40f600b82782b4f460e40ee37ce72ef2691c8`. It includes 1,704 version source tests, actual 1,500/1,484 loaded content count, 12 U01-S01 question renderings, 997 element UI scan, correct and wrong grading, original Arabic protection, JS error collection, reviewer dossier generation.
- Review package artifact: see `german-review-required-1704-plus-90` on that Actions run. Expert/native/licensing status of all items remains **pending**.
- Unblocked engineering task: review and implement a **production-grade German UI and Quran translation bridge only after approval**, then run first-run onboarding, saved progress/language switches, matching/fill/sequence, end-of-stage, Quran/audio, all 15 units, screen readers and mobile/desktop regressions with the real `de` runtime. Current QA is **not** approval for real German deployment.

## Real German matching, fill-blank and Quran source audit — 2026-10-13

**Added source-verified interactive browser QA (disposable local manifest; no production DE release):**
- `scripts/test-german-true-locale-preview.mjs` now actually taps German U01-S01 matching pairs (3/3) and a `fill_blank` word chip. Visible matching progress reached 3/3, `session.correct===1`; the German “Hingabe” chip selected the correct inline slot, enabled the confirm button and earned `session.correct===1`.
- **Open runtime defect: matching session state divergence.** Even when visual matching reaches 3/3 and is graded correct, `session.__deenMatchingState.matchedLeft` and `window.DEEN_MATCHING_SESSION_STATE.snapshot()` remain empty, `finished=false`. This creates a potential re-render/resume consistency risk. It is recorded in `report.matching.session_snapshot_diverged`, not mislabeled as resolved. Find the duplicate/late matching renderer or overwritten session object before shipping.
- `assets/i18n/german-activity-a11y.staging.mjs` adds source-guarded German screen-reader labels for matching cards and selected fill-word/slot fields. It is QA-only, preserving answer text, Arabic Quran verses, and release approval flags.
- **Root cause & fix:** `release/v9.9.3-direct/segment-27.txt` v10.4.4 fill-freeze monitor initially only recognized Turkish/English/Arabic continuation buttons. It now recognizes `Weiter`/`Fortfahren`, preserving the older languages; loader SHA-256 in `index.html` was updated. `scripts/test-german-fill-runtime-locale.mjs` pins the digest and verifies continuation labels.
- **Precise residual QA diagnostic:** the test deliberately jumps directly between question indices and invokes `renderQuestion()`, producing two transient pregrade `slotPresent=false` callbacks before the active fill UI stabilizes. A later real German fill submission passes **all** `DEEN_FILL_FREEZE.inspect` checks. The E2E test explicitly records the initial failures and only tolerates those exact transient, pregrade `rendered` events when the final monitor and actual grading pass, while failing on any unrelated browser error. This does **not** establish that ordinary navigation has zero race conditions.
- **Quran source and audio consistency:** `scripts/test-german-quran-source-integrity.mjs` verified all **90/90** German meaning draft entries against the unchanged source Arabic text, surah ID, ayah index and audio path from `assets/quran/audio/ayah-audio-manifest.json`. No source mismatch and no release approval claimed. German meanings still need specialist linguistic/theological and translator rights sign-off.
- The QA suite does not modify production manifests: `de.question_data=missing`, `de.global_qa=blocked`, `de.religious_expert_approved=false`. Do not merge the staged German PR stack into main or publish unapproved Quran meanings.

**Resume next:** inspect the latest German real-browser Actions run at current head, resolve matching session snapshot divergence without breaking existing Turkish matching, then extend the real-de flow through fill/matching errors, sequence, Quran UI/audio and locale persistence. Review status is still pending.

## 2026-10-13 — Complete real German U01-S01 lesson and return visit (staging only)

- **Green Chromium workflow:** [German real-browser staging QA #38319488956](https://github.com/ilgazfindik/DEEN-App/actions/runs/38319488956), at commit `9ac18b690b55cc615a9108a13d5d21d3e09fb26a`. Its generated JSON/screenshots are in the workflow's `german-staging-browser-evidence` artifact.
- Exercised the real U01-S01 controller **through all 12 questions in order** in an isolated, local-only `de` browser session, not 12 direct index jumps. Verified source-pinned German rendered questions, actual correct answer clicks across card choice, matching, true/false, fill blank, scenario and odd-one-out; **12/12 graded correct** with corresponding exact staged German explanations. The Turkish `Kısaca:` feedback prefix is replaced by `Kurz gesagt:` **only after independent question/source verification within the QA browser**, never on shipped content.
- Verified the result's actual animation reached **12/12, 100%**, the stage U01-S01 was marked complete at score 100 and awarded **40 XP**. Found and added source-observed staged German translations for the generated achievement/result/next-stage chrome, reaching **zero Turkish-signal UI residuals in this specific result view**. This is not a whole-app German language quality certification.
- **Normal return visit passed:** after clicking result continuation and persisting state, opening the canonical app URL `/` restored selected locale `de`, HTML lang `de`, completed U01-S01, score 100 and 40 XP; no lost progress. Root cause of earlier QA timeouts was the QA link `?previewLanguage=1`, which deliberately forces the initial language chooser on *every* load, blocking the bootstrap until a user selects a language. Returning-user regression now uses canonical `/` without that force flag.
- Exactly **4 extra full-lesson pre-grade fill-freeze monitor warnings** were source/classification-checked: every one has `reason=rendered`, `graded=false`, `mode=chip`, and only `slotPresent` transiently false. The four console diagnostics match the four monitor records exactly. No unrelated JavaScript exceptions were allowed. The two older direct-index QA warnings remain separately reported; these warnings are not evidence of a fully race-free release.
- The **1,704 source-verified German question versions**, **90 Quran meaning drafts**, original Arabic/audio and German release-gate flags remain untouched by the browser tests. German is **not live**: `de.question_data=missing`, `de.global_qa=blocked`, `de.religious_expert_approved=false`; no main merge/deploy occurred.

**Resume engineering next:** test language switching **from German to another approved runtime locale and back**, with unchanged stage/XP persistence; fresh-first-run onboarding rather than QA profile seeding; Quran/audio and secondary learning flows; offline/slow-network and mobile/desktop device matrices. Native German and Islamic expert/rights reviews remain mandatory and cannot be auto-approved.

## 2026-10-13 — Language switches and genuine first-run onboarding (QA-only)

- **Green German → Turkish → German saved-progress E2E:** [Chromium Actions #38319777362](https://github.com/ilgazfindik/DEEN-App/actions/runs/38319777362), test commit `5ff005121db1b4f8ab2079b0288a477ac4d24a8c`. Real `DEEN_BOOT.changeLanguage` accepted `tr` and then `de`, each with a full page reload and verified `phase=ready`, stored UI locale and `document.lang`, unchanged U01-S01 completion, score 100, XP 40. No other browser errors beyond previously documented exact transient fill monitor diagnostics.
- **Green genuine German onboarding E2E:** [Chromium Actions #38357242639](https://github.com/ilgazfindik/DEEN-App/actions/runs/38357242639), test commit `e90fc4051956f5c97f2f6139e3620f3f321bff64`. New isolated browser context starts with no prior localStorage, selects German at first-run language gate, clicks through all six real onboarding steps (welcome, name, age/style, companion, minutes, summary). Every rendered heading equals its German locale key. Enters QA profile name `DE QA`, teen learning style, owl companion and 10-minute / 2-lesson daily goal. No manual `state.onboarded=true` bypass; completes via the actual finish button and gets `DEEN_BOOT.phase=ready`. A return visit to canonical URL restores `de`, name, owl, daily goal, and does not re-open onboarding. Evidence and six screenshots are in run artifact `german-staging-browser-evidence`.
- Both use a SHA-pinned **in-memory synthetic German manifest in disposable localhost Chromium**, not deployed German content; production flags and human expert review requirements are unchanged. Passing this onboarding smoke test does not cover all screen reader, small-screen or offline paths.

**Next:** Quran German tab plus unchanged original Arabic audio, surah controls and meaning attribution in real de session, plus slower-network/offline regressions and remaining UI flows. Do not merge the German PR stack or enable production German without native and religious/rights approvals.

## 2026-10-13 — Real-de Quran hub and Fâtiha journey QA (staging only)

- Quran hub tab (`leagueScreen`) navigation passed using the real German locale and staged UI adapter. [Green Chromium run #38357892260](https://github.com/ilgazfindik/DEEN-App/actions/runs/38357892260) verified the activated German Quran hub headline `Deine Reise durch den Koran`, 96 scanned UI nodes, 62 UI writes and **zero Turkish-signal untranslated chrome in the hub**. The synthetic lesson test profile required manually closing its companion-selection modal before tab navigation; this was a QA-profile artifact because the genuine separate first-run test completed companion selection normally.
- After clicking `Mit al-Fātiha beginnen`, Chromium displayed the **Fâtiha Journey dialog**, not an actual Arabic ayah player. A previous smoke assertion falsely counted the text `العربية` from the language selector as Quranic ayah text; it is now excluded and the run explicitly records `source_ayat_verified=false` when actual verses are absent. This means **end-to-end verse rendering and audible recitation remain unverified**, despite the separate 90/90 source/audio-manifest static integrity audit.
- Captured and fixed newly generated staged German modal chrome: journey title, companion caption, source-labelled `Wikimedia Commons` recitation, daily tasks/counts, retry and medals. German locale labels `Türkçe` and `Français` are allowed **only as official language picker names** and are not silently translated. Source/media references remain unchanged by the staged renderer.
- [Green Chromium #38359426409](https://github.com/ilgazfindik/DEEN-App/actions/runs/38359426409) verified the Fâtiha dialog's **unapproved Quran-meaning release block**, zero residual Turkish UI beyond official language names, and the selected source-observed English journey/stage/locked-state labels translated to German. The Quran modal remains a staging-only UI pass; it is **not evidence that German meanings were expert-approved**. Newly identified `Mastery` label received a follow-up localization and test assertion.
- No product release enabled, no production manifest unblocked, no PR merge/main deploy. Original Arabic verses/audio and translation permissions require real surfacing, device playback checks and scholarly/native-language review before German deployment.

**Next work:** open an actual ayah learning/recitation view (the Fâtiha journey dialog by itself has zero visible Arabic ayat/audio players), verify original Arabic + ordered ayah audio at the real control level, inspect other Quran question modes and modal-specific English remnants, then slow-network/offline and smaller mobile viewport regressions. Avoid implying whole app is German-complete based only on Turkish-signal scanning.


## 2026-10-13 — Real Fâtiha ayah/audio acceptance (staging-only, passed)

- [German real-browser staging QA #38361979607](https://github.com/ilgazfindik/DEEN-App/actions/runs/38361979607) **passed** at code commit `c52aadae45f6152a579ececbadac800134ba0b4a`.
- Extended `scripts/test-german-true-locale-preview.mjs` to click the actual first **Learn** button inside the German Fâtiha Journey dialog, opening `#v5Sheet .deen-qmulti-session`. Previous QA stopped at Journey and did not verify any actual verses.
- Chromium verified Fâtiha **ayah 1 and ayah 2** Arabic DOM text equals both the Quran content registry and unmodified `assets/quran/audio/ayah-audio-manifest.json` records. It clicked the actual inline speaker, decoded and played `fatiha_1.mp3` (2.351 s) and `fatiha_2.mp3` (2.429375 s), verified the player source and ayah number, paused using the real button, and reached ayah 2 using the five real learning-stage actions, without changing question or locale state directly.
- Ayah 1 verified 4 synced Arabic word elements and a playback progress track. Actual end-user audio audibility on physical devices is **not** claimed from headless Chromium.
- Release safeguards unchanged: **synthetic German manifest only in disposable localhost Chromium**; no main merge/deploy, no public German Quran meanings, no native-language/religious or rights approval. The 90/90 Arabic/audio source integrity check passed in the same browser workflow.
- **Next:** audit source-guarded German chrome and untranslated text in the *actual ayah-learning view*, then wider Quran flows and mobile/offline regressions. The Fâtiha Journey modal alone is not sufficient evidence of full German localization.


## 2026-10-13 — German Fâtiha learning UI and recitation chrome QA (staging-only)

- **Real Chromium: PASSED** [German real-browser staging QA #38364708257](https://github.com/ilgazfindik/DEEN-App/actions/runs/38364708257) at code commit `8d2b446d68e251dca6cc78373cf35804627f8bb9`; **static German staging audit: PASSED** [#38364333199](https://github.com/ilgazfindik/DEEN-App/actions/runs/38364333199).
- Source-exact staging German labels added for Fâtiha's five actual learning stages (Listen, Read, Meaning, Recall, Complete), forward/back/reveal/finish controls, ayah counters, recitation rights notice, original audio-playback hints, buttons and accessibility names. Source references: `release/v9.9.3-direct/segment-36.txt` and `segment-52.txt`. Test cases reject out-of-range ayah counters. These **UI strings are not verse translations**.
- Native browser flow verified all five stages of **Fâtiha ayah 1** plus actual **ayah 2 Listen**, recording **6 distinct chrome snapshots**, each with `unresolved=[]`; combined `unresolvedChrome=[]`. The QA renderer preserved Arabic verse text and original audio-source attributes at each stage. Audio playback/pause for original ayahs 1 and 2 also remained green, with source-identity and synchronized Arabic word checks.
- QA failures that were identified and corrected: a staging dynamic-match variable declaration order, a German QA renderer instance lost at locale navigation/reload, omitted legacy recitation control texts, and an over-strict speaker state timing assumption in the test. Final code has passed both static and full Chromium QA.
- **Scope limitation:** in-memory/source-guarded German DOM renderer is used only in disposable localhost Chromium; shipped production still blocks German (`de.question_data=missing`, `de.global_qa=blocked`, `religious_expert_approved=false`). No `main` merge or live deployment. The test does not certify every Quran view, all seven Fâtiha audio files on devices, offline mode or licensed/native/theological review.

**Next:** inspect real German Quran *memorization*, ayah/meaning tests and mobile/offline behaviors without silently releasing untranslated Quran meanings.


## 2026-10-13 — Fâtiha memorization and Arabic ayah test (German staging only)

- **Chromium passed:** [German real-browser staging QA #38369730061](https://github.com/ilgazfindik/DEEN-App/actions/runs/38369730061) at code commit `344eabef78d31f4f5cac87db4fe86c8990b57407`; **static German audit passed:** [#38369540453](https://github.com/ilgazfindik/DEEN-App/actions/runs/38369540453).
- Expanded `assets/i18n/german-ui.dynamic.staging.mjs` using source-exact QA mappings for the native Fâtiha memorization card, recall/reveal controls, tested question chrome, counters, accessibility labels and unavailable-audio/meaning notices. Source-sensitive Arabic words, rendered answers and approved translations remain excluded from generic replacements.
- The user-facing 5-step Learn controls completed all seven Fâtiha ayahs without setting progress manually. The *real Journey memorization button* then unlocked and opened an Arabic-backed German card (`Fâtiha auswendig lernen`, `AUSWENDIGLERNSTUFE 2 / 5`). The reveal was byte-identical in displayed text to the original Arabic registry; the QA renderer did not modify Arabic or audio sources. No unhandled Turkish UI signals remained in the tested memorization view.
- The Journey Ayah Test was playable while German meanings were absent. It exposed four source-preserved choices, a German prompt (`Ergänze das fehlende Wort`) and action (`PRÜFEN`), and the native grader recorded one answer. The DOM QA audit reported `unresolved=[]` and original Arabic/graded choices unchanged.
- **Critical gating verified:** the real Meaning Test button remained disabled; `DEEN_QURAN_JOURNEY_V2.mealReady('fatiha')===false`, `stats('fatiha').meaningUnlocked===false` and `startStage('meaning')===false` without generating a quiz. No German Quran meanings or Surah Final were released.
- **Scope:** these are localhost browser/source-exact staging changes only; no PR merge or live deploy. One Ayah Test item was graded, not the entire question set. German academic/native review and religious review are still pending; missing meanings must not be manufactured or auto-approved.

**Next:** exercise all five Ayah Test questions (correct and incorrect paths, replay audio, result/review), broader Surah memorization/practice and real mobile/offline regressions before any release consideration.


## 2026-10-13 — Full five-question Fâtiha Ayah Test and mistake-review acceptance (DE staging)

- **Chromium PASS:** [German real-browser staging QA #38371528848](https://github.com/ilgazfindik/DEEN-App/actions/runs/38371528848) on code commit `d78752d910c214489524392130d27af07cbd07a0`; **German staging static audit PASS:** [#38371563959](https://github.com/ilgazfindik/DEEN-App/actions/runs/38371563959) after result-string unit tests.
- The browser completed the **five real Ayah Test questions**, with both correct and incorrect grading. A deterministic QA run produced 1/5 correct = 20%, 4 wrong. The real audio-identification question played the expected original Fâtiha MP3, replayed it without changing the source, and accepted the correctly identified verse. Original Arabic and graded answer DOM source values remained unchanged. `meaningUnlocked=false` throughout.
- The result screen rendered entirely in staging German for audited chrome: `Fâtiha · Verstest`, `Übe weiter ✦ Neuer Bestwert`, `Fragenanalyse`, `FEHLER WIEDERHOLEN · 4`, `ERNEUT VERSUCHEN`. Source-observed mixed-language residues from `quizChrome` (partial English substitutions, including `YANLIŞLARI REVIEW ET` and an English passing-threshold notice) were source-exactly translated and pinned in static regression tests; browser `result.unresolved=[]`.
- The real `FEHLER WIEDERHOLEN` button opened a four-question **practice** session, completed it, and preserved official Ayah Test state **attempts=1, best=20**. Restarting and reloading the app also preserved `attempts=1, best=20, locale=de, learned=7`; after reload, `meaningUnlocked=false` remained enforced.
- No expert/native Quran meaning approval was asserted. The browser uses a **synthetic QA-only local German manifest**; production remains gated. No `main` merge or live deployment. This test verifies one full five-question attempt plus the linked wrong-answer review; it does not exhaustively prove all user paths, accessibility, offline audio or external rights review.

**Next:** review German Quran Journey result accessibility and broader Surah types/physical-device audio behavior. Prioritize native German and theological verification separately from automated UI passing.


## 2026-10-13 — Cross-surah German Quran QA (staging only)

- **Browser PASS:** [German real-browser staging QA #38377907054](https://github.com/ilgazfindik/DEEN-App/actions/runs/38377907054) at code commit `f7c825941c00cc3337f770db2f77313237cfe3db`. **Static German staging audit PASS:** [#38377936204](https://github.com/ilgazfindik/DEEN-App/actions/runs/38377936204).
- New real Chromium matrix covers representative shared-engine Quran surahs `nasr` (3 ayahs), `falaq` (5 ayahs), and `bayyina` (8 ayahs): opened their native Journey and Ayah Test controls in synthetic QA-only German, tested first answer grading, verified the Arabic and option DOM remained unchanged and stage labels were source-guardedly localized. All three first-question chrome audits returned `unresolved=[]`.
- For every surah tested: `sourceReady=true`, `ayahUnlocked=true`, `mealReady=false`, `meaningUnlocked=false`, `finalUnlocked=false`. Disabled Meaning/Final buttons and rejected calls to `startStage('meaning')` and `startStage('final')` did not create questions. The production safety gate is unchanged.
- Nasr: the real five-step learning buttons completed three original Arabic ayahs, opening Memorize. Its genuine memorization card rendered `Nasr auswendig lernen`, `AUSWENDIGLERNSTUFE 2 / 5`, `ICH HABE MICH ERINNERT` with `unresolved=[]` and Arabic unchanged. Chromium initially found `Nasr Ezberi` and `Ayet 3 / 3` untranslated; the source-exact staging German title and bounded generic verse counters were fixed and retested.
- These three are samples from the 16-sura registry, not 100% Quran coverage. Nasr full memorization levels, full five-question tests for Falaq/Bayyina, distinct Ikhlas memorization path and offline/physical-device audio still require separate tests.
- **No live deployment or merge:** this pass runs in disposable localhost with a synthetic German manifest; `assets/i18n/content-support.json` still blocks German question data/global release and flags expert review pending.

**Next:** cover İhlâs-specific lesson/memorization differences, then remaining 12 surahs and real-device audio/offline regressions without weakening translation approval.


## 2026-10-13 — İhlâs native German learning/memorization and audio acceptance (staging only)

- **Chromium PASS**: [German real-browser staging QA #38399946911](https://github.com/ilgazfindik/DEEN-App/actions/runs/38399946911) on code commit `4323c7336bd013f2ef2fc1393d42061a73da1cbc`. Native İhlâs branch covered **20/20 learning stages** (4 ayahs × 5 steps) with `unresolved=[]`, unchanged Arabic source text, and all four native MP3 records `ihlas_1.mp3`–`ihlas_4.mp3` played from their correct ayah. Arabic content is never localized.
- **Native separate v10921/v10922 engines**: the genuine İhlâs memorization button unlocked only after learning all four ayahs. The opened card was already independently German-localized as `Al-Ichlās auswendig lernen`; its self-check actions and progressive stage were in German. Revealing the original Arabic showed byte-equivalent normalized text; clicking **ICH HABE MICH ERINNERT** advanced saved level to **2/5**, without unlocking an unapproved German meaning test.
- **Real code fixes**: `release/v9.9.3-direct/segment-34.txt` now prefers the saved **İhlâs-specific** current ayah over a general profile last-ayah value, preventing a previous Nasr verse 3 from causing the first İhlâs lesson to open at verse 3. German Quran source attribution no longer falls back to `Türkçe meal bekleniyor`; the unapproved translation is plainly unavailable, not manufactured.
- **Release integrity**: `index.html` segment-34 SHA-256 and cache build marker were updated after source changes, since otherwise the bootloader discards the changed segment and can fall back to the previous immutable revision. A new test asserts the SHA-256 source/manifest identity before launching the browser.
- **UI-only staging**: source-guarded translations cover native İhlâs learning prompts, five-level memorization descriptions and recitation panel labels (`AYET ARASI BEKLEME`, `Kıraat hazır`, `SEÇİLİ AYETİ LOOP KAPALI`). The German static locale audit and Arabic question bank audit on the preceding branch SHA were green. The final code change at `4323c733` only corrected the test expectation for an already-German heading.
- **Scope**: success is a disposable localhost Chromium session with an in-memory synthetic German QA manifest, **not** live German release. Full five-level completion across all four verses, all remaining surahs, mobile physical-device audible output, and German native/theological/rights approval remain open. PR #55 is not merged into main.

**Next**: verify all remaining Quran surahs on the shared engine, test offline/mobile device behavior and complete separate German theological/native language review. Keep German production gate closed until approved.
