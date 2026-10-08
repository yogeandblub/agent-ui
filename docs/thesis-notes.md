# Thesis notes

Running log of citable findings. Newest first. Each entry: date, phase, what happened, why it
matters.

---

## 2026-10-08 · Lo-fi wireframes · G1 Grant authority

**13. A single "grant authority" screen is too much to take in.**
The first G1 wireframe put every mandate field on one screen. The owner rejected it as "a lot to
look at": Robinhood itself splits setup into one decision per screen. G1 is now a flow. This also
keeps the conditions fair: the baseline recreates a multi-screen setup, so a one-screen system
condition would differ in density as well as in authority design.

**14. Beginners don't know what to write, so the instruction is generated from choices.**
The brief treats `Mandate.instruction` as the user's own words. In both G1 versions the
instruction is instead written from the user's choices, and the user can then edit it. So the
field is no longer strictly the user's words. It's a generated draft the user approved and
possibly edited. If that holds, the schema may need to record where the text came from
(generated, edited, typed).

**15. The structured settings, not the sentence, are what gets enforced.**
If the edited text contradicts a limit ("$800 a trade" against a $500 limit), the limit is what
gets enforced, and the UI says so. This is ADR-0002's "the agent never marks its own homework"
applied to setup: free text can steer the goal, but it can't widen authority. The
node-chain version (G1b) makes the point visible: each block is a typed part of the mandate that
the policy layer can check, and a sentence isn't.

**16. Templates can pre-select autonomy.**
In the node-chain version, templates fill in the strategy, including the autonomy level, but
never the money. Pre-selecting autonomy may speed up setup at the cost of comprehension at
handover (RQ1/RQ2). This is a question for testing. The owner currently favours the guided path
(G1a), which asks for autonomy explicitly.

---

## 2026-10-07 · Design system extraction · Screen recording of the shipped app

**10. How the shipped product shows an agent's authority.**
The recording (iOS, 2026-10-07) shows what the current Robinhood app offers for supervising an
agent:

- The agent gets its **own account tab** ("Agentic") with its own balance and chart, next to
  Investing.
- On that account, a single row shows the connected agent ("Claude") with a red **Disconnect**
  link. That's the only visible intervention.
- In **Activity**, an agent-placed order ("QQQ market buy, -$20.00") is attributed only by a small
  agent glyph after the date. There's no rule, limit or approval information on the row.
- No limits, rules, scope or liability text appear anywhere on the account screen.

This is direct evidence for the baseline condition (§12): minimal attribution, one off switch, and
authority information absent from the supervision surface.

**11. The app's own assistant describes the guardrails; the screens don't.**
Asked about Agents, Cortex (Robinhood's in-app AI chat) said trades "require manual approval by
default" and "use dedicated agentic accounts". None of that was visible on the account screen
itself. The authority model is told, not shown. This is Cortex's own claim, not verified against
the product.

**12. Where design tooling strained.**

- Robinhood's typeface isn't available, so the library uses a substitute.
- The recording shows light mode only, so dark mode can't be extracted.
- Sampled colors come from a screen recording and may be shifted by the phone's color space
  (Display P3) and video compression. Treat them as close, not exact.

---

## 2026-10-06 · Phase 1.5 · Screen inventory

**8. "Reversible" depends on when you ask.**
A trade order can be cancelled until it fills; after the fill it can't be undone, only offset by a
new trade at a new price. So reversibility belongs to a moment in an action's life, not to the
action itself. The schema's single `reversible` boolean fits "place order" but not "fill". If the
brokerage treats fills as irreversible, the irreversible-confirmation step (`A2`) enters the
happy path. That's a much stronger test of brief §3.7 than a contrived "delete account" action.
Open for interview round 1.

**9. No scenario uses "take over" or an irreversible action.**
Writing the screen inventory showed two parts of the brief that no scenario exercises: the
`takeover` intervention and the irreversible-approval sub-state. An inventory driven by scenarios
works as a coverage check on the component list.

---

## 2026-10-06 · Phase 1 · Writing the contract

**1. Limits need to say which actions they apply to.**
The brief's `Limit` has a unit and a max but no way to say _which_ actions count. Without one, a
sell would draw down a spending limit, and every email would count against a "replies per day"
limit. Added `appliesTo: RulePredicate | null`, reusing the rule predicates. Finding: a limit is a
_scoped_ ceiling. The scope is part of what the user granted, so it has to be visible in the UI
(`LimitMeter` should be able to say "counts buys only").

**2. Write scope needs something on the action to check against.**
Brief §3.4 says read and write scope must be shown separately, but the brief's `AgentAction` has
nothing a write scope could be checked against. `target` is the thing acted _on_ (a ticker, a
hotel), not the account acted _through_. Added `resource` to actions and gave scope entries an
`id` plus `label`. Without this, the most common overreach (acting through the wrong account) is
impossible to detect. That's the RQ3 case.

**3. Two of the brief's events were statuses in disguise.**
`run.waiting_for_tool` and `run.waiting_for_user` are states, not facts. Both are implied by
`tool.invoked` and `approval.requested`. Keeping them would let the runtime assert state that
machines should derive, which is the exact failure ADR-0002 prevents. Removed. An open-ended
lesson: a naming convention like `run.*` invites smuggling status into an event stream.

**4. "Within mandate" and "needs approval" aren't enough to describe a decision.**
Three outcomes exist: allow, hold for approval, and deny (approval can't fix it). Two booleans can
express all three, but the UI then has to work out which one applies, and that is exactly the kind
of trust logic that shouldn't live in components. The verdict now carries an explicit `decision`,
plus `violations` and `approvalReasons` so the UI can say _why_ (brief §3.5).

**5. Exceeding a limit is outside the mandate but escalatable; a prohibition isn't.**
Scenario 2 needs "the agent escalates instead of acting" at a limit, while a prohibited action
should never get an approval button. So: limit exceeded → `withinMandate: false`,
`decision: require_approval`. Prohibited, out of scope, or expired → `decision: deny`. The
distinction matters for the overreach design. An honest agent that escalates at a limit and a
dishonest one that crosses it look identical in the booleans until you add the agent's claim.

**6. Fail closed when a limit can't be evaluated.**
If a money limit applies but the action has no amount in that currency, policy holds the action
for approval (`limit_unevaluable`) instead of letting it through. Expect this to come up again with
live agents whose tool calls omit amounts.

**7. The email workflow will need a predicate the brief doesn't have (predicted leak).**
"Never email anyone outside the company" is a prohibition on recipients that _don't_ match
`*@company.com`. `targetMatches` can only match. That needs either negation or a
`targetNotMatches` kind. Not added now: the brief asks for leaks to be found in Phase 6 and logged
there, and adding it early would hide the finding.
