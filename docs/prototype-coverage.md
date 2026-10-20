# Prototype coverage

The ledger for "every element that looks tappable goes somewhere". One table per Catalogue row
on the Wireframes page. Kept by the wireframer agent; each run updates only the rows it touched.

## Summary (2026-10-19, first full audit)

| Measure                                    | Count                  |
| ------------------------------------------ | ---------------------- |
| Frames audited                             | 52 (60 after this run) |
| Tappable elements found                    | 378                    |
| `linked` (to a frame that already existed) | 162                    |
| `built` (to a frame made this run)         | 14                     |
| `out of scope`                             | 112                    |
| `planned` (waiting on the owner)           | 90                     |
| `open`                                     | 0                      |

New frames this run: Agent home 6 (stopped); Home with two agents 3, 4 and 5; Pause, stop or
remove the agent 5 (stop trading agent); Background rule details 3 (paused); Not in this
prototype 1; Baseline · Not in this prototype 1.

Status key: `linked` goes to a frame that already existed, `built` goes to a frame made this run,
`out of scope` goes to the condition's "Not in this prototype 1" frame (placeholder rule, below),
`planned` waits on a plan below (P1–P9), `open` isn't handled yet.

### What counts as tappable

Counted: buttons, back and close circles, rows and cards with a chevron or an action, links,
toggles, checkboxes, option rows, keypads, account tabs and tab bar icons, and trade rows in an
activity feed (Agent home 1 already linked one).

Not counted:

- The current tab ("Agent", "Agentic") and the current tab bar icon (home).
- Anything under a scrim, behind a sheet or dialog.
- Disabled buttons (Finish setup on Set up the agent (blocks) 2).
- Activity rows that aren't trades (price checks, "Started working", "You paused…"). They have no
  chevron and nothing to open.
- Static tags, meters and text fields edited in place (the instruction text on Set up the agent
  (guided) 6, the name field on Baseline · Set up the agent 1).
- The selected option in a single-choice list.
- The breach sheet's scrim on Limit warnings and rule breaks 3. It's blocking on purpose
  (severity is shown by how much it interrupts).

### Out-of-scope rule (placeholder)

The owner hasn't decided this yet (TODO in `.claude/agents/wireframer.md`). Until then, taps
on the rest of the Robinhood app go to one frame per condition: **Not in this prototype 1**
(system, its own row after Background rule details) and **Baseline · Not in this prototype 1**
(baseline, its own row after Disconnect the agent). The baseline rows moved down 1200 pt to make
room. Each frame says "This part of the app isn't in the prototype" and has one Back button.

### Test pages

**Test · System** and **Test · Baseline** are stale. They were generated before this run. Rebuild
them with `packages/figma-sync/scripts/build-test-pages.js` before the next test session. The
script picks up the new rows by name, so it needs no changes.

---

## Plans waiting for the owner

Each plan covers a group of `planned` elements. None is built.

### P1 · Controls that change something in place (23 elements)

Option rows, keypads, toggles and checkboxes:

- System (19): 4 other goals (guided 1), 3 other autonomy levels (guided 2), the funding keypad
  (guided 3), "Never trade options" (guided 4), 3 other templates (blocks 1), the liability
  checkbox (Review and confirm 2), "Also move it back to Individual" (Pause, stop or remove 3),
  2 other triggers (Create a background rule 1), 2 other actions and "Change" frequency (Create a
  background rule 2).
- Baseline (4): the funding keypad, 2 other models, the chart range on Agent's account.

Decision: what should a tap do when the prototype can't follow the choice?

- **(a) Nothing.** No hotspot. Maze logs a misclick.
- **(b) Stay on the same frame.** Link each to its own frame. No visible change, but not a
  misclick.
- **(c) Build the selected state**, only where the choice changes later screens.

Suggestion: (b) everywhere, plus (c) for **Full autonomy** on Set up the agent (guided) 2. That
choice is scenario 6's setup, and it's where the regulator exception should show (2 frames: the
option selected, then the review with approvals off). Weak idea to avoid: building selected
states for every goal or model. It multiplies frames and nothing downstream changes.

