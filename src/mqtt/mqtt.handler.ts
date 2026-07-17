import logger from '../utils/logger';
import { telemetryPayloadSchema } from '../validators/telemetry.validator';
import { statusPayloadSchema } from '../validators/status.validator';
import { eventPayloadSchema } from '../validators/event.validator';
import { TelemetryService } from '../services/telemetry.service';

export const handleMQTTMessage = async (topic: string, message: Buffer): Promise<void> => {
  const payloadStr = message.toString();

  try {
    let parsedPayload: any;
    try {
      parsedPayload = JSON.parse(payloadStr);
    } catch {
      // If payload is not valid JSON, print invalid payload message with reason
      const logMessage = `[MQTT]\n\nPayload Invalid\n\nReason:\n- Payload is not a valid JSON string`;
      logger.info(logMessage);
      return;
    }

    if (topic === 'solar/panel/telemetry') {
      const result = telemetryPayloadSchema.safeParse(parsedPayload);
      if (result.success) {
        const logMessage = `[MQTT]

Payload Valid

Topic:
${topic}

Payload:
${JSON.stringify(result.data, null, 2)}`;
        logger.info(logMessage);

        // Forward to TelemetryService
        await TelemetryService.saveTelemetry(result.data, topic);
      } else {
        const reasons = result.error.errors.map((err) => err.message);
        const logMessage = `[MQTT]

Payload Invalid

Reason:
${reasons.map((r) => `- ${r}`).join('\n')}`;
        logger.info(logMessage);
      }
    } else if (topic === 'solar/panel/status') {
      const result = statusPayloadSchema.safeParse(parsedPayload);
      if (result.success) {
        const logMessage = `[MQTT]

Payload Valid

Topic:
${topic}

Payload:
${JSON.stringify(result.data, null, 2)}`;
        logger.info(logMessage);
      } else {
        const reasons = result.error.errors.map((err) => err.message);
        const logMessage = `[MQTT]

Payload Invalid

Reason:
${reasons.map((r) => `- ${r}`).join('\n')}`;
        logger.info(logMessage);
      }
    } else if (topic === 'solar/panel/event') {
      const result = eventPayloadSchema.safeParse(parsedPayload);
      if (result.success) {
        const logMessage = `[MQTT]

Payload Valid

Topic:
${topic}

Payload:
${JSON.stringify(result.data, null, 2)}`;
        logger.info(logMessage);
      } else {
        const reasons = result.error.errors.map((err) => err.message);
        const logMessage = `[MQTT]

Payload Invalid

Reason:
${reasons.map((r) => `- ${r}`).join('\n')}`;
        logger.info(logMessage);
      }
    } else {
      logger.warn(`[MQTT] Received message on unknown topic: ${topic}`);
    }
  } catch (error: any) {
    logger.error(`Error processing MQTT message on topic ${topic}: ${error.message}`, { error });
  }
};
