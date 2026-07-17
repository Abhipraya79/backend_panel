import { Request, Response, NextFunction } from 'express';
import { cleaningCommandSchema } from '../validators/cleaning.validator';
import { ControlService } from '../services/control.service';
import logger from '../utils/logger';

export const postCleaningCommand = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    logger.info(`[CONTROL] Control request received\n\nBody:\n${JSON.stringify(req.body, null, 2)}`);

    const parsed = cleaningCommandSchema.safeParse(req.body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ');
      res.status(400).json({
        success: false,
        message: `Validation failed: ${errors}`,
      });
      return;
    }

    const result = await ControlService.publishCleaningCommand(parsed.data);
    logger.info(`[CONTROL] HTTP response sent\n\nStatus: 200\n\nPayload:\n${JSON.stringify(result, null, 2)}`);

    res.status(200).json({
      success: true,
      message: 'Cleaning command published successfully',
      mqtt: result.mqtt,
      firestore: result.firestore,
    });
  } catch (error: any) {
    logger.error(`[CONTROL] POST /api/control/cleaning - Error: ${error.message}`, { error });

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};
