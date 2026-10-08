# Lo-fi wireframes: screen summary

Every screen in the **Catalogue** section of the Figma file's Screen inventory page, what it shows,
and why it was built that way. Built 2026-10-08 in grayscale lo-fi, for interview round 1 and for
choosing a direction. The process and conventions are in
[`wireframing-process.md`](wireframing-process.md). The screen IDs come from
[`screen-inventory.md`](screen-inventory.md).

**File:** https://www.figma.com/design/3hxTnvbUjczlAeyimq2tGt/Untitled · page **Screen inventory**
· section **Catalogue**

## How to read the Catalogue

- **One row per screen ID.** The row title is the ID and name; the grey text beside it is the
  purpose. A row's frames run left to right as a short journey or a set of states.
- **Frames are named `<ID>-<n> <name>`**, e.g. `A1-3 Over limit`. The caption above each frame
  repeats the name.
- **Everything is a clickable prototype.** In Figma's Present mode, each row has its own start
  point (listed below). Continue moves forward, the back arrow goes back, and the main buttons
  link across rows: setup → home → approval → alert → stop → recovery.
- **Grayscale on purpose.** State is shown by shape, weight and wording, never colour, so the
  screens still work in the `wireframe` theme (brief §9.5). The visual key is in the process doc.

### Prototype start points

| Start point                    | First frame               |
| ------------------------------ | ------------------------- |
| G1a Guided path                | G1a-1 Goal                |
| G1b Node chain                 | G1b-1 Start               |
| G2 Review and grant            | G2-1 Review               |
| H1 Supervision home            | H1-1 Working              |
| A1 Approval request            | A1-1 Financial            |
| A2 Irreversible confirmation   | A2-1 Irreversible request |
| N1 Breach alert                | N1-3 Breach (assertive)   |
| I1 Intervention                | I1-1 Choose               |
| H2 Two agents                  | H2-1 Two agents           |
| S1 Create standing instruction | S1-1 When                 |
| S2 Standing instruction detail | S2-1 Rule detail          |
| Baseline · BG1 Set up agent    | BG1-1 Name                |
| Baseline · BH1 Agent home      | BH1-1 Agentic account     |

---

## System condition

### G1 Grant authority: two versions under test

Both versions set the same mandate and end at the same place: an instruction written from the
user's choices, which the user can edit, then G2. **Limits win:** if the edited text contradicts a
limit, a warning says so, and the limit is what gets enforced. Read vs. write scope moved to G2.

The owner currently favours **Version A**. Version B stays as the documented alternative until
testing decides.

**Why it's a flow, not one screen.** The first attempt put every mandate field on one screen. It
was rejected as too much to take in: Robinhood splits setup into one decision per screen.
Splitting also keeps the two study conditions fair, since the baseline recreates a multi-screen
setup. See thesis note 13.

**Why the instruction is generated.** Beginners don't know what to write. Building the sentence
from their choices, then letting them edit it, gets them to a precise instruction without a blank
text box. See thesis notes 14 and 15.

#### Version A: guided path

| Frame  | Step              | What's on it                                                                                                      | Components                                          |
| ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| G1a-1  | Goal              | Preset goals, plus "Something else" in the user's own words                                                       | `MandateEditor` (goal)                              |
| G1a-2  | Autonomy          | Four levels. "Act within limits" reveals the approval threshold. Locked platform and regulator rules listed below | `AutonomyIndicator`, `PermissionBoundary`           |
| G1a-3  | Fund              | Amount entry with a keypad: the stock limit                                                                       | `SpendingLimit` (stock)                             |
| G1a-4  | Limits            | Weekly, per trade, per day. An "Also" group: never trade options, end date                                        | `SpendingLimit` (flow), `PermissionBoundary` (user) |
| G1a-5  | Instruction       | The sentence written from steps 1–4. Each underlined part traces back to its step, with a link to change it       | `MandateEditor` (instruction)                       |
| G1a-5b | Editing, conflict | The edited text says $800 a trade against a $500 limit. Warning: the limit wins; change the limit or fix the text | `MandateEditor` (instruction)                       |

