# DEEN P11 — Quran source, audio and licensing review (not release clearance)

Evidence checked in PR #57 on 14 October 2026:
- 90 verse MP3 paths are listed in assets/quran/audio/ayah-audio-manifest.json.
- The manifest contains verse text and file paths, not per-recording license grants,
  voice-consent agreements, distribution scope or permission dates.
- The Quran UI currently contains an attribution reading
  "Kaynak: DEEN user-provided ElevenLabs generation · Lisans: User-provided generated asset".
  That description is **a claim of origin, not proof of redistribution permission**.
- Separate UI attributions include "Arapça: Quran.com · Meal: Muhammed Hamdi Yazır, 1938",
  and "Atcovi · CC0 1.0". These describe DIFFERENT source/material categories;
  they do not license the eleven Quran recitation MP3s.
- "Samir - Modern Arabic" is a voice/source description, not a signed rights record.
- There is no approved French Quran translation edition established by this P11 pilot.

## First review batch

Fâtiha:1 through Fâtiha:7 and İhlâs:1 through İhlâs:4.
Chromium QA must decode each local MP3 without autoplay, record duration/channels
and reject candidate word boundaries that exceed its decoded length. It cannot
test religious recitation correctness or document playback/redistribution rights.

## Evidence required before French Quran audio/meaning release

1. Record source, creator/rightsholder, allowed commercial mobile-app redistribution,
   permitted geographies/terms, expiration and retained permission evidence for
   EACH audio source or a verifiable license covering the entire set.
2. Verify whether ElevenLabs-generated voice material and any voice models may be
   used and distributed in the intended app under the user's actual plan/contract.
   Do not infer rights simply from the presence of files.
3. Independently listen to each candidate word timing; check correct recitation
   text, audible boundaries and tajwid, with reviewer name, date and approval.
4. For French meanings, record approved edition, translator, legal rights and
   religious expert approval separately. Never alter the canonical Arabic verses.
5. Only after these are documented, run genuine French selected-locale QA
   (iOS/Safari, Android/Chrome, progress, grading, offline and screen readers).

P11 code is **staging only**. All rights and review fields remain NOT APPROVED;
this record does not authorize a production merge, enable French locale,
publish recordings or certify word-level synchronized highlighting.
