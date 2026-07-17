"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
// Define log directory and ensure it exists (handled by our empty dir setup, but good practice to use relative pathing)
const logDir = path_1.default.join(process.cwd(), 'logs');
// Define custom levels and colors if needed, but standard NPM levels are perfect:
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
winston_1.default.addColors(colors);
// Custom format for console logs (readable, colored)
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}${info.stack ? `\n${info.stack}` : ''}`));
// File transport format (JSON format for structured logging in production)
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
// Create the logger instance
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    levels,
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'error.log'),
            level: 'error',
            format: fileFormat,
        }),
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'combined.log'),
            format: fileFormat,
        }),
        // Always write to console with pretty format
        new winston_1.default.transports.Console({
            format: consoleFormat,
        }),
    ],
});
// Create a stream object for Morgan middleware integration
exports.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};
exports.default = logger;
