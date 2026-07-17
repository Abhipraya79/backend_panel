"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../utils/appError");
const logger_1 = __importDefault(require("../utils/logger"));
const env_1 = require("../config/env");
const errorHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';
    let stack = undefined;
    if (err instanceof appError_1.AppError) {
        statusCode = err.statusCode;
        errorCode = err.errorCode;
        message = err.message;
        stack = err.stack;
    }
    else if (err.name === 'ValidationError' || err.constructor.name === 'ZodError') {
        // Handle validation errors (e.g. from zod schemas)
        statusCode = 400;
        errorCode = 'VALIDATION_ERROR';
        message = err.message;
        stack = err.stack;
    }
    else {
        // Programmer or system errors
        message = env_1.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';
        stack = err.stack;
    }
    // Log error using Winston
    if (statusCode >= 500) {
        logger_1.default.error(`[500 Server Error] - Message: ${err.message}`, { stack });
    }
    else {
        logger_1.default.warn(`[Client Error] - Code: ${errorCode} - Message: ${message}`);
    }
    // Format standard API response as per PRD
    res.status(statusCode).json({
        success: false,
        message,
        error: {
            code: errorCode,
            ...(env_1.env.NODE_ENV === 'development' && { stack }), // optional extra info in development
        },
    });
};
exports.errorHandler = errorHandler;
