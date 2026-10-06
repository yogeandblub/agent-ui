import { z } from 'zod';
import { Rule } from './mandate.ts';

/**
 * Regulator rules by jurisdiction code (e.g. 'US-NY'). They apply on top of the mandate's own
 * rules and ignore the autonomy setting, which is what produces the approval-exception case.
 */
export const JurisdictionTable = z.record(
  z.string(),
  z.array(
    Rule.refine((r) => r.source === 'regulator', {
      message: 'Jurisdiction rules must have source "regulator"',
      path: ['source'],
    }),
  ),
);
export type JurisdictionTable = z.infer<typeof JurisdictionTable>;
