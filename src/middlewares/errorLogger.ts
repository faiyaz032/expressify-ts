// middleware/errorLogger.ts
import { NextFunction, Request, Response } from 'express';
import { resolve } from '../registry';
import { Logger } from '../shared/logger/Logger';
import { loggerToken } from '../shared/tokens';

export function errorLogger(err: any, req: Request, res: Response, next: NextFunction) {
  const requestId = res.getHeader('X-Request-Id') as string;
  resolve<Logger>(loggerToken).logError(err, requestId, req);
  next(err);
}
