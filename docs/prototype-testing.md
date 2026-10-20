# Remote testing with the Figma prototype

Round 1 runs as an unmoderated Figma prototype test in **Maze**, and possibly **UserTesting**.
The coded prototype (scripted and Alpaca paper data) waits for Phases 5 and 5b.

**File:** https://www.figma.com/design/3hxTnvbUjczlAeyimq2tGt/Untitled

## Pages

| Page            | What it is                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------------- |
| Wireframes      | **The master.** The Catalogue section holds all 52 frames. Edit here, never on the test pages.      |
| Test · System   | Generated: 43 system frames plus a timed copy of Agent home 1 (working), with 10 start points       |
| Test · Baseline | Generated: 9 baseline frames plus a timed copy of Baseline · Agent's account 1, with 3 start points |

Each test page has a **test brief** panel to the left of the screens: the task wording, success screen and
measures for each task, the timed events, and the follow-up questions. A **▶ start tag** sits above
each task's first frame. Both are outside the frames, so participants never see them. They're for
the research team; participants read the task wording in Maze or UserTesting.

Each test page only links to itself, so a participant can't cross into the other condition.
After editing the Catalogue, rebuild the test pages with
[`packages/figma-sync/scripts/build-test-pages.js`](../packages/figma-sync/scripts/build-test-pages.js),
once per condition. The rebuild wipes the test page, so don't edit the copies by hand.

## Flow descriptions

Figma's Plugin API can set a flow's name and start frame but not its description, so these are
pasted by hand: select the start frame, then edit the flow in the Prototype panel. **A rebuild of
the test pages recreates the flows and drops the descriptions**, so paste them again afterwards.
They show in Figma's prototype sidebar, so they're written to be safe if a participant ever sees
them: they describe the journey, and never say what's measured, what goes wrong, or when an event
arrives.

### Test · System

| Flow                                      | Description                                                                                                                                                                  |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1 · Set up the agent (guided steps)      | Guided setup, one decision per screen: goal, autonomy, funding, limits, then an instruction written from your choices. Review, accept who bears losses, and grant authority. |
| T1b · Set up the agent (building blocks)  | Setup as a chain of blocks. Pick a template or start blank, fill in each block, then review, accept who bears losses, and grant authority.                                   |
| T2 · Approve a trade, then hit the limit  | Your agent is working on your goal. Watch it and respond to anything it needs.                                                                                               |
| T3 · Agent breaks a rule (off by default) | Something has come up with your agent. Find out what happened and decide what to do.                                                                                         |
| T4 · A trade fails                        | A trade didn't go through. See what was kept, what didn't happen, and what you can do next.                                                                                  |
| T5 · Pause, then stop the agent           | The agent is working. Pause it, then stop it for good, and see which past trades stay.                                                                                       |
| T6 · Asked to approve with approvals off  | Your agent has approvals turned off. Respond to what comes up.                                                                                                               |
| T7 · Create and stop a background rule    | Create a background rule (when QQQ drops, buy more), see it on the home screen, then open it and stop it.                                                                    |
| T8 · Stop one of two agents               | Two agents share one account: yours and a connected research assistant. Review the assistant's request, then stop only the assistant.                                        |
| T9 · Confirm a sale that can't be undone  | The agent wants to sell, and the sale can't be undone. Confirm it with the extra step.                                                                                       |

### Test · Baseline

| Flow                      | Description                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| T1 · Set up the agent     | Name your agent, fund its account, pick a model, and choose whether trades need your approval. |
| T2 · Approve a trade      | Finish setup and go to the agent's account. Respond to anything it needs.                      |
| T5 · Disconnect the agent | From the agent's account, disconnect the agent.                                                |

## Timed events

