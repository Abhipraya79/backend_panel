import { z } from 'zod';

export const cleaningCommandSchema = z.object({
  action: z.enum(['START', 'STOP'], {
    errorMap: () => ({
      message: 'action must be one of: START, STOP',
    }),
  }),
  mode: z.enum(['MANUAL', 'AUTO_RTC'], {
    errorMap: () => ({
      message: 'mode must be one of: MANUAL, AUTO_RTC',
    }),
  }),
});

export type CleaningCommandPayload = z.infer<typeof cleaningCommandSchema>;
