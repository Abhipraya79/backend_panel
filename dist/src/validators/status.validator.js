"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusPayloadSchema = void 0;
const zod_1 = require("zod");
exports.statusPayloadSchema = zod_1.z.object({
    deviceId: zod_1.z
        .string({
        required_error: 'deviceId is required',
        invalid_type_error: 'deviceId must be string',
    })
        .min(1, 'deviceId is required'),
    status: zod_1.z.enum(['ONLINE', 'OFFLINE'], {
        errorMap: () => ({ message: 'status must be ONLINE or OFFLINE' }),
    }),
    timestamp: zod_1.z
        .string({
        invalid_type_error: 'timestamp must be string',
    })
        .optional(),
});
