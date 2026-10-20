# Lo-fi wireframes: screen summary

Every screen in the **Catalogue** section of the Figma file's Wireframes page, what it shows,
and why it was built that way. Built 2026-10-08 in grayscale lo-fi, for interview round 1 and for
choosing a direction. The process and conventions are in
[`wireframing-process.md`](wireframing-process.md). The screen IDs come from
[`screen-inventory.md`](screen-inventory.md).

**File:** https://www.figma.com/design/3hxTnvbUjczlAeyimq2tGt/Untitled · page **Wireframes**
· section **Catalogue**

## How to read the Catalogue

- **One row per screen group.** The row title is a plain name; the grey text beside it is the
  purpose. A row's frames run left to right as a short journey or a set of states.
- **Frames are named `<row name> <n>`**, numbered left to right, e.g. `Review and confirm 3`.
  Where a row's screens are alternatives rather than steps, a short tag says which one:
  `Agent asks for approval 3 (over limit)`. Baseline frames start with `Baseline · `. The build
  script relies on this pattern, so keep it when adding frames.
- **Screen IDs** (G1, H1, A1…) are still used in [`screen-inventory.md`](screen-inventory.md) and
  the thesis notes. The lookup table below maps them to frame names.
- **Everything is a clickable prototype.** In Figma's Present mode, each row has its own start
  point (listed below). Continue moves forward, the back arrow goes back, and the main buttons
  link across rows: setup → home → approval → alert → stop → recovery.
- **Grayscale on purpose.** State is shown by shape, weight and wording, never colour, so the
  screens still work in the `wireframe` theme (brief §9.5). The visual key is in the process doc.

### Prototype start points

These are the per-row demo start points on the Wireframes page. For participant testing, use the
generated **Test · System** and **Test · Baseline** pages instead; see
[`prototype-testing.md`](prototype-testing.md).

| Start point                 | First frame                                   |
| --------------------------- | --------------------------------------------- |
| Set up · guided steps       | Set up the agent (guided) 1                   |
| Set up · building blocks    | Set up the agent (blocks) 1                   |
| Review and confirm          | Review and confirm 1                          |
| Agent home                  | Agent home 1 (working)                        |
| Agent asks for approval     | Agent asks for approval 1 (normal)            |
| Sale that can't be undone   | Confirm a sale that can't be undone 1         |
| Rule break alert            | Limit warnings and rule breaks 3 (rule break) |
| Pause, stop or remove       | Pause, stop or remove the agent 1 (choose)    |
| Home with two agents        | Home with two agents 1                        |
| Create a background rule    | Create a background rule 1                    |
| Background rule details     | Background rule details 1                     |
| Baseline · Set up the agent | Baseline · Set up the agent 1                 |
| Baseline · Agent's account  | Baseline · Agent's account 1                  |

### Screen IDs → frame names

Renamed 2026-10-13. Old frame `H1-2 Needs you` is now `Agent home 2 (needs you)`, and so on.

| Screen ID | Frames                                      |
| --------- | ------------------------------------------- |
| G1a       | Set up the agent (guided) 1, 2, …           |
| G1b       | Set up the agent (blocks) 1, 2, …           |
| G2        | Review and confirm 1, 2, …                  |
| H1        | Agent home 1, 2, …                          |
| H2        | Home with two agents 1, 2, …                |
| A1        | Agent asks for approval 1, 2, …             |
| A2        | Confirm a sale that can't be undone 1, 2, … |
| N1        | Limit warnings and rule breaks 1, 2, …      |
| D1        | Details of one trade 1, 2, …                |
| I1        | Pause, stop or remove the agent 1, 2, …     |
| R1        | After a stop or a failure 1, 2, …           |
| S1        | Create a background rule 1, 2, …            |
| S2        | Background rule details 1, 2, …             |
| BG1       | Baseline · Set up the agent 1, 2, …         |
| BG2       | Baseline · Approvals on or off 1, 2, …      |
| BH1       | Baseline · Agent's account 1, 2, …          |
| BA1       | Baseline · Approval prompt 1, 2, …          |
| BR1       | Baseline · Disconnect the agent 1, 2, …     |
| —         | Not in this prototype 1 (both conditions)   |

