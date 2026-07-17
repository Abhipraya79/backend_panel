import { mqttClient } from '../config/mqtt.config';
import logger from '../utils/logger';

export const publishTest = (topic: string, payload: unknown): void => {
  const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
  mqttClient.publish(topic, payloadStr, { qos: 1 }, (err) => {
    if (err) {
      logger.error(`[MQTT PUBLISH ERROR] Failed to publish to ${topic}`, { err });
    } else {
      logger.info(`[MQTT PUBLISHED] Topic: ${topic}`);
    }
  });
};
