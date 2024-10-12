import dayjs from 'dayjs';
import winston from 'winston';

class LoggerManager {
  static createLogger() {
    const customFormat = winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    });

    const logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: () => dayjs().format('YYYY-MM-DD HH:mm:ss') }),
        customFormat
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({
              all: true,
              colors: {
                info: 'green',
                error: 'red',
                warn: 'yellow',
                debug: 'blue',
              },
            }),
            customFormat
          ),
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    });

    return logger;
  }
}

const logger = LoggerManager.createLogger();

export default logger;
