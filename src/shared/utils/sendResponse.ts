import { Response } from 'express';

const sendResponse = (res: Response, statusCode: number, message: string, data?: any, pagination?: any): void => {
  // Uncomment if logger is imported or defined
  // logger.info(message, {
  //   responseCode: statusCode,
  //   url: res.req.originalUrl,
  //   headers: res.req.headers,
  //   body: res.req.body ? res.req.body : null,
  // });

  const responseObject: any = {
    success: true,
    statusCode,
    message,
    requestId: res.get('x-request-id'),
  };

  if (data !== undefined) {
    responseObject.data = data;
  }
  if (pagination !== undefined) {
    responseObject.pagination = pagination;
  }

  res.status(statusCode).json(responseObject);
};

export default sendResponse;
