import { Request, Response } from 'express';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Extend the Winston Logger interface
interface CustomLogger extends winston.Logger {
  logRequest(req: Request, res: Response, responseTime: number, requestId: string): void;
  logError(error: any, requestId: string, req: Request): void; // New method
}

class LoggerManager {
  static createLogger(): CustomLogger {
    const logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
    };

    const colors = {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      http: 'magenta',
      debug: 'blue',
    };

    winston.addColors(colors);

    const consoleFormat = winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} ${level}: ${message} ${metaStr}`;
      })
    );

    const fileFormat = winston.format.combine(winston.format.timestamp(), winston.format.json());

    const logger = winston.createLogger({
      levels: logLevels,
      level: process.env.NODE_ENV === 'production' ? 'http' : 'debug',
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
          level: 'http', // Set back to 'http' to log HTTP requests to the console
        }),
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log', // Store application logs in application.log
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: fileFormat,
          level: 'info', // Store info level and above in application.log
        }),
        new DailyRotateFile({
          filename: 'logs/requests-%DATE%.log', // Store HTTP requests in request.log
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'http', // Store HTTP requests in request.log
          format: fileFormat,
        }),
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
          format: fileFormat,
        }),
      ],
    }) as CustomLogger;

    // Add the custom logRequest method
    logger.logRequest = (req: Request, res: Response, responseTime: number, requestId: string) => {
      const logData = {
        requestId: requestId,
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        headers: req.headers,
        query: req.query,
        body: req.method !== 'GET' && req.method !== 'DELETE' ? req.body : undefined,
      };

      logger.http('HTTP Request', logData); // This will go to both console and request.log
    };

    // Add the custom logError method
    logger.logError = (error: any, requestId: string, req: Request) => {
      const logData = {
        success: false,
        requestId: requestId,
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        statusCode: error.statusCode || 500,
        message: error.message,
        stack: error.stack,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        headers: req.headers,
        query: req.query,
        body: req.body,
      };

      logger.error('Error Occurred', logData); // This will go to both console and error logs
    };

    return logger;
  }
}

const logger = LoggerManager.createLogger();

export default logger;
