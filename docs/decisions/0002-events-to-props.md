# ADR-0002: Events are facts, status is computed

- **Status:** accepted
- **Date:** 2026-10-06
- **Decided by:** brief §2 (architecture rule); owner at Checkpoint 0 (machines independent of
  policy, react type-only on schema, figma-sync reads machines)

## Context

Most agent UIs let the agent, or a backend speaking for it, report its own status ("near limit",
"within policy", "needs approval"). The UI just displays that report. That's the wrong trust
relationship for delegated authority. The party being supervised is grading its own work, and the
interface can't show when the agent is wrong about itself.

This thesis needs the opposite: the UI's picture of the agent's authority must come from comparing
what the agent _did_ against what it was _allowed_ to do.

## Decision

Data flows one way. Each step only reads what the step before it produced. A composition in
`apps/` (or the gateway, in live mode) passes data between steps; the packages don't call each
other.

```text
runtime ──emits──▶ AgentEvent           facts only            packages/schema
                        │
                        ▼
                   policy layer ──▶ PolicyVerdict             packages/policy
                        │           (within mandate? needs approval? which rule? whose rule?)
                        │
                        │   composition passes event + verdict on
                        ▼
                   state machines ──▶ derived status          packages/machines
                        │
                        ▼
                   view state ──props──▶ components (pure)    packages/react
```

1. **Events carry facts only.** "Agent proposed buying $450 of X." "Tool returned." Never
   "status: near_limit." The schema has no derived status fields.
2. **Status is derived, never sent.** Machines decide `near_limit` by reading facts against the
   mandate.
3. **The agent never marks its own homework.** `withinMandate` and `requiresApproval` come from the
   policy layer. The agent's self-report is kept separately as `agentClaim`, so the UI can show
   claim against verdict.
4. **Machines don't call policy.** They take an event plus its `PolicyVerdict` as input. The
   composition (or gateway) calls policy and passes the verdict along. That keeps machines
   testable with hand-written verdicts, and policy stays the single place where mandate rules are
   evaluated.
5. **Components are pure.** Props in, callbacks out. They don't import machines, policy, or a
   runtime. They may use schema _types_ to describe props (`import type` only, enforced by
   ESLint), but never run schema code. Workflow compositions in `apps/` wire those together.
6. **In live mode, the policy layer sits in the action path.** The agent calls a gateway, not the
   broker. The gateway runs policy before forwarding and holds anything that needs approval
   (separate ADR in Phase 5b).

## Consequences

- All three runtimes (scripted, live, replay) are interchangeable because they only emit facts.
- The overreach scenario becomes possible: the agent claims "within mandate," policy says no, and
  the UI shows both.
- Machines and policy can be tested exhaustively without rendering anything.
- More plumbing: every status a component shows has to be traceable to a machine state, which comes
  from facts. That's intentional.
- Enforcement: `scripts/architecture.test.ts` checks which packages may depend on which
  (machines → schema only; react → tokens + schema; figma-sync → tokens + machines). An ESLint rule
  limits react to `import type` from schema.
- `figma-sync` reads the machines directly, so Figma variants are generated from real states
  rather than a hand-kept list.

## Alternatives considered

- **Agent-reported status.** Simpler, and it's how most products work. Rejected because it removes
  the thing being studied.
- **Status computed inside components.** Puts trust logic in the view layer, can't be shared with
  the gateway, and breaks the pure-component rule.
