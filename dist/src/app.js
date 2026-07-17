"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const appError_1 = require("./utils/appError");
const logger_1 = require("./utils/logger");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
// 1. Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*', // Customize this as per production requirements (e.g., specific Flutter Web/Staging domains)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// 2. Logging Middleware (Morgan integrated with Winston)
const morganFormat = env_1.env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use((0, morgan_1.default)(morganFormat, { stream: logger_1.stream }));
// 3. Body Parser Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 4. API Routes
app.use('/', routes_1.default);
// 5. Fallback 404 Route Handler
app.use((_req, _res, next) => {
    next(new appError_1.AppError('The requested resource could not be found.', 404, 'NOT_FOUND'));
});
// 6. Centralized Error Handler Middleware
app.use(errorHandler_1.errorHandler);
exports.default = app;
