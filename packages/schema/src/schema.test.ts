import { describe, expect, it } from 'vitest';
import { brokerage } from './fixtures/index.ts';
import {
  AgentAction,
  AgentEvent,
  JurisdictionTable,
  Limit,
  Mandate,
  PolicyVerdict,
  Rule,
  StandingInstruction,
} from './index.ts';

const { brokerageMandate, actions, brokerageJurisdictions, NOW } = brokerage;
const at = NOW;

describe('fixtures parse', () => {
  it('mandate', () => {
    expect(Mandate.parse(brokerageMandate)).toEqual(brokerageMandate);
  });

  it.each(Object.entries(actions))('action %s', (_, a) => {
    expect(AgentAction.parse(a)).toEqual(a);
  });

  it('jurisdiction table', () => {
    expect(JurisdictionTable.parse(brokerageJurisdictions)).toEqual(brokerageJurisdictions);
  });
});

describe('Rule', () => {
  const rule = brokerageMandate.rules[0];

  it('rejects a platform or regulator rule the user could edit', () => {
    expect(Rule.safeParse({ ...rule, source: 'platform', userEditable: true }).success).toBe(false);
    expect(Rule.safeParse({ ...rule, source: 'regulator', userEditable: true }).success).toBe(
      false,
    );
  });

  it('rejects free-text predicates', () => {
    expect(Rule.safeParse({ ...rule, when: { kind: 'custom', text: 'be careful' } }).success).toBe(
      false,
    );
  });
});

describe('JurisdictionTable', () => {
  it('rejects non-regulator rules', () => {
    const userRule = brokerageMandate.rules[0];
    expect(JurisdictionTable.safeParse({ 'US-NY': [userRule] }).success).toBe(false);
  });
});

describe('Limit', () => {
  const base = brokerageMandate.limits[0];

  it('requires a window for rate limits', () => {
    expect(Limit.safeParse({ ...base, kind: 'rate', window: null }).success).toBe(false);
    expect(Limit.safeParse({ ...base, kind: 'rate', window: 'P1D' }).success).toBe(true);
  });

  it('rejects windows that are not ISO 8601 durations', () => {
    expect(Limit.safeParse({ ...base, window: '1 week' }).success).toBe(false);
  });

  it('rejects negative maximums', () => {
    expect(Limit.safeParse({ ...base, max: -1 }).success).toBe(false);
  });
});

describe('Mandate', () => {
  it('rejects non-ISO timestamps', () => {
    expect(Mandate.safeParse({ ...brokerageMandate, grantedAt: 'yesterday' }).success).toBe(false);
  });

  it('keeps read and write scope separate', () => {
    const m = Mandate.parse(brokerageMandate);
    expect(m.readScope.length).toBeGreaterThan(m.writeScope.length);
  });
});

describe('AgentAction', () => {
  it('rejects confidence outside 0–1', () => {
    expect(AgentAction.safeParse({ ...actions.smallBuy, confidence: 1.2 }).success).toBe(false);
  });

  it('requires an agent claim', () => {
    const noClaim: Partial<typeof actions.smallBuy> = { ...actions.smallBuy };
    delete noClaim.agentClaim;
    expect(AgentAction.safeParse(noClaim).success).toBe(false);
  });
});

describe('StandingInstruction', () => {
  const si = {
    id: 'si-1',
    agentId: 'agent-1',
    mandateId: 'mandate-1',
    instruction: 'Buy $100 of AAPL whenever it drops below $180.',
    condition: 'AAPL below $180',
    actionTemplate: 'Buy $100 of AAPL',
    schedule: null,
    reversibleOnStop: false,
  };

  it('parses', () => {
    expect(StandingInstruction.parse(si)).toEqual(si);
  });

  it('can never be reversible on stop (stop is not undo)', () => {
    expect(StandingInstruction.safeParse({ ...si, reversibleOnStop: true }).success).toBe(false);
  });
});

describe('AgentEvent', () => {
  it('parses one event of each family', () => {
    const events = [
      { type: 'run.started', id: 'e1', at, agentId: 'agent-1', runId: 'r1', instruction: 'Go' },
      { type: 'action.proposed', id: 'e2', at, agentId: 'agent-1', action: actions.smallBuy },
      {
        type: 'usage.recorded',
        id: 'e3',
        at,
        agentId: 'agent-1',
        limitId: 'l',
        amount: 5,
        actionId: null,
      },
      {
        type: 'approval.resolved',
        id: 'e4',
        at,
        agentId: 'agent-1',
        approvalId: 'a1',
        outcome: 'expired',
      },
      {
        type: 'intervention.applied',
        id: 'e5',
        at,
        agentId: 'agent-1',
        kind: 'stop',
        target: { kind: 'run', runId: 'r1' },
      },
      { type: 'mandate.granted', id: 'e6', at, agentId: 'agent-1', mandate: brokerageMandate },
    ];
    for (const e of events) expect(AgentEvent.parse(e)).toEqual(e);
  });

  it('rejects unknown event types', () => {
    expect(AgentEvent.safeParse({ type: 'run.vibes', id: 'e', at, agentId: 'a' }).success).toBe(
      false,
    );
  });

  it('does not accept status events (status is derived, never sent)', () => {
    for (const type of ['run.waiting_for_user', 'run.waiting_for_tool', 'mandate.near_limit']) {
      expect(AgentEvent.safeParse({ type, id: 'e', at, agentId: 'a', runId: 'r1' }).success).toBe(
        false,
      );
    }
  });

  it('strips status fields smuggled onto a fact', () => {
    const parsed = AgentEvent.parse({
      type: 'action.executed',
      id: 'e',
      at,
      agentId: 'a',
      actionId: 'x',
      result: null,
      status: 'near_limit',
    });
    expect(parsed).not.toHaveProperty('status');
  });
});

describe('PolicyVerdict', () => {
  it('is a separate shape from any event', () => {
    const verdict = {
      decision: 'allow',
      withinMandate: true,
      requiresApproval: false,
      approvalException: false,
      violations: [],
      approvalReasons: [],
      matchedRules: [],
      limitImpact: [],
      claimMismatch: false,
    };
    expect(PolicyVerdict.parse(verdict)).toEqual(verdict);
    expect(
      AgentEvent.safeParse({ type: 'policy.verdict', id: 'e', at, agentId: 'a', ...verdict })
        .success,
    ).toBe(false);
  });
});
