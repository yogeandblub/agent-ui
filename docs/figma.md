# Figma

**File:** https://www.figma.com/design/3hxTnvbUjczlAeyimq2tGt/Untitled

Connected to Claude Code through the Figma MCP server (signed in 2026-10-06).

## Pages

| Page             | Contents                                                                                                                                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cover            | Title and page index                                                                                                                                                                                 |
| Screen inventory | Header, catalogue (one row per screen; flows run left to right), 8 scenario sections. G1 wireframed in two versions (flows "G1a Guided path", "G1b Node chain"); the rest are empty 440 × 956 frames |
| Foundations      | Color swatches, type specimens, spacing, radius, elevation — all bound to variables                                                                                                                  |
| Icons            | 26 icon components, 24px, color bound to `color/icon/primary`                                                                                                                                        |
| Core             | Button, PricePill, Chip, RangeTab, RangeSelector, Divider                                                                                                                                            |
| Rows & Lists     | Sparkline, SectionHeader, ValueRow, AssetRow, ActivityRow, AgentConnectionRow, ListGroupHeader                                                                                                       |
| Cards            | TopMoverCard, MarketCard, PromoCard, DiscoverCard                                                                                                                                                    |
| Navigation       | StatusBar, AccountTab, AccountTabs, PortfolioHeader, TabBar, SearchBar, BottomActionBar                                                                                                              |
| Cortex (AI chat) | ChatHeader, ChatBubble, ChatInput, SuggestionChip, FollowUpRow, ThinkingIndicator, SourcesChip, GlanceCard, Disclaimer                                                                               |
| Reference        | 7 frames from the recording, plus the Agentic account screen rebuilt from components                                                                                                                 |

## Where the values came from

A screen recording of the Robinhood iOS app (`design-references/robinhood/videos/`, gitignored),
captured 2026-10-07 at 1320 × 2868 (440pt @3x). Frames were extracted at every screen change.
Colors were sampled from full-resolution frames, and sizes were measured at 1pt = 1px. See
ADR-0003 for why this is a literal copy.

## Variables

| Collection | Modes | Count | Notes                                                                                     |
| ---------- | ----- | ----- | ----------------------------------------------------------------------------------------- |
| Primitives | Value | 13    | Raw sampled colors. Hidden from pickers (no scopes).                                      |
| Color      | Light | 25    | Semantic colors pointing to primitives: `bg/*`, `text/*`, `border/*`, `icon/*`, `chart/*` |
| Spacing    | Value | 13    | `spacing/2xs`–`3xl` (2–40), `radius/sm`–`full` (6, 8, 12, 16, 999)                        |
| Typography | Value | 12    | `font/family/sans` (DM Sans), weights, sizes 12–32                                        |

Every variable has scopes and WEB code syntax (`var(--color-bg-brand)` etc.).

**Key colors:** brand / negative `#EF3805` · positive `#0FE110` · text `#000000` / `#5D6261` ·
borders `#E2E5E4` · soft surface `#FBFBFB` · gold `#FAD68C`.

## Styles

- **Text (11):** Display/Balance 32, Title/Section 24, Title/Hero 22, Headline 17, Body 15
  (Regular / Medium / Semibold), Caption 13 (Regular / Medium / Semibold), Footnote 12. Family,
  size and weight are bound to the typography variables.
- **Effect (1):** Shadow/Floating (tab bar, search field, chat input, bottom action bar).

## Known gaps

- **Typeface:** DM Sans substitutes for Capsule Sans. Change `font/family/sans` to switch.
- **Light mode only.** A dark-mode recording would be needed for a Dark mode.
- **Brand assets are placeholders:** agent / provider logos, promo art, list emoji. Supply real ones.
- **A few fixed values remain:** status bar padding, Gold Card chip vertical padding, the overlap
  of source favicons.
- **Not yet built:** approval prompts and the agent setup flow. They weren't in the recording, so
  baseline screens BG1, BG2 and BA1 need a recording of the setup and approval flow.

## Building screens fast

1. Start from a 440 × 956 frame on Screen inventory.
2. Stack instances: `StatusBar` → `AccountTabs` / `SearchBar` → content rows → `TabBar` floating
   20pt from the edges.
3. Change text through component properties. Never detach.
4. See "Reference → BUILT Agentic account" for a complete example (31 instances).

## Sync workflow

To be written in Phase 2. Per ADR-0003, `packages/tokens` should import these variable values
instead of pushing new ones.

## Parity status

Not started. The parity check runs from Phase 4 onward (§14).