Why these choices:

- **The locked rules show on the Autonomy step**, before the user picks "Full autonomy". Scenario
  6 tests whether people notice the regulator exception at the moment they turn approvals off.
- **Funding gets its own keypad screen,** as in Robinhood's own amount entry. Limits come after,
  on a separate screen.
- **5b also shows a harmless addition** ("strong AI revenue"), so testers see that free text can
  steer the goal but can't widen the limits.

#### Version B: node chain (Shortcuts style)

| Frame | Step         | What's on it                                                                                                   |
| ----- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| G1b-1 | Start        | Templates, each with a mini preview of the chain, or start blank. Templates never set the money.               |
| G1b-2 | Chain        | Goal → Autonomy → Funding → Limits → Rules, with "+ Add a block". Empty blocks are dashed; Finish is disabled. |
| G1b-3 | Limits sheet | Tapping a block opens a bottom sheet for that one decision                                                     |
| G1b-4 | Complete     | Compact chain with the instruction written from the blocks. "Edit the wording" reuses G1a-5b                   |

Why these choices:

- **A vertical chain, not a free canvas.** Free node canvases are hard on a 440 pt phone and put
  off beginners. The Shortcuts-style chain keeps one decision at a time through bottom sheets.
- **Templates never fill in the money**, because a template can't know what you can afford.
- **Open question for testing:** templates pre-select the autonomy level. People tend to accept
  defaults, so B may make setup faster at the cost of comprehension at handover (RQ1/RQ2). See
  thesis note 16.
- **Prototype shortcut:** on G1b-2, tapping Funding or Limits opens the Limits sheet, and G1b-3
  shows Funding as already set. The "+ Add a block" button isn't linked yet.

### G2 Review and grant

| Frame | Shows                                                                     | Why                                                                                                                                            |
| ----- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| G2-1  | Every setting from G1 in one summary, plus read vs. write scope           | Scope moved here from G1: it's easiest to judge once, next to everything else the agent may do                                                 |
| G2-2  | Liability on its own screen, an acknowledgement, then "swipe up to grant" | RQ2 is measured here, so liability can't share space with anything. Swipe-up is Robinhood's own commit gesture, which adds deliberate friction |
| G2-3  | "Your agent is active", plus where to pause or stop it                    | Says how to stop the agent at the moment it starts (principle 8)                                                                               |

The liability wording comes from the mandate fixture. It doesn't claim anything about Robinhood's
actual reimbursement policy.

### H1 Supervision home: one layout, five states

| Frame | State                      | Why                                                                                                     |
| ----- | -------------------------- | ------------------------------------------------------------------------------------------------------- |
| H1-1  | Working, all limits normal | Status, autonomy, limits, activity and Pause/Stop all on one screen (principle 3)                       |
| H1-2  | Needs you                  | The held trade sits above everything else and says it won't happen until you decide                     |
| H1-3  | Weekly limit near (80%)    | Pressure is shown by a tag and a threshold tick, not colour, so it survives the grayscale theme         |
| H1-4  | Paused                     | Says the in-flight step finished first (brief §8 pause semantics) and that past trades stay             |
| H1-5  | Background rule active     | Each activity row is tagged "from rule" or "from agent run", so scenario 7.3's question can be answered |

The agent card always holds the autonomy level and Pause/Stop, so intervention is one step away
wherever the agent is shown (principle 8).

### A1 Approval request: one pattern, four variants

| Frame | Variant                     | Why                                                                                                                 |
| ----- | --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| A1-1  | Financial (user rule, $450) | Fixed order: why you're asked, what happens, limit impact, the agent's reason, claim vs. Robinhood's check          |
| A1-2  | Exception (NY regulator)    | Opens with "approvals are off, but this one still needs you". Says whose rule it is and that it can't be turned off |
| A1-3  | Over the weekly limit       | Three choices for open question 3: allow once, raise the limit, don't buy. "Don't buy" is the primary button        |
| A1-4  | External agent              | External agents get a dashed avatar and a tag, and say they act under their own mandate                             |

