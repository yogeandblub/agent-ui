# Screen inventory (lo-fi prep, Phase 1.5)

Every screen and state the eight brokerage scenarios need, in both study conditions, so they can
be wireframed by hand before interview round 1 (brief §12.1). Generated from the scenarios in
§11.1, the machines in §8, and the components in §10.

**How to read this**

- **Screens** are listed once in the catalogue, then used by the scenarios.
- **States** use the machine vocabulary from §8, so wireframes and code share names:
  - **run:** `idle`, `planning`, `working`, `waiting_for_tool`, `waiting_for_user`, `paused`,
    `completed`, `failed`, `cancelled`, `stopped`
  - **approval:** `requested`, `requested_by_exception`, `confirming`, `approved`, `rejected`,
    `expired`, `superseded`
  - **mandate:** three separate regions
    - lifecycle: `draft`, `active`, `expired`, `revoked`
    - pressure (one per limit): `normal`, `near`, `reached`
    - integrity: `clean`, `breached`
  - **standing instruction:** `draft`, `active`, `waiting_for_condition`, `acting`, `paused`,
    `expired`, `stopped`
- **Decision** is the question the screen asks the participant. "Monitor" means it asks nothing
  but has to stay readable.
- **Baseline** is what the same moment looks like in the recreation of the shipped flow (§12).
  Both conditions use identical branding and copy tone. Only the authority design differs.

---

## 1. Screen catalogue

### System condition

| ID  | Screen                      | What it's for                                                      | Main components                                                                                            |
| --- | --------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| G1  | Grant authority             | Set what the agent may do                                          | `MandateEditor`, `AutonomyIndicator`, `SpendingLimit`, `ScopeDisclosure`, `PermissionBoundary`             |
| G2  | Review and grant            | Confirm, with liability shown at the moment of delegation          | `MandateSummary`, `LiabilityNotice`, `ScopeDisclosure`                                                     |
| H1  | Supervision home            | See the agent, its limits, its activity, and how to stop it        | `AgentCard`, `AgentStatusBadge`, `MandateSummary`, `SpendingLimit`, `ActivityFeed`, `InterventionControls` |
| H2  | Supervision home, 2 agents  | Same, for a first-party and an external agent side by side         | 2 × `AgentCard`, `AgentIdentity`, `ActivityFeed` (attributed by agent)                                     |
| A1  | Approval request            | Decide on one held action                                          | `ApprovalRequest`, `ActionPreview`, `RiskIndicator`, `ReversibilityTag`, `RuleSourceTag`, `LimitMeter`     |
| A2  | Irreversible confirmation   | Second step for actions that can't be undone                       | `ApprovalRequest` (`confirming` sub-state), `ReversibilityTag`                                             |
| N1  | Boundary alert              | Notice a limit pressure change or a breach                         | `BoundaryAlert`, `LimitMeter`, `ClaimVerdictIndicator`                                                     |
| D1  | Action detail               | Inspect one action: what, why, under which rule, claim vs. verdict | `ActionPreview`, `ClaimVerdictIndicator`, `RuleSourceTag`, `RelativeTimestamp`, `ExecutionTimeline`        |
| I1  | Intervention confirm        | Confirm pause / stop / revoke, with "stop isn't undo" copy         | `InterventionControls`                                                                                     |
| R1  | Recovery                    | After a stop or failure: what persisted, what didn't, what next    | `RecoveryState`, `ActivityFeed`                                                                            |
| S1  | Create standing instruction | Set up a background rule                                           | `StandingInstruction` (`draft`), `MandateSummary`                                                          |
| S2  | Standing instruction detail | See its trigger, last and next action, and stop it                 | `StandingInstruction`, `ActivityFeed` (filtered to the instruction)                                        |

### Baseline condition

