import { z } from 'zod';
import { AutonomyLevel, RuleSource } from './primitives.ts';

// ── Computed contract ────────────────────────────────────────────────────────────────────────
// These shapes are NOT facts and never appear inside an AgentEvent. They live in schema only so
// that policy (which produces them) and machines (which consume them) share one definition
// without depending on each other (ADR-0002, Checkpoint 0 option A).

/** How much of a limit has been consumed in its current window. Computed from usage facts. */
export const LimitUsage = z.object({ limitId: z.string(), used: z.number() });
export type LimitUsage = z.infer<typeof LimitUsage>;

export const MatchedRule = z.object({
  ruleId: z.string(),
  effect: z.enum(['require_approval', 'prohibit']),
  source: RuleSource,
  reason: z.string(),
});
export type MatchedRule = z.infer<typeof MatchedRule>;

export const LimitImpact = z.object({
  limitId: z.string(),
  before: z.number(),
  after: z.number(),
  max: z.number(),
  exceeded: z.boolean(), // after > max (reaching exactly max is allowed)
});
export type LimitImpact = z.infer<typeof LimitImpact>;

/** Why an action is outside the mandate. */
export const Violation = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('prohibited_by_rule'), ruleId: z.string(), source: RuleSource }),
  z.object({ kind: z.literal('out_of_write_scope'), resource: z.string() }),
  z.object({ kind: z.literal('limit_exceeded'), limitId: z.string() }),
  z.object({ kind: z.literal('mandate_not_in_force'), at: z.string() }),
  z.object({ kind: z.literal('wrong_agent'), agentId: z.string() }),
]);
export type Violation = z.infer<typeof Violation>;

/** Why a human has to approve before the action runs. */
export const ApprovalReason = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('rule'), ruleId: z.string(), source: RuleSource }),
  z.object({ kind: z.literal('autonomy'), level: AutonomyLevel }),
  z.object({ kind: z.literal('limit_exceeded'), limitId: z.string() }),
  /** The limit applies but the action has no comparable magnitude. Fail closed. */
  z.object({ kind: z.literal('limit_unevaluable'), limitId: z.string() }),
]);
export type ApprovalReason = z.infer<typeof ApprovalReason>;

export const PolicyVerdict = z.object({
  /**
   * allow            run it
   * require_approval hold it for a human
   * deny             it cannot run, and approval can't change that
   */
  decision: z.enum(['allow', 'require_approval', 'deny']),
  withinMandate: z.boolean(), // no violations
  requiresApproval: z.boolean(), // decision === 'require_approval'
  /** Approval required although autonomy is full_autonomy ("approvals off"). */
  approvalException: z.boolean(),
  violations: z.array(Violation),
  approvalReasons: z.array(ApprovalReason),
  matchedRules: z.array(MatchedRule),
  limitImpact: z.array(LimitImpact),
  claimMismatch: z.boolean(), // agentClaim disagrees with this verdict
});
export type PolicyVerdict = z.infer<typeof PolicyVerdict>;
