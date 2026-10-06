# ADR-0001: pnpm monorepo with source-exported internal packages

- **Status:** accepted (pending review at Checkpoint 0)
- **Date:** 2026-10-06
- **Decided by:** brief §4–5 (monorepo, pnpm); Claude Code (source exports, TypeScript pin)

## Context

The thesis argues that agent state becomes UI state through a fixed sequence of layers (ADR-0002).
The repo should make that sequence physically visible, so a reader can see which code is allowed to
know about which. The cross-domain test (brief §12) also depends on a hard line around
`packages/react`: travel and email must work without touching it.

## Decision

- One pnpm workspace. Each layer is its own package under `packages/`; runnable things (Storybook,
  reference apps) live under `apps/`.
- Internal packages export their TypeScript source directly (`"exports": { ".": "./src/index.ts" }`).
  There is no per-package build step. Vite (in Storybook and the reference apps) and Vitest compile
  them on the fly.
- Allowed dependencies between packages are written down and checked by
  `scripts/architecture.test.ts`. Because pnpm only links declared dependencies, an import a
  package hasn't declared fails to resolve, so checking `package.json` is enough.
- TypeScript is pinned to the 6.0 line. TypeScript 7 (the native compiler) is current, but
  `typescript-eslint` does not support it yet, and type-aware linting matters more here than
  compiler speed. Revisit when `typescript-eslint` supports 7.

## Consequences

- No watch processes or stale `dist/` folders. Editing `packages/policy` is reflected immediately
  in Storybook.
- The packages can't be consumed outside this repo without a build. That's fine because nothing is
  published (§4). If a reference app ever needs to ship separately, add Vite library mode then.
- Every package shares one strict `tsconfig.base.json`.

## Alternatives considered

- **Vite library mode for every package (the brief's original wording).** Adds eight build and
  watch steps for no benefit while nothing is published. Easy to add later.
- **Single package with folders.** Simpler, but the boundaries the thesis depends on would be
  convention only and couldn't be checked.
- **Turborepo or Nx.** Task caching isn't needed at this size.