- **"Why you're asked" always comes first,** with a rule-source tag: outlined for the user's own
  rules, filled for platform and regulator rules (principle 5).
- **The claim vs. check block appears on every approval,** even when they agree. Participants then
  learn what agreement looks like before the overreach scenario shows a mismatch.
- **A1-1 says what happens if nobody answers** (it expires and nothing is bought). This covers the
  approval machine's `expired` state.

### A2 Irreversible confirmation

| Frame | Shows                                                                                      |
| ----- | ------------------------------------------------------------------------------------------ |
| A2-1  | "Can’t be undone" flagged up front. The button says "Continue", not "Approve"              |
| A2-2  | The confirming sub-state: a summary, then **hold to sell** (2 seconds; letting go cancels) |

Irreversibility changes behaviour, not just styling (principle 7): an extra step, different
button wording, and a deliberate gesture. **Assumptions to check:** a market sell counts as
irreversible (open question 1), and there's a new platform rule, "ask before anything that can't
be undone". It uses the existing `irreversible` predicate but isn't in the fixtures yet.

### N1 Boundary alert

| Frame | Shows                                                                                                 |
| ----- | ----------------------------------------------------------------------------------------------------- |
| N1-1  | Near limit: a banner at the top of H1. Doesn't block anything (polite)                                |
| N1-2  | Limit reached: a darker banner on H1, "won't buy more this week without asking you" (polite)          |
| N1-3  | Breach: a bottom sheet over H1 (assertive), with "it can act on" vs. "it tried", plus claim vs. check |

- **Severity is shown by how much it interrupts,** not by colour: an outlined banner, a filled
  banner, then a blocking sheet.
- **N1-3 shows the overreach as blocked by the gateway** (open question 2). In the system
  condition, supervision sits in the action path (brief §2), so an out-of-scope trade can't go
  through. If you decide the overreach should execute, N1-3 and D1-2 need a "what to do about the
  trade" step.

### D1 Action detail

| Frame | Shows                                                                                                    |
| ----- | -------------------------------------------------------------------------------------------------------- |
| D1-1  | An executed trade: which rule let it through without asking, a 4-step timeline, claim and check agreeing |
| D1-2  | The blocked attempt: the mismatch first, then a timeline, then "Is it still going?" with Pause / Stop    |

D1-2 answers scenario 3.3's question ("What happened, and is it still going?") on one screen.

### I1 Intervention confirm

| Frame | Shows                                                                                             |
| ----- | ------------------------------------------------------------------------------------------------- |
| I1-1  | Pause / Stop / Revoke, each described by what it ends and what it leaves                          |
| I1-2  | Stop: the trades that stay are listed by name, with "Pause instead" offered as the gentler choice |
| I1-3  | Revoke: separately asks whether to move the money back to Individual                              |
| I1-4  | Stop one agent: shows which agent stops and which keeps working (scenario 8.3)                    |

- **Confirmation scales with consequence.** Pause takes one tap from H1 with no confirmation;
  Stop and Revoke confirm.
- **Every confirm says that stopping doesn't undo past trades** (principle 6), and names the
  trades that stay rather than only giving a count.

### R1 Recovery

The same three parts every time: what stayed, what didn't happen, what you can do.

| Frame | After              | Stayed                  | Didn't happen                      |
| ----- | ------------------ | ----------------------- | ---------------------------------- |
| R1-1  | Stopping the agent | 2 trades                | The running price check            |
| R1-2  | A failed run       | 1 earlier trade         | The $300 NVDA buy (price failed)   |
| R1-3  | Stopping a rule    | Both buys from the rule | Nothing; it simply won't buy again |

