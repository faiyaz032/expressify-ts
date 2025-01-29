// middleware/requestLogger.ts
import { NextFunction, Response } from 'express';

import logger from '../shared/logger';
import { RequestWithId } from './addRequestId';

export default function requestLogger(req: RequestWithId, res: Response, next: NextFunction) {
  const start = Date.now();

  // Skip logging for health check or metrics endpoints
  if (req.method === 'GET' && (req.url === '/health' || req.url === '/metrics')) {
    return next();
  }

  // Get the request ID from headers
  const requestId = res.get('x-request-id') as string;

  // Capture the original end function
  const originalEnd = res.end;

  // Override the end function
  res.end = function (chunk?: any, encoding?: any, callback?: any): any {
    // Restore the original end function
    res.end = originalEnd;

    // Call the original end function
    res.end(chunk, encoding, callback);

    // Calculate response time
    const responseTime = Date.now() - start;

    // Use the custom logRequest method with request ID and additional info
    logger.logRequest(req, res, responseTime, requestId);
  };

  next();
}
