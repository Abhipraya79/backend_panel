import { z } from 'zod';

export const statusPayloadSchema = z.object({
  deviceId: z
    .string({
      required_error: 'deviceId is required',
      invalid_type_error: 'deviceId must be string',
    })
    .min(1, 'deviceId is required'),
  status: z.enum(['ONLINE', 'OFFLINE'], {
    errorMap: () => ({ message: 'status must be ONLINE or OFFLINE' }),
  }),
  timestamp: z
    .string({
      invalid_type_error: 'timestamp must be string',
    })
    .optional(),
});

export type StatusPayload = z.infer<typeof statusPayloadSchema>;
