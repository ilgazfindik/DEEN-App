# DEEN v9.9.87 Runtime Regression QA

Build: `9987regression1`

## Scope

Regression pass for the centralized Runtime Arbiter and the critical learning flows:

- question render / grade / advance
- lesson result / close
- navigation
- smart review
- macro stages
- section finals
- streak / energy / rewarded-ad simulation
- ceremony/result cross-cuts
- stale visual callback cancellation
- post-load owner uniqueness

## Static parse audit

All release segments were parsed after the v9.9.87 changes.

- Release scripts parsed: 104
- Loader/index scripts parsed: 1
- Total scripts parsed: 105
- Syntax errors: 0
- Legacy `renderQuestion=wrapped` assignments in late v873/v890/v891 installers: 0
- Legacy `startStage=wrapped` assignment in v910: 0

## Isolated Runtime Arbiter execution test

The actual `deen-v9953-runtime-arbiter-js` source was executed against a controlled DOM/runtime stub.

Verified:

1. `startStage` emitted `deen:lesson-starting -> deen:lesson-started`.
2. `renderQuestion` emitted `deen:question-rendering -> deen:question-rendered`.
3. A second `completeQuestion` call in the same render epoch returned `false`; only one grade reached the underlying implementation.
4. A scheduled question visual job was cancelled by `nextQuestion`; stale callback execution count remained zero.
5. Smart Review emitted `review-starting -> review-started` with `started:true`.
6. Macro stage emitted `macro-stage-starting -> macro-stage-started` with `started:true`.
7. Section final emitted `section-final-starting -> section-final-started` with `started:true`.
8. Reward simulation emitted `reward-ad-starting -> reward-ad-completed` and energy changed once.
9. Energy panel emitted `energy-rendering -> energy-rendered`.
10. The underlying commit guard allowed only one commit for the same session.

## Stale visual callback hardening

The following legacy visual callbacks now use `DEEN_RUNTIME_SCHEDULE.question(...)`, so they are validated against the current render epoch/question key and cancelled when the user advances, closes the lesson, or navigates away:

- `v621-feedback`
- `v624-energy-feedback`
- `v733-match-watch`
- `v950-question-ui`
- `v950-feedback`
- `v9936-companion`
- `v9937-companion-lock`
- `v9944-reaction`

## Runtime self-check

v9.9.87 adds `DEEN_RUNTIME_REGRESSION`.

It runs non-destructive ownership/lifecycle checks after load at 0 ms, 250 ms, 1200 ms and 2500 ms. It verifies that delayed legacy installers did not steal authoritative owners after boot.

Browser inspection:

```js
DEEN_RUNTIME_REGRESSION.snapshot()
```

Expected:

```js
{ pass: true, failed: [] }
```

The document root also receives:

```
data-deen-runtime-regression="pass"
```

A failed check is logged to the console with the failing owner/lifecycle keys.

## Protected business owners

The regression cleanup intentionally retains real business/safety behavior:

- v995 worldScreen retirement safety
- v600 Kısım 3 final behavior
- v600/v623 ceremony/reward behavior
- adaptive Smart Review session construction
- progression/commit logic

These are behavior owners, not decorative wrappers.

## Result

Source-level and isolated runtime regression audit: PASS.

This report does not replace manual device/browser UX testing, but the centralized lifecycle/owner invariants and stale-callback protections pass the automated checks available in the repository workflow.
