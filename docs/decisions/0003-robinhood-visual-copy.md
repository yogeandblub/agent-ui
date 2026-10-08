# ADR-0003: Copy the Robinhood visual system literally into the Figma library

- **Status:** accepted
- **Date:** 2026-10-07
- **Decided by:** owner (literal copy over a theme); Claude Code (extraction method, token names, font
  substitute)

## Context

The brief (§1, §9) keeps the system brand-neutral. Robinhood was meant to enter only as a
`robinhood` theme and in `apps/ref-brokerage`. The owner wants the end result to look like a real
Robinhood product. The goal is to go from lo-fi to mid-fi quickly, using a component library
extracted from the shipped app, and finish hi-fi by hand.

## Decision

- Robinhood's visual language is extracted from a screen recording of the iOS app
  (`design-references/robinhood/videos/`, gitignored). It is built into the Figma file as
  variables, text styles, an effect style and about 40 components, under Robinhood's own
  structures and copy.
- Components keep generic names (`Button`, `AssetRow`, `ActivityRow`, `TabBar`), but their look is
  a literal copy, not a theme over neutral parts.
- Values are sampled from the recording at 1pt = 1px (440pt-wide iPhone frame). DM Sans stands in
  for Capsule Sans, which is proprietary and not available in Figma. The family is a variable
  (`font/family/sans`), so swapping it is a single change.
- Light mode only, because the recording shows only light mode.

## Consequences

- Wireframes can be filled from real-looking components immediately. The baseline condition
  (recreating the shipped flow) gets more faithful at the same time.
- **This weakens the thesis's reuse claim at the visual layer.** If `ref-travel` and `ref-email`
  use this library, they will look like Robinhood. The zero-changes test (§12) then has to be
  argued at the behavioral layer: same props, same states, same events. It can't also be argued
  as visual neutrality. Write this up as a limitation, or later add a neutral variable mode so the
  same components can render without the brand.
- Figma is now the source of truth for token values. That reverses §9.1, where the repo was
  meant to push tokens into Figma. Phase 2 should import these values into `packages/tokens`
  rather than invent new ones.
- The recording contains a real account's balances. It stays local, and the uploaded reference
  frames live only in the private Figma file.

## Alternatives considered

- **`robinhood` theme over neutral components (the brief's plan, and Claude Code's
  recommendation).** It keeps the reuse claim clean at every layer, but the owner chose a literal
  copy for fidelity.
