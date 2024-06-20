import { NextFunction, Request, Response } from 'express';
import logger from '../shared/logger/LoggerManager';

export default function requestLogger(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET' && req.url === '/metrics') {
    return next();
  }
  const start = Date.now();

  // Log request details including method, URL, and headers
  if (process.env.NODE_ENV === 'production') {
    logger.info(`Request: ${req.method} ${req.originalUrl}`);
    logger.info('Request Headers:', req.headers);
  }

  res.on('finish', () => {
    const responseTime = Date.now() - start;
    const { statusCode } = res;
    const { method, originalUrl } = req;
    // Log response status code, request method, URL, and response time
    logger.info(`${method} ${originalUrl} - Response: ${statusCode} [${responseTime}ms]`);
  });

  next();
}
