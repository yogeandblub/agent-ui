import type { Mandate } from '@agent-ui/schema';
import { brokerage } from '@agent-ui/schema/fixtures';
import { describe, expect, it } from 'vitest';
import { evaluate, type EvaluationContext } from './evaluate.ts';

const {
  actions,
  brokerageMandate: mandate,
  fullAutonomyMandate,
  brokerageJurisdictions,
  NOW,
} = brokerage;

const ctx = (overrides: Partial<EvaluationContext> = {}): EvaluationContext => ({
  jurisdiction: 'US-CA',
  now: NOW,
  jurisdictions: brokerageJurisdictions,
  ...overrides,
});

describe('decisions', () => {
  it('allows an action inside every rule and limit', () => {
    const v = evaluate(actions.smallBuy, mandate, [], ctx());
    expect(v).toMatchObject({
      decision: 'allow',
      withinMandate: true,
      requiresApproval: false,
      violations: [],
      approvalReasons: [],
      matchedRules: [],
      claimMismatch: false,
    });
    expect(v.limitImpact.map((l) => l.limitId)).toEqual([
      'limit-funded',
      'limit-weekly',
      'limit-per-trade',
      'limit-daily-trades',
    ]);
  });

  it('holds an action that matches a user approval rule (happy path)', () => {
    const v = evaluate(actions.largeBuy, mandate, [], ctx());
    expect(v.decision).toBe('require_approval');
    expect(v.withinMandate).toBe(true);
    expect(v.approvalReasons).toEqual([
      { kind: 'rule', ruleId: 'rule-approve-over-250', source: 'user' },
    ]);
    expect(v.matchedRules[0]?.reason).toBe('You asked to approve any trade over $250.');
  });

  it('escalates when a limit would be exceeded (approaching limit)', () => {
    const usage = [{ limitId: 'limit-weekly', used: 1900 }];
    const v = evaluate(actions.smallBuy, mandate, usage, ctx());
    expect(v.decision).toBe('require_approval');
    expect(v.withinMandate).toBe(false);
    expect(v.violations).toEqual([{ kind: 'limit_exceeded', limitId: 'limit-weekly' }]);
    expect(v.limitImpact.find((l) => l.limitId === 'limit-weekly')).toEqual({
      limitId: 'limit-weekly',
      before: 1900,
      after: 2100,
      max: 2000,
      exceeded: true,
    });
  });

  it('denies a prohibited action and offers no approval path', () => {
    const v = evaluate(actions.optionsBuy, mandate, [], ctx());
    expect(v.decision).toBe('deny');
    expect(v.requiresApproval).toBe(false);
    expect(v.approvalReasons).toEqual([]);
    expect(v.violations).toContainEqual({
      kind: 'prohibited_by_rule',
      ruleId: 'rule-no-options',
      source: 'user',
    });
  });

  it('denies an action outside write scope, even if the agent can read it', () => {
    expect(mandate.readScope.some((s) => s.id === 'acct-individual')).toBe(true);
    const v = evaluate(actions.outOfScopeBuy, mandate, [], ctx());
    expect(v.decision).toBe('deny');
    expect(v.violations).toEqual([{ kind: 'out_of_write_scope', resource: 'acct-individual' }]);
  });

  it('prefers deny over escalation when both apply', () => {
    const usage = [{ limitId: 'limit-weekly', used: 1990 }];
    const v = evaluate(actions.outOfScopeBuy, mandate, usage, ctx());
    expect(v.decision).toBe('deny');
    expect(v.approvalReasons).toEqual([]);
    expect(v.violations.map((x) => x.kind)).toEqual(['out_of_write_scope', 'limit_exceeded']);
  });
});

describe('mandate in force', () => {
  it('denies before grant and at or after expiry', () => {
    for (const now of ['2026-09-30T00:00:00Z', '2026-12-31T23:59:59Z', '2027-01-01T00:00:00Z']) {
      const v = evaluate(actions.smallBuy, mandate, [], ctx({ now }));
      expect(v.decision).toBe('deny');
      expect(v.violations).toContainEqual({ kind: 'mandate_not_in_force', at: now });
    }
  });

  it('never expires when expiresAt is null', () => {
    const open: Mandate = { ...mandate, expiresAt: null };
    expect(
      evaluate(actions.smallBuy, open, [], ctx({ now: '2099-01-01T00:00:00Z' })).decision,
    ).toBe('allow');
  });

  it('denies actions by a different agent', () => {
    const v = evaluate({ ...actions.smallBuy, agentId: 'agent-ext' }, mandate, [], ctx());
    expect(v.violations).toContainEqual({ kind: 'wrong_agent', agentId: 'agent-ext' });
  });
});

