# Thesis notes

Running log of citable findings. Newest first. Each entry: date, phase, what happened, why it
matters.

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