---

## System condition

### Set up the agent: two versions under test (G1)

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

#### Version A: guided steps

| Frame                       | Step              | What's on it                                                                                                      | Components                                          |
| --------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Set up the agent (guided) 1 | Goal              | Preset goals, plus "Something else" in the user's own words                                                       | `MandateEditor` (goal)                              |
| Set up the agent (guided) 2 | Autonomy          | Four levels. "Act within limits" reveals the approval threshold. Locked platform and regulator rules listed below | `AutonomyIndicator`, `PermissionBoundary`           |
| Set up the agent (guided) 3 | Fund              | Amount entry with a keypad: the stock limit                                                                       | `SpendingLimit` (stock)                             |
| Set up the agent (guided) 4 | Limits            | Weekly, per trade, per day. An "Also" group: never trade options, end date                                        | `SpendingLimit` (flow), `PermissionBoundary` (user) |
| Set up the agent (guided) 5 | Instruction       | The sentence written from steps 1–4. Each underlined part traces back to its step, with a link to change it       | `MandateEditor` (instruction)                       |
| Set up the agent (guided) 6 | Editing, conflict | The edited text says $800 a trade against a $500 limit. Warning: the limit wins; change the limit or fix the text | `MandateEditor` (instruction)                       |

Why these choices:

- **The locked rules show on the Autonomy step**, before the user picks "Full autonomy". Scenario
  6 tests whether people notice the regulator exception at the moment they turn approvals off.
- **Funding gets its own keypad screen,** as in Robinhood's own amount entry. Limits come after,
  on a separate screen.
- **5b also shows a harmless addition** ("strong AI revenue"), so testers see that free text can
  steer the goal but can't widen the limits.

#### Version B: building blocks (Shortcuts style)

| Frame                       | Step         | What's on it                                                                                                      |
| --------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| Set up the agent (blocks) 1 | Start        | Templates, each with a mini preview of the chain, or start blank. Templates never set the money.                  |
| Set up the agent (blocks) 2 | Chain        | Goal → Autonomy → Funding → Limits → Rules, with "+ Add a block". Empty blocks are dashed; Finish is disabled.    |
| Set up the agent (blocks) 3 | Limits sheet | Tapping a block opens a bottom sheet for that one decision                                                        |
| Set up the agent (blocks) 4 | Complete     | Compact chain with the instruction written from the blocks. "Edit the wording" reuses Set up the agent (guided) 6 |

Why these choices:

- **A vertical chain, not a free canvas.** Free node canvases are hard on a 440 pt phone and put
  off beginners. The Shortcuts-style chain keeps one decision at a time through bottom sheets.
- **Templates never fill in the money**, because a template can't know what you can afford.
- **Open question for testing:** templates pre-select the autonomy level. People tend to accept
  defaults, so B may make setup faster at the cost of comprehension at handover (RQ1/RQ2). See
  thesis note 16.
- **Prototype shortcut:** on Set up the agent (blocks) 2, tapping Funding or Limits opens the Limits sheet, and Set up the agent (blocks) 3
  shows Funding as already set. The "+ Add a block" button isn't linked yet.

### Review and confirm (G2)

| Frame                | Shows                                                                     | Why                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Review and confirm 1 | Every setting from G1 in one summary, plus read vs. write scope           | Scope moved here from G1: it's easiest to judge once, next to everything else the agent may do                                                 |
| Review and confirm 2 | Liability on its own screen, an acknowledgement, then "swipe up to grant" | RQ2 is measured here, so liability can't share space with anything. Swipe-up is Robinhood's own commit gesture, which adds deliberate friction |
| Review and confirm 3 | "Your agent is active", plus where to pause or stop it                    | Says how to stop the agent at the moment it starts (principle 8)                                                                               |

