import { Application, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppErrorHandler from '../shared/error-handling';
import logger from '../shared/logger';

interface ResponseData {
  success: boolean;
  statusCode: number;
  errors: {
    message: string;
    details?: Array<{ field: string; message: string; location: string }>;
  };
  operational?: boolean;
  requestId?: string;
  stack?: string;
}

export default function globalErrorHandler(expressApp: Application, errorHandler: AppErrorHandler) {
  expressApp.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.log('🚀 ~ expressApp.use ~ error:', error);
    if (error && typeof error === 'object') {
      if (error.operational === undefined || error.operational === null) {
        error.operational = true;
      }
    }

    const requestId = res.get('X-Request-Id')!;

    errorHandler.handleError(error);

    const responseData: ResponseData = {
      success: error.success || false,
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      errors: error.errors || { message: 'An unexpected error occurred' }, // Use the new structure
      operational: error.operational,
      requestId: res.get('X-Request-Id'),
    };
    // Log the error details
    logger.logError(error, requestId, req);
    // Check if NODE_ENV is set to 'development'
    if (process.env.NODE_ENV === 'development') {
      // Include stack trace in response
      responseData.stack = error.stack || new Error().stack;
    }

    res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responseData);
  });
}
