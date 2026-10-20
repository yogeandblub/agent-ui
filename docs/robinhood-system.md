# Robinhood system, reverse-engineered

The reference that every component in `ref-brokerage` aligns to. Robinhood's internal design
system and brand guidelines aren't public, so this is rebuilt from what is: Robinhood's own
statements, the agencies' published case studies, and our screen recording of the iOS app.

**Confidence labels** — every claim carries one:

- **[P] Published:** Robinhood or its agency said it. Cite the source.
- **[O] Observed:** seen in the shipped app (recording 2026-10-07, or later captures).
- **[I] Inferred:** our reading of [P] and [O]. Contestable. Never present as Robinhood's words.

Write the thesis and case study in the same terms: "Robinhood's system as observed", not
"Robinhood's guidelines".

---

## 1. Mission

> "We're on a mission to democratize finance for all." [P] (About us)

**Working definition [I]:** give everyday people the tools, access and prices that used to belong
to the wealthy and to institutions. The 2026 HOOD Summit says the same thing in agent terms:
"tools once reserved for hedge funds, big banks, and quant firms", now "in every trader's pocket" [P].

**Why it matters for us [I]:** agents are pitched as democratization. The thesis question is whether
handing everyday people hedge-fund tools also hands them the supervision that came with them.
That ties the behavioral layer to the mission rather than against it.

## 2. Brand concept and principles

### Company values [P] (About us)

| Value                   | Their line                                       |
| ----------------------- | ------------------------------------------------ |
| Insane Customer Focus   | "Our customers are why we exist."                |
| High Performance        | "We operate with extreme urgency."               |
| **Safety Always**       | "Trust is hard earned and easily lost."          |
| One Robinhood           | "We're all invested in the same mission."        |
| **Participation is Power** | "We level the playing field."                 |
| First Principles Thinking | "We only follow the crowd when they're right." |
| Lean & Disciplined      | "We do more with less."                          |

### How the brand concept evolved

1. **2020 — "a brighter future" (COLLINS)** [P]. Make finance less intimidating, more engaging,
   easier to understand. Imaginative illustration, graphic-novel layouts, Capsule Sans + Nib.
2. **2021 — the gamification correction** [P]. Confetti on first deposit and first trade was removed
   after Massachusetts regulators cited it in a complaint. Replaced with "more subdued" visuals.
3. **2024 — restraint (Porto Rocha)** [P]. A brand for "serious investors for generations to come".
   "Less is more." A "distraction-free experience" so customers can focus on financial decisions.
   A modular system built to scale across stocks, crypto and Gold.

### Brand principles, distilled [I]

These are ours, derived from the above. They are the test every component must pass.

1. **Restraint.** Every element earns its place. Few colors, few weights, lots of space.
2. **Focus.** The screen serves one decision. Nothing competes with the money.
3. **Seriousness.** Mature, never playful about risk. (The 2021 correction is the proof this is
   enforced, not decorative.)
4. **Access.** Complex tools made simple enough for anyone (Participation is Power).
5. **Trust.** Safety is a stated value, not a feature (Safety Always).
6. **Modularity.** One system, many products.

**Tension to name in the thesis [I]:** principles 4 and 5 pull against each other in agent setup.
"Setup is simple" [P] serves access; the risk, liability and "Robinhood does not control, supervise,
monitor, recommend, or audit agents" [P] live in disclosures, not in the flow. Our behavioral
layer is an argument for resolving that tension inside the brand, not outside it.

## 3. Voice and tone

Robinhood speaks in three registers [I, from P sources]:

| Register            | Where                          | Character                                                                                          |
| ------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| **Marketing**       | Newsroom, launches             | Bold, ambitious, democratizing, a little FOMO ("you're at a disadvantage if you're not using Robinhood") |
| **Product**         | In-app UI                      | Plain, short, second person, sentence case, few words per element ("Setup is simple")              |
| **Legal**           | Disclosures, help links        | Long, hedged, dense ("solely responsible", "not automatically reversed")                           |

**Product voice rules we'll follow [I]:**

- Second person, present tense, sentence case.
- Short labels: verbs on buttons ("Review", "Disconnect"), nouns on sections.
- Numbers lead; words support. Money is formatted, signed and never rounded away.
- Calm about risk. No exclamation marks, no celebration on financial actions.
- No jargon without a plain-language gloss.

