import { Router } from 'express';
import { getLatestTelemetry, getTelemetryHistory } from '../controllers/telemetry.controller';

const router = Router();

router.get('/latest', getLatestTelemetry);
router.get('/history', getTelemetryHistory);

export default router;
