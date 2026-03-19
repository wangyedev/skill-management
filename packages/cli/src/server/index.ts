import express from 'express';
import type { Express } from 'express';
import { corsMiddleware, requestLogger, errorHandler } from './middleware.js';
import skillsRouter from './routes/skills.js';
import configRouter from './routes/config.js';

/**
 * Create and configure Express application
 */
export function createApp(): Express {
  const app = express();

  // Apply middleware
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(requestLogger);

  // Mount routes
  app.use('/api', skillsRouter);
  app.use('/api', configRouter);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}
