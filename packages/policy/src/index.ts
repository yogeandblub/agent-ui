// @agent-ui/policy — pure functions: action × mandate → PolicyVerdict.
export const PACKAGE_NAME = '@agent-ui/policy';

export { evaluate, type EvaluationContext } from './evaluate.ts';
export { detectClaimMismatch } from './claim.ts';
export { assessLimit, type LimitAssessment } from './limits.ts';
export { globMatches, matchesPredicate } from './predicates.ts';
