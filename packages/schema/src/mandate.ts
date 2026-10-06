import { z } from 'zod';
import { AutonomyLevel, RiskLevel, RuleSource, Timestamp } from './primitives.ts';

/**
 * Typed predicates over an AgentAction. No free-text rules that nothing evaluates.
 * Adding a new `kind` is a thesis finding: log it in docs/thesis-notes.md (brief §12).
 */
export const RulePredicate = z.discriminatedUnion('kind', [
  /** action.magnitude is in `unit` and strictly greater than `value`. */
  z.object({ kind: z.literal('amountAbove'), unit: z.string(), value: z.number() }),
  /** action.reversible is false. */
  z.object({ kind: z.literal('irreversible') }),
  /** action.risk is `level` or higher. */
  z.object({ kind: z.literal('riskAtLeast'), level: RiskLevel }),
  /**
   * A field of the action matches a glob (`*` = any run of characters, case-insensitive,
   * whole value). `field` is `verb`, `target`, `tool`, `resource`, or an attribute key.
   * Globs, not regexes, because patterns may come from agents or users.
   */
  z.object({ kind: z.literal('targetMatches'), field: z.string(), pattern: z.string() }),
  /** action.attributes.assetClass equals `value` (e.g. 'crypto'). */
  z.object({ kind: z.literal('assetClass'), value: z.string() }),
]);
export type RulePredicate = z.infer<typeof RulePredicate>;

export const Rule = z
  .object({
    id: z.string(),
    effect: z.enum(['require_approval', 'prohibit']),
    when: RulePredicate,
    source: RuleSource,
    reason: z.string(), // plain-language explanation shown in UI
    userEditable: z.boolean(),
  })
  .refine((r) => r.source === 'user' || !r.userEditable, {
    message: 'Platform and regulator rules cannot be user-editable',
    path: ['userEditable'],
  });
export type Rule = z.infer<typeof Rule>;

export const Limit = z
  .object({
    id: z.string(),
    /**
     * stock      = funded balance the agent draws down (never refills on its own)
     * cumulative = total magnitude, optionally per rolling window
     * per_action = magnitude of any single action
     * rate       = number of actions per rolling window (window required)
     * count      = number of actions, optionally per window
     */
    kind: z.enum(['stock', 'cumulative', 'per_action', 'rate', 'count']),
    label: z.string(),
    unit: z.string(),
    max: z.number().nonnegative(),
    window: z.iso.duration().nullable(), // ISO 8601 duration for rolling windows
    /**
     * Which actions count against this limit. null = every action.
     * Without this, selling would draw down a spending limit.
     */
    appliesTo: RulePredicate.nullable(),
  })
  .refine((l) => l.kind !== 'rate' || l.window !== null, {
    message: 'Rate limits need a window',
    path: ['window'],
  });
export type Limit = z.infer<typeof Limit>;

/** A resource the agent can see or act on. `id` is matched against AgentAction.resource. */
export const ScopeEntry = z.object({ id: z.string(), label: z.string() });
export type ScopeEntry = z.infer<typeof ScopeEntry>;

export const Mandate = z.object({
  id: z.string(),
  agentId: z.string(),
  grantedAt: Timestamp,
  expiresAt: Timestamp.nullable(),
  autonomy: AutonomyLevel,
  instruction: z.string(), // verbatim user instruction
  readScope: z.array(ScopeEntry), // what the agent can see
  writeScope: z.array(ScopeEntry), // what the agent can act on
  limits: z.array(Limit),
  rules: z.array(Rule),
  liability: z.string(), // who bears loss, plain language
});
export type Mandate = z.infer<typeof Mandate>;
