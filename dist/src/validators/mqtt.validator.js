"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventPayloadSchema = exports.statusPayloadSchema = exports.telemetryPayloadSchema = void 0;
const zod_1 = require("zod");
exports.telemetryPayloadSchema = zod_1.z.object({
    deviceId: zod_1.z.string().min(1, 'deviceId is required'),
    temperature: zod_1.z.number({ required_error: 'temperature is required' }),
    dust: zod_1.z.number({ required_error: 'dust is required' }),
    voltage: zod_1.z.number({ required_error: 'voltage is required' }),
    current: zod_1.z.number({ required_error: 'current is required' }),
    power: zod_1.z.number({ required_error: 'power is required' }),
    pumpStatus: zod_1.z.boolean({ required_error: 'pumpStatus is required' }),
    wiperStatus: zod_1.z.boolean({ required_error: 'wiperStatus is required' }),
    mode: zod_1.z.enum(['AUTO', 'MANUAL'], { required_error: 'mode is required' }),
    timestamp: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'timestamp must be a valid date string',
    }),
});
exports.statusPayloadSchema = zod_1.z.object({
    deviceId: zod_1.z.string().min(1, 'deviceId is required'),
    status: zod_1.z.enum(['ONLINE', 'OFFLINE'], { required_error: 'status must be ONLINE or OFFLINE' }),
    timestamp: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'timestamp must be a valid date string',
    }),
});
exports.eventPayloadSchema = zod_1.z.object({
    deviceId: zod_1.z.string().min(1, 'deviceId is required'),
    event: zod_1.z.string().min(1, 'event description is required'),
    timestamp: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'timestamp must be a valid date string',
    }),
});
