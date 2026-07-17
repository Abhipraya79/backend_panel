"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const telemetry_controller_1 = require("../controllers/telemetry.controller");
const router = (0, express_1.Router)();
router.get('/latest', telemetry_controller_1.getLatestTelemetry);
router.get('/history', telemetry_controller_1.getTelemetryHistory);
exports.default = router;