The liability wording comes from the mandate fixture. It doesn't claim anything about Robinhood's
actual reimbursement policy.

### Agent home: one layout, six states (H1)

| Frame                          | State                      | Why                                                                                                                                                                |
| ------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Agent home 1 (working)         | Working, all limits normal | Status, autonomy, limits, activity and Pause/Stop all on one screen (principle 3)                                                                                  |
| Agent home 2 (needs you)       | Needs you                  | The held trade sits above everything else and says it won't happen until you decide                                                                                |
| Agent home 3 (near limit)      | Weekly limit near (80%)    | Pressure is shown by a tag and a threshold tick, not colour, so it survives the grayscale theme                                                                    |
| Agent home 4 (paused)          | Paused                     | Says the in-flight step finished first (brief §8 pause semantics) and that past trades stay                                                                        |
| Agent home 5 (background rule) | Background rule active     | Each activity row is tagged "from rule" or "from agent run", so scenario 7.3's question can be answered                                                            |
| Agent home 6 (stopped)         | Stopped                    | Added 2026-10-19 as the destination of "Done" after a stop. Says the price check was cancelled, the 2 trades stay and the settings are kept. Start again or Revoke |

The agent card always holds the autonomy level and Pause/Stop, so intervention is one step away
wherever the agent is shown (principle 8).

### Agent asks for approval: one pattern, four variants (A1)

| Frame                                      | Variant                     | Why                                                                                                                 |
| ------------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Agent asks for approval 1 (normal)         | Financial (user rule, $450) | Fixed order: why you're asked, what happens, limit impact, the agent's reason, claim vs. Robinhood's check          |
| Agent asks for approval 2 (regulator)      | Exception (NY regulator)    | Opens with "approvals are off, but this one still needs you". Says whose rule it is and that it can't be turned off |
| Agent asks for approval 3 (over limit)     | Over the weekly limit       | Three choices for open question 3: allow once, raise the limit, don't buy. "Don't buy" is the primary button        |
| Agent asks for approval 4 (external agent) | External agent              | External agents get a dashed avatar and a tag, and say they act under their own mandate                             |

- **"Why you're asked" always comes first,** with a rule-source tag: outlined for the user's own
  rules, filled for platform and regulator rules (principle 5).
- **The claim vs. check block appears on every approval,** even when they agree. Participants then
  learn what agreement looks like before the overreach scenario shows a mismatch.
- **Agent asks for approval 1 (normal) says what happens if nobody answers** (it expires and nothing is bought). This covers the
  approval machine's `expired` state.

### Confirm a sale that can't be undone (A2)

| Frame                                 | Shows                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------ |
| Confirm a sale that can't be undone 1 | "Can’t be undone" flagged up front. The button says "Continue", not "Approve"              |
| Confirm a sale that can't be undone 2 | The confirming sub-state: a summary, then **hold to sell** (2 seconds; letting go cancels) |

Irreversibility changes behaviour, not just styling (principle 7): an extra step, different
button wording, and a deliberate gesture. **Assumptions to check:** a market sell counts as
irreversible (open question 1), and there's a new platform rule, "ask before anything that can't
be undone". It uses the existing `irreversible` predicate but isn't in the fixtures yet.

### Limit warnings and rule breaks (N1)

| Frame                                            | Shows                                                                                                 |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Limit warnings and rule breaks 1 (near limit)    | Near limit: a banner at the top of H1. Doesn't block anything (polite)                                |
| Limit warnings and rule breaks 2 (limit reached) | Limit reached: a darker banner on H1, "won't buy more this week without asking you" (polite)          |
| Limit warnings and rule breaks 3 (rule break)    | Breach: a bottom sheet over H1 (assertive), with "it can act on" vs. "it tried", plus claim vs. check |

