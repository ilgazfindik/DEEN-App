# DEEN P11 — Quran source/rights evidence (staging only)

The per-file register `assets/quran/audio/fr-rights-evidence.staging.json` exactly follows the 90 audio paths in `ayah-audio-manifest.json`.

Every recording initially has `permissionStatus=unverified` and `recitationReview=pending`. An MP3 file, an ElevenLabs account, a voice label, or an existing source/attribution string does NOT establish commercial redistributable rights.

CI checks missing/duplicate/path-drifted assets, fabricated approvals and missing evidence references. It permits `evidence_submitted` only with an evidence reference; this still does NOT prove legal permission or permit release.

French Quran meanings separately require a named translation edition, translator, distribution permission, independent Islamic review and native French review. Do not change Arabic ayats, original audio, or the blocked French production gate.

Run `node scripts/audit-french-quran-rights.mjs` from the repo root. Its report is written to `qa-artifacts/french-quran/rights-audit.json`. Rights contracts and secrets should be stored securely outside the public Git repository, using only a non-sensitive reference in the register.
