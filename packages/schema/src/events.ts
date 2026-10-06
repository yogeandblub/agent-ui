import { z } from 'zod';
import { AgentAction } from './action.ts';
import { Mandate } from './mandate.ts';
import { Timestamp } from './primitives.ts';
import { StandingInstruction } from './standing.ts';

// Every AgentEvent is a fact: something that happened, with when and which agent.
// Nothing here says what state anything is in. Machines derive that (ADR-0002).
//
// Deliberately absent: `run.waiting_for_tool` and `run.waiting_for_user`. Both are statuses,
// already implied by `tool.invoked` (no `tool.returned` yet) and `approval.requested` (not yet
// resolved). Sending them would let the runtime assert state the machines should derive.

const base = {
  id: z.string(),
  at: Timestamp,
  agentId: z.string(),
};

const ErrorInfo = z.object({ code: z.string(), message: z.string() });

const event = <T extends string, S extends z.ZodRawShape>(type: T, shape: S) =>
  z.object({ type: z.literal(type), ...base, ...shape });

export const InterventionKind = z.enum(['pause', 'resume', 'stop', 'revoke', 'takeover']);
export type InterventionKind = z.infer<typeof InterventionKind>;

export const InterventionTarget = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('run'), runId: z.string() }),
  z.object({ kind: z.literal('standing'), standingInstructionId: z.string() }),
  z.object({ kind: z.literal('mandate'), mandateId: z.string() }),
]);
export type InterventionTarget = z.infer<typeof InterventionTarget>;

export const AgentEvent = z.discriminatedUnion('type', [
  // Run lifecycle: phases the agent reports entering, plus terminal outcomes.
  event('run.started', { runId: z.string(), instruction: z.string() }),
  event('run.planning', { runId: z.string() }),
  event('run.working', { runId: z.string() }),
  event('run.completed', { runId: z.string() }),
  event('run.failed', { runId: z.string(), error: ErrorInfo }),

  // Plans
  event('plan.proposed', {
    runId: z.string(),
    planId: z.string(),
    steps: z.array(z.object({ id: z.string(), description: z.string() })),
  }),
  event('plan.step_updated', {
    runId: z.string(),
    planId: z.string(),
    stepId: z.string(),
    outcome: z.enum(['started', 'succeeded', 'failed', 'skipped']),
  }),

  // Actions
  event('action.proposed', { action: AgentAction }),
  event('action.executed', { actionId: z.string(), result: z.string().nullable() }),
  event('action.failed', { actionId: z.string(), error: ErrorInfo }),
  event('action.undone', { actionId: z.string() }),

  // Limits: what was actually consumed (e.g. a fill price), which can differ from the proposal.
  event('usage.recorded', {
    limitId: z.string(),
    amount: z.number(),
    actionId: z.string().nullable(),
  }),

  // Approvals
  event('approval.requested', { approvalId: z.string(), actionId: z.string() }),
  event('approval.resolved', {
    approvalId: z.string(),
    outcome: z.enum(['approved', 'rejected', 'expired']),
  }),

  // Tools
  event('tool.invoked', {
    runId: z.string().nullable(),
    toolCallId: z.string(),
    tool: z.string(),
    input: z.record(z.string(), z.unknown()),
  }),
  event('tool.returned', {
    toolCallId: z.string(),
    outcome: z.enum(['ok', 'error']),
    output: z.unknown(),
  }),

  // Standing instructions
  event('standing.created', { instruction: StandingInstruction }),
  event('standing.condition_met', {
    standingInstructionId: z.string(),
    observation: z.string(), // what was seen, e.g. "Price crossed 180.00"
  }),
  event('standing.acted', { standingInstructionId: z.string(), actionId: z.string() }),

  // Interventions (always by the user)
  event('intervention.applied', { kind: InterventionKind, target: InterventionTarget }),

  // Mandates
  event('mandate.granted', { mandate: Mandate }),
  event('mandate.edited', { mandate: Mandate }), // full replacement, not a patch
  event('mandate.expired', { mandateId: z.string() }),

  // Misc
  event('error.raised', { runId: z.string().nullable(), error: ErrorInfo }),
  event('message.streamed', { runId: z.string(), messageId: z.string(), delta: z.string() }),
]);
export type AgentEvent = z.infer<typeof AgentEvent>;
export type AgentEventType = AgentEvent['type'];
export type AgentEventOf<T extends AgentEventType> = Extract<AgentEvent, { type: T }>;
