# DEEN Companion Assets

Runtime integration is enabled in DEEN v9.9.36+.

## Required animals
lion, wolf, owl, turtle, eagle, cat

## Required states
- lesson_idle
- correct
- try_again
- celebrate
- avatar

## File convention
`assets/companions/<animal>/<animal>_<state>.png`

Example:
`assets/companions/eagle/eagle_lesson_idle.png`

## Production art spec
- transparent PNG
- main poses: 1536x1536
- avatar: 1024x1024
- consistent camera angle, lighting, teal/mint/cream/subtle-gold palette
- 3/4 body for lesson poses
- character faces slightly toward the speech bubble
- lesson_idle should use a welcoming teaching gesture
- correct = small positive reaction
- try_again = calm encouraging reaction
- celebrate = stronger success reaction

The runtime probes files before displaying them. Missing files automatically fall back to the existing DEEN companion rendering, so partial asset packs are safe.
