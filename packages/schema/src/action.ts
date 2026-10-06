import { z } from 'zod';
import { Magnitude, RiskLevel } from './primitives.ts';

/** What the agent SAYS about its own action. Recorded, displayed, never trusted (ADR-0002). */
export const AgentClaim = z.object({
  withinMandate: z.boolean(),
  requiresApproval: z.boolean(),
});
export type AgentClaim = z.infer<typeof AgentClaim>;

export const AgentAction = z.object({
  id: z.string(),
  agentId: z.string(),
  runId: z.string().nullable(),
  standingInstructionId: z.string().nullable(),
  verb: z.string(),
  target: z.string(),
  /** The scope entry this action writes to; checked against Mandate.writeScope. */
  resource: z.string(),
  attributes: z.record(z.string(), z.string()), // e.g. { assetClass: 'crypto' } for predicates
  magnitude: Magnitude.nullable(),
  tool: z.string().nullable(),
  risk: RiskLevel,
  reversible: z.boolean(),
  rationale: z.string().nullable(),
  confidence: z.number().min(0).max(1).nullable(),
  agentClaim: AgentClaim,
});
export type AgentAction = z.infer<typeof AgentAction>;
