import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface RequestWithId extends Request {
  requestId?: string;
}

export default function addRequestId(req: RequestWithId, res: Response, next: NextFunction) {
  req.requestId = uuidv4();
  res.setHeader('X-Request-Id', req.requestId);
  next();
}
