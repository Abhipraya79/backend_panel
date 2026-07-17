"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryService = void 0;
const telemetry_repository_1 = require("../repositories/telemetry.repository");
const socket_server_1 = require("../socket/socket.server");
const socket_events_1 = require("../socket/socket.events");
const logger_1 = __importDefault(require("../utils/logger"));
const telemetry_dto_1 = require("../dto/telemetry.dto");
class TelemetryService {
    static async saveTelemetry(payload, topic) {
        // 1. Save to Firestore
        await telemetry_repository_1.TelemetryRepository.save(payload, topic, 'mqtt');
        // 2. Emit Socket.IO event (wrapped in try/catch to avoid crash)
        try {
            const io = (0, socket_server_1.getSocketIO)();
            const emitPayload = {
                deviceId: payload.deviceId,
                temperature: payload.temperature,
                voltage: payload.voltage,
                current: payload.current,
                power: payload.power,
                dust: payload.dust,
                humidity: payload.humidity,
                pumpStatus: payload.pumpStatus,
                wiperStatus: payload.wiperStatus,
                mode: payload.mode,
                receivedAt: new Date().toISOString(),
            };
            io.emit(socket_events_1.SOCKET_EVENTS.TELEMETRY_NEW, emitPayload);
            const clientCount = io.sockets.sockets.size;
            logger_1.default.info(`[SOCKET]

Telemetry emitted

Socket Clients
${clientCount}`);
        }
        catch (error) {
            logger_1.default.error(`[SOCKET]\n\nFailed to emit telemetry\n\nReason:\n${error.message || error}`);
        }
    }
    static async getLatestTelemetry() {
        return await telemetry_repository_1.TelemetryRepository.getLatest();
    }
    static async getTelemetryHistory(page, limit) {
        return await telemetry_repository_1.TelemetryRepository.getHistory(page, limit);
    }
    static async getDashboardData() {
        const latest = await telemetry_repository_1.TelemetryRepository.getLatest();
        if (!latest) {
            return null;
        }
        return (0, telemetry_dto_1.toDashboardDTO)(latest);
    }
}
exports.TelemetryService = TelemetryService;
