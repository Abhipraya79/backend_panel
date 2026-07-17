"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishTest = void 0;
const mqtt_config_1 = require("../config/mqtt.config");
const logger_1 = __importDefault(require("../utils/logger"));
const publishTest = (topic, payload) => {
    const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
    mqtt_config_1.mqttClient.publish(topic, payloadStr, { qos: 1 }, (err) => {
        if (err) {
            logger_1.default.error(`[MQTT PUBLISH ERROR] Failed to publish to ${topic}`, { err });
        }
        else {
            logger_1.default.info(`[MQTT PUBLISHED] Topic: ${topic}`);
        }
    });
};
exports.publishTest = publishTest;