### P2 · Edit sheets in setup (13 elements)

- Set up the agent (guided) 4: Weekly spending, Per trade, Trades per day, Authority ends (each has
  a ›).
- Set up the agent (blocks) 2 and 4: the Goal, Autonomy and Rules blocks.
- Set up the agent (blocks) 3: the three limit values inside the Limits sheet.

Proposed frames, all bottom sheets over a copy of the screen they open from:

| Frame                                             | Decision                      | Out             |
| ------------------------------------------------- | ----------------------------- | --------------- |
| Set up the agent (guided) 7 (edit an amount)      | Amount for weekly / per trade | Save → guided 4 |
| Set up the agent (guided) 8 (edit trades per day) | A count, with − / +           | Save → guided 4 |
| Set up the agent (guided) 9 (edit end date)       | A date                        | Save → guided 4 |
| Set up the agent (blocks) 5 (goal sheet)          | Goal                          | Done → blocks 2 |
| Set up the agent (blocks) 6 (autonomy sheet)      | Autonomy level                | Done → blocks 2 |
| Set up the agent (blocks) 7 (rules sheet)         | Your rules, plus locked rules | Done → blocks 2 |

Why: the chevrons promise an editor. The rules sheet is worth having anyway: it's where the
blocks version shows platform and regulator rules (principle 5). One amount sheet serves both
money limits, with the label changed.

### P3 · "+ Add a block" (1 element)

Set up the agent (blocks) 2. Which blocks can be added (another rule, an end date,
notifications)? This shapes version B, so it's the owner's call. Already noted in
`wireframes.md` as not linked.

### P4 · Terms and the help article (3 elements)

"Read the full agent trading terms ›" (Review and confirm 2) and "Learn about agent trading ›"
(Baseline · Approvals on or off 1 and 2). In the shipped product, liability lives only in that
help article (brief §12). Whether baseline participants can open it changes what RQ2 measures.

Proposal: one help frame per condition, with the same fixture liability wording, so the
conditions stay matched. The baseline version is **to verify** against the shipped article
(decision 6 in `wireframes.md`). Until it's verified, leaving the baseline link dead also biases
RQ2, so this one is worth deciding before round 1.

### P5 · Mandate details (9 elements)

"Mandate ›" on Agent home 1–6 and Limit warnings and rule breaks 1–2, and "Change its settings"
on After a stop or a failure 2. New row, **Mandate** (proposed screen ID M1):

| Frame               | Decision                    | Shows                                                                                                       | In / out                                             |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Mandate 1           | Monitor; maybe edit         | Instruction, autonomy, limits with usage, rules with source tags, can see / can act on, liability, end date | In: every Mandate ›. Out: Edit → Mandate 2, Back     |
| Mandate 2 (edit)    | What to change              | The same fields as rows with ›; locked rules can't be edited                                                | Out: a row → reuse the P2 sheets, Review → Mandate 3 |
| Mandate 3 (confirm) | Accept the changed mandate? | What changed, before vs. after, and that past trades stay                                                   | Out: Save → Agent home 1                             |

Questions for the owner: does editing a live mandate ask for liability again? Does it affect a
pending approval? (`mandate.edited` in the brief, but no screen yet.) If round 1 doesn't test
editing, build Mandate 1 only and leave its Edit button for later.

### P6 · All activity (13 elements)

"See all" on Agent home 1–6 and Limit warnings and rule breaks 1–2, and "All agents ▾" on Home
with two agents 1–5. New row, **All activity** (proposed ID F1):

| Frame                       | Shows                                                                  |
| --------------------------- | ---------------------------------------------------------------------- |
| All activity 1              | The full feed, each row attributed to agent run, rule or approval rule |
| All activity 2 (two agents) | The same, with filter chips: All · Trading agent · Research assistant  |

"All agents ▾" opens All activity 2. Suggestion: build it if round 1 asks "which agent did what?"
(scenario 8). Otherwise skip, since the home feed already answers it.

### P7 · Details of other trades (25 elements)

