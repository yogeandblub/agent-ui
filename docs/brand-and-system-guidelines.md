# Little John: brand and system guidelines

**Draft v0.1** · 2026-10-19 · *Little John* is a working name, pending a trademark check.
Student thesis work, speculative design, not affiliated with Robinhood.

This guide defines what Little John stands for, how it speaks, how it looks, and the system
underneath. Designers, writers and engineers use it to make every decision the same way.
Research and rationale live in `robinhood-system.md`, `thesis-positioning.md`,
`sub-brand-concept.md` and `realignment-2026-10-19.md`.

---

## 1. Foundations

### Purpose

People will only take a chance on autonomy they can see and stop. We exist to make an agent's
authority visible, so handing over control becomes a risk worth taking.

### Mission

Give every trader what institutions give their algorithms: a mandate, limits, a watchful eye and a
kill switch.

### Vision

A world where trusting an agent with your money is a decision you understand, not a leap of faith.

### Brand promise

**You'll always know what your agent can do, how close it is to its limits, and how to stop it.**

### Brand idea

> **Take the chance. Keep the leash.**

*Take the chance* is the invitation: autonomy, ambition, letting the agent run.
*Keep the leash* is the guarantee: authority you can see, set and pull back.
Every expression of the brand needs both halves. An invitation without the leash is reckless.
A leash without the invitation is a settings page.

### Core concept: calibrated autonomy

Trust should match what the agent is actually allowed to do, no more and no less. Our job is to
close the gap between what users *believe* they handed over and what they *actually* handed over.

### Brand architecture

**Little John, by Robinhood.** An endorsed sub-brand.

- **From Robinhood:** trust, regulation, accounts, money. *Safety Always.*
- **Our own:** audience, voice, visual language.
- **Shared:** the behavioral system. The same leash works under both brands.

## 2. Audience

We define our audience by **appetite for automation** and **trading experience**, never by age.

| Persona        | Who they are                                       | The agent is their… | Relationship                 | Autonomy starts |
| -------------- | -------------------------------------------------- | ------------------- | ---------------------------- | --------------- |
| **Apprentice** | New to trading, at home with AI                    | Mentor              | The agent teaches you        | Low, and grows  |
| **Operator**   | Has a method, tired of repeating it                | Sidekick            | You teach the agent          | High, bounded   |

**Who's teaching whom** organizes everything: onboarding, explanation depth, default autonomy.
Cautious investors belong to the parent brand.

## 3. Personality

| We are       | We are not            | In practice                                                         |
| ------------ | --------------------- | ------------------------------------------------------------------- |
| **Daring**   | Reckless              | We invite autonomy, and we always show its edge                     |
| **Honest**   | Alarmist              | We name risk plainly, without hype and without hiding it            |
| **Attentive**| Hovering              | We speak when something changes, not to fill silence                |
| **Steady**   | Cold                  | Calm in volatility, warm in tone                                     |
| **Loyal**    | Servile               | The agent works for you; it says so when it can't do something      |

## 4. Voice and tone

### Voice principles

1. **Say what it can do, before what it did.** Authority comes first, activity second.
2. **Numbers lead, words support.** "$412 of $500 used today" beats "You're close to your limit."
3. **Name who decided.** "Your rule", "Robinhood's rule", "New York's rule".
4. **The agent speaks as itself, briefly.** "I'll hold this until you say go." Never chatty.
5. **Say what stopping does, every time.** "Stopped. The 2 trades already made stay in your account."

### Two dialects

| Moment            | To the Apprentice (mentor)                                        | To the Operator (sidekick)                         |
| ----------------- | ----------------------------------------------------------------- | -------------------------------------------------- |
| Proposing a trade | "I'd buy $50 of QQQ. It's under your limit, and here's why."      | "QQQ setup hit. Buy $50? Within your rules."       |
| Near a limit      | "You've used $412 of today's $500. I'll ask before going further."| "$412 / $500 today. Holding above $88."            |
| Blocked by a rule | "New York requires your OK for crypto, so I'm asking first."      | "Crypto needs approval in NY. Waiting on you."     |
| After a stop      | "I've stopped. Trades I already made stay, here's what they were."| "Stopped. 2 trades stay. Nothing pending."         |

### Tone by stakes

As stakes rise, the tone gets shorter, plainer and slower. It never gets louder.

- **Routine:** light, brief.
- **Approaching a limit:** factual, one line.
- **Approval needed:** direct, the decision first.
- **Irreversible or breach:** plain, deliberate, no softening, an extra step.

### Words

| Use                       | Avoid                                       | Why                                           |
| ------------------------- | ------------------------------------------- | --------------------------------------------- |
| limits, rules, authority  | "leash" in the product                      | *Leash* is the brand idea, not UI copy         |
| always-on, hands-off      | high-frequency                              | HFT means institutional, microsecond trading  |
| your agent, I             | the AI, the bot                             | It's a relationship, with a clear owner       |
| explain, show why         | recommend, you should                        | We explain; we don't give investment advice   |
| stop, pause               | "set it and forget it"                      | Forgetting is the failure mode                 |
| —                         | "get rich", urgency, FOMO, exclamation marks | Daring, not reckless                           |

## 5. Design principles

These hold for every screen, component and campaign. They extend the system principles in
`thesis-2026.md` §3.

1. **Show the leash.** Wherever an agent can act, its authority, its distance to its limits and the
   way to stop it are visible together, within one interaction. *(§3.3)*
