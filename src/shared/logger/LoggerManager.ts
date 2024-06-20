import dayjs from 'dayjs';
import pino from 'pino';

class LoggerManager {
  static createLogger() {
    const logger = pino({
      base: {
        pid: false,
      },

      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
        },
      },
    });

    return logger;
  }
}

const logger = LoggerManager.createLogger();

export default logger;
