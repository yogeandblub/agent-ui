# Agent UI — Thesis 2026 Build Brief

> **How to use this file:** Put it at the repo root as `CLAUDE.md` (or keep it as `docs/thesis-2026.md` and point `CLAUDE.md` at it). Start each session with:
> *"Read CLAUDE.md fully. Do the next unfinished phase only and stop at its checkpoint."*
> I review between every phase. Do not skip checkpoints.

---

## 1. Project context

This repo is the primary artifact of a UX/UI master's thesis (NYIT, 2026). It is a **design system for agentic interfaces**: a reusable component library that makes delegated authority legible and controllable.

**Locked research question**
> How can a reusable UI component system make delegated authority legible and controllable across agentic interfaces, so users can understand the limits of an agent's autonomy and intervene when those limits are reached or exceeded?

**Working sub-questions** (carried over from the earlier framing; see Open Decisions)
- **RQ1/RQ2 — Comprehension at handover.** After granting authority, can users accurately report what the agent may do, and who bears the loss if it goes wrong?
- **RQ3 — Detection during operation.** If the agent acts outside its mandate, do users notice in time to intervene?

**Builder question.** Can designers and developers assemble a correct agentic workflow from the library, in a new domain, without changing the components?

**One-sentence thesis:** *how agent state becomes UI state.*

**Core argument the code must embody.** Conventional design systems encode visual and interaction consistency. Agentic UI systems must also encode **autonomy, temporality, uncertainty, and control state**. The repo has two layers:

1. A **foundation layer** (tokens, type, buttons, inputs, surfaces). Deliberately small. Not the contribution.
2. A **behavioral layer** (mandates, limits, approval gates, permission boundaries, standing instructions, interventions, recovery). This is the contribution.

### Reference domain

The first instantiation is a **Robinhood product concept**: a redesign of how Robinhood Agents handles delegated authority. It's modeled on the shipped Robinhood Agents product: a dedicated funded account for the agent, approvals on by default, a single toggle to turn them off, background "standing instruction" loops, external agents connected over MCP and supervised on the same screen as the first-party agent, and jurisdiction rules that force approvals on in some states.

Finance is the *validation environment*, not the subject. The same components must later power two non-finance workflows (travel booking, bulk email) **with no changes to `packages/react`**. That reuse is the evidence.

**Where the brand lives.** `apps/ref-brokerage`, its Figma workflow frames, and the case-study material are branded as Robinhood: name, UI copy, and visual language (via a Robinhood brand theme in tokens). Brand assets such as logos are supplied by me; don't fabricate them. **The system itself stays brand-neutral:** `packages/*`, the Figma component library, and foundation tokens never reference Robinhood. This isn't about trademarks. The thesis claim is that the same components power travel and email, and a Robinhood-named library would undercut it.

### In scope
A Figma library (variables, component sets whose variants mirror the state machines, usage documentation) kept in parity with code, tokens (including behavioral tokens), React + TypeScript components, a typed agent-to-UI event schema, a policy layer, state machines, a deterministic mock runtime, Storybook docs, three reference workflows, a baseline comparison condition, accessibility, and tests.

