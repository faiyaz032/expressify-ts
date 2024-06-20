import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../shared/error-handling/CustomError';

export default function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next(
    new CustomError(
      StatusCodes.NOT_FOUND,
      `Can't find your requested url: '${req.originalUrl}' in the server`
    )
  );
}
