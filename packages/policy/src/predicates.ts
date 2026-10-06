import type { AgentAction, RiskLevel, RulePredicate } from '@agent-ui/schema';

const RISK_ORDER: readonly RiskLevel[] = ['none', 'low', 'medium', 'high', 'critical'];

/** Resolves a predicate field name to a value on the action. Unknown fields read attributes. */
function readField(action: AgentAction, field: string): string | null {
  switch (field) {
    case 'verb':
      return action.verb;
    case 'target':
      return action.target;
    case 'tool':
      return action.tool;
    case 'resource':
      return action.resource;
    default:
      return action.attributes[field] ?? null;
  }
}

/** Whole-value, case-insensitive glob. `*` matches any run of characters; nothing else is special. */
export function globMatches(pattern: string, value: string): boolean {
  const source = pattern
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${source}$`, 'i').test(value);
}

export function matchesPredicate(predicate: RulePredicate, action: AgentAction): boolean {
  switch (predicate.kind) {
    case 'amountAbove':
      return (
        action.magnitude !== null &&
        action.magnitude.unit === predicate.unit &&
        action.magnitude.value > predicate.value
      );
    case 'irreversible':
      return !action.reversible;
    case 'riskAtLeast':
      return RISK_ORDER.indexOf(action.risk) >= RISK_ORDER.indexOf(predicate.level);
    case 'targetMatches': {
      const value = readField(action, predicate.field);
      return value !== null && globMatches(predicate.pattern, value);
    }
    case 'assetClass':
      return action.attributes.assetClass === predicate.value;
  }
}
