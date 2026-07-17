"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandPayloadSchema = void 0;
const zod_1 = require("zod");
exports.commandPayloadSchema = zod_1.z.object({
    deviceId: zod_1.z
        .string({
        required_error: 'deviceId is required',
        invalid_type_error: 'deviceId must be string',
    })
        .min(1, 'deviceId is required'),
    command: zod_1.z.enum(['PUMP_ON', 'PUMP_OFF', 'WIPER_ON', 'WIPER_OFF', 'AUTO_MODE', 'MANUAL_MODE'], {
        errorMap: () => ({
            message: 'command must be one of: PUMP_ON, PUMP_OFF, WIPER_ON, WIPER_OFF, AUTO_MODE, MANUAL_MODE',
        }),
    }),
});
