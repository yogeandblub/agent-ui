import type { Limit } from '@agent-ui/schema';
import { brokerage } from '@agent-ui/schema/fixtures';
import { describe, expect, it } from 'vitest';
import { assessLimit } from './limits.ts';

const { actions } = brokerage;
const buy200 = actions.smallBuy;

const limit = (overrides: Partial<Limit>): Limit => ({
  id: 'l',
  kind: 'cumulative',
  label: 'L',
  unit: 'USD',
  max: 1000,
  window: null,
  appliesTo: null,
  ...overrides,
});

describe('assessLimit', () => {
  it('accumulates stock and cumulative limits on top of prior usage', () => {
    for (const kind of ['stock', 'cumulative'] as const) {
      expect(assessLimit(limit({ kind }), buy200, [{ limitId: 'l', used: 700 }])).toEqual({
        kind: 'impact',
        impact: { limitId: 'l', before: 700, after: 900, max: 1000, exceeded: false },
      });
    }
  });

  it('treats missing usage as zero', () => {
    const r = assessLimit(limit({}), buy200, []);
    expect(r.kind === 'impact' && r.impact.before).toBe(0);
  });

  it('allows reaching the max exactly; exceeds only above it', () => {
    const at = assessLimit(limit({}), buy200, [{ limitId: 'l', used: 800 }]);
    const over = assessLimit(limit({}), buy200, [{ limitId: 'l', used: 801 }]);
    expect(at.kind === 'impact' && at.impact.exceeded).toBe(false);
    expect(over.kind === 'impact' && over.impact.exceeded).toBe(true);
  });

  it('judges per_action limits on the action alone', () => {
    expect(
      assessLimit(limit({ kind: 'per_action', max: 150 }), buy200, [{ limitId: 'l', used: 999 }]),
    ).toEqual({
      kind: 'impact',
      impact: { limitId: 'l', before: 0, after: 200, max: 150, exceeded: true },
    });
  });

  it('counts each action as one for count and rate limits, ignoring unit', () => {
    for (const kind of ['count', 'rate'] as const) {
      const r = assessLimit(limit({ kind, unit: 'emails', max: 3, window: 'P1D' }), buy200, [
        { limitId: 'l', used: 3 },
      ]);
      expect(r).toEqual({
        kind: 'impact',
        impact: { limitId: 'l', before: 3, after: 4, max: 3, exceeded: true },
      });
    }
  });

  it('skips actions outside appliesTo', () => {
    const buysOnly = limit({ appliesTo: { kind: 'targetMatches', field: 'verb', pattern: 'buy' } });
    expect(assessLimit(buysOnly, actions.sell, []).kind).toBe('not_applicable');
    expect(assessLimit(buysOnly, buy200, []).kind).toBe('impact');
  });

  it('is unevaluable when a magnitude limit applies but the action has no comparable amount', () => {
    expect(assessLimit(limit({}), { ...buy200, magnitude: null }, []).kind).toBe('unevaluable');
    expect(assessLimit(limit({ unit: 'EUR' }), buy200, []).kind).toBe('unevaluable');
  });
});
