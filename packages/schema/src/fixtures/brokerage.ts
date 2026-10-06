// Brokerage fixtures for tests, stories and scenarios. Domain content is fine here; it is data,
// not component code. Brand names never appear in packages/* (brief §1).
import type { AgentAction } from '../action.ts';
import type { JurisdictionTable } from '../jurisdiction.ts';
import type { Mandate } from '../mandate.ts';
import type { AgentIdentity } from '../primitives.ts';

export const NOW = '2026-10-06T15:00:00Z';

export const firstPartyAgent: AgentIdentity = {
  id: 'agent-1',
  name: 'Trading agent',
  provenance: 'first_party',
  provider: 'Anthropic',
};

export const externalAgent: AgentIdentity = {
  id: 'agent-ext',
  name: 'Research assistant',
  provenance: 'external',
  provider: 'Example Labs (MCP)',
};

/** System condition: graduated autonomy, stock + flow limits, typed rules with sources. */
export const brokerageMandate: Mandate = {
  id: 'mandate-1',
  agentId: firstPartyAgent.id,
  grantedAt: '2026-10-01T14:00:00Z',
  expiresAt: '2026-12-31T23:59:59Z',
  autonomy: 'act_within_limits',
  instruction:
    'Build a position in large-cap tech. Keep each trade under $500 and spend no more than $2,000 a week.',
  readScope: [
    { id: 'acct-individual', label: 'Individual account' },
    { id: 'acct-agent', label: 'Agent account' },
    { id: 'market-data', label: 'Market data' },
  ],
  writeScope: [{ id: 'acct-agent', label: 'Agent account' }],
  limits: [
    {
      id: 'limit-funded',
      kind: 'stock',
      label: 'Funded balance',
      unit: 'USD',
      max: 5000,
      window: null,
      appliesTo: { kind: 'targetMatches', field: 'verb', pattern: 'buy' },
    },
    {
      id: 'limit-weekly',
      kind: 'cumulative',
      label: 'Weekly spending',
      unit: 'USD',
      max: 2000,
      window: 'P7D',
      appliesTo: { kind: 'targetMatches', field: 'verb', pattern: 'buy' },
    },
    {
      id: 'limit-per-trade',
      kind: 'per_action',
      label: 'Per trade',
      unit: 'USD',
      max: 500,
      window: null,
      appliesTo: null,
    },
    {
      id: 'limit-daily-trades',
      kind: 'rate',
      label: 'Trades per day',
      unit: 'trades',
      max: 10,
      window: 'P1D',
      appliesTo: null,
    },
  ],
  rules: [
    {
      id: 'rule-approve-over-250',
      effect: 'require_approval',
      when: { kind: 'amountAbove', unit: 'USD', value: 250 },
      source: 'user',
      reason: 'You asked to approve any trade over $250.',
      userEditable: true,
    },
    {
      id: 'rule-no-options',
      effect: 'prohibit',
      when: { kind: 'assetClass', value: 'options' },
      source: 'user',
      reason: 'You chose not to let the agent trade options.',
      userEditable: true,
    },
    {
      id: 'rule-platform-high-risk',
      effect: 'require_approval',
      when: { kind: 'riskAtLeast', level: 'high' },
      source: 'platform',
      reason: 'The platform requires your approval for any action rated high risk.',
      userEditable: false,
    },
  ],
  liability:
    'Trades the agent makes inside this mandate are treated as your trades. You bear any losses.',
};

/** Same mandate with approvals switched off: the setup for the approval-exception case. */
export const fullAutonomyMandate: Mandate = { ...brokerageMandate, autonomy: 'full_autonomy' };

const action = (overrides: Partial<AgentAction> & Pick<AgentAction, 'id'>): AgentAction => ({
  agentId: firstPartyAgent.id,
  runId: 'run-1',
  standingInstructionId: null,
  verb: 'buy',
  target: 'AAPL',
  resource: 'acct-agent',
  attributes: { assetClass: 'equity' },
  magnitude: { value: 200, unit: 'USD' },
  tool: 'propose_order',
  risk: 'low',
  reversible: true,
  rationale: null,
  confidence: null,
  agentClaim: { withinMandate: true, requiresApproval: false },
  ...overrides,
});

export const actions = {
  /** Inside everything. Allowed. */
  smallBuy: action({ id: 'act-small', rationale: 'Adding to the AAPL position.' }),
  /** Over the user's $250 approval rule, under the $500 per-trade limit. */
  largeBuy: action({
    id: 'act-large',
    target: 'MSFT',
    magnitude: { value: 450, unit: 'USD' },
    agentClaim: { withinMandate: true, requiresApproval: true },
  }),
  /** Over the $500 per-trade limit. The agent escalates honestly. */
  overLimitBuy: action({
    id: 'act-over',
    target: 'NVDA',
    magnitude: { value: 600, unit: 'USD' },
    agentClaim: { withinMandate: false, requiresApproval: true },
  }),
  /** Crypto. Fine under the mandate; regulated in some jurisdictions. */
  cryptoBuy: action({
    id: 'act-crypto',
    target: 'BTC',
    attributes: { assetClass: 'crypto' },
    magnitude: { value: 100, unit: 'USD' },
  }),
  /** Overreach: acts on an account outside write scope while claiming it's fine. */
  outOfScopeBuy: action({
    id: 'act-overreach',
    resource: 'acct-individual',
    magnitude: { value: 200, unit: 'USD' },
    agentClaim: { withinMandate: true, requiresApproval: false },
  }),
  /** Prohibited by the user's no-options rule. */
  optionsBuy: action({
    id: 'act-options',
    target: 'AAPL 2026-11-20 200C',
    attributes: { assetClass: 'options' },
    magnitude: { value: 150, unit: 'USD' },
  }),
  /** Sells don't draw down spending limits (appliesTo: verb = buy). */
  sell: action({ id: 'act-sell', verb: 'sell', magnitude: { value: 300, unit: 'USD' } }),
} satisfies Record<string, AgentAction>;

/**
 * Regulator rules for the reference brokerage.
 * Illustrative: one jurisdiction, general wording. The copy deliberately names no specific law.
 */
export const brokerageJurisdictions: JurisdictionTable = {
  'US-NY': [
    {
      id: 'reg-ny-crypto-approval',
      effect: 'require_approval',
      when: { kind: 'assetClass', value: 'crypto' },
      source: 'regulator',
      reason:
        'Rules where you live require your approval for every crypto trade, even when approvals are off.',
      userEditable: false,
    },
  ],
};
