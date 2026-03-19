import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';

/**
 * CORS middleware - allow all origins for local development
 */
export const corsMiddleware = cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  console.log(`${req.method} ${req.path}`);
  next();
}

/**
 * Error handling middleware
 * Catches errors and returns JSON response with appropriate status
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err.message);

  // Determine status code - default to 500
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: err.message || 'Internal server error',
  });
}
