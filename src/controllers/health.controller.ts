import { Request, Response, NextFunction } from 'express';

export const getHealth = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    res.status(200).json({
      status: 'ok',
      service: 'solar-backend',
      time: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
