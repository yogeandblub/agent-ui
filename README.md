# Agent UI

A design system for agentic interfaces: a reusable component library that makes delegated
authority legible and controllable. It's the primary artifact of a UX/UI master's thesis
(NYIT, 2026).

**Thesis in one line:** how agent state becomes UI state.

> **Student work and speculative design.** This is a master's thesis case study, not a real
> product. It is **not affiliated with, endorsed by, or connected to Robinhood Markets, Inc.**
> The Robinhood-branded screens and copy are a speculative redesign, made for research and
> critique only. Robinhood's name and visual style belong to Robinhood. Nothing here reflects
> Robinhood's actual products, plans or policies. No real money or brokerage accounts are used
> (paper trading only).

The full build brief is [`docs/thesis-2026.md`](docs/thesis-2026.md). Architecture decisions live in
[`docs/decisions/`](docs/decisions/).

## Requirements

- Node 24 (`nvm use` reads `.nvmrc`)
- pnpm 12 (`corepack enable` picks up the version in `package.json`)

## Commands

| Command                | What it does                                           |
| ---------------------- | ------------------------------------------------------ |
| `pnpm install`         | Install everything                                     |
| `pnpm dev`             | Storybook at http://localhost:6006                     |
| `pnpm test`            | All unit and component tests (Vitest)                  |
| `pnpm test:watch`      | Tests in watch mode                                    |
| `pnpm typecheck`       | TypeScript across every package                        |
| `pnpm lint`            | ESLint (type-aware)                                    |
| `pnpm format`          | Prettier, writing changes                              |
| `pnpm check`           | Format check + lint + typecheck + test (run before PR) |
| `pnpm build-storybook` | Static Storybook build                                 |

## Layout

```text
packages/
  tokens/        design tokens: foundation, semantic, behavioral
  schema/        Zod: agent facts and events (no derived status)
  policy/        action × mandate → PolicyVerdict
  machines/      XState: run, approval, mandate, standing instruction
  runtime-mock/  scripted + replay scenario player
  runtime-live/  paper-trading agent server (Phase 5b)
  figma-sync/    tokens → Figma variables, variant manifest, parity check
  react/         pure components
apps/
  storybook/     all stories and docs
```

Reference apps (`ref-brokerage`, `ref-travel`, `ref-email`) arrive in Phases 5 and 6.

## How data flows

```text
runtime ──▶ AgentEvent (facts) ──▶ policy ──▶ machines ──▶ view state ──▶ components
```

Events carry facts. Status is computed. The agent never marks its own homework. See
[ADR-0002](docs/decisions/0002-events-to-props.md).

## Safety

Paper trading only. No real money, ever. See brief §11.4.
