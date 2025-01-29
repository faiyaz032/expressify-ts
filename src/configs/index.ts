// config/ConfigManager.ts
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'path';

// Simple console logger for initialization phase
const initLogger = {
  error: (...args: any[]) => console.error('[Config]', ...args),
  info: (...args: any[]) => console.info('[Config]', ...args),
};

class ConfigManager {
  private config: Record<string, any> = {};

  constructor() {
    try {
      this.loadConfig();
    } catch (error) {
      initLogger.error('Error loading configuration:', error);
      throw error;
    }
  }

  private loadConfig(): void {
    const nodeEnv = process.env.NODE_ENV || 'development';

    const envFile = `.env.${nodeEnv}`;
    const envFilePath = path.resolve(process.cwd(), envFile);

    try {
      const result = dotenv.config({ path: envFilePath });
      dotenvExpand.expand(result);

      if (result.error) {
        throw result.error;
      }

      // Default logger config in case of circular dependency
      const defaultLoggerConfig = {
        level: process.env.LOG_LEVEL || 'info',
        logDirectory: process.env.LOG_DIRECTORY || 'logs',
        maxFileSize: process.env.LOG_MAX_SIZE || '20m',
        maxFiles: process.env.LOG_MAX_FILES || '14d',
        datePattern: process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD',
        environment: nodeEnv,
      };

      // Load environment-specific config
      let configModule;
      switch (nodeEnv) {
        case 'production':
          configModule = require('./production').default;
          break;
        case 'staging':
          configModule = require('./staging').default;
          break;
        case 'development':
        default:
          configModule = require('./development').default;
          break;
      }

      // Ensure logger config exists
      this.config = {
        ...configModule,
        logger: {
          ...defaultLoggerConfig,
          ...configModule.logger,
        },
      };
    } catch (error) {
      initLogger.error(`Error loading ${envFile}:`, error);
      throw error;
    }
  }

  get(key: string): any {
    try {
      return key.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object' && part in acc) {
          return acc[part];
        }
        throw new Error(`Configuration key '${key}' not found`);
      }, this.config);
    } catch (error) {
      // Special handling for logger config during initialization
      if (key.startsWith('logger.')) {
        const defaultValues: Record<string, any> = {
          'logger.level': 'info',
          'logger.logDirectory': 'logs',
          'logger.maxFileSize': '20m',
          'logger.maxFiles': '14d',
          'logger.datePattern': 'YYYY-MM-DD',
          'logger.environment': process.env.NODE_ENV || 'development',
        };
        if (key in defaultValues) {
          return defaultValues[key];
        }
      }
      throw error;
    }
  }
}

// Export a singleton instance
export default new ConfigManager();
