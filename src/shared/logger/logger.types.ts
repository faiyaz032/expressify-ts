import { Request, Response } from 'express';

export type LoggerConfig = {
  level: string;
  logDirectory: string;
  maxFileSize: string;
  maxFiles: string;
  datePattern: string;
  environment: string;
};

export type LogMetadata = {
  requestId?: string;
  timestamp?: string;
  [key: string]: any;
};

export interface ILogger {
  error(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  info(message: string, ...meta: any[]): void;
  http(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
  logRequest(req: Request, res: Response, responseTime: number, requestId: string): void;
  logError(error: any, requestId: string, req: Request): void;
}
