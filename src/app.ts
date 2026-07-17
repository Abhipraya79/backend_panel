import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/appError';
import { stream } from './utils/logger';
import { env } from './config/env';

const app: Application = express();

// 1. Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*', // Customize this as per production requirements (e.g., specific Flutter Web/Staging domains)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// 2. Logging Middleware (Morgan integrated with Winston)
const morganFormat = env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(morganFormat, { stream }));

// 3. Body Parser Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. API Routes
app.use('/', routes);

// 5. Fallback 404 Route Handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('The requested resource could not be found.', 404, 'NOT_FOUND'));
});

// 6. Centralized Error Handler Middleware
app.use(errorHandler);

export default app;