| ID  | Screen            | What it shows (recreating the shipped flow)                                           |
| --- | ----------------- | ------------------------------------------------------------------------------------- |
| BG1 | Set up agent      | Name the agent, fund a dedicated account, pick a model                                |
| BG2 | Approvals         | Approvals on by default, one toggle to turn them off. Liability only via a help link. |
| BH1 | Agent home        | Balance, recent activity with minimal attribution, a way to turn the agent off        |
| BA1 | Approval prompt   | The proposed trade and approve / decline. No rule source, limit impact, or claim.     |
| BR1 | After turning off | Whatever the shipped product shows (to verify)                                        |

> **TODO (§17.3):** whether the shipped product has a per-trade or per-period limit is unverified.
> BG1/BH1 neither include nor exclude one until that's confirmed.

---

## 2. Scenarios

Each table follows the scenario's beats in order. **Bold** marks the moment a measure is taken
(handled outside the code, §12).

### Scenario 1 — Happy path

_Mandate granted; actions stay within limits; one crosses the approval threshold; the user
approves._ Probes **RQ1/RQ2** (comprehension at handover).

| #   | Screen | States shown                                                       | Components needed                                                                                                                        | Decision                   | Baseline        |
| --- | ------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------- |
| 1.1 | G1     | mandate `draft`                                                    | `MandateEditor`, `SpendingLimit`, `ScopeDisclosure`, `PermissionBoundary` (platform high-risk rule)                                      | What authority do I grant? | BG1             |
| 1.2 | G2     | mandate `draft` → `active`                                         | `MandateSummary`, `LiabilityNotice`                                                                                                      | **Grant? Who bears loss?** | BG2 (help link) |
| 1.3 | H1     | run `planning` → `working`; all limits `normal`; integrity `clean` | `AgentCard`, `AgentStatusBadge`, `SpendingLimit`, `ActivityFeed` ($200 buy executed)                                                     | Monitor                    | BH1             |
| 1.4 | A1     | run `waiting_for_user`; approval `requested`                       | `ApprovalRequest` (financial), `ActionPreview` ($450, limit impact, rationale), `RuleSourceTag` (user), `ClaimVerdictIndicator` (agrees) | Approve or reject?         | BA1             |
| 1.5 | H1     | approval `approved`; run `working` → `completed`                   | `ActivityFeed` (approved action attributed to the $250 rule), `RelativeTimestamp`                                                        | Monitor                    | BH1             |

### Scenario 2 — Approaching limit

_A flow limit goes from 80% to 100%; the agent escalates instead of acting._ Probes **RQ3**.
Starts with weekly spending at $1,600 of $2,000.

| #   | Screen  | States shown                                                          | Components needed                                                                                                       | Decision                                                | Baseline              |
| --- | ------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | --------------------- |
| 2.1 | H1      | weekly limit `near`; run `working`                                    | `SpendingLimit`, `LimitMeter` (near)                                                                                    | Monitor                                                 | BH1 (no limit shown?) |
| 2.2 | H1 + N1 | weekly limit `near` → `reached` after a $400 buy                      | `BoundaryAlert` (reached, polite), `LimitMeter`                                                                         | **Did I notice?**                                       | — (TODO §17.3)        |
| 2.3 | A1      | run `waiting_for_user`; approval `requested`; reason `limit_exceeded` | `ApprovalRequest`, `ActionPreview` (limit impact: $2,000 → $2,200), `ClaimVerdictIndicator` (agrees: honest escalation) | Allow once over the limit, reject, or change the limit? | BA1 (if approvals on) |
| 2.4 | H1      | approval `rejected` → run `completed`; limit stays `reached`          | `ActivityFeed` (escalation recorded)                                                                                    | Monitor                                                 | BH1                   |

### Scenario 3 — Overreach _(switchable, off by default; ethics flag, §17.2)_

_The agent attempts an action outside its mandate while claiming it's inside._ Probes **RQ3**:
time to notice and intervene.

