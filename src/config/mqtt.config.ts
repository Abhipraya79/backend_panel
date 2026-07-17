import mqtt from 'mqtt';
import { env } from './env';
import logger from '../utils/logger';

const brokerUrl = `mqtt://${env.MQTT_HOST}:${env.MQTT_PORT}`;

const options: mqtt.IClientOptions = {
  clientId: env.MQTT_CLIENT_ID,
  clean: true,
  connectTimeout: 10000,
  reconnectPeriod: 1000,
};

if (env.MQTT_USERNAME) {
  options.username = env.MQTT_USERNAME;
}

if (env.MQTT_PASSWORD) {
  options.password = env.MQTT_PASSWORD;
}

logger.info(`Connecting to MQTT Broker at ${brokerUrl}...`);
const mqttClient = mqtt.connect(brokerUrl, options);

mqttClient.on('connect', () => {
  logger.info('[MQTT CONNECTED]');
});

mqttClient.on('error', (err) => {
  logger.error(`MQTT Connection Error: ${err.message}`, { err });
});

mqttClient.on('offline', () => {
  logger.warn('[MQTT DISCONNECTED]');
});

mqttClient.on('reconnect', () => {
  logger.info('[MQTT RECONNECTED]');
});

export { mqttClient };
