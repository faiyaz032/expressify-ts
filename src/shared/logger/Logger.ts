import { Request, Response } from 'express';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import configs from '../../configs';
import { ILogger, LoggerConfig } from './logger.types';

export class Logger implements ILogger {
  private logger: winston.Logger;
  private config: LoggerConfig;

  constructor() {
    // Set default config first
    this.config = {
      level: 'info',
      logDirectory: 'logs',
      maxFileSize: '20m',
      maxFiles: '14d',
      datePattern: 'YYYY-MM-DD',
      environment: process.env.NODE_ENV || 'development',
    };

    // Try to load config from configs, fallback to defaults if fails
    try {
      this.config = {
        level: configs.get('logger.level') || this.config.level,
        logDirectory: configs.get('logger.logDirectory') || this.config.logDirectory,
        maxFileSize: configs.get('logger.maxFileSize') || this.config.maxFileSize,
        maxFiles: configs.get('logger.maxFiles') || this.config.maxFiles,
        datePattern: configs.get('logger.datePattern') || this.config.datePattern,
        environment: configs.get('logger.environment') || this.config.environment,
      };
    } catch (error) {
      console.warn('Failed to load logger config, using defaults:', error);
    }

    // Initialize logger after config is set
    this.logger = this.initializeLogger();
  }

  private initializeLogger(): winston.Logger {
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

    return winston.createLogger({
      levels: logLevels,
      level: this.config.environment === 'production' ? 'http' : 'debug',
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
          level: 'http', // Set to 'http' to log HTTP level messages
        }),
        new DailyRotateFile({
          filename: `${this.config.logDirectory}/application-%DATE%.log`,
          datePattern: this.config.datePattern,
          maxSize: this.config.maxFileSize,
          maxFiles: this.config.maxFiles,
          format: fileFormat,
          level: 'info',
        }),
        new DailyRotateFile({
          filename: `${this.config.logDirectory}/requests-%DATE%.log`,
          datePattern: this.config.datePattern,
          maxSize: this.config.maxFileSize,
          maxFiles: this.config.maxFiles,
          level: 'http',
          format: fileFormat,
        }),
        new DailyRotateFile({
          filename: `${this.config.logDirectory}/error-%DATE%.log`,
          datePattern: this.config.datePattern,
          maxSize: this.config.maxFileSize,
          maxFiles: this.config.maxFiles,
          level: 'error',
          format: fileFormat,
        }),
      ],
    });
  }

  error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }

  info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  http(message: string, ...meta: any[]): void {
    this.logger.http(message, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }

  logRequest(req: Request, res: Response, responseTime: number, requestId: string): void {
    const logData = {
      requestId,
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

    this.http('HTTP Request', logData);
  }

  logError(error: any, requestId: string, req: Request): void {
    const logData = {
      success: false,
      requestId,
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

    this.error('Error Occurred', logData);
  }
}