- **Severity is shown by how much it interrupts,** not by colour: an outlined banner, a filled
  banner, then a blocking sheet.
- **Limit warnings and rule breaks 3 (rule break) shows the overreach as blocked by the gateway** (open question 2). In the system
  condition, supervision sits in the action path (brief §2), so an out-of-scope trade can't go
  through. If you decide the overreach should execute, Limit warnings and rule breaks 3 (rule break) and Details of one trade 2 (blocked trade) need a "what to do about the
  trade" step.

### Details of one trade (D1)

| Frame                                    | Shows                                                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Details of one trade 1 (completed trade) | An executed trade: which rule let it through without asking, a 4-step timeline, claim and check agreeing |
| Details of one trade 2 (blocked trade)   | The blocked attempt: the mismatch first, then a timeline, then "Is it still going?" with Pause / Stop    |

Details of one trade 2 (blocked trade) answers scenario 3.3's question ("What happened, and is it still going?") on one screen.

### Pause, stop or remove the agent (I1)

| Frame                                                  | Shows                                                                                                                                                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pause, stop or remove the agent 1 (choose)             | Pause / Stop / Revoke, each described by what it ends and what it leaves                                                                                                                     |
| Pause, stop or remove the agent 2 (stop)               | Stop: the trades that stay are listed by name, with "Pause instead" offered as the gentler choice                                                                                            |
| Pause, stop or remove the agent 3 (remove)             | Revoke: separately asks whether to move the money back to Individual                                                                                                                         |
| Pause, stop or remove the agent 4 (stop one agent)     | Stop one agent: shows which agent stops and which keeps working (scenario 8.3)                                                                                                               |
| Pause, stop or remove the agent 5 (stop trading agent) | The same confirm for the first-party agent, reached from its Stop on the two-agent home. Added 2026-10-19 so a wrong tap in T8 lands on a confirm that says Research assistant keeps working |

- **Confirmation scales with consequence.** Pause takes one tap from H1 with no confirmation;
  Stop and Revoke confirm.
- **Every confirm says that stopping doesn't undo past trades** (principle 6), and names the
  trades that stay rather than only giving a count.

### After a stop or a failure (R1)

The same three parts every time: what stayed, what didn't happen, what you can do.

| Frame                                       | After              | Stayed                  | Didn't happen                      |
| ------------------------------------------- | ------------------ | ----------------------- | ---------------------------------- |
| After a stop or a failure 1 (after stop)    | Stopping the agent | 2 trades                | The running price check            |
| After a stop or a failure 2 (after failure) | A failed run       | 1 earlier trade         | The $300 NVDA buy (price failed)   |
| After a stop or a failure 3 (rule stopped)  | Stopping a rule    | Both buys from the rule | Nothing; it simply won't buy again |

Where the buttons go (linked 2026-10-19): Done after a stop opens Agent home 6 (stopped). Start
it again, Try again, Dismiss and the other Done buttons open Agent home 1 (working). **Shortcut:**
there's no idle home, so Dismiss ("the agent waits for its next run") shows the working home.

### Home with two agents (H2)

| Frame                                              | Shows                                                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Home with two agents 1                             | Two agent cards, each with its own mandate line, limit and Pause/Stop. One shared feed                 |
| Home with two agents 2                             | The external agent stopped (its trade stays); the first-party agent keeps working                      |
| Home with two agents 3 (trading agent paused)      | Trading agent paused (Resume), Research assistant keeps working                                        |
| Home with two agents 4 (research assistant paused) | Research assistant paused (Resume), Trading agent keeps working. Its card no longer opens the approval |
| Home with two agents 5 (trading agent stopped)     | Trading agent stopped; its 2 trades this week stay ($200 of AAPL, $400 of MSFT). Start again or Revoke |

Frames 3–5 were added on 2026-10-19 so every Pause and Stop on this row leads somewhere. **Prototype shortcut:** they show one agent changing at a time. The other agent's controls behave as on Home with two agents 1, so pausing both, or stopping one after pausing the other, doesn't show the combined state (thesis note 18).

