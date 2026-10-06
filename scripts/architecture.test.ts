import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Guards the event flow in ADR-0002 at the package level:
//   runtime ──▶ schema (facts) ──▶ policy ──▶ machines ──▶ view state ──▶ react (pure)
// A package may only depend on the internal packages listed for it here. pnpm's strict
// node_modules layout means an undeclared workspace import fails to resolve, so checking
// package.json dependencies is enough to enforce the boundary.

const ROOT = join(import.meta.dirname, '..');

type PackageName =
  | 'tokens'
  | 'schema'
  | 'policy'
  | 'machines'
  | 'runtime-mock'
  | 'runtime-live'
  | 'figma-sync'
  | 'react';

// Decided at Checkpoint 0:
// - machines does not depend on policy. Verdicts arrive as input; the composition layer
//   (apps/*) calls policy and hands the result to the machines.
// - react may use schema, but only for types (enforced in eslint.config.js).
// - figma-sync reads machines so the variant manifest is generated from real states.
const ALLOWED: Partial<Record<PackageName, PackageName[]>> = {
  tokens: [],
  schema: [],
  policy: ['schema'],
  machines: ['schema'],
  'runtime-mock': ['schema'],
  'runtime-live': ['schema', 'policy'],
  'figma-sync': ['tokens', 'machines'],
  react: ['tokens', 'schema'],
};

function readInternalDeps(dir: string): { name: string; deps: string[] } {
  const pkg = JSON.parse(readFileSync(join(ROOT, dir, 'package.json'), 'utf8')) as {
    name: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  const deps = Object.keys(all)
    .filter((d) => d.startsWith('@agent-ui/'))
    .map((d) => d.replace('@agent-ui/', ''));
  return { name: pkg.name.replace('@agent-ui/', ''), deps };
}

const packages = readdirSync(join(ROOT, 'packages')).map((d) => readInternalDeps(`packages/${d}`));

describe('workspace wiring', () => {
  it.each(packages.map((p) => p.name))('@agent-ui/%s resolves and exports', async (name) => {
    const mod = (await import(`@agent-ui/${name}`)) as { PACKAGE_NAME: string };
    expect(mod.PACKAGE_NAME).toBe(`@agent-ui/${name}`);
  });
});

describe('package boundaries (ADR-0002)', () => {
  if (Object.keys(ALLOWED).length === 0) {
    it.todo('fill in ALLOWED to enforce package boundaries');
    return;
  }

  it.each(packages)('$name depends only on allowed packages', ({ name, deps }) => {
    const allowed = ALLOWED[name as PackageName];
    expect(allowed, `${name} is missing from ALLOWED`).toBeDefined();
    expect(deps.filter((d) => !allowed?.includes(d as PackageName))).toEqual([]);
  });
});
