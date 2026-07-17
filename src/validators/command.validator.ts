import { z } from 'zod';

export const commandPayloadSchema = z.object({
  deviceId: z
    .string({
      required_error: 'deviceId is required',
      invalid_type_error: 'deviceId must be string',
    })
    .min(1, 'deviceId is required'),
  command: z.enum(['PUMP_ON', 'PUMP_OFF', 'WIPER_ON', 'WIPER_OFF', 'AUTO_MODE', 'MANUAL_MODE'], {
    errorMap: () => ({
      message:
        'command must be one of: PUMP_ON, PUMP_OFF, WIPER_ON, WIPER_OFF, AUTO_MODE, MANUAL_MODE',
    }),
  }),
});

export type CommandPayload = z.infer<typeof commandPayloadSchema>;