### Out of scope
Real money, live brokerage accounts, auth, production backends, and building agent intelligence (we use an off-the-shelf model; we don't tune or evaluate it).

**Three runtimes, one event contract.** Agent behavior comes from one of three runtimes, all emitting the same `AgentEvent`s (see §11):
- **Scripted** (default): deterministic, used for stories, tests, and the user study.
- **Live**: a real LLM agent trading in a **paper** account against real-time market data. Built in Phase 5b, under the safety rules in §11.4.
- **Replay**: recorded live sessions played back deterministically.

Anything that would touch real money is forbidden, with no exceptions.

---

## 2. The architecture rule: events are facts, status is computed

This is the most important rule in the repo. Everything else follows from it.

```text
mock runtime ──emits──▶ AgentEvent (facts only)
                             │
                             ▼
                      policy layer ──▶ PolicyVerdict (computed: within mandate? needs approval? which rule? whose rule?)
                             │
                             ▼
                      state machines ──▶ derived status (mandate, run, approval, standing instruction)
                             │
                             ▼
                      view state ──props──▶ components (pure)
```

- **Events carry facts only.** "Agent proposed buying $450 of X." "Tool returned." "Condition met." Never "status: near_limit."
- **Status is derived, never sent.** Machines decide `near_limit` by reading facts against the mandate. Nothing upstream asserts it.
- **The agent never marks its own homework.** `withinMandate` and `requiresApproval` are computed by the policy layer, which compares the action to the mandate. The agent's self-report is kept as a separate `agentClaim` field, so the UI can show *claim vs. verdict*. In the overreach scenario that gap is the legibility argument in a single component.

**In live mode, supervision sits in the action path.** The agent never calls the broker directly. Its tools go to a **gateway** that runs the policy layer *before* forwarding an order to the paper broker. Actions that need approval are held at the gateway until the UI resolves them. If the agent could reach the broker directly (as with an MCP server handed straight to a model), approvals and limits would be reports after the fact, not controls. That difference is a thesis point in itself.

Write ADR-0002 on this flow in Phase 0, and an ADR on the gateway in Phase 5b.

---

## 3. Design principles (enforce in every PR)

1. **Contract first.** Behavioral components render from schema-derived view state. No component invents its own shape for agent data.
2. **State is explicit.** No boolean soup. Statuses are discriminated unions from documented machines. Every state has a visual, a label, and an accessible announcement.
3. **Authority is always visible.** Wherever an agent can act, the user can see what it may do, how close it is to its limits, and how to stop it, all within one interaction.
4. **Read scope and write scope are shown separately.** An agent that can *see* everything but *act* on only one account must make that asymmetry obvious.
5. **Every rule shows its source.** A boundary set by the user, the platform, or a regulator is labeled as such. Rules the user didn't set are explained, not just enforced.
6. **Stop is not undo.** Stopping ends future actions; past actions persist. Components must say so whenever a user stops, pauses, or revokes.
7. **Irreversibility is encoded, not decorated.** `reversible: false` changes behavior (confirmation friction, copy, focus), not just color.
8. **Intervention is one step away.** Pause / stop / revoke are first-class components, not buried settings.
9. **Domain-agnostic components, domain-specific content.** Domain language enters through props and slots only.
10. **Accessible by default.** WCAG 2.2 AA. Approval requests announce assertively; progress announces politely. Never use color alone for state, risk, or rule source.
11. **Pure components.** Props in, events out. Machines, policy, and the runtime live outside components and are wired in by workflow compositions.

---

## 4. Tech stack

Verify current stable versions at install time. Don't pin versions from memory.

| Concern | Choice | Why |
|---|---|---|
| Monorepo | pnpm workspaces | Package boundaries mirror the architecture |
| Language | TypeScript (strict) | The interface contract is the thesis |
| Components | React | Industry-standard UI engineering target |
| Build | Vite (library mode for packages, app mode for references) | Fast, simple |
| Accessible primitives | Radix UI | Don't hand-roll focus traps |
| Styling | CSS custom properties from tokens + CSS Modules | Framework-agnostic tokens |
| Tokens | W3C DTCG JSON → Style Dictionary → CSS vars + TS | Mirrors Figma variable export |
| Icons | State → icon map as a **TypeScript constant** in `packages/react` | Icons aren't tokens |
| Schema | Zod | The contract is validated, not assumed |
| State machines | XState v5 | Parallel states, history states, and diagrams for the thesis |
| Docs | Storybook (latest) + a11y and interactions addons | Component docs + builder-testing surface |
| Live agent | Anthropic API (tool use) driven from a local Node server | Real agent behavior; the API key never reaches the browser |
| Paper broker | Alpaca paper trading API (REST for orders/positions, streaming for quotes) | Real-time quotes, simulated fills, virtual money; stocks and 24/7 crypto |
| Broker inspection (dev only) | Alpaca's official MCP server, connected in Claude Code with paper keys | Lets Claude Code inspect the paper account during development; **never** wired into the agent |
| Design library | Figma (variables, component sets, documentation pages) | The design half of the system; what designer-builders test against |
| Design ↔ code sync | Figma MCP server (if connected in Claude Code) + Code Connect | Push tokens to variables, read component properties for parity checks, map Figma components to React |
| Tests | Vitest + Testing Library + axe | Unit, interaction, a11y |
| Lint/format | ESLint + Prettier | Standard |

Package scope: `@agent-ui/*` (not published to npm, so naming collisions don't matter).

---

## 5. Repo structure

```text
agent-ui/
├── CLAUDE.md
├── README.md
├── package.json · pnpm-workspace.yaml · tsconfig.base.json
├── docs/
│   ├── decisions/            # ADRs
│   ├── taxonomy.md           # primitives → patterns → workflows
│   ├── state-machines.md     # diagrams + transition tables
│   ├── precedents.md         # shipped vs. missing controls (see §12)
│   ├── figma.md              # file link, page structure, sync workflow, parity status
│   ├── builder-tasks.md      # builder-testing tasks (Phase 7)
│   └── thesis-notes.md       # running log of citable findings
├── recordings/               # saved live sessions (gitignored by default; curated ones committed)
├── packages/
│   ├── tokens/
│   ├── schema/               # Zod: facts and events only
│   ├── policy/               # pure functions: action × mandate → PolicyVerdict
│   ├── machines/             # XState: run, approval, mandate, standingInstruction
│   ├── runtime-mock/         # scripted + replay player
│   ├── runtime-live/         # Node server: agent loop, gateway, paper-broker adapter, recorder
│   ├── figma-sync/           # token → variables push, variant manifest, parity check
│   └── react/
│       └── src/
│           ├── foundation/
│           ├── primitives/
│           ├── patterns/
│           ├── icons.ts      # state → icon map
│           └── index.ts
└── apps/
    ├── storybook/            # ALL stories live here, not in packages/react
    ├── ref-brokerage/        # build first; includes baseline + system conditions
    ├── ref-travel/
    └── ref-email/
```

Component folders in `packages/react` contain `Component.tsx`, `Component.module.css`, `Component.test.tsx`, `index.ts`. Stories and MDX docs live in `apps/storybook/src/<Component>/`.

---

## 6. Schema (`packages/schema`) — facts only

A starting sketch. Refine it, but keep the concepts. **No derived status fields.**

```ts
export const RiskLevel = z.enum(['none', 'low', 'medium', 'high', 'critical']);

export const AutonomyLevel = z.enum([
  'suggest_only',       // agent proposes, human acts
  'act_with_approval',  // every action approved
  'act_within_limits',  // acts freely inside the mandate; escalates at limits
  'full_autonomy',      // no approvals (still revocable; exceptions may still apply)
]);

export const RuleSource = z.enum(['user', 'platform', 'regulator']);

export const AgentIdentity = z.object({
  id: z.string(),
  name: z.string(),
  provenance: z.enum(['first_party', 'external']), // built-in vs. connected over MCP
  provider: z.string().nullable(),                 // e.g. model or vendor name
});

// Typed approval / prohibition rules — no free-text rules that nothing evaluates
export const RulePredicate = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('amountAbove'), unit: z.string(), value: z.number() }),
  z.object({ kind: z.literal('irreversible') }),
  z.object({ kind: z.literal('riskAtLeast'), level: RiskLevel }),
  z.object({ kind: z.literal('targetMatches'), field: z.string(), pattern: z.string() }),
  z.object({ kind: z.literal('assetClass'), value: z.string() }), // e.g. 'crypto'
]);

export const Rule = z.object({
  id: z.string(),
  effect: z.enum(['require_approval', 'prohibit']),
  when: RulePredicate,
  source: RuleSource,
  reason: z.string(),          // plain-language explanation shown in UI
  userEditable: z.boolean(),   // false for platform/regulator rules
});

export const Limit = z.object({
  id: z.string(),
  kind: z.enum(['stock', 'cumulative', 'per_action', 'rate', 'count']),
  // stock = funded balance the agent can draw from; others are flow limits
  label: z.string(),
  unit: z.string(),
  max: z.number(),
  window: z.string().nullable(),  // ISO 8601 duration for rolling windows
});

export const Mandate = z.object({
  id: z.string(),
  agentId: z.string(),
  grantedAt: z.string().datetime(),
  expiresAt: z.string().datetime().nullable(),
  autonomy: AutonomyLevel,
  instruction: z.string(),        // verbatim user instruction
  readScope: z.array(z.string()), // what the agent can see
  writeScope: z.array(z.string()),// what the agent can act on
  limits: z.array(Limit),
  rules: z.array(Rule),
  liability: z.string(),          // who bears loss, plain language
});

export const AgentAction = z.object({
  id: z.string(),
  agentId: z.string(),
  runId: z.string().nullable(),
  standingInstructionId: z.string().nullable(),
  verb: z.string(),
  target: z.string(),
  attributes: z.record(z.string()),          // e.g. { assetClass: 'crypto' } for predicates
  magnitude: z.object({ value: z.number(), unit: z.string() }).nullable(),
  tool: z.string().nullable(),
  risk: RiskLevel,
  reversible: z.boolean(),
  rationale: z.string().nullable(),
  confidence: z.number().min(0).max(1).nullable(),
  agentClaim: z.object({                     // what the agent SAYS — never trusted
    withinMandate: z.boolean(),
    requiresApproval: z.boolean(),
  }),
});

export const StandingInstruction = z.object({
  id: z.string(),
  agentId: z.string(),
  mandateId: z.string(),
  instruction: z.string(),          // verbatim
  condition: z.string(),            // plain-language trigger
  actionTemplate: z.string(),       // what it will do when triggered
  schedule: z.string().nullable(),
  reversibleOnStop: z.literal(false), // stopping never undoes past actions
});

export const AgentEvent = z.discriminatedUnion('type', [
  /* run.started, run.planning, run.working, run.waiting_for_tool, run.waiting_for_user,
     run.completed, run.failed,
     plan.proposed, plan.step_updated,
     action.proposed, action.executed, action.failed, action.undone,
     usage.recorded (limitId, amount),
     approval.requested, approval.resolved (approved | rejected | expired),
     tool.invoked, tool.returned,
     standing.created, standing.condition_met, standing.acted,
     intervention.applied (pause | resume | stop | revoke | takeover),
     mandate.granted, mandate.edited, mandate.expired,
     error.raised, message.streamed */
]);
```

---

## 7. Policy layer (`packages/policy`)

Pure, fully tested functions:

```ts
evaluate(action: AgentAction, mandate: Mandate, usage: LimitUsage[], context: { jurisdiction: string })
  → PolicyVerdict {
      withinMandate: boolean;
      requiresApproval: boolean;
      matchedRules: { ruleId; effect; source; reason }[];
      limitImpact: { limitId; before; after; max }[];
      claimMismatch: boolean;   // agentClaim disagrees with the verdict
    }
```

Regulator rules come from a small jurisdiction table (e.g. crypto approvals forced on in certain states). These rules apply even when `autonomy` is `full_autonomy`, which produces the **approval-exception** case: approvals are "off", but this action still needs one, and the UI must say why and whose rule it is.

---

## 8. State machines (`packages/machines`)

Each machine gets a transition table in `docs/state-machines.md`, an exportable diagram, a unit test for every transition, and a stepper story.

### `agentRunMachine`
`idle → planning → working ⇄ waiting_for_tool / waiting_for_user → completed`, with `failed`, `paused`, and two distinct terminal states:

- **`cancelled`** — stopped before any action executed. Nothing persists.
- **`stopped`** — stopped after one or more actions executed. **Completed actions persist, and the UI must say so.**

Pause semantics: pausing during `waiting_for_tool` lets the in-flight call finish, then holds. Resume returns to the prior state via a history state. Stop cancels in-flight calls.

### `approvalMachine`
`requested → approved | rejected | expired | superseded`. Irreversible actions add an explicit confirmation sub-state. Include **`requested_by_exception`**: an approval forced by a platform or regulator rule while the user's autonomy setting says approvals are off.

### `mandateMachine` — parallel regions
A flat enum can't express "active, near the spend cap, and breached" at once. Use parallel regions:

- **lifecycle:** `draft → active → expired | revoked`
- **pressure (one child per limit):** `normal → near → reached`
- **integrity:** `clean → breached` (the policy layer saw an out-of-mandate action, attempted or executed)

This machine is the most directly tied to the RQ. Its diagram is a primary thesis figure.

### `standingInstructionMachine`
`draft → active → waiting_for_condition ⇄ acting → waiting_for_condition`, plus `paused`, `expired`, and **`stopped`** (future actions end; past actions persist). Every action it takes is attributed to the instruction in the activity feed.

---

## 9. Tokens and the Figma library

### 9.1 Source of truth

- **Tokens:** the repo is the source of truth (`packages/tokens`, DTCG JSON). `packages/figma-sync` pushes them into Figma variables (collections: Foundation, Semantic, Behavioral; modes: Light, Dark). Variable names match token paths exactly.
- **States and variants:** the state machines are the source of truth. `packages/figma-sync` generates a **variant manifest** (`variant-manifest.json`) from the machines and component prop types. It lists every component, its variant properties, and their allowed values. Figma component sets are built against it.
- **Visual design:** Figma is the source of truth for how components look. Code follows Figma for layout and styling; Figma follows code for states and names.

### 9.2 Figma file structure

```text
Cover
Screen inventory     every screen and state each scenario needs (generated, see §12.1)
Wireframes           lo-fi flows per scenario, both study conditions
Foundations          tokens rendered as swatches/scales, bound to variables
Behavioral tokens    agent state, risk, autonomy, limit, rule source, scope, provenance
Primitives           one component set per primitive in §10
Patterns             one component set per pattern in §10
Workflows            hi-fi Robinhood frames (system + baseline), travel, email: key frames per scenario
State diagrams       the four machines, laid out as figures for the thesis
Docs                 usage guidance per component, mirroring the MDX standard in §13
```

### 9.3 Rules for the Figma library

1. **Variants mirror machine states.** A component's variant properties come from the manifest. No variant exists in Figma that has no state in code, and vice versa.
2. **Parallel state = multiple variant properties.** The mandate's parallel regions (lifecycle, pressure, integrity) become separate properties, not one combined "status" property. If Figma's variant model makes this awkward, log it in `docs/thesis-notes.md`. Where design tooling strains against agent state is itself a finding.
3. **Everything binds to variables.** No hardcoded colors, spacing, or radii in component sets.
4. **Same names everywhere.** Component names, property names, and values match the React components and the manifest exactly (`AgentStatusBadge` / `state=waiting_for_user`).
5. **Content is swappable.** Domain text uses text properties or instance-swap slots, so the same component set renders brokerage, travel, and email content. This is the Figma side of the zero-changes test.
6. **Code Connect** maps each Figma component set to its React component (required by Phase 7, not optional).

### 9.4 Who does what

By default, Claude Code handles the mechanical sync: pushing variables, generating the manifest, scaffolding empty component sets with the correct properties, running parity checks. I design the visuals. If the Figma MCP server isn't connected in Claude Code, generate the manifest and a token export, and I'll import them manually. Don't block on it.

### 9.5 Token tiers (`packages/tokens`)

Three tiers, DTCG JSON, light and dark from day one.

**Themes control fidelity.** The same tiers ship in three themes, so moving up a fidelity level is a theme swap, not a rebuild (see §12.1):
- `wireframe` — grayscale, system font, flat surfaces. Behavioral signals use shape, icon, and weight, never color. Used for mid-fi interviews.
- `neutral` — the brand-free system look, used in Storybook and for travel and email.
- `robinhood` — the brand theme for `ref-brokerage` hi-fi. Semantic and behavioral tokens may be remapped; component code never changes.

- **Foundation:** color ramps, type, spacing, radii, elevation, motion.
- **Semantic:** surface, text, border, interactive, feedback.
- **Behavioral (the novel tier):**
  - `agent.state.*` — color + motion per run state.
  - `risk.*` — none → critical, with color and border weight.
  - `autonomy.*` — encoding for the four levels.
  - `limit.*` — normal / near / reached / breached fills.
  - `ruleSource.*` — user / platform / regulator treatments.
  - `scope.*` — read vs. write treatments.
  - `reversibility.*` — irreversible-action treatment.
  - `provenance.*` — first-party vs. external agent.
  - `motion.agent.*` — streaming, working, background-waiting; all respect `prefers-reduced-motion`.

In every theme, keep the foundation restrained so behavioral signals carry the visual weight. No icons in tokens.

---

## 10. Component inventory

**P0** = needed for `ref-brokerage` (both conditions). **P1** = needed for cross-domain validation. **P2** = nice to have. Scope creep happens in Phases 4 and 6, so stay inside P0 until Checkpoint 5.

### Foundation (only what behavioral components need)
Button, IconButton, Text, Heading, Surface, Stack, Divider, Icon, Badge, Tooltip, Dialog, Sheet, Meter, Switch, VisuallyHidden, LiveRegion.

### Behavioral primitives
| Component | Purpose | Priority |
|---|---|---|
| `AgentStatusBadge` | Run state: icon + label + motion | P0 |
| `AgentIdentity` | Name, role, and provenance (first-party vs. external) | P0 |
| `AutonomyIndicator` | Current autonomy level | P0 |
| `RiskIndicator` | Risk, color-independent | P0 |
| `ReversibilityTag` | Reversible vs. irreversible | P0 |
| `RuleSourceTag` | User / platform / regulator | P0 |
| `LimitMeter` | One limit: stock or flow, with pressure state | P0 |
| `RelativeTimestamp` | Live, accessible time | P0 |
| `ClaimVerdictIndicator` | Agent's claim vs. policy verdict | P0 |
| `ToolBadge` | Tool or integration in use | P1 |
| `ConfidenceIndicator` | Uncertainty without false precision (may be cut) | P2 |

### Behavioral patterns
| Component | Purpose | Priority |
|---|---|---|
| `MandateEditor` | Grant/edit authority: verbatim instruction, autonomy, limits (stock + flow), rules, expiry, read/write scope, liability | P0 |
| `MandateSummary` | Always-available compact view with stop control | P0 |
| `ScopeDisclosure` | Read scope vs. write scope, side by side | P0 |
| `LiabilityNotice` | Who bears loss, shown at the moment of delegation | P0 |
| `SpendingLimit` | Stock + flow limits composed from `LimitMeter`s | P0 |
| `PermissionBoundary` | A rule, its source, its reason, and whether the user can change it | P0 |
| `ApprovalRequest` | Variants: information, permission, financial, destructive, irreversible, exception | P0 |
| `ActionPreview` | What will happen, limit impact, reversibility, rationale, claim vs. verdict | P0 |
| `BoundaryAlert` | Near / at / over a limit, or a breach — the RQ3 moment | P0 |
| `InterventionControls` | Pause / resume / stop / revoke / take over, with stop-isn't-undo copy | P0 |
| `StandingInstruction` | A background rule: trigger, what it will do, last/next action, stop control | P0 |
| `ActivityFeed` / `ActivityItem` | Audit trail attributed by agent, run or instruction, and rule | P0 |
| `ExecutionTimeline` | Ordered steps with live status | P0 |
| `RecoveryState` | After a stop or failure: what persisted, what didn't, what you can do | P0 |
| `AgentCard` | Identity, status, mandate summary, latest activity | P0 |
| `AgentRoster` | Multiple agents (first-party + external) on one supervision surface | P1 |
| `PlanViewer` | Editable multi-step plan before execution | P1 |
| `ToolInvocation` | Expandable tool-call record | P1 |
| `AgentHandoff` | Transfer between agents or agent → human | P2 |
| `StreamingMessage` | Agent narration while streaming | P2 |

---

## 11. Runtimes

### 11.1 Scripted (`packages/runtime-mock`)

A deterministic scenario player. Scenarios are typed scripts of `AgentEvent`s with relative timings. Supports play / pause / step / speed / seek, so stories and test sessions are reproducible.

Brokerage scenarios:
1. **Happy path.** Mandate granted; actions stay within limits; one exceeds the approval threshold; the user approves.
2. **Approaching limit.** A flow limit goes from 80% to 100%; the agent escalates instead of acting.
3. **Overreach** *(research condition, switchable, see Open Decisions).* The agent attempts an out-of-mandate action while its `agentClaim` says it's within mandate.
4. **Tool failure + recovery.**
5. **Intervention mid-run.** Pause during a tool call, inspect, then stop. The run ends in `stopped` with persisted actions shown.
6. **Jurisdiction exception.** Autonomy is set to approvals-off, but a crypto action in a regulated state forces an approval with a regulator-sourced reason.
7. **Standing instruction.** A loop waits, triggers, acts twice; the user stops it; `RecoveryState` shows that both past actions persist.
8. **Two agents.** A first-party agent and an external agent act under separate mandates on one surface.

Travel and email re-skin scenarios 1, 2, 3, 5 and 7 with identical event structures and different content.

### 11.2 Live (`packages/runtime-live`) — Phase 5b

A small local Node server with four parts:

- **Agent loop.** An LLM with tool use, given a mandate and instruction as context. Its tools are *our* tools (`get_quote`, `get_positions`, `propose_order`, `cancel_order`, `create_standing_instruction`, ...), shaped like real brokerage MCP tools but served by the gateway.
- **Gateway.** Receives every tool call, emits `AgentEvent`s, runs the policy layer, holds anything that needs approval until the UI resolves it, enforces limits and rules, and forwards only allowed orders to the broker. It records the agent's own claims as `agentClaim`.
- **Paper-broker adapter.** Talks to the Alpaca paper API: quotes and bars in, orders and fills out, account and positions for limit usage. Translates broker responses into events.
- **Event bridge.** Streams events to the reference app over WebSocket or SSE. The app reduces them exactly as it reduces scripted events.

**Fault injection** (switchable, off by default) makes the overreach condition possible in live mode. Either the gateway feeds the agent a misleading tool result, or a system-prompt condition steers it out of bounds. Every injected fault is logged as such in the recording.

Standing instructions in live mode run on the server (condition checks against real quotes), not inside the model.

### 11.3 Record and replay

The live server records every session: the market feed slice, every `AgentEvent`, tool calls and responses, timings, and any injected faults. A recording converts into a replay scenario the scripted player can run, with an optional overreach injected at a fixed timestamp.

**Study sessions use replays, not live runs.** Participants see real market movement and real agent behavior, but every participant sees the same run, in both conditions. Live mode is for development, demos, schema stress-testing, and builder testing.

When live agent output doesn't fit the schema cleanly (a rationale with no field, an action the predicates can't evaluate), log it in `docs/thesis-notes.md`. That's evidence about whether the contract holds against real agents.

### 11.4 Safety rules (non-negotiable)

1. **Paper only.** The server refuses to start unless it has paper credentials, the broker host is the paper host on an explicit allowlist, and the account endpoint confirms a paper account. Any live host or key → hard fail, no override flag.
2. **No other brokers.** Nothing in this repo may reference, import, or call any other brokerage connection, including any MCP connector configured elsewhere on this machine or account. The only broker is the Alpaca paper adapter.
3. **The agent never holds broker credentials.** Keys live only in the server's environment (`.env`, gitignored). The model sees only gateway tools.
4. **The Alpaca MCP server is a dev tool only.** If it's connected in Claude Code, it uses paper keys and `ALPACA_PAPER_TRADE=true`, and it's never exposed to the in-app agent.
5. **Spend guardrails on the model too.** A per-session cap on tool calls and tokens, with a kill switch in the dev toolbar.
6. **Methods note.** Paper fills are simulated against real quotes and can differ from real fills in active markets. Say so in the thesis; it doesn't affect a supervision-interface study.

---

## 12. Reference workflows and study conditions

### `ref-brokerage` — two conditions behind one switch
- **`system`** — the full component library: graduated autonomy, stock + flow limits, typed rules with sources, scope disclosure, liability at the moment of delegation, standing-instruction visibility, stop-isn't-undo recovery.
**Both conditions carry identical Robinhood branding, theme, and copy tone.** Only the authority and supervision design differs; otherwise participants react to branding, not design.

- **`baseline`** — a faithful recreation of the shipped Robinhood Agents flow: name the agent, fund a dedicated account, pick a model, approvals on by default, one toggle to turn them off, liability only in a linked help article, minimal activity attribution. **Don't include or exclude a per-trade/per-period limit in the baseline until I confirm what the shipped product actually offers.**

Both conditions run the same scenarios. Measures (handled outside the code): accuracy in reporting what the agent may do, accuracy in reporting who bears loss, and time to notice and intervene in the overreach scenario.

A dev toolbar (shown only with `?dev=1`) switches runtime (scripted / live / replay), condition, scenario or recording, playback speed, jurisdiction, and fault injection. It also has the live-mode kill switch.

### 12.1 Fidelity track

The brief drives the screens through three fidelity levels. I decide when to move up; Claude Code doesn't advance fidelity on its own.

**Lo-fi — before Phase 4.** From the scenarios and machines, generate `docs/screen-inventory.md`: for each scenario, every screen, every state shown on it, the components it needs, and the user decision it asks for. Scaffold matching empty frames on the Figma Screen inventory page. I wireframe those flows by hand on the Wireframes page, then run **interview round 1** (concept and comprehension). Findings go in `docs/thesis-notes.md` and may change the inventory, the schema, or P0 before components are built.

**Mid-fi — Phase 5.** `ref-brokerage` runs in the `wireframe` theme: clickable, real states, scripted scenarios, both conditions. This is the **interview round 2 and study pilot** build. Interactive mid-fi is better than static frames here, because RQ3 is about noticing things over time.

**Hi-fi — after round 2.** I design the definitive Robinhood screens in Figma on the Workflows page. Claude Code implements the `robinhood` theme and any layout changes in `apps/ref-brokerage` only. Component changes are allowed only if logged as findings. The study sessions and the portfolio case study use this version (with replays from §11.3).

### `ref-travel`
"Book flights and a hotel under $1,200. Nothing non-refundable without asking."

### `ref-email`
"Send follow-ups to my list, max 50 a day. Never email anyone outside the company."

**Success criterion:** `ref-travel` and `ref-email` require **zero changes** to `packages/react`. If a change is needed, log it in `docs/thesis-notes.md` as a finding (where the abstraction leaked), then fix it generically. New predicate *kinds* needed in `packages/schema` or `packages/policy` are also findings and should be logged the same way.

### `docs/precedents.md`
Seed it in Phase 1 with the shipped-vs-missing controls table from the thesis document. I'll paste it in. Each row maps a gap to a component in §10.

---

## 13. Documentation standard (MDX, in `apps/storybook`)

1. What it is (one sentence)
2. When to use / when not to
3. States and variants (live)
4. Props (auto-generated)
5. Schema mapping: which events and policy fields drive it
6. Accessibility: roles, announcements, keyboard
7. Examples in all three domains (written in **Phase 6**; finance-only until then)
8. Rationale: why this has no direct equivalent in Material, Fluent, Carbon, Polaris or Primer, in plain English

Section 8 is thesis material.

---

## 14. Testing

- **Unit:** every machine transition; every policy rule kind; schema parse/reject cases.
- **Component:** every state renders the correct label, icon, and ARIA; irreversible approvals require the extra confirmation; `stopped` always shows persisted actions.
- **A11y:** axe on every story; keyboard-only path through each reference app.
- **Domain-leak test:** scans `packages/react/src` only (stories live elsewhere) against a short curated deny list of unambiguously financial terms (e.g. `robinhood`, `ticker`, `brokerage`, `shares`, `portfolio`, `dividend`). Generic words like "order", "balance", "position", and "trade" are not on the list.
- **Figma parity check:** a script in `packages/figma-sync` compares Figma component properties (read via the Figma MCP server, or from a manual export) against the variant manifest, and Figma variables against tokens. It reports missing, extra, or misnamed variants and values. Run it at every checkpoint from Phase 4 on and record the result in `docs/figma.md`.
- **Live-runtime safety:** tests that the server refuses live hosts, live keys, and non-paper accounts; that the gateway holds actions needing approval; that no code path lets the agent reach the broker without the gateway.
- **Replay fidelity:** a recording replayed through the scripted player produces the same derived states as the live session did.
- **Builder-testing support:** `docs/builder-tasks.md` with 3–4 tasks, e.g. "Build an approval flow for a calendar agent using only the library." Keep the public API small enough for ~30-minute tasks.

---

## 15. Phases and checkpoints

At every checkpoint: summarize what was done, **list decisions you made on your own separately from decisions I made**, and wait.

**Phase 0 — Scaffold.** `git init`, monorepo, TS strict, lint/format, Vitest, Storybook boots, empty packages wired together, ADR template, ADR-0001 (monorepo) and ADR-0002 (events → policy → machines → view state → props). README with run commands.
→ *Checkpoint 0: `pnpm dev` launches Storybook; `pnpm test` passes.*

**Phase 1 — Contract + policy.** Schema, policy layer with full tests, fixtures, jurisdiction table, draft `docs/taxonomy.md`, seed `docs/precedents.md`.
→ *Checkpoint 1: I review the schema and policy before anything renders.*

**Phase 1.5 — Screen inventory (lo-fi prep).** Generate `docs/screen-inventory.md` and scaffold its Figma frames (§12.1).
→ *Checkpoint 1.5: I wireframe and run interview round 1. Phase 4 waits for those findings; Phases 2–3 can proceed in parallel.*

**Phase 2 — Tokens + foundation.** Tokens, foundation components, and the token → Figma variables push. Create `docs/figma.md` and the Figma page structure in §9.2.
→ *Checkpoint 2: variables in Figma match tokens.*

**Phase 3 — Machines.** All four machines, tests, stepper stories, `docs/state-machines.md` with diagrams. Generate the first variant manifest and scaffold empty Figma component sets with the correct properties.
→ *Checkpoint 3: I design the P0 primitives in Figma against the scaffolds before Phase 4a code starts.*

**Phase 4 — P0 components.** 4a primitives, then 4b patterns. Finance examples only. Each component is built in code against its finished Figma component set. Run the parity check at each sub-checkpoint.
→ *Checkpoints 4a and 4b: parity check passes, or every difference is listed.*

**Phase 5 — Runtime + `ref-brokerage` (mid-fi).** Scenarios 1–8, both conditions, dev toolbar, `wireframe` theme.
→ *Checkpoint 5: both conditions clickable end to end. I run interview round 2 / pilot.*

**Phase 5b — Live runtime (paper).** `runtime-live`: gateway, Alpaca paper adapter, agent loop, event bridge, recorder, replay conversion, safety tests, gateway ADR. Starts only after Checkpoint 5 passes, so a delay here can't threaten the study.
→ *Checkpoint 5b: a live paper session runs end to end in `ref-brokerage`, is recorded, and replays identically.*

**Phase 5c — Hi-fi.** Implement the `robinhood` theme and the hi-fi layouts I design in Figma, in `apps/ref-brokerage` only. Parity check against the hi-fi frames.
→ *Checkpoint 5c: study-ready build.* (Can run in parallel with 5b.)

**Phase 6 — Cross-domain validation.** `ref-travel`, `ref-email`, P1 components, three-domain MDX examples, travel and email workflow frames in Figma using the same component sets. Log every leak, in code or in Figma.
→ *Checkpoint 6.*

**Phase 7 — Hardening.** A11y pass, reduced motion, responsive QA, builder-tasks doc (with a Figma task and a code task), Storybook polish, Code Connect for every P0 component, final parity check, Figma Docs pages complete.

---

## 16. Conventions

- PascalCase components. Prefix with `Agent` only when ambiguous.
- Callbacks: `onApprove`, `onReject`, `onIntervene(kind)`, `onStopInstruction(id)`.
- Conventional commits (`feat(policy): add assetClass predicate`).
- Non-obvious architecture choices → short ADR.
- Anything that looks like a research finding → `docs/thesis-notes.md` with date and context.

---

## 17. Open decisions — ask me, don't assume

1. **Sub-questions.** RQ1/RQ2 and RQ3 come from the earlier framing. Treat them as working until I confirm.
2. **Overreach / deception condition.** Not yet decided, and it carries an ethics flag. Build scenario 3 as switchable and non-default; don't make other features depend on it.
3. **Baseline flow limits.** Whether the shipped product has a per-trade or per-period limit is unverified. Leave a clearly marked TODO in the baseline.
4. **Jurisdiction in the study.** Participants are likely NY-based. Either keep test tasks to stocks, or use the forced crypto approval deliberately to test `PermissionBoundary`. Support both via the toolbar.
5. **Visual direction.** The `neutral` theme is set in Figma during Phases 2–3, and the `robinhood` theme during hi-fi. Don't invent a look in code.
6. **Figma file.** I'll share the file link (new or existing) before Phase 2, plus whether the Figma MCP server is connected in Claude Code.
7. **`MandateEditor`**: one component or a composed pattern of field components.
8. **`ConfidenceIndicator`**: ship it or cut it.
9. **Model and budget** for the live agent: which model, and a monthly spend cap.
10. **Recordings and data terms.** Recordings contain real market data. Keep them local for study use; check Alpaca's data terms before publishing any recording publicly.
11. **Deployment target** for Storybook and reference apps (for test sessions).

---

## 18. Working style

- I work iteratively and test between rounds. Small, reviewable steps over large drops.
- Be direct about tradeoffs. Tell me when something in this brief is a weak idea.
- Keep my decisions separate from your suggestions in every summary.
- Plain-English docs over jargon.