Only "Bought $200 of AAPL" has a details frame (Details of one trade 1). Trade rows for GOOGL,
AMZN, MSFT and QQQ on Agent home 3, 5 and 6, all five Home with two agents frames, Limit
warnings 1 and 2, After a stop 1 and 3, and Background rule details 1 and 3 don't. Proposal: two
new frames in the Details of one trade row:

- **Details of one trade 3 (from a background rule):** $100 of QQQ, attributed to "QQQ dip rule"
  (scenario 7).
- **Details of one trade 4 (external agent):** $300 of AMZN by Research assistant, under its own
  mandate (scenario 8).

Then link the remaining trades (GOOGL, AMZN $250, MSFT $400) to the frame of the same kind and
accept that the numbers differ, or leave them unlinked. Linking them to the AAPL frame would put
the wrong numbers in front of participants, so this run didn't.

### P8 · Revoke an external agent (1 element)

"Revoke" on Home with two agents 2 (Research assistant). What does revoking a connected agent
do: end its mandate only, or also disconnect it over MCP? Is there money to move back? That's a
design decision, not a missing state. Proposal: one frame, Pause, stop or remove the agent 6
(revoke research assistant), modelled on Pause, stop or remove the agent 3.

### P9 · Baseline order details (2 elements)

"QQQ Market Buy" on Baseline · Agent's account 1 and Baseline · Disconnect the agent 2. The
shipped app opens an order detail page. Scenario 3.3's baseline is "activity row detail".
Proposal: one frame, Baseline · Order details 1, **to verify** against a recording (decision 6).

### Not a tappable element, but worth knowing

No screen in the system condition leads to Create a background rule 1, Confirm a sale that can't
be undone 1, Limit warnings and rule breaks 3 or After a stop or a failure 2. They're reached only
from start points (and Agent home 2 and Baseline · Approval prompt 1 only from timers). That works
for task-based testing. A free-exploration test would need entries, e.g. "+ Add a rule" on Agent
home.

---

## Ledger

`NIP` = Not in this prototype 1 (system) or Baseline · Not in this prototype 1 (baseline).
"Home chrome" = three other account tabs and four other tab bar icons: 7 elements, all
`out of scope` → NIP.

### Set up the agent (guided)

| Frame | Element                                              | Goes to                                          | Status       |
| ----- | ---------------------------------------------------- | ------------------------------------------------ | ------------ |
| 1     | Back                                                 | NIP                                              | out of scope |
| 1     | Continue                                             | guided 2                                         | linked       |
| 1     | 4 other goals                                        | —                                                | planned (P1) |
| 2     | Back                                                 | back                                             | linked       |
| 2     | Continue                                             | guided 3                                         | linked       |
| 2     | Suggest only, Ask every time, Full autonomy          | —                                                | planned (P1) |
| 3     | Back, Continue                                       | back, guided 4                                   | linked       |
| 3     | Keypad                                               | —                                                | planned (P1) |
| 4     | Back, Continue                                       | back, guided 5                                   | linked       |
| 4     | Weekly, Per trade, Trades per day, Ends rows         | —                                                | planned (P2) |
| 4     | Never trade options toggle                           | —                                                | planned (P1) |
| 5     | Back, 5 × Change, Edit the wording, Review and grant | back, guided 1–4, guided 6, Review and confirm 1 | linked       |
| 6     | Back, Save instruction                               | back, guided 5                                   | linked       |
| 6     | Change the limit                                     | guided 4                                         | linked       |
| 6     | Use $500 in text                                     | guided 5                                         | linked       |

### Set up the agent (blocks)

