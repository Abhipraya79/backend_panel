import { Router, Request, Response } from 'express';
import { publishTest } from '../mqtt/mqtt-test';

const router = Router();

// POST /test/mqtt
router.post('/mqtt', (req: Request, res: Response) => {
  const body = req.body;
  // If the body contains specific 'topic' and 'payload' properties, use them,
  // otherwise default to 'solar/panel/telemetry' and treat the entire body as payload.
  const topic = body.topic || 'solar/panel/telemetry';
  const payload = body.payload !== undefined ? body.payload : body;

  try {
    publishTest(topic, payload);

    res.status(200).json({
      success: true,
      message: 'Successfully processed and published test message.',
      topic,
      payload,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to publish test message.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
