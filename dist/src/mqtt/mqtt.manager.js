"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMQTT = void 0;
const mqtt_config_1 = require("../config/mqtt.config");
const logger_1 = __importDefault(require("../utils/logger"));
const mqtt_handler_1 = require("./mqtt.handler");
const TOPICS = {
    TELEMETRY: 'solar/panel/telemetry',
    STATUS: 'solar/panel/status',
    EVENT: 'solar/panel/event',
};
const initializeMQTT = () => {
    const topicsToSubscribe = Object.values(TOPICS);
    const subscribeToTopics = () => {
        mqtt_config_1.mqttClient.subscribe(topicsToSubscribe, { qos: 1 }, (err) => {
            if (err) {
                logger_1.default.error('Failed to subscribe to MQTT topics', { err, topics: topicsToSubscribe });
                return;
            }
            logger_1.default.info('[MQTT SUBSCRIBED]');
        });
    };
    // If already connected, subscribe immediately
    if (mqtt_config_1.mqttClient.connected) {
        subscribeToTopics();
    }
    // Register connect handler to subscribe on connection/reconnection
    mqtt_config_1.mqttClient.on('connect', () => {
        subscribeToTopics();
    });
    // Handle incoming messages
    mqtt_config_1.mqttClient.on('message', (topic, message) => {
        (0, mqtt_handler_1.handleMQTTMessage)(topic, message).catch((err) => {
            logger_1.default.error(`Error in handleMQTTMessage for topic ${topic}: ${err.message}`, { err });
        });
    });
};
exports.initializeMQTT = initializeMQTT;