| Frame | Element                                  | Goes to                              | Status       |
| ----- | ---------------------------------------- | ------------------------------------ | ------------ |
| 1     | Back                                     | NIP                                  | out of scope |
| 1     | Use this template                        | blocks 2                             | linked       |
| 1     | 3 other templates                        | —                                    | planned (P1) |
| 2     | Back                                     | back                                 | linked       |
| 2     | Funding, Limits blocks                   | blocks 3                             | linked       |
| 2     | Goal, Autonomy, Rules blocks             | —                                    | planned (P2) |
| 2     | + Add a block                            | —                                    | planned (P3) |
| 3     | Back, Done                               | back, blocks 4                       | linked       |
| 3     | Scrim (tap outside the sheet)            | blocks 2                             | linked       |
| 3     | 3 limit values in the sheet              | —                                    | planned (P2) |
| 4     | Back, Edit the wording, Review and grant | back, guided 6, Review and confirm 1 | linked       |
| 4     | Funding, Limits blocks                   | blocks 3                             | linked       |
| 4     | Goal, Autonomy, Rules blocks             | —                                    | planned (P2) |

### Review and confirm

| Frame | Element                             | Goes to                     | Status       |
| ----- | ----------------------------------- | --------------------------- | ------------ |
| 1     | Back, Continue                      | back, Review and confirm 2  | linked       |
| 1     | Edit                                | Set up the agent (guided) 5 | linked       |
| 2     | Back, Grant authority (swipe)       | back, Review and confirm 3  | linked       |
| 2     | Read the full agent trading terms › | —                           | planned (P4) |
| 2     | Acknowledgement checkbox            | —                           | planned (P1) |
| 3     | Go to Agent home                    | Agent home 1                | linked       |

### Agent home

| Frame              | Element                    | Goes to                               | Status       |
| ------------------ | -------------------------- | ------------------------------------- | ------------ |
| 1–6                | Home chrome (7 each)       | NIP                                   | out of scope |
| 1–6                | Mandate ›                  | —                                     | planned (P5) |
| 1–6                | See all                    | —                                     | planned (P6) |
| 1, 2, 3, 5         | Pause, Stop                | Agent home 4, Pause, stop or remove 1 | linked       |
| 1, 2, 3, 5, 6      | Bought $200 of AAPL        | Details of one trade 1                | linked       |
| 2                  | Review                     | Agent asks for approval 1             | linked       |
| 3                  | GOOGL $300, AMZN $250 rows | —                                     | planned (P7) |
| 4                  | Resume, Stop               | Agent home 1, Pause, stop or remove 2 | linked       |
| 5                  | Manage ›                   | Background rule details 1             | linked       |
| 5                  | 2 × QQQ $100 rows          | —                                     | planned (P7) |
| 6 (stopped, built) | Start again                | Agent home 1                          | linked       |
| 6                  | Revoke                     | Pause, stop or remove 3               | linked       |
| 6                  | GOOGL $300 row             | —                                     | planned (P7) |

### Home with two agents

| Frame                         | Element                           | Goes to                                         | Status       |
| ----------------------------- | --------------------------------- | ----------------------------------------------- | ------------ |
| 1–5                           | Home chrome (7 each)              | NIP                                             | out of scope |
| 1–5                           | All agents ▾                      | —                                               | planned (P6) |
| 1–5                           | Trade rows (2, 1, 2, 2, 2)        | —                                               | planned (P7) |
| 1                             | Trading agent Pause               | Home with two agents 3                          | built        |
| 1, 2, 3, 4                    | Trading agent Stop                | Pause, stop or remove 5                         | built        |
| 1, 5                          | Research assistant Pause          | Home with two agents 4                          | built        |
| 1, 3, 5                       | Research assistant card           | Agent asks for approval 4                       | linked       |
| 1, 3, 4, 5                    | Research assistant Stop           | Pause, stop or remove 4                         | linked       |
| 2                             | Trading agent Pause               | Home with two agents 3                          | built        |
| 2                             | Research assistant Start again    | Home with two agents 1                          | linked       |
| 2                             | Research assistant Revoke         | —                                               | planned (P8) |
| 3 (trading agent paused)      | Trading agent Resume              | Home with two agents 1                          | linked       |
| 3                             | Research assistant Pause          | Home with two agents 4                          | built        |
| 4 (research assistant paused) | Trading agent Pause               | Home with two agents 3                          | built        |
| 4                             | Research assistant Resume         | Home with two agents 1                          | linked       |
| 5 (trading agent stopped)     | Trading agent Start again, Revoke | Home with two agents 1, Pause, stop or remove 3 | linked       |

