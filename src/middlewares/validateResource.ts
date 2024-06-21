// middleware/validateResource.ts
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
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        const errorMessages = result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          location: 'body',
        }));
        return next(
          new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, JSON.stringify(errorMessages))
        );
      }
      req.body = result.data;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        const errorMessages = result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          location: 'query',
        }));
        return next(new CustomError(StatusCodes.BAD_REQUEST, JSON.stringify(errorMessages)));
      }
      req.query = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        const errorMessages = result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          location: 'params',
        }));
        return next(new CustomError(StatusCodes.BAD_REQUEST, JSON.stringify(errorMessages)));
      }
      req.params = result.data;
    }

    next();
  };
}