The feed is tagged by agent avatar: solid for first-party, dashed for external. Scenario 8 asks
"which agent did what?", and the answer is visible in every row.

### Create a background rule (S1)

| Frame                      | Step   | Shows                                                                                 |
| -------------------------- | ------ | ------------------------------------------------------------------------------------- |
| Create a background rule 1 | When   | Trigger type, set to "QQQ drops 2% in a day"                                          |
| Create a background rule 2 | Then   | Action ("buy $100 of QQQ") and frequency ("at most once a day")                       |
| Create a background rule 3 | Review | The rule as one sentence, how often it checks, which mandate it runs under, stop note |

Guided the same way as G1a. Create a background rule 2 says the rule runs inside the agent's mandate and counts toward
its limits, so a rule can never do more than the agent.

### Background rule details (S2)

| Frame                              | Shows                                                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Background rule details 1          | Trigger, last action, next check, the shared weekly limit, and only this rule's activity                                           |
| Background rule details 2          | Confirm stop: its 2 buys stay; the agent keeps working. Leads to After a stop or a failure 3 (rule stopped)                        |
| Background rule details 3 (paused) | Added 2026-10-19 for "Pause rule" and "Pause instead". No checks until you resume; Resume rule is the main button, Stop rule stays |

---

## Baseline condition (recreation of the shipped flow)

Kept deliberately sparse: the baseline should look like what Robinhood ships, not like a weaker
version of the system condition. **BH1 follows the screen recording** (thesis note 10). The other
rows are rebuilt from the brief and marked **to verify** against a recording of the setup and
approval flow.

| Frame                                         | Shows                                                                         | Source         |
| --------------------------------------------- | ----------------------------------------------------------------------------- | -------------- |
| Baseline · Set up the agent 1                 | Name the agent                                                                | Brief (verify) |
| Baseline · Set up the agent 2                 | Fund the agentic account (keypad)                                             | Brief (verify) |
| Baseline · Set up the agent 3                 | Pick a model. Model names are placeholders                                    | Brief (verify) |
| Baseline · Approvals on or off 1 Approvals on | One toggle, on by default. Liability only behind "Learn about agent trading"  | Brief (verify) |
| Baseline · Approvals on or off 2              | The same toggle off. No exception shown                                       | Brief (verify) |
| Baseline · Agent's account 1                  | Own account tab, balance, chart, one Disconnect link, agent glyph on activity | Recording      |
| Baseline · Approval prompt 1                  | The trade and Approve / Decline. No rule, limit impact or claim               | Brief (verify) |
| Baseline · Disconnect the agent 1             | "Disconnect Claude?" dialog                                                   | Verify         |
| Baseline · Disconnect the agent 2             | "No agent connected"                                                          | Verify         |

The §17.3 TODO stands: the baseline neither shows nor rules out a per-trade or per-period limit.

---

## Not in this prototype (both conditions)

Added 2026-10-19. One frame per condition, in its own row at the end of that condition:
`Not in this prototype 1` (system) and `Baseline · Not in this prototype 1` (baseline). It says
"This part of the app isn't in the prototype" with a single Back button. Taps on the rest of the
Robinhood app land here: other account tabs, the tab bar, leaving setup from its first screen,
"Sell what it bought" (a normal trade), and in the baseline the deposit and holdings rows. It's a
placeholder until the owner decides the out-of-scope rule (see
[`prototype-coverage.md`](prototype-coverage.md)).

## Decisions waiting on the owner

1. **Overreach: blocked or executed?** (open question 2). The wireframes show it blocked.
2. **Is a market sell irreversible?** (open question 1). A2 assumes yes, and adds a platform rule.
3. **Agent asks for approval 3 (over limit)'s primary button** is "Don't buy". Allow once and raise the limit are secondary.
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
