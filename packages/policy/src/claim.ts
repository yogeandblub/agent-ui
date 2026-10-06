import type { AgentClaim, PolicyVerdict } from '@agent-ui/schema';

/**
 * Does the agent's self-report disagree with policy? Brief §7: any disagreement counts,
 * including an agent that is more cautious than it needs to be.
 */
export function detectClaimMismatch(
  claim: AgentClaim,
  verdict: Pick<PolicyVerdict, 'withinMandate' | 'requiresApproval'>,
): boolean {
  return (
    claim.withinMandate !== verdict.withinMandate ||
    claim.requiresApproval !== verdict.requiresApproval
  );
}
