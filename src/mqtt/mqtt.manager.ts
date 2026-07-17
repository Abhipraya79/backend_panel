import { mqttClient } from '../config/mqtt.config';
import logger from '../utils/logger';
import { handleMQTTMessage } from './mqtt.handler';

const TOPICS = {
  TELEMETRY: 'solar/panel/telemetry',
  STATUS: 'solar/panel/status',
  EVENT: 'solar/panel/event',
};

export const initializeMQTT = (): void => {
  const topicsToSubscribe = Object.values(TOPICS);

  const subscribeToTopics = () => {
    mqttClient.subscribe(topicsToSubscribe, { qos: 1 }, (err) => {
      if (err) {
        logger.error('Failed to subscribe to MQTT topics', { err, topics: topicsToSubscribe });
        return;
      }
      logger.info('[MQTT SUBSCRIBED]');
    });
  };

  // If already connected, subscribe immediately
  if (mqttClient.connected) {
    subscribeToTopics();
  }

  // Register connect handler to subscribe on connection/reconnection
  mqttClient.on('connect', () => {
    subscribeToTopics();
  });

  // Handle incoming messages
  mqttClient.on('message', (topic: string, message: Buffer) => {
    handleMQTTMessage(topic, message).catch((err) => {
      logger.error(`Error in handleMQTTMessage for topic ${topic}: ${err.message}`, { err });
    });
  });
};
