"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMQTTMessage = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const telemetry_validator_1 = require("../validators/telemetry.validator");
const status_validator_1 = require("../validators/status.validator");
const event_validator_1 = require("../validators/event.validator");
const telemetry_service_1 = require("../services/telemetry.service");
const handleMQTTMessage = async (topic, message) => {
    const payloadStr = message.toString();
    try {
        let parsedPayload;
        try {
            parsedPayload = JSON.parse(payloadStr);
        }
        catch {
            // If payload is not valid JSON, print invalid payload message with reason
            const logMessage = `[MQTT]\n\nPayload Invalid\n\nReason:\n- Payload is not a valid JSON string`;
            logger_1.default.info(logMessage);
            return;
        }
        if (topic === 'solar/panel/telemetry') {
            const result = telemetry_validator_1.telemetryPayloadSchema.safeParse(parsedPayload);
            if (result.success) {
                const logMessage = `[MQTT]

Payload Valid

Topic:
${topic}

Payload:
${JSON.stringify(result.data, null, 2)}`;
                logger_1.default.info(logMessage);
                // Forward to TelemetryService
                await telemetry_service_1.TelemetryService.saveTelemetry(result.data, topic);
            }
            else {
                const reasons = result.error.errors.map((err) => err.message);
                const logMessage = `[MQTT]

Payload Invalid

Reason:
${reasons.map((r) => `- ${r}`).join('\n')}`;
                logger_1.default.info(logMessage);
            }
        }
        else if (topic === 'solar/panel/status') {
            const result = status_validator_1.statusPayloadSchema.safeParse(parsedPayload);
            if (result.success) {
                const logMessage = `[MQTT]

Payload Valid

Topic:
${topic}

Payload:
${JSON.stringify(result.data, null, 2)}`;
                logger_1.default.info(logMessage);
            }
            else {
                const reasons = result.error.errors.map((err) => err.message);
                const logMessage = `[MQTT]

Payload Invalid

Reason:
${reasons.map((r) => `- ${r}`).join('\n')}`;
                logger_1.default.info(logMessage);
            }
        }
        else if (topic === 'solar/panel/event') {
            const result = event_validator_1.eventPayloadSchema.safeParse(parsedPayload);
            if (result.success) {
                const logMessage = `[MQTT]

Payload Valid

Topic:
${topic}

Payload:
${JSON.stringify(result.data, null, 2)}`;
                logger_1.default.info(logMessage);
            }
            else {
                const reasons = result.error.errors.map((err) => err.message);
                const logMessage = `[MQTT]

Payload Invalid

Reason:
${reasons.map((r) => `- ${r}`).join('\n')}`;
                logger_1.default.info(logMessage);
            }
        }
        else {
            logger_1.default.warn(`[MQTT] Received message on unknown topic: ${topic}`);
        }
    }
    catch (error) {
        logger_1.default.error(`Error processing MQTT message on topic ${topic}: ${error.message}`, { error });
    }
};
exports.handleMQTTMessage = handleMQTTMessage;
