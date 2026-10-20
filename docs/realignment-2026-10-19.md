# Realignment to the sub-brand concept

Status: **proposal for owner review** (2026-10-19). Nothing in `thesis-2026.md` changes until the
owner accepts. Inputs: `robinhood-system.md`, `thesis-positioning.md`, `sub-brand-concept.md`.

**Where the build stands:** Phases 0, 1 and 1.5 are done (scaffold, schema + policy, screen
inventory); lo-fi wireframes are in progress; tokens (Phase 2) haven't started. That's the cheapest
possible moment to realign: the contract and policy layer are brand-free, and no theme exists yet.

---

## 1. The thesis in brand terms

> **Take the chance. Keep the leash.**

That line is the locked research question in plain words:

| Locked RQ phrase                                     | Brand half               |
| ---------------------------------------------------- | ------------------------ |
| "make delegated authority **legible**"              | see the leash            |
| "and **controllable**"                              | keep the leash           |
| "understand the **limits** of an agent's autonomy"  | how long the leash is    |
| "**intervene** when those limits are reached"       | pull the leash           |

What the brand **adds** is the other half: *take the chance*. The old framing only measured
safety (do people understand, do they notice). A brand for risk-takers also has to show that
legibility makes people **willing to grant real autonomy, with accurate understanding**. A system
that's safe because nobody dares use it fails the brand.

## 2. What stays

- **The locked research question.** Brand- and domain-agnostic. No change.
- **The architecture rule** (§2): events are facts, status is computed.
- **All 11 design principles** (§3). They *are* the leash.
- **Schema and policy** (Phase 1). Already brand-free.
- **Scenarios 1–8**, the baseline condition, the zero-changes test, out-of-scope list.

## 3. What changes

### 3.1 Sub-questions

| ID      | Question                                                                                         | Change                    |
| ------- | ------------------------------------------------------------------------------------------------ | ------------------------- |
| RQ1/RQ2 | Comprehension at handover: what may the agent do, who bears the loss?                           | Now reported **by persona** |
| RQ3     | Detection: do users notice overreach in time to intervene?                                        | By persona. The key case is the **Operator with approvals off** |
| **RQ4** | **Calibrated autonomy:** does the system let users grant more autonomy *without* losing comprehension? | **New.** The "take the chance" half |
| Builder | Can a correct workflow be built in a new domain without changing components?                     | Extended: **and under a second brand**, with zero component changes |
| Brand   | Does the sub-brand resonate with Apprentices and Operators more than the parent brand?            | **New, secondary.** Concept test, separate from the behavior study |

