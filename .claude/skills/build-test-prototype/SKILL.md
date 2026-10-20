---
name: build-test-prototype
description: Rebuild the Figma test prototype for remote testing (Maze, UserTesting) and write its task and flow descriptions. Use when the owner says "build the test prototype", "rebuild the test pages", "update the prototype for testing", or asks to connect the wireframes and write the task descriptions in one go.
---

# Build the test prototype

One job, five steps: audit the Catalogue links, write the task descriptions, generate the two test
pages, check them, and hand over the flow descriptions. Do all of it unless the owner asks for
part of it. Don't commit unless asked.

## Where things are

- Figma file key `3hxTnvbUjczlAeyimq2tGt`. Page **Wireframes** (`0:1`, formerly Screen inventory), section
  **Catalogue** (`4:6`) is the master: one row per screen ID, frames named `<ID>-<n> <name>`.
- Generated pages: **Test · System** and **Test · Baseline**. Never edit them by hand.
- Generator: `packages/figma-sync/scripts/build-test-pages.js`. It runs inside `use_figma`, not
  Node. Paste it with `CONDITION` set to `'system'`, then `'baseline'`.
- Frame names: `<row name> <n>`, numbered left to right, with a short tag where a row's screens
  are alternatives (`Agent asks for approval 3 (over limit)`). Baseline frames start with
  `Baseline · `. The generator groups rows and splits conditions by this pattern (`FRAME_NAME`,
  `BASELINE`). Screen IDs → names: the lookup table in `docs/wireframes.md`.
- Task source of truth: `docs/prototype-testing.md` (the Tasks, Flow descriptions and After each
  task sections). The generator's `starts` arrays must match it.
- Load the `figma:figma-use` skill before any `use_figma` call. Links are set with
  `await node.setReactionsAsync([...])`. A timer is
  `{ trigger: { type: 'AFTER_TIMEOUT', timeout: 6 } }`.

## 1. Audit the Catalogue links

Run a read-only `use_figma` over the Catalogue frames (the generator's `FRAME_NAME` pattern). List each
frame's outgoing links, then report:

- **Orphans:** frames nothing links to that aren't a task's start frame.
- **Dead ends:** frames with no way out except Back that aren't a task's success screen.
- **Crossings:** links between system frames and baseline frames (`Baseline · …`). These must not exist.

Fix plain gaps directly in the Catalogue: Pause → Agent home 4 (paused) and Stop → Pause, stop or remove the agent 1 (choose) on every home state, and
Back where it's missing. **If a fix would change a user journey** (a new path, a different
outcome after a choice), plan it and ask the owner first. The owner wants flows planned before
they're built.

Keep the timed-start pattern. A timer never sits on an ordinary home frame. The generator clones
the home frame (`Agent home 1 (working, timed start)`, `Baseline · Agent's account 1 (timed start)`) and puts the timer on the copy, so returning home doesn't fire
the event again.

## 2. Write the task descriptions

Compare the tasks in `docs/prototype-testing.md` against the Catalogue. Add or update a task when
screens exist that no task reaches, or when a task's start or success frame was renamed or
removed. Then update both the doc tables and the generator's `starts` arrays
(`[name, startFrameId, wording, successScreen, measures]`) so they match.

**Task wording** (participants read this in Maze or UserTesting):

- State a goal in the participant's terms. Never name the control being tested ("Stop the
  research assistant…", not "Tap Stop on the Research assistant card").
- Don't hint at timing or at what will go wrong. RQ3 measures whether people notice by
  themselves.
- Tasks shared by both conditions use identical wording, word for word.
- One or two plain sentences. No jargon: mandate, autonomy level and policy are system words, not
  participant words.

**Success screen:** the exact frame name. **Measures:** the RQ or principle (RQ1/RQ2 handover,
RQ3, stop is not undo, rule source, provenance, irreversibility, recovery).

Keep the overreach task (T3) marked "off by default" with its ethics flag until the owner
settles open question 2.

## 3. Generate the test pages

Run the generator twice, in parallel, in one message: `CONDITION = 'system'` and
`CONDITION = 'baseline'`. Each run wipes its page and rebuilds the frames, the remapped links, the
timed start copy, the start points, the **test brief** panel (task wording, success screen,
measures, timed events, follow-up questions) and a **▶ start tag** above each start frame.

## 4. Check

- Each run must return `outside: []`. Anything else means a link crosses a page.
- The frame count must be the Catalogue's system or baseline count, plus 1 for the timed copy.
- Take one screenshot of each test brief panel. Fix clipped or wrong text in the script, not on
  the canvas, then rebuild.
- Run `npx prettier --write` on any docs or script you changed.

## 5. Hand over the flow descriptions

Figma's Plugin API can't set a flow's description, and a rebuild drops the old ones. Refresh the
Flow descriptions tables in `docs/prototype-testing.md`, then give the owner the paste list in
the reply: one row per flow, per page.

**Flow description rules:** they show in Figma's prototype sidebar, so write them as if a
participant could read them. Describe the journey (what screens, what the participant does).
Never say what's measured, what goes wrong, or when an event arrives. "Respond to anything it
needs", not "after a few seconds it asks you to approve".

## Reply to the owner

Summarise: links added or changed, tasks added or reworded, both page checks, then the
flow-description paste list. Keep the owner's decisions separate from the ones you made.
Open items stay listed in "Before sending it out" in the doc.
