import express from 'express';
import type { Express } from 'express';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { createRequire } from 'module';
import { corsMiddleware, requestLogger, errorHandler } from './middleware.js';
import skillsRouter from './routes/skills.js';
import configRouter from './routes/config.js';

const require = createRequire(import.meta.url);

function resolveDashboardDist(): string | null {
  try {
    const pkgPath = require.resolve('@skillscan/dashboard/package.json');
    const distDir = join(dirname(pkgPath), 'dist');
    return existsSync(distDir) ? distDir : null;
  } catch {
    return null;
  }
}

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

  // Serve dashboard static files
  const dashboardDist = resolveDashboardDist();
  if (dashboardDist) {
    app.use(express.static(dashboardDist));
    // SPA fallback: serve index.html for non-API routes
    app.get('*', (_req, res) => {
      res.sendFile(join(dashboardDist, 'index.html'));
    });
  }

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}