RQ4 anchors in the trust-in-automation literature (Lee & See, 2004: trust should match the
automation's actual capability; neither over- nor under-trust). Measures: autonomy level chosen,
comprehension accuracy at that level, and the gap between them.

### 3.2 Personas replace "retail investors"

- **Apprentice:** new to trading, high automation appetite. Agent = mentor. Autonomy starts low.
- **Operator:** has a method, high automation appetite. Agent = sidekick. Autonomy starts high,
  bounded by an explicit mandate.
- **Cautious Holder:** parent-brand audience. Out of scope for the design; optional comparison.

**Already in the wireframes:** the two G1 versions map onto the personas. **G1a Guided path** is the
Apprentice onboarding (asks for autonomy explicitly, one decision per screen). **G1b Node chain** is
the Operator onboarding (templates, typed blocks, faster). Thesis-notes #16 already flagged the
trade-off. The realignment turns "pick one" into "one per persona".

### 3.3 Brand and theme architecture (amends ADR-0003)

ADR-0003 made the Figma library a literal Robinhood copy, which weakened reuse at the visual layer.
The sub-brand fixes that:

```text
foundation + semantic + behavioral tokens (brand-free)
        │
        ├── wireframe   lo-fi / mid-fi interviews
        ├── neutral     Storybook, travel, email
        ├── robinhood   baseline + system study conditions; the parent brand
        └── subbrand    "[Name], by Robinhood": hi-fi concept, case study, brand test
```

- The extracted Robinhood library becomes the **`robinhood` theme**, not the system itself.
- The sub-brand is **behavioral tokens given a look**: `motion.agent.*`, `autonomy.*`, `limit.*`
  and uncertainty become expressive (loosen with autonomy, tighten near limits, the stop control
  never moves). §9.5's rule "keep the foundation restrained so behavioral signals carry the visual
  weight" already describes the sub-brand.
- Write **ADR-0004: sub-brand and theme architecture**, superseding the "literal copy is the library"
  part of ADR-0003.

### 3.4 Schema and machines (small additions)

| Addition                           | Where                | Why                                                                                    |
| ---------------------------------- | -------------------- | -------------------------------------------------------------------------------------- |
| `mandate.mode: apprentice \| operator` | `packages/schema` | Persona is a **configuration** of the mandate: default autonomy, explanation density, onboarding path. Not new components |
| `mandate.instruction.origin: generated \| edited \| typed \| learned` | `packages/schema` | Thesis-notes #14 asked for it; "learned" is the Operator's playbook-from-history |
| **Earned autonomy**                | `mandateMachine` + policy | The system may *propose* more autonomy after a track record. Only the user can accept. The agent never widens its own authority (ADR-0002) |
| Explain vs. recommend rule         | `packages/policy`    | Apprentice mentoring must not become advice. A platform-sourced rule, shown via `RuleSourceTag` |

### 3.5 Components

**No new P0 components.** The test of the persona model is that it fits the existing inventory:

- Earned-autonomy proposal → `ApprovalRequest` (`permission` variant) + `AutonomyIndicator`.
- Learned playbook → `MandateEditor` with `origin: learned`, shown on `MandateSummary`.
- Mentor explanations → `ActionPreview` rationale, denser in `apprentice` mode.

If any of these needs a new component, log it as a finding.

### 3.6 Scenarios

| Scenario                                  | Persona     |
| ----------------------------------------- | ----------- |
| 1 Happy path                              | Apprentice  |
| 2 Approaching limit                       | Apprentice  |
| 6 Jurisdiction exception                  | Apprentice  |
| 3 Overreach                               | Operator    |
| 5 Intervention mid-run                    | Operator    |
| 7 Standing instruction                    | Operator    |
| 8 Two agents                              | Operator    |
| 4 Tool failure + recovery                 | both        |
| **9 Earned autonomy** (new, P0)           | Apprentice → the RQ4 moment |
| **10 Learned playbook** (new, P1)         | Operator onboarding |

### 3.7 Study design

- **Behavior study** (RQ1–4): both conditions in the **`robinhood` theme**, as before, so
  participants react to the design, not the brand. Participants screened and sorted into
  Apprentice or Operator.
- **Brand concept test** (Brand RQ): separate and smaller. Sub-brand vs. parent concept frames, per
  persona. Desirability and message recall, not task performance.
- **Screener:** traded in the last 12 months; never delegated trading to an agent; financial risk
  tolerance (DOSPERT financial items); automation use elsewhere; trading method yes/no (sorts
  Apprentice vs. Operator).
- **New measures:** autonomy level chosen (RQ4), time-on-task (Operators abandon friction).

### 3.8 Phases

| Phase                         | Change                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| **1.6 Brand + positioning**   | **New.** These four docs. Checkpoint: owner decides §5 below                                   |
| 1.5 Lo-fi                     | Label G1a = Apprentice, G1b = Operator. Interview round 1 recruits both                        |
| 2 Tokens                      | Build the four-theme structure. `robinhood` from the Figma extraction; `subbrand` stubbed      |
| 3 Machines                    | Add earned autonomy to `mandateMachine`                                                        |
| 5 Runtime                     | Scenario 9 joins P0 scenarios                                                                  |
| 5c Hi-fi                      | Adds `subbrand` concept frames and the brand concept test                                      |
| 6 Cross-domain                | Travel and email run in `neutral`. Plus: one workflow re-themed in `subbrand`, zero changes    |

## 4. Scope guardrails

- **The brand stays concept-level:** name, principles, voice, the behavioral visual language, one
  campaign frame. No full identity system, no logo work.
- **The contribution is still the behavioral layer.** The brand is the evidence that it flexes, and
  the story that makes it legible to Robinhood.
- **Regulatory:** "mentor" must stay explanation, not recommendation. Flagged in policy, not fixed
  with copy.

## 5. Decisions for the owner

1. Accept **RQ4 (calibrated autonomy)** as a new sub-question?
2. Accept **Apprentice / Operator** as personas, with G1a / G1b mapped to them?
3. Accept the **four-theme architecture** and an ADR-0004 that amends ADR-0003?
4. Accept **scenario 9 (earned autonomy)** as P0?
5. Accept the **two-study split**: behavior in the `robinhood` theme, brand tested separately?
6. Once accepted: fold these into `thesis-2026.md` as an amendment block, like the 2026-10-07 one.
