import { z } from 'zod';

export const coolingCommandSchema = z.object({
  action: z.enum(['START', 'STOP'], {
    errorMap: () => ({
      message: 'action must be one of: START, STOP',
    }),
  }),
});

export type CoolingCommandPayload = z.infer<typeof coolingCommandSchema>;
