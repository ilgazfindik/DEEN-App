# DEEN — Français P08: locale persistence and learning-state regression

**State:** Verified in isolated QA, **not production French release approval**.

## Evidence
- GitHub Actions: https://github.com/ilgazfindik/DEEN-App/actions/runs/38581435253
- New Playwright test: `scripts/test-french-locale-progress-chromium.mjs`
- CI: `.github/workflows/french-browser-staging-qa.yml`
- Per-device JSON and screenshots: Actions artifact `french-isolated-chromium-staging-evidence`, `qa-artifacts/french-locale-progress/`.

## Actual tests and assertions
1. Launch the real assembled DEEN in an isolated Chromium context (390×844 and 1280×820).
2. Populate a **synthetic, non-user** progress record via the application's own `saveState()` storage model, after initializing `DEEN_QURAN.state()`.
3. Verify `DEEN_BOOT.changeLanguage('fr')` **rejects the unapproved locale**: no change in saved `deen_app_language_v1`, `settings.language`, Quran `quizLocale` or learning progress.
4. Within disposable localhost QA only, use the **actual** `DEEN_APP_LOCALE.commit('fr')` state-writing method and then `commit('tr')`. This intentionally bypasses `DEEN_BOOT`'s availability check for a **persistence-unit regression**, *not* a production French language switch.
5. Reload the original assembled app in Turkish and compare the persisted learning-state projection.

| Invariant (synthetic QA fixture) | Before | After TR → FR → TR and actual reload |
|---|---:|---:|
| XP | 1735 | 1735 |
| Streak | 9 | 9 |
| Longest streak | 11 | 11 |
| Completed lessons | 2 | 2 |
| Badge achievements | 3 | 3 |
| Quran learning | Al-Ikhlas, ayah 2 | Al-Ikhlas, ayah 2 |
| Current Quran daily ayahs | 2 | 2 |
| French production availability | false | false |

Both viewports passed and logged `FR_P08_PROGRESS` and `FR_P08_SUMMARY`.

## Important constraints
- No real user state, other connected accounts, production data, `main` or Pages were modified.
- The QA-only `commit('fr')` checks persistence, **not** the actual approved user-visible French switch/reload. A direct French reload without French release flags remains intentionally unsupported and was **not claimed** to succeed.
- This test uses synthetic progress and real app storage APIs. Actual post-purchase/remote account sync, multi-device conflict resolution, real played lessons, Safari/iOS and all possible Quran review states are **not certified**.
- `fr.question_data=missing`, `fr.global_qa=blocked`, `fr.religious_expert_approved=false` remain unchanged.
- Native-French review, independent Islamic review, Quran meaning/rights clearance and word-sync QA are still blocking production.
