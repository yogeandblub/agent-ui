import type { AgentAction, Limit, LimitImpact, LimitUsage } from '@agent-ui/schema';
import { matchesPredicate } from './predicates.ts';

export type LimitAssessment =
  | { kind: 'not_applicable' }
  | { kind: 'unevaluable' } // applies, but the action has no magnitude in the limit's unit
  | { kind: 'impact'; impact: LimitImpact };

/**
 * What this action would do to one limit. `usage` is consumption in the current window, which
 * the caller computes from usage facts; policy doesn't know about time windows.
 */
export function assessLimit(
  limit: Limit,
  action: AgentAction,
  usage: readonly LimitUsage[],
): LimitAssessment {
  if (limit.appliesTo !== null && !matchesPredicate(limit.appliesTo, action)) {
    return { kind: 'not_applicable' };
  }

  const before = usage.find((u) => u.limitId === limit.id)?.used ?? 0;
  const impact = (after: number): LimitAssessment => ({
    kind: 'impact',
    impact: { limitId: limit.id, before, after, max: limit.max, exceeded: after > limit.max },
  });

  // Counting limits: every applicable action counts as one, whatever its size.
  if (limit.kind === 'count' || limit.kind === 'rate') return impact(before + 1);

  // Magnitude limits need a comparable amount.
  if (action.magnitude === null || action.magnitude.unit !== limit.unit) {
    return { kind: 'unevaluable' };
  }

  // A per-action limit judges each action alone; prior usage doesn't matter.
  if (limit.kind === 'per_action') {
    return {
      kind: 'impact',
      impact: {
        limitId: limit.id,
        before: 0,
        after: action.magnitude.value,
        max: limit.max,
        exceeded: action.magnitude.value > limit.max,
      },
    };
  }

  // stock and cumulative both accumulate.
  return impact(before + action.magnitude.value);
}
