// middleware/errorLogger.ts
import { NextFunction, Request, Response } from 'express';

import logger from '../shared/logger';

export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
  const requestId = res.getHeader('X-Request-Id') as string;
  logger.logError(err, requestId, req);
  next(err);
}
