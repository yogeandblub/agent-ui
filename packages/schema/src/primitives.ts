import { z } from 'zod';

export const Timestamp = z.iso.datetime({ offset: true });

/** Ordered lowest → highest. Policy compares by index, so order matters. */
export const RiskLevel = z.enum(['none', 'low', 'medium', 'high', 'critical']);
export type RiskLevel = z.infer<typeof RiskLevel>;

export const AutonomyLevel = z.enum([
  'suggest_only', // agent proposes, human acts
  'act_with_approval', // every action approved
  'act_within_limits', // acts freely inside the mandate; escalates at limits
  'full_autonomy', // no approvals (still revocable; platform/regulator exceptions still apply)
]);
export type AutonomyLevel = z.infer<typeof AutonomyLevel>;

/** Who set a rule. Rules the user didn't set must be explained, not just enforced (brief §3.5). */
export const RuleSource = z.enum(['user', 'platform', 'regulator']);
export type RuleSource = z.infer<typeof RuleSource>;

export const AgentIdentity = z.object({
  id: z.string(),
  name: z.string(),
  provenance: z.enum(['first_party', 'external']), // built-in vs. connected over MCP
  provider: z.string().nullable(), // e.g. model or vendor name
});
export type AgentIdentity = z.infer<typeof AgentIdentity>;

export const Magnitude = z.object({ value: z.number(), unit: z.string() });
export type Magnitude = z.infer<typeof Magnitude>;