**The gap [O + I]:** the legal register carries the authority model (who's liable, what Loops can do,
that stopping doesn't reverse trades). The product register never says it. Our components move
those facts from the legal register into the product register, *in product voice*. That is the
alignment rule for all behavioral copy.

## 4. Brand expression [P] (2024 identity)

| Element      | Definition                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------- |
| Logo         | Simplified feather emphasising the upward arrow; refined wordmark. **Supplied by owner only.** |
| Color        | Black, white, mature neutrals; one accent, **Robin Neon** (electric yellow-green)            |
| Type         | **Robinhood Phonic** (sans, ink traps) + **Martina Plantijn** (serif, headlines)             |
| Illustration | Technical, chart-derived, simple enough to replicate at any size                             |
| Photography  | Single-subject, close-up still life                                                         |
| Layout       | Intentional, modular                                                                         |

## 5. Product foundations [O]

From the Figma library (see `figma.md`, ADR-0003). Sampled at 1pt = 1px, 440pt iPhone frame.

- **Color:** black text `#000000`, secondary `#5D6261`, borders `#E2E5E4`, soft surface `#FBFBFB`,
  positive `#0FE110`, negative `#EF3805`, gold `#FAD68C`.
- **Type scale:** 32 / 24 / 22 / 17 / 15 / 13 / 12. Display for balances; Body 15 is the workhorse.
- **Spacing:** 2–40; radius 6 / 8 / 12 / 16 / full.
- **Elevation:** one shadow, used only on floating elements (tab bar, search, chat input, action bar).
- **Mode:** light only (so far).

**Corrections to check before Phase 2:**

1. **Typeface.** ADR-0003 names Capsule Sans (2020). The 2024 identity introduced Robinhood Phonic.
   Confirm what the current app renders; the substitute should approximate the right face.
2. **"Brand" color.** We stored `#EF3805` as `bg/brand`. The app's accent likely follows market
   direction (green up, red down) [I — verify], so red may have been the *day's* color, not the brand.
   If so, the accent is a **semantic, state-driven token** (`accent = market direction`), which is
   itself a behavioral pattern, and Robin Neon is the brand accent outside price contexts.

## 6. Product patterns

### General [O unless marked]

- **One decision per screen** in setup flows (thesis-notes #13).
- **Account tabs** separate money pools (Investing, Agentic, …) with their own balance and chart.
- **Number-first hierarchy:** big balance, then chart, then range tabs, then lists.
- **Rows over cards** for lists (assets, activity); cards for discovery and promotion.
- **Floating chrome:** tab bar and action bars float over content with the single shadow.
- **Order flow:** order entry → review → submit (historically "swipe up to submit") [I — re-record].
- **Restrained feedback:** no celebration on financial actions since 2021 [P].
- **AI chat (Cortex):** bubbles, suggestion chips, sources chip, thinking indicator, disclaimer.

### Agent behavior, as shipped [P + O]

| Pattern                | What Robinhood does                                                                     | Source |
| ---------------------- | --------------------------------------------------------------------------------------- | ------ |
| Dedicated account      | Agent can only access funds in its own agentic account                                  | P, O   |
| Approvals              | Manual approval of each trade **on by default**; shown during setup; one toggle off     | P      |
| Limits                 | "Users set the instructions and limits the agent follows" — form of limits not shown    | P      |
| Standing instructions  | Loops (coming soon): run in background, place/modify/cancel without per-trade approval  | P      |
| Intervention           | A single **Disconnect** link on the agent row; Loops can be turned off                  | O, P   |
| Stop ≠ undo            | "Positions already placed are not automatically reversed" — in disclosures only         | P      |
| Attribution            | Agent trades marked by a small glyph in Activity; no rule, limit or approval info       | O      |
| Liability              | User bears all risk; Robinhood "does not control, supervise, monitor… agents"           | P      |
| External agents        | Third-party agents via the Robinhood Trading MCP, alongside the in-app agent             | P      |
| Told, not shown        | Cortex describes guardrails; the account screen doesn't                                 | O      |

This table is the **baseline condition**. Nothing missing here may appear in the baseline.

## 7. Alignment rules for our components [I]

1. **Look and voice match; authority behavior differs.** Foundations, patterns and product voice
   come from §3–6. Only the authority model changes, and every change cites a row in §6.
2. **Pass the restraint test.** A behavioral component that adds clutter breaks the brand. Prefer
   one meter, one tag, one line of copy over panels of controls.
3. **Seriousness over delight.** No celebratory states on approval or grant.
4. **Legal facts, product voice.** Liability, stop-isn't-undo and rule sources are written in §3 voice.
5. **Reuse their patterns for new jobs.** Approval = their review/submit flow; limits = their
   number-first hierarchy; agents = their account-tab model. New patterns only when none fits.

## 8. Open items

- [ ] Record the agent **setup** and **approval** flows (BG1, BG2, BA1).
- [ ] Record **dark mode**.
- [ ] Confirm the **typeface** and whether the accent follows market direction.
- [ ] Re-record an equity **order flow** to confirm review/submit.
- [ ] Verify whether shipped limits are per-trade, per-period, or account balance only (§17.3).
- [ ] Insider review: a current or former Robinhood designer checks §2, §3 and §7.

## Sources

- Robinhood, About us — https://robinhood.com/us/en/about-us
- Robinhood Newsroom, A new visual identity (2024-10-10) — https://robinhood.com/newsroom/a-new-visual-identity/
- Porto Rocha, Robinhood — https://www.portorocha.com/robinhood
- The Brand Identity, COLLINS × Robinhood (2020) — https://the-brandidentity.com/feed/collins-robinhood-combine-make-investing-accessible-affordable-engaging/
- CNN, Robinhood removes confetti (2021-03-31) — https://edition.cnn.com/2021/03/31/business/robinhood-confetti-app-changes
- Robinhood Newsroom, HOOD Summit 2026 — https://robinhood.com/newsroom/hood-summit-2026/
- CoinDesk, Robinhood's agentic AI trades 24/7 (2026-09-30) — https://www.coindesk.com/markets/2026/09/30/robinhood-is-giving-customers-an-ai-agent-that-trades-for-them-plus-10x-crypto-bets
- Our recording and notes — `design-references/robinhood/videos/`, `docs/thesis-notes.md` #10–13, `docs/figma.md`
