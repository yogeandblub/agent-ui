import { brokerage } from '@agent-ui/schema/fixtures';
import { describe, expect, it } from 'vitest';
import { globMatches, matchesPredicate } from './predicates.ts';

const { actions } = brokerage;
const a = actions.smallBuy; // buy $200 AAPL, low risk, reversible, equity

describe('amountAbove', () => {
  it('matches strictly above the value in the same unit', () => {
    expect(matchesPredicate({ kind: 'amountAbove', unit: 'USD', value: 199 }, a)).toBe(true);
    expect(matchesPredicate({ kind: 'amountAbove', unit: 'USD', value: 200 }, a)).toBe(false);
  });

  it('never matches a different unit or a missing magnitude', () => {
    expect(matchesPredicate({ kind: 'amountAbove', unit: 'EUR', value: 1 }, a)).toBe(false);
    expect(
      matchesPredicate({ kind: 'amountAbove', unit: 'USD', value: 1 }, { ...a, magnitude: null }),
    ).toBe(false);
  });
});

describe('irreversible', () => {
  it('matches only irreversible actions', () => {
    expect(matchesPredicate({ kind: 'irreversible' }, a)).toBe(false);
    expect(matchesPredicate({ kind: 'irreversible' }, { ...a, reversible: false })).toBe(true);
  });
});

describe('riskAtLeast', () => {
  it('compares by order, inclusive', () => {
    expect(matchesPredicate({ kind: 'riskAtLeast', level: 'low' }, a)).toBe(true);
    expect(matchesPredicate({ kind: 'riskAtLeast', level: 'medium' }, a)).toBe(false);
    expect(
      matchesPredicate({ kind: 'riskAtLeast', level: 'high' }, { ...a, risk: 'critical' }),
    ).toBe(true);
  });
});

describe('targetMatches', () => {
  it('reads built-in fields', () => {
    expect(matchesPredicate({ kind: 'targetMatches', field: 'verb', pattern: 'buy' }, a)).toBe(
      true,
    );
    expect(matchesPredicate({ kind: 'targetMatches', field: 'target', pattern: 'AA*' }, a)).toBe(
      true,
    );
    expect(
      matchesPredicate({ kind: 'targetMatches', field: 'resource', pattern: 'acct-*' }, a),
    ).toBe(true);
  });

  it('falls back to attributes, and never matches a missing field', () => {
    expect(
      matchesPredicate({ kind: 'targetMatches', field: 'assetClass', pattern: 'equity' }, a),
    ).toBe(true);
    expect(matchesPredicate({ kind: 'targetMatches', field: 'nope', pattern: '*' }, a)).toBe(false);
    expect(
      matchesPredicate(
        { kind: 'targetMatches', field: 'tool', pattern: '*' },
        { ...a, tool: null },
      ),
    ).toBe(false);
  });
});

describe('assetClass', () => {
  it('matches the assetClass attribute exactly', () => {
    expect(matchesPredicate({ kind: 'assetClass', value: 'crypto' }, actions.cryptoBuy)).toBe(true);
    expect(matchesPredicate({ kind: 'assetClass', value: 'crypto' }, a)).toBe(false);
  });
});

describe('globMatches', () => {
  it.each([
    ['*@example.com', 'ana@example.com', true],
    ['*@example.com', 'ana@example.com.evil.io', false],
    ['BUY', 'buy', true],
    ['a.b', 'axb', false], // dots are literal
    ['(x)+', '(x)+', true], // regex syntax is literal
    ['*', '', true],
  ])('%s vs %s → %s', (pattern, value, expected) => {
    expect(globMatches(pattern, value)).toBe(expected);
  });
});
