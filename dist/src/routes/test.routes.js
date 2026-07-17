"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mqtt_test_1 = require("../mqtt/mqtt-test");
const router = (0, express_1.Router)();
// POST /test/mqtt
router.post('/mqtt', (req, res) => {
    const body = req.body;
    // If the body contains specific 'topic' and 'payload' properties, use them,
    // otherwise default to 'solar/panel/telemetry' and treat the entire body as payload.
    const topic = body.topic || 'solar/panel/telemetry';
    const payload = body.payload !== undefined ? body.payload : body;
    try {
        (0, mqtt_test_1.publishTest)(topic, payload);
        res.status(200).json({
            success: true,
            message: 'Successfully processed and published test message.',
            topic,
            payload,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to publish test message.',
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.default = router;
