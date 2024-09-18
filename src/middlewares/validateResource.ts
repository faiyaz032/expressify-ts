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
    const errorDetails: Array<{ field: string; message: string; location: string }> = [];

    let statusCode = StatusCodes.BAD_REQUEST; // Default status code

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        statusCode = StatusCodes.UNPROCESSABLE_ENTITY; // Set status code for body validation failure
        errorDetails.push(
          ...result.error.errors.map((e) => ({
            field: e.path.join('.'),
            location: 'body',
            message: e.message,
          }))
        );
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errorDetails.push(
          ...result.error.errors.map((e) => ({
            field: e.path.join('.'),
            location: 'query',
            message: e.message,
          }))
        );
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errorDetails.push(
          ...result.error.errors.map((e) => ({
            field: e.path.join('.'),
            location: 'params',
            message: e.message,
          }))
        );
      }
    }

    if (errorDetails.length > 0) {
      return next(new CustomError(statusCode, 'Validation failed', errorDetails));
    }

    next();
  };
}
