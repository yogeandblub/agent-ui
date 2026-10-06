import { z } from 'zod';

export const StandingInstruction = z.object({
  id: z.string(),
  agentId: z.string(),
  mandateId: z.string(),
  instruction: z.string(), // verbatim
  condition: z.string(), // plain-language trigger
  actionTemplate: z.string(), // what it will do when triggered
  schedule: z.string().nullable(),
  reversibleOnStop: z.literal(false), // stopping never undoes past actions
});
export type StandingInstruction = z.infer<typeof StandingInstruction>;