| #   | Screen  | States shown                                                                            | Components needed                                                                                                                           | Decision                              | Baseline                |
| --- | ------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ----------------------- |
| 3.1 | H1      | run `working`; integrity `clean`                                                        | `AgentCard`, `ActivityFeed`                                                                                                                 | Monitor                               | BH1                     |
| 3.2 | H1 + N1 | integrity `clean` → `breached` (buy through the Individual account, out of write scope) | `BoundaryAlert` (breach, assertive), `ClaimVerdictIndicator` (claims within / policy: outside), `ScopeDisclosure` (write scope highlighted) | **Did I notice? How fast?**           | BH1 (activity row only) |
| 3.3 | D1      | integrity `breached`                                                                    | `ActionPreview`, `ClaimVerdictIndicator`, `RuleSourceTag`                                                                                   | What happened, and is it still going? | Activity row detail     |
| 3.4 | I1      | run `working` → `paused` or `stopped`; or mandate `revoked`                             | `InterventionControls`                                                                                                                      | **Pause, stop, or revoke?**           | Turn agent off          |
| 3.5 | R1      | run `stopped`; persisted actions listed                                                 | `RecoveryState`                                                                                                                             | What now?                             | BR1                     |

### Scenario 4 — Tool failure and recovery

_A tool call fails mid-run; the user sees what persisted and chooses what to do._

| #   | Screen | States shown                                                      | Components needed                                                   | Decision                             | Baseline |
| --- | ------ | ----------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------ | -------- |
| 4.1 | H1     | run `waiting_for_tool` (quote lookup)                             | `AgentStatusBadge`, `ExecutionTimeline`, `ToolBadge` (P1, optional) | Monitor                              | BH1      |
| 4.2 | H1     | tool returned an error → run `failed`; timeline step failed       | `ExecutionTimeline`, `AgentStatusBadge` (failed)                    | Notice the failure                   | BH1      |
| 4.3 | R1     | run `failed`; earlier executed actions persist; failed one didn't | `RecoveryState`, `ActivityFeed`                                     | Retry, dismiss, or edit the mandate? | BR1      |

### Scenario 5 — Intervention mid-run

_Pause during a tool call, inspect, then stop. The run ends in `stopped` with persisted actions
shown._

| #   | Screen | States shown                                             | Components needed                                                                        | Decision                              | Baseline       |
| --- | ------ | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------- | -------------- |
| 5.1 | H1     | run `waiting_for_tool`; two actions already executed     | `AgentStatusBadge`, `ExecutionTimeline`, `InterventionControls`                          | Pause?                                | BH1            |
| 5.2 | H1     | run `paused` (in-flight call finishes first, then holds) | `AgentStatusBadge` (paused), `InterventionControls` (resume / stop)                      | Monitor                               | —              |
| 5.3 | D1     | run `paused`                                             | `ActionPreview`, `ExecutionTimeline`                                                     | Inspect: what has it done?            | Activity row   |
| 5.4 | I1     | about to stop                                            | `InterventionControls` ("Stopping ends future actions. The 2 trades already made stay.") | **Stop? Do I understand what stays?** | Turn agent off |
| 5.5 | R1     | run `stopped`; 2 persisted actions                       | `RecoveryState`                                                                          | Revoke the mandate too?               | BR1            |

### Scenario 6 — Jurisdiction exception

