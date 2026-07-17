import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let stack: string | undefined = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    stack = err.stack;
  } else if (err.name === 'ValidationError' || err.constructor.name === 'ZodError') {
    // Handle validation errors (e.g. from zod schemas)
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = err.message;
    stack = err.stack;
  } else {
    // Programmer or system errors
    message = env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';
    stack = err.stack;
  }

  // Log error using Winston
  if (statusCode >= 500) {
    logger.error(`[500 Server Error] - Message: ${err.message}`, { stack });
  } else {
    logger.warn(`[Client Error] - Code: ${errorCode} - Message: ${message}`);
  }

  // Format standard API response as per PRD
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: errorCode,
      ...(env.NODE_ENV === 'development' && { stack }), // optional extra info in development
    },
  });
};