On frames 3–5, the other agent's controls behave as on frame 1 (see `wireframes.md`).

### Agent asks for approval

| Frame | Element                                                       | Goes to                              | Status |
| ----- | ------------------------------------------------------------- | ------------------------------------ | ------ |
| 1     | Close, Reject, Approve                                        | back, Agent home 1, Limit warnings 1 | linked |
| 2     | Close, Reject, Approve                                        | back, Agent home 3                   | linked |
| 3     | Close, Allow this one trade, Raise my weekly limit, Don’t buy | back, Agent home 3, Limit warnings 2 | linked |
| 4     | Close, Reject, Approve                                        | back, Home with two agents 1         | linked |

### Confirm a sale that can't be undone

| Frame | Element                     | Goes to                    | Status |
| ----- | --------------------------- | -------------------------- | ------ |
| 1     | Close, Continue             | back, sale 2               | linked |
| 1     | Reject                      | Agent home 3               | linked |
| 2     | Back, Hold to sell, Go back | back, Agent home 3, sale 1 | linked |

### Limit warnings and rule breaks

| Frame | Element                                   | Goes to                               | Status       |
| ----- | ----------------------------------------- | ------------------------------------- | ------------ |
| 1, 2  | Home chrome (7 each)                      | NIP                                   | out of scope |
| 1, 2  | Mandate ›                                 | —                                     | planned (P5) |
| 1, 2  | See all                                   | —                                     | planned (P6) |
| 1, 2  | Pause, Stop                               | Agent home 4, Pause, stop or remove 1 | linked       |
| 1, 2  | Bought $200 of AAPL                       | Details of one trade 1                | linked       |
| 1, 2  | Two other trade rows each                 | —                                     | planned (P7) |
| 2     | Limit reached banner (incl. See limits ›) | Agent asks for approval 3             | linked       |
| 3     | Pause the agent now, See what happened    | Agent home 4, Details of one trade 2  | linked       |

### Details of one trade

| Frame | Element                       | Goes to                                     | Status |
| ----- | ----------------------------- | ------------------------------------------- | ------ |
| 1     | Back                          | back                                        | linked |
| 2     | Back, Pause agent, Stop agent | back, Agent home 4, Pause, stop or remove 2 | linked |

### Pause, stop or remove the agent

| Frame                         | Element                         | Goes to                          | Status       |
| ----------------------------- | ------------------------------- | -------------------------------- | ------------ |
| 1                             | Pause, Stop, Revoke authority   | Agent home 4, remove 2, remove 3 | linked       |
| 1                             | Scrim                           | back                             | linked       |
| 2                             | Stop agent, Pause instead       | After a stop 1, Agent home 4     | linked       |
| 2                             | Scrim                           | back                             | linked       |
| 3                             | Close, Revoke authority         | back, After a stop 1             | linked       |
| 3                             | Cancel                          | back                             | linked       |
| 3                             | Also move it back to Individual | —                                | planned (P1) |
| 4                             | Close, Stop Research assistant  | back, Home with two agents 2     | linked       |
| 4                             | Cancel                          | Home with two agents 1           | linked       |
| 5 (stop trading agent, built) | Close, Cancel                   | back                             | linked       |
| 5                             | Stop Trading agent              | Home with two agents 5           | built        |

### After a stop or a failure

| Frame | Element                      | Goes to                 | Status       |
| ----- | ---------------------------- | ----------------------- | ------------ |
| 1     | Close                        | back                    | linked       |
| 1     | Start it again               | Agent home 1            | linked       |
| 1     | Revoke its authority too     | Pause, stop or remove 3 | linked       |
| 1     | Sell what it bought          | NIP                     | out of scope |
| 1     | Done                         | Agent home 6 (stopped)  | built        |
| 1     | Bought $200 of AAPL          | Details of one trade 1  | linked       |
| 1     | Bought $300 of GOOGL         | —                       | planned (P7) |
| 2     | Close                        | back                    | linked       |
| 2     | Try again, Dismiss, Done     | Agent home 1            | linked       |
| 2     | Change its settings          | —                       | planned (P5) |
| 2     | Bought $200 of AAPL          | Details of one trade 1  | linked       |
| 3     | Close, Turn the rule back on | back, Agent home 5      | linked       |
| 3     | Sell what it bought          | NIP                     | out of scope |
| 3     | Done                         | Agent home 1            | linked       |
| 3     | 2 × QQQ $100 rows            | —                       | planned (P7) |

