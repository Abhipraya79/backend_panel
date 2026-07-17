"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttClient = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const env_1 = require("./env");
const logger_1 = __importDefault(require("../utils/logger"));
const brokerUrl = `mqtt://${env_1.env.MQTT_HOST}:${env_1.env.MQTT_PORT}`;
const options = {
    clientId: env_1.env.MQTT_CLIENT_ID,
    clean: true,
    connectTimeout: 10000,
    reconnectPeriod: 1000,
};
if (env_1.env.MQTT_USERNAME) {
    options.username = env_1.env.MQTT_USERNAME;
}
if (env_1.env.MQTT_PASSWORD) {
    options.password = env_1.env.MQTT_PASSWORD;
}
logger_1.default.info(`Connecting to MQTT Broker at ${brokerUrl}...`);
const mqttClient = mqtt_1.default.connect(brokerUrl, options);
exports.mqttClient = mqttClient;
mqttClient.on('connect', () => {
    logger_1.default.info('[MQTT CONNECTED]');
});
mqttClient.on('error', (err) => {
    logger_1.default.error(`MQTT Connection Error: ${err.message}`, { err });
});
mqttClient.on('offline', () => {
    logger_1.default.warn('[MQTT DISCONNECTED]');
});
mqttClient.on('reconnect', () => {
    logger_1.default.info('[MQTT RECONNECTED]');
});
