import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnyZodObject } from 'zod';
import CustomError from '../shared/error-handling/CustomError';

interface ValidationSchemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

// Utility function to validate a request using Zod
export default function validateResource(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errorMessages: Array<{ fields: string; message: string; location: string }> = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errorMessages.push(
          ...result.error.errors.map((e) => ({
            fields: e.path.join('.'),
            message: e.message,
            location: 'body',
          }))
        );
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errorMessages.push(
          ...result.error.errors.map((e) => ({
            fields: e.path.join('.'),
            message: e.message,
            location: 'query',
          }))
        );
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errorMessages.push(
          ...result.error.errors.map((e) => ({
            fields: e.path.join('.'),
            message: e.message,
            location: 'params',
          }))
        );
      }
    }

    if (errorMessages.length > 0) {
      return next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, JSON.stringify(errorMessages)));
    }

    next();
  };
}