### Create a background rule

| Frame | Element                             | Goes to            | Status       |
| ----- | ----------------------------------- | ------------------ | ------------ |
| 1     | Back, Continue                      | back, rule 2       | linked       |
| 1     | 2 other triggers                    | —                  | planned (P1) |
| 2     | Back, Continue                      | back, rule 3       | linked       |
| 2     | 2 other actions, Change (frequency) | —                  | planned (P1) |
| 3     | Back, Turn on rule                  | back, Agent home 5 | linked       |

### Background rule details

| Frame             | Element                      | Goes to                              | Status       |
| ----------------- | ---------------------------- | ------------------------------------ | ------------ |
| 1                 | Back, Stop rule              | back, rule details 2                 | linked       |
| 1                 | Pause rule                   | Background rule details 3            | built        |
| 1, 3              | 2 × QQQ $100 rows            | —                                    | planned (P7) |
| 2                 | Back, Scrim                  | Background rule details 1            | linked       |
| 2                 | Stop rule                    | After a stop 3                       | linked       |
| 2                 | Pause instead                | Background rule details 3            | built        |
| 3 (paused, built) | Back, Resume rule, Stop rule | back, rule details 1, rule details 2 | linked       |

### Not in this prototype (system)

| Frame | Element | Goes to | Status |
| ----- | ------- | ------- | ------ |
| 1     | Back    | back    | linked |

### Baseline · Set up the agent

| Frame | Element        | Goes to                     | Status       |
| ----- | -------------- | --------------------------- | ------------ |
| 1     | Back           | NIP                         | out of scope |
| 1     | Continue       | Baseline · Set up 2         | linked       |
| 2     | Back, Continue | back, Baseline · Set up 3   | linked       |
| 2     | Keypad         | —                           | planned (P1) |
| 3     | Back, Continue | back, Approvals on or off 1 | linked       |
| 3     | 2 other models | —                           | planned (P1) |

### Baseline · Approvals on or off

| Frame | Element                     | Goes to                                  | Status       |
| ----- | --------------------------- | ---------------------------------------- | ------------ |
| 1, 2  | Back, toggle, Finish setup  | back, the other frame, Agent's account 1 | linked       |
| 1, 2  | Learn about agent trading › | —                                        | planned (P4) |

### Baseline · Agent's account

| Frame | Element                      | Goes to      | Status       |
| ----- | ---------------------------- | ------------ | ------------ |
| 1     | Home chrome (7)              | NIP          | out of scope |
| 1     | Deposit row, QQQ holding row | NIP          | out of scope |
| 1     | Disconnect                   | Disconnect 1 | linked       |
| 1     | Chart range (1D … ALL)       | —            | planned (P1) |
| 1     | QQQ Market Buy row           | —            | planned (P9) |

### Baseline · Approval prompt

| Frame | Element                 | Goes to                 | Status |
| ----- | ----------------------- | ----------------------- | ------ |
| 1     | Close, Decline, Approve | back, Agent's account 1 | linked |

### Baseline · Disconnect the agent

| Frame | Element                | Goes to             | Status       |
| ----- | ---------------------- | ------------------- | ------------ |
| 1     | Disconnect             | Disconnect 2        | linked       |
| 1     | Cancel, Scrim          | Agent's account 1   | linked       |
| 2     | Home chrome (7)        | NIP                 | out of scope |
| 2     | No agent connected row | Baseline · Set up 1 | linked       |
| 2     | QQQ Market Buy row     | —                   | planned (P9) |

### Baseline · Not in this prototype

| Frame | Element | Goes to | Status |
| ----- | ------- | ------- | ------ |
| 1     | Back    | back    | linked |