_Approvals are off, but a crypto trade in a regulated state still needs approval, with a
regulator-sourced reason._ Probes **RQ1** (understanding rules the user didn't set). Toolbar
jurisdiction: `US-NY`.

| #   | Screen | States shown                              | Components needed                                                                       | Decision                                    | Baseline               |
| --- | ------ | ----------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------- |
| 6.1 | G1     | mandate `draft`, autonomy `full_autonomy` | `AutonomyIndicator`, `PermissionBoundary` (regulator rule shown up front, not editable) | Turn approvals off. Do I see the exception? | BG2 (toggle off)       |
| 6.2 | H1     | run `working`                             | `AgentCard`, `AutonomyIndicator` (full autonomy)                                        | Monitor                                     | BH1                    |
| 6.3 | A1     | approval `requested_by_exception`         | `ApprovalRequest` (exception), `PermissionBoundary`, `RuleSourceTag` (regulator)        | **Why am I being asked? Whose rule is it?** | BA1 (no reason shown?) |
| 6.4 | H1     | approval `approved` or `rejected`         | `ActivityFeed` (attributed to the regulator rule)                                       | Monitor                                     | BH1                    |

### Scenario 7 — Standing instruction

_A background rule waits, triggers, and acts twice; the user stops it; recovery shows both past
actions persist._

| #   | Screen | States shown                                     | Components needed                                                             | Decision                                            | Baseline                  |
| --- | ------ | ------------------------------------------------ | ----------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------- |
| 7.1 | S1     | standing `draft` → `active`                      | `StandingInstruction` (draft: trigger, what it will do, stop-isn't-undo note) | Create it?                                          | (shipped equivalent?)     |
| 7.2 | H1     | standing `waiting_for_condition`                 | `StandingInstruction` (compact: trigger, next check)                          | Monitor                                             | BH1                       |
| 7.3 | H1     | standing `acting` → `waiting_for_condition` (×2) | `ActivityFeed` (both actions attributed to the instruction)                   | **Can I tell these came from the rule, not a run?** | BH1 (minimal attribution) |
| 7.4 | S2     | standing `waiting_for_condition`                 | `StandingInstruction`, `ActivityFeed` (filtered)                              | Stop it?                                            | —                         |
| 7.5 | I1     | about to stop                                    | `InterventionControls` ("Stopping won't undo the 2 trades it made.")          | **Confirm stop**                                    | —                         |
| 7.6 | R1     | standing `stopped`; 2 persisted actions          | `RecoveryState`                                                               | What now?                                           | BR1                       |

### Scenario 8 — Two agents

_A first-party and an external agent act under separate mandates on one surface._ Probes RQ1
(whose authority is whose) and RQ3 (which agent did what).

| #   | Screen | States shown                                         | Components needed                                                                    | Decision                          | Baseline |
| --- | ------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------- | -------- |
| 8.1 | H2     | two runs `working`; each mandate with its own limits | 2 × `AgentCard`, `AgentIdentity` (first-party / external), `ActivityFeed` (by agent) | Monitor: who is who?              | BH1 (?)  |
| 8.2 | A1     | approval `requested` from the external agent         | `ApprovalRequest`, `AgentIdentity` (external, provider shown)                        | Approve an outside agent's trade? | BA1      |
| 8.3 | I1     | stop one agent only                                  | `InterventionControls` (scoped to one agent)                                         | **Which agent do I stop?**        | —        |
| 8.4 | H2     | one run `stopped`, the other still `working`         | 2 × `AgentCard`                                                                      | Monitor                           | —        |

---

## 3. Component coverage

Which P0 components each scenario calls out in its steps. (Screens like H1 always carry their full catalogue set; this counts what the step depends on.) A component no scenario uses is a candidate to cut.

| Component               | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   |
| ----------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| `AgentStatusBadge`      | ●   | ●   | ●   | ●   | ●   | ●   | ●   | ●   |
| `AgentIdentity`         | ●   |     |     |     |     |     |     | ●   |
| `AutonomyIndicator`     | ●   |     |     |     |     | ●   |     |     |
| `RiskIndicator`         | ●   | ●   |     |     |     | ●   |     | ●   |
| `ReversibilityTag`      | ●   | ●   |     |     |     | ●   |     | ●   |
| `RuleSourceTag`         | ●   |     | ●   |     |     | ●   |     |     |
| `LimitMeter`            | ●   | ●   |     |     |     |     |     | ●   |
| `RelativeTimestamp`     | ●   | ●   | ●   | ●   | ●   | ●   | ●   | ●   |
| `ClaimVerdictIndicator` | ●   | ●   | ●   |     |     |     |     |     |
| `MandateEditor`         | ●   |     |     |     |     | ●   |     |     |
| `MandateSummary`        | ●   | ●   | ●   |     |     | ●   | ●   | ●   |
| `ScopeDisclosure`       | ●   |     | ●   |     |     |     |     |     |
| `LiabilityNotice`       | ●   |     |     |     |     |     |     |     |
| `SpendingLimit`         | ●   | ●   |     |     |     |     |     | ●   |
| `PermissionBoundary`    | ●   |     |     |     |     | ●   |     |     |
| `ApprovalRequest`       | ●   | ●   |     |     |     | ●   |     | ●   |
| `ActionPreview`         | ●   | ●   | ●   |     | ●   |     |     |     |
| `BoundaryAlert`         |     | ●   | ●   |     |     |     |     |     |
| `InterventionControls`  |     |     | ●   |     | ●   |     | ●   | ●   |
| `StandingInstruction`   |     |     |     |     |     |     | ●   |     |
| `ActivityFeed`          | ●   | ●   | ●   | ●   |     | ●   | ●   | ●   |
| `ExecutionTimeline`     |     |     |     | ●   | ●   |     |     |     |
| `RecoveryState`         |     |     | ●   | ●   | ●   |     | ●   |     |
| `AgentCard`             | ●   | ●   | ●   |     |     | ●   |     | ●   |

**What the matrix shows**

- **Every P0 component is used at least once.** `LiabilityNotice` appears in only one scenario, but
  that one is where RQ2 is measured.
- **`ConfidenceIndicator` (P2) appears nowhere.** That supports cutting it (§17.8).
- **`A2` (irreversible confirmation) appears nowhere either,** because no brokerage action in the
  scenarios is marked irreversible. See open question 1.
- **Scenario 8 needs a multi-agent surface,** but `AgentRoster` is P1. The table composes H2 from
  two `AgentCard`s instead, which keeps scenario 8 inside P0.

---

## 4. Figma frames to scaffold

One empty frame per row, on the **Screen inventory** page. Frames are named
`<scenario>.<step> <screen> — <condition>` so names stay sortable and match this document. Example:
`1.4 A1 Approval request — system`, `1.4 BA1 Approval prompt — baseline`.

- **System condition:** 36 frames (every scenario step above).
- **Baseline condition:** one frame per step that has a baseline equivalent (marked "—" when
  there isn't one): 30 frames.
- **Catalogue section:** one frame per screen ID (12 system + 5 baseline), for reusable layouts.

> **Waiting on:** the Figma file link and a signed-in Figma connection (§17.6). Until then, this
> document is the frame list.

---

## 5. Open questions for interview round 1 and the next phases

1. **Which brokerage actions are irreversible?** Placing an order can be cancelled until it fills.
   A fill can't be undone; selling afterwards is a new trade at a new price. That suggests
   "place order" is reversible and "fill" is not, which would put `A2` into scenarios 1 and 2 for
   market orders. Today's fixtures mark every trade reversible. (Logged in thesis notes.)
2. **Overreach: blocked or executed?** In scenario 3, does the out-of-scope action get blocked by
   policy (the user notices an _attempt_), or go through (the user notices a _result_)? This
   changes what the user is intervening on and ties into the ethics decision (§17.2).
3. **Approving over a limit: one-off or new limit?** In 2.3, does "allow once" leave the limit
   unchanged (pressure stays `reached`), or does it raise the limit?
4. **What does "take over" look like?** It's listed as an intervention (§6) but no scenario uses
   it. Either cut it from P0 or add a step where the user finishes a task by hand.
5. **Baseline gaps to verify against the shipped product:** limits (§17.3), what the approval
   prompt says under a jurisdiction rule (6.3), how background loops show up (7.1–7.3), and how
   external agents appear (8.1).
6. **`BoundaryAlert` vs. `ApprovalRequest`.** In 2.2–2.3 the alert and the approval arrive
   together. Wireframe both orders (alert first, or approval that contains the alert) and see
   which participants read correctly.
