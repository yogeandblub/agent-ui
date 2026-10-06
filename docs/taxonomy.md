# Taxonomy (draft, Phase 1)

How the system is organised, from smallest to largest. Each level is built only from the levels
below it.

```text
contract      facts and verdicts          packages/schema, packages/policy
   │
foundation    visual building blocks      packages/react/src/foundation
   │
primitives    one behavioral signal       packages/react/src/primitives
   │
patterns      one behavioral task         packages/react/src/patterns
   │
workflows     one domain, end to end      apps/ref-*
```

## Contract

The vocabulary everything else is built from. Not visible on its own.

| Concept                 | What it is                                                         | Defined in             |
| ----------------------- | ------------------------------------------------------------------ | ---------------------- |
| Agent identity          | Who is acting, and whether it's built-in or connected from outside | `schema/primitives.ts` |
| Mandate                 | Everything the user granted: autonomy, scope, limits, rules        | `schema/mandate.ts`    |
| Limit                   | A ceiling: stock (balance), cumulative, per action, rate, count    | `schema/mandate.ts`    |
| Rule                    | A typed condition with an effect, a source, and a plain reason     | `schema/mandate.ts`    |
| Scope                   | What the agent can see (read) vs. act on (write)                   | `schema/mandate.ts`    |
| Action                  | One thing the agent proposes to do, plus its own claim about it    | `schema/action.ts`     |
| Standing instruction    | A background rule that waits for a condition and then acts         | `schema/standing.ts`   |
| Event                   | A fact: something happened, at a time, by an agent                 | `schema/events.ts`     |
| Verdict _(computed)_    | Policy's judgement of an action against a mandate                  | `schema/verdict.ts`    |
| Jurisdiction _(domain)_ | Regulator rules that apply regardless of the user's settings       | `schema/jurisdiction`  |

**Signals the UI must be able to show,** each traceable to one contract field:

| Signal             | Values                                      | Source                                |
| ------------------ | ------------------------------------------- | ------------------------------------- |
| Autonomy           | suggest only → full autonomy                | `Mandate.autonomy`                    |
| Risk               | none → critical                             | `AgentAction.risk`                    |
| Reversibility      | reversible / irreversible                   | `AgentAction.reversible`              |
| Rule source        | user / platform / regulator                 | `Rule.source`                         |
| Provenance         | first-party / external                      | `AgentIdentity.provenance`            |
| Scope              | read / write                                | `Mandate.readScope`, `writeScope`     |
| Limit pressure     | normal / near / reached _(machine-derived)_ | `PolicyVerdict.limitImpact` + machine |
| Decision           | allow / require approval / deny             | `PolicyVerdict.decision`              |
| Claim vs. verdict  | agrees / disagrees                          | `AgentAction.agentClaim` + verdict    |
| Approval exception | approvals off, but this one needs approval  | `PolicyVerdict.approvalException`     |

## Foundation

Generic, brand-free building blocks. Deliberately small; not the contribution.
Button, IconButton, Text, Heading, Surface, Stack, Divider, Icon, Badge, Tooltip, Dialog, Sheet,
Meter, Switch, VisuallyHidden, LiveRegion.

## Primitives — one signal each

Each primitive renders exactly one signal from the table above, in a way that doesn't rely on color.

| Primitive               | Signal                              |
| ----------------------- | ----------------------------------- |
| `AgentStatusBadge`      | Run state                           |
| `AgentIdentity`         | Identity + provenance               |
| `AutonomyIndicator`     | Autonomy                            |
| `RiskIndicator`         | Risk                                |
| `ReversibilityTag`      | Reversibility                       |
| `RuleSourceTag`         | Rule source                         |
| `LimitMeter`            | One limit and its pressure          |
| `RelativeTimestamp`     | When                                |
| `ClaimVerdictIndicator` | Claim vs. verdict                   |
| `ToolBadge` (P1)        | Tool in use                         |
| `ConfidenceIndicator`   | Uncertainty (P2, may be cut, §17.8) |

## Patterns — one task each

Patterns combine primitives to support one user task. Grouped by the moment in the delegation
lifecycle they serve:

| Moment          | Patterns                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Granting**    | `MandateEditor`, `ScopeDisclosure`, `LiabilityNotice`, `PermissionBoundary`                                                    |
| **Monitoring**  | `MandateSummary`, `SpendingLimit`, `AgentCard`, `ActivityFeed`, `ExecutionTimeline`, `StandingInstruction`, `AgentRoster` (P1) |
| **Deciding**    | `ApprovalRequest`, `ActionPreview`, `PlanViewer` (P1)                                                                          |
| **Noticing**    | `BoundaryAlert`                                                                                                                |
| **Intervening** | `InterventionControls`                                                                                                         |
| **Recovering**  | `RecoveryState`                                                                                                                |

The "noticing" row holds a single pattern because it's the RQ3 moment: detection has to work even
when the user isn't looking at the monitoring surfaces.

## Workflows

A workflow wires a runtime, policy, machines and patterns together for one domain. Domain language
enters only here, through props and slots.

| Workflow        | Instruction                                                                         |
| --------------- | ----------------------------------------------------------------------------------- |
| `ref-brokerage` | Robinhood product concept: delegated trading, two study conditions                  |
| `ref-travel`    | "Book flights and a hotel under $1,200. Nothing non-refundable without asking."     |
| `ref-email`     | "Send follow-ups to my list, max 50 a day. Never email anyone outside the company." |

## Open questions

- Does `MandateEditor` stay one component or split into field components (§17.7)? That decides
  whether it sits in patterns or becomes a small workflow of its own.
- `BoundaryAlert` and `ApprovalRequest` overlap when a limit escalation asks for approval. Phase 4
  should decide whether one contains the other.
