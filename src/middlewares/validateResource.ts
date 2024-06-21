// middleware/validateResource.ts
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnyZodObject, ZodRawShape, ZodType } from 'zod';
import CustomError from '../shared/error-handling/CustomError';

// Define a utility type to infer the schema type
type ZodSchemaType<T extends AnyZodObject | undefined> = T extends ZodType<infer U>
  ? U
  : ZodRawShape;

interface ValidationSchemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

// Utility function to validate a request using Zod
export default function validateResource<T extends ValidationSchemas>(schemas: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body as ZodSchemaType<T['body']>);

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
    }

    next();
  };
}