describe('autonomy', () => {
  it.each(['suggest_only', 'act_with_approval'] as const)(
    '%s requires approval for everything',
    (autonomy) => {
      const v = evaluate(actions.smallBuy, { ...mandate, autonomy }, [], ctx());
      expect(v.decision).toBe('require_approval');
      expect(v.approvalReasons).toEqual([{ kind: 'autonomy', level: autonomy }]);
    },
  );

  it('full_autonomy switches off user approval rules', () => {
    const v = evaluate(actions.largeBuy, fullAutonomyMandate, [], ctx());
    expect(v.decision).toBe('allow');
    expect(v.matchedRules).toEqual([]);
    expect(v.approvalException).toBe(false);
  });

  it('full_autonomy keeps user prohibitions', () => {
    expect(evaluate(actions.optionsBuy, fullAutonomyMandate, [], ctx()).decision).toBe('deny');
  });

  it('full_autonomy keeps platform approval rules, flagged as an exception', () => {
    const risky = { ...actions.smallBuy, risk: 'high' as const };
    const v = evaluate(risky, fullAutonomyMandate, [], ctx());
    expect(v.decision).toBe('require_approval');
    expect(v.approvalException).toBe(true);
    expect(v.approvalReasons).toEqual([
      { kind: 'rule', ruleId: 'rule-platform-high-risk', source: 'platform' },
    ]);
  });

  it('full_autonomy still escalates at limits', () => {
    const v = evaluate(actions.overLimitBuy, fullAutonomyMandate, [], ctx());
    expect(v.decision).toBe('require_approval');
    expect(v.approvalException).toBe(true);
  });
});

describe('jurisdiction', () => {
  it('adds regulator rules for the jurisdiction (approval-exception case)', () => {
    const v = evaluate(actions.cryptoBuy, fullAutonomyMandate, [], ctx({ jurisdiction: 'US-NY' }));
    expect(v.decision).toBe('require_approval');
    expect(v.approvalException).toBe(true);
    expect(v.matchedRules).toEqual([
      expect.objectContaining({ ruleId: 'reg-ny-crypto-approval', source: 'regulator' }),
    ]);
  });

  it('does not apply regulator rules elsewhere', () => {
    expect(evaluate(actions.cryptoBuy, fullAutonomyMandate, [], ctx()).decision).toBe('allow');
  });

  it('tolerates an unknown jurisdiction', () => {
    expect(evaluate(actions.cryptoBuy, mandate, [], ctx({ jurisdiction: 'XX' })).decision).toBe(
      'allow',
    );
  });
});

describe('limits in evaluation', () => {
  it('does not draw spending limits down for sells', () => {
    const v = evaluate(actions.sell, mandate, [], ctx());
    expect(v.limitImpact.map((l) => l.limitId)).toEqual(['limit-per-trade', 'limit-daily-trades']);
  });

  it('fails closed when a magnitude limit cannot be evaluated', () => {
    const v = evaluate({ ...actions.smallBuy, magnitude: null }, mandate, [], ctx());
    expect(v.decision).toBe('require_approval');
    expect(v.approvalReasons).toEqual([
      { kind: 'limit_unevaluable', limitId: 'limit-funded' },
      { kind: 'limit_unevaluable', limitId: 'limit-weekly' },
      { kind: 'limit_unevaluable', limitId: 'limit-per-trade' },
    ]);
  });
});

describe('claim vs. verdict', () => {
  it('flags the overreach: agent claims within mandate, policy denies', () => {
    const v = evaluate(actions.outOfScopeBuy, mandate, [], ctx());
    expect(actions.outOfScopeBuy.agentClaim.withinMandate).toBe(true);
    expect(v.claimMismatch).toBe(true);
  });

  it('does not flag an honest escalation', () => {
    expect(evaluate(actions.overLimitBuy, mandate, [], ctx()).claimMismatch).toBe(false);
    expect(evaluate(actions.largeBuy, mandate, [], ctx()).claimMismatch).toBe(false);
  });

  it('never lets the claim change the decision', () => {
    const honest = evaluate(actions.outOfScopeBuy, mandate, [], ctx());
    const lying = evaluate(
      { ...actions.outOfScopeBuy, agentClaim: { withinMandate: false, requiresApproval: false } },
      mandate,
      [],
      ctx(),
    );
    expect({ ...lying, claimMismatch: honest.claimMismatch }).toEqual(honest);
  });
});

describe('purity', () => {
  it('does not mutate its inputs', () => {
    const snapshot = structuredClone({ action: actions.largeBuy, mandate });
    evaluate(actions.largeBuy, mandate, [], ctx());
    expect({ action: actions.largeBuy, mandate }).toEqual(snapshot);
  });
});