### H2 Supervision home, two agents

| Frame | Shows                                                                                  |
| ----- | -------------------------------------------------------------------------------------- |
| H2-1  | Two agent cards, each with its own mandate line, limit and Pause/Stop. One shared feed |
| H2-2  | The external agent stopped (its trade stays); the first-party agent keeps working      |

The feed is tagged by agent avatar: solid for first-party, dashed for external. Scenario 8 asks
"which agent did what?", and the answer is visible in every row.

### S1 Create standing instruction

| Frame | Step   | Shows                                                                                 |
| ----- | ------ | ------------------------------------------------------------------------------------- |
| S1-1  | When   | Trigger type, set to "QQQ drops 2% in a day"                                          |
| S1-2  | Then   | Action ("buy $100 of QQQ") and frequency ("at most once a day")                       |
| S1-3  | Review | The rule as one sentence, how often it checks, which mandate it runs under, stop note |

Guided the same way as G1a. S1-2 says the rule runs inside the agent's mandate and counts toward
its limits, so a rule can never do more than the agent.

### S2 Standing instruction detail

| Frame | Shows                                                                                    |
| ----- | ---------------------------------------------------------------------------------------- |
| S2-1  | Trigger, last action, next check, the shared weekly limit, and only this rule's activity |
| S2-2  | Confirm stop: its 2 buys stay; the agent keeps working. Leads to R1-3                    |

---

## Baseline condition (recreation of the shipped flow)

Kept deliberately sparse: the baseline should look like what Robinhood ships, not like a weaker
version of the system condition. **BH1 follows the screen recording** (thesis note 10). The other
rows are rebuilt from the brief and marked **to verify** against a recording of the setup and
approval flow.

| Frame                    | Shows                                                                         | Source         |
| ------------------------ | ----------------------------------------------------------------------------- | -------------- |
| BG1-1 Name               | Name the agent                                                                | Brief (verify) |
| BG1-2 Fund               | Fund the agentic account (keypad)                                             | Brief (verify) |
| BG1-3 Model              | Pick a model. Model names are placeholders                                    | Brief (verify) |
| BG2-1 Approvals on       | One toggle, on by default. Liability only behind "Learn about agent trading"  | Brief (verify) |
| BG2-2 Approvals off      | The same toggle off. No exception shown                                       | Brief (verify) |
| BH1-1 Agentic account    | Own account tab, balance, chart, one Disconnect link, agent glyph on activity | Recording      |
| BA1-1 Approval prompt    | The trade and Approve / Decline. No rule, limit impact or claim               | Brief (verify) |
| BR1-1 Disconnect confirm | "Disconnect Claude?" dialog                                                   | Verify         |
| BR1-2 Disconnected       | "No agent connected"                                                          | Verify         |

The §17.3 TODO stands: the baseline neither shows nor rules out a per-trade or per-period limit.

---

## Decisions waiting on the owner

1. **Overreach: blocked or executed?** (open question 2). The wireframes show it blocked.
2. **Is a market sell irreversible?** (open question 1). A2 assumes yes, and adds a platform rule.
3. **A1-3's primary button** is "Don't buy". Allow once and raise the limit are secondary.
4. **Pause without confirmation** (one tap); Stop and Revoke confirm.
5. **G1: Version A or B.** A is favoured; testing decides.
6. **Baseline details to verify** against a recording: setup, approvals, the approval prompt,
   disconnecting.

## Content used throughout

Numbers and names come from `packages/schema/src/fixtures/brokerage.ts`, so the wireframes match
the code: "Trading agent" (first-party), "Research assistant" by Example Labs (external, MCP), $5,000
funded, $2,000 a week, $500 a trade, 10 trades a day, approval above $250, no options, the
platform high-risk rule, the NY crypto rule, and ends Dec 31, 2026. The $12,480 Individual balance,
tickers beyond the fixtures, and times are illustrative.