Agent events arrive by themselves after 6 seconds (Figma's "after delay" trigger), in both
conditions:

- **System:** Agent home 1 (working, timed start) → Agent home 2 (needs you), then Limit warnings
  and rule breaks 1 (near limit) → 2 (limit reached).
- **Baseline:** Baseline · Agent's account 1 (timed start) → Baseline · Approval prompt 1.

The timer sits on a separate copy of the home screen that's used only to enter a task. Returning
home later goes to the ordinary copy, so the same approval doesn't pop up again.

**Tool limits to check in a pilot:**

- **Maze** doesn't formally support after-delay triggers. The screen change usually still happens,
  but Maze records no data for it. The taps that follow are recorded as normal.
  ([Maze help](https://help.maze.co/hc/en-us/articles/16550492768147))
- **UserTesting** plays the Figma prototype as-is, so timed events work, and the recording shows
  how participants react.
- Figma's after-delay trigger has been reported to misfire on a prototype's **first** frame. That's
  why T2 starts one screen earlier (Review and confirm 3, or Baseline · Approvals on or off 1 in the baseline) and enters the timed
  copy with a tap.
- **Hold to sell (Confirm a sale that can't be undone 2)** is a plain tap in the prototype, since Maze only records taps. Ask
  participants to "hold" in the task wording, and treat the hold itself as untested.

## Tasks

The task wording is a first draft. It avoids the names of the controls being tested. "Success"
is the screen to set as the end of the task in Maze.

### System condition

| Task | Start point                               | Wording (draft)                                                                                                     | Success screen                                                     | Measures                   |
| ---- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------- |
| T1   | T1 · Set up the agent (guided steps)      | "Set up an agent to invest in large-cap tech for you, with $5,000."                                                 | Review and confirm 3                                               | RQ1/RQ2 handover           |
| T1b  | T1b · Set up the agent (building blocks)  | Same as T1. Give each participant one setup version only.                                                           | Review and confirm 3                                               | RQ1/RQ2, guided vs. blocks |
| T2   | T2 · Approve a trade, then hit the limit  | "Your agent is running. Keep an eye on it and respond if it needs anything."                                        | Agent asks for approval 3 (over limit), a choice made              | RQ3 (rough)                |
| T3   | T3 · Agent breaks a rule (off by default) | "Something has come up with your agent. Find out what happened and deal with it." **Ethics flag, open question 2.** | After a stop or a failure 1 (after stop)                           | RQ3                        |
| T4   | T4 · A trade fails                        | "A trade didn't go through. What happened to your money?"                                                           | After a stop or a failure 2 (after failure), then a written answer | Recovery                   |
| T5   | T5 · Pause, then stop the agent           | "You want the agent to stop for now, then stop for good."                                                           | After a stop or a failure 1 (after stop)                           | Stop ≠ undo                |
| T6   | T6 · Asked to approve with approvals off  | "You turned approvals off, but the agent is asking you anyway. Decide what to do."                                  | Agent home 3 (near limit)                                          | Rule source                |
| T7   | T7 · Create and stop a background rule    | "Have the agent buy more QQQ whenever it drops. Later, end that rule."                                              | After a stop or a failure 3 (rule stopped)                         | Background rules           |
| T8   | T8 · Stop one of two agents               | "Stop the research assistant without stopping your trading agent."                                                  | Home with two agents 2                                             | Provenance                 |
| T9   | T9 · Confirm a sale that can't be undone  | "Your agent wants to sell. Go ahead with it."                                                                       | Agent home 3 (near limit)                                          | Irreversibility            |

### Baseline condition

| Task | Start point               | Wording (draft)   | Success screen                                                                |
| ---- | ------------------------- | ----------------- | ----------------------------------------------------------------------------- |
| T1   | T1 · Set up the agent     | Same as system T1 | Baseline · Agent's account 1 (timed start), then Baseline · Approval prompt 1 |
| T2   | T2 · Approve a trade      | Same as system T2 | Baseline · Agent's account 1, after the approval prompt                       |
| T5   | T5 · Disconnect the agent | Same as system T5 | Baseline · Disconnect the agent 2                                             |

The baseline has no screens for T3, T4 and T6–T9: the shipped product doesn't show those states.
That gap is part of the comparison, and it's why the comprehension questions matter more than
task success here.

## After each task

Comprehension is measured with questions, not clicks. Put these in Maze question blocks or
UserTesting written-response tasks, in both conditions:

1. What can the agent do without asking you? (RQ1)
2. If the agent loses money, who pays for it? (RQ2)
3. If you stop the agent, what happens to trades it already made? (principle 6)
4. After T6: Who decided this trade needed your approval? (rule source)

## Before sending it out

- Baseline rows BG1, BG2, BA1 and BR1 are still **to verify** against a recording of the shipped
  flow.
- Decide open question 2 (overreach). Leave T3 out until then.
- Check IRB and consent requirements, and add a consent screen in the testing tool.
- Keep the "student work, not affiliated with Robinhood" notice in the test intro.
- In the Figma prototype settings, set the device to a phone around 440×956 and scaling to "fit".