2. **Earn the length.** Autonomy grows with a track record. The system may propose more; only the
   user grants it. The agent never widens its own authority. *(ADR-0002)*
3. **Say who decided.** Every rule carries its source: you, Robinhood or a regulator. Rules you
   didn't set are explained, not just enforced. *(§3.5)*
4. **Motion means work.** Movement reflects what the agent is doing, never reward. Still is idle,
   breathing is working, a pulse toward you is waiting for you.
5. **Stop is solid.** Pause, stop and revoke are the one fixed element. They never move, hide or
   animate away. *(§3.8)*
6. **Stop isn't undo.** Ending authority always says what it can't take back. *(§3.6)*
7. **Irreversible feels different.** Actions that can't be undone change behavior: friction,
   copy, focus. Not just color. *(§3.7)*
8. **Never gamify money.** No celebration of trades, gains or streaks. Losses are shown as plainly
   as gains.
9. **Accessible by default.** WCAG 2.2 AA. Never color alone for state, risk or rule source. All
   motion respects reduced-motion. *(§3.10)*

## 6. Visual language: undefined, but held

The parent brand is restraint. Little John is **range with a boundary**: the brand embraces the open
space of autonomy, and makes the edge of that space unmistakable.

### The core move: the identity is the agent's state

The brand doesn't decorate the behavioral layer. **It is the behavioral layer, given a look.**

| Agent state                | Visual expression                                        | Token                    |
| -------------------------- | -------------------------------------------------------- | ------------------------ |
| Autonomy level             | Form opens with more autonomy, closes with less          | `autonomy.*`             |
| Limit pressure             | Form tightens as a limit nears; holds shape when reached | `limit.*`                |
| Run state                  | Still, breathing, pulsing toward the user                | `agent.state.*`, `motion.agent.*` |
| Uncertainty                | Less certain output looks less resolved                  | `confidence.*` (P2)      |
| Risk                       | Weight and border, never color alone                     | `risk.*`                 |
| Rule source                | A distinct mark for you, Robinhood and a regulator       | `ruleSource.*`           |
| Irreversibility            | A heavier, slower treatment                              | `reversibility.*`        |
| Control                    | Solid, unmoving, always in the same place                | `interactive.control.*`  |

### Foundations

- **Color:** a restrained neutral foundation, so behavioral signals carry the visual weight.
  Accents are reserved for agent state, never decoration. Palette to be designed in hi-fi.
- **Type:** one sans family, numbers-first. Tabular figures for all money.
- **Shape:** soft, open forms for autonomy; firm edges for limits and controls.
- **Motion:** purposeful and slow. Every animation maps to a state. All respect
  `prefers-reduced-motion`.
- **Mode:** light and dark from day one.

### Relationship to the parent brand

Foundation tokens stay shared, so a Little John screen sits comfortably inside the Robinhood app.
The difference lives in the behavioral tier: Robinhood keeps it quiet; Little John lets it speak.

## 7. System architecture

### The rule

> **Events are facts. Status is computed. Components only render.**

```text
agent event (fact) → policy (verdict) → state machines (status) → view state → component
```

The agent's own claims never decide what the user sees. The policy layer does.

### Token tiers

| Tier           | Contents                                                                          | Brand-specific? |
| -------------- | --------------------------------------------------------------------------------- | --------------- |
| Foundation     | color ramps, type, spacing, radii, elevation, motion                              | No              |
| Semantic       | surface, text, border, interactive, feedback                                      | Remapped per theme |
| **Behavioral** | agent state, autonomy, limit, risk, rule source, scope, reversibility, provenance | **This is where brands differ** |

### Themes

| Theme        | Use                                                         |
| ------------ | ----------------------------------------------------------- |
| `wireframe`  | Lo-fi and mid-fi interviews. Grayscale; behavior via shape and weight |
| `neutral`    | Storybook, travel and email workflows                       |
| `robinhood`  | The parent brand; both behavior-study conditions           |
| `littlejohn` | The sub-brand: hi-fi concept, case study, brand test        |

Changing theme never changes component code. If it does, that's a finding.

### Component tiers

- **Foundation:** only what the behavioral layer needs (Button, Sheet, Meter, Switch…).
- **Behavioral primitives:** the vocabulary of authority (`AutonomyIndicator`, `LimitMeter`,
  `RuleSourceTag`, `ReversibilityTag`, `AgentStatusBadge`…).
- **Behavioral patterns:** the sentences (`MandateEditor`, `ApprovalRequest`, `BoundaryAlert`,
  `InterventionControls`, `RecoveryState`…).

### Personas are modes, not components

`mandate.mode: apprentice | operator` changes default autonomy, explanation depth and onboarding
path. Same components.

## 8. Glossary

| Term                 | Meaning                                                                    |
| -------------------- | -------------------------------------------------------------------------- |
| **Mandate**          | What the user authorized the agent to do: instruction, autonomy, limits, rules, scope, expiry |
| **Autonomy level**   | How much the agent may do without asking                                   |
| **Limit**            | A cap on money or actions: total (stock) or per period (flow)              |
| **Rule source**      | Who set a rule: the user, the platform or a regulator                      |
| **Earned autonomy**  | More autonomy, proposed by the system after a track record, granted only by the user |
| **Standing instruction** | A background rule the agent runs repeatedly                             |
| **Intervention**     | Pause, stop, revoke or take over                                           |
| **The leash**        | Brand shorthand for all of the above. Never used in product copy           |
