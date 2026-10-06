import type {
  AgentAction,
  ApprovalReason,
  JurisdictionTable,
  LimitImpact,
  LimitUsage,
  Mandate,
  MatchedRule,
  PolicyVerdict,
  Rule,
  Violation,
} from '@agent-ui/schema';
import { detectClaimMismatch } from './claim.ts';
import { assessLimit } from './limits.ts';
import { matchesPredicate } from './predicates.ts';

export interface EvaluationContext {
  /** e.g. 'US-NY'. Looked up in `jurisdictions`. */
  jurisdiction: string;
  /** ISO timestamp the action is evaluated at. Passed in so policy stays pure. */
  now: string;
  /** Regulator rules per jurisdiction. Domain data, supplied by the workflow. */
  jurisdictions: JurisdictionTable;
}

function mandateInForce(mandate: Mandate, now: string): boolean {
  const t = Date.parse(now);
  if (t < Date.parse(mandate.grantedAt)) return false;
  return mandate.expiresAt === null || t < Date.parse(mandate.expiresAt);
}

/**
 * User approval rules stop applying when the user turns approvals off (full_autonomy).
 * Platform and regulator rules always apply. That's the approval-exception case.
 */
function ruleInEffect(rule: Rule, mandate: Mandate): boolean {
  if (rule.effect === 'prohibit') return true;
  return rule.source !== 'user' || mandate.autonomy !== 'full_autonomy';
}

/**
 * Compares a proposed action with the mandate. Pure: same inputs, same verdict.
 * The agent's own claim is read only to compute `claimMismatch`, never to decide.
 */
export function evaluate(
  action: AgentAction,
  mandate: Mandate,
  usage: readonly LimitUsage[],
  context: EvaluationContext,
): PolicyVerdict {
  const violations: Violation[] = [];
  const approvalReasons: ApprovalReason[] = [];
  const matchedRules: MatchedRule[] = [];
  const limitImpact: LimitImpact[] = [];

  // Is this mandate even the one that governs this action, right now?
  if (action.agentId !== mandate.agentId) {
    violations.push({ kind: 'wrong_agent', agentId: action.agentId });
  }
  if (!mandateInForce(mandate, context.now)) {
    violations.push({ kind: 'mandate_not_in_force', at: context.now });
  }

  // Write scope. Read scope never authorises an action.
  if (!mandate.writeScope.some((s) => s.id === action.resource)) {
    violations.push({ kind: 'out_of_write_scope', resource: action.resource });
  }

  // Rules: the mandate's own, plus regulator rules for this jurisdiction.
  const rules = [...mandate.rules, ...(context.jurisdictions[context.jurisdiction] ?? [])];
  for (const rule of rules) {
    if (!ruleInEffect(rule, mandate) || !matchesPredicate(rule.when, action)) continue;
    matchedRules.push({
      ruleId: rule.id,
      effect: rule.effect,
      source: rule.source,
      reason: rule.reason,
    });
    if (rule.effect === 'prohibit') {
      violations.push({ kind: 'prohibited_by_rule', ruleId: rule.id, source: rule.source });
    } else {
      approvalReasons.push({ kind: 'rule', ruleId: rule.id, source: rule.source });
    }
  }

  // Limits. Exceeding one is outside the mandate but can be escalated for approval.
  for (const limit of mandate.limits) {
    const assessment = assessLimit(limit, action, usage);
    if (assessment.kind === 'unevaluable') {
      approvalReasons.push({ kind: 'limit_unevaluable', limitId: limit.id });
    } else if (assessment.kind === 'impact') {
      limitImpact.push(assessment.impact);
      if (assessment.impact.exceeded) {
        violations.push({ kind: 'limit_exceeded', limitId: limit.id });
        approvalReasons.push({ kind: 'limit_exceeded', limitId: limit.id });
      }
    }
  }

  // Autonomy levels where a human approves everything.
  if (mandate.autonomy === 'suggest_only' || mandate.autonomy === 'act_with_approval') {
    approvalReasons.push({ kind: 'autonomy', level: mandate.autonomy });
  }

  const denied = violations.some((v) => v.kind !== 'limit_exceeded');
  const decision: PolicyVerdict['decision'] = denied
    ? 'deny'
    : approvalReasons.length > 0
      ? 'require_approval'
      : 'allow';

  const withinMandate = violations.length === 0;
  const requiresApproval = decision === 'require_approval';

  return {
    decision,
    withinMandate,
    requiresApproval,
    approvalException: requiresApproval && mandate.autonomy === 'full_autonomy',
    violations,
    approvalReasons: denied ? [] : approvalReasons,
    matchedRules,
    limitImpact,
    claimMismatch: detectClaimMismatch(action.agentClaim, { withinMandate, requiresApproval }),
  };
}
