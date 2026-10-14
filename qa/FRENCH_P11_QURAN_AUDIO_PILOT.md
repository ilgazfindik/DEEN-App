# DEEN — P11 Quran Audio Pilot (staging only)

ElevenLabs forced alignment provides word-level Arabic candidate timings:
https://elevenlabs.io/docs/api-reference/forced-alignment/create

Scope: 90 mapped audio entries; the initial pilot is Fatiha (7 ayahs)
plus Ikhlas (4 ayahs), **11** planned calls. Actual timings in the
checked-in file remain **0/90** until an authorized API run produces and
saves candidates. A successful automated run is not human recitation review.

## Credential-free dry run

Run from repository root:

~~~sh
ALIGN_DRY_RUN=1 ALIGN_ONLY=fatiha,ikhlas ALIGN_MAX=11 node scripts/quran/align-word-timings.mjs
node --test scripts/test-quran-word-alignment-plan.mjs scripts/test-quran-word-alignment-guard.mjs
~~~

The dry run never calls the API or changes audio/timing files. CI runs only
dry-run tests, not paid API requests.

## Authorized real run (requires source rights, budget and private API key)

~~~sh
# Put ELEVENLABS_API_KEY in a private environment variable (never Git).
ALIGN_ONLY=fatiha,ikhlas ALIGN_MAX=11 node scripts/quran/align-word-timings.mjs
node scripts/audit-french-quran-audio-readiness.mjs
~~~

If a run aborts, valid candidate ayahs remain in JSON; repeating skips them.
ALIGN_ONLY=ikhlas:2 targets one ayah; ALIGN_MAX=2 caps calls to two.
FORCE_ALIGNMENT=1 replaces previously saved candidates, not human review.

Machine acceptance rejects missing/changed Arabic words, invalid time spans
and incomplete alignment outputs before atomic persistence. Each verse still
needs manual listening and confirmation of displayed word boundaries.

Release blockers: redistribution and playback rights for each audio asset,
French meaning source/translator attribution and permission, independent
Islamic and native French review, real mobile locale-switch and retention
tests. Never alter Arabic ayats for localization. Preserve blocked French
production manifest and do not merge or deploy on automation alone.
