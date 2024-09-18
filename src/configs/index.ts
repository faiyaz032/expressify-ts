import dotenv from 'dotenv';
import path from 'path';
import logger from '../shared/logger/LoggerManager';

class ConfigManager {
  private config: any;

  constructor() {
    try {
      this.loadConfig();
    } catch (error) {
      logger.error('Error loading configuration:', error);
      process.exit(1);
    }
  }

  private loadConfig(): void {
    const nodeEnv = process.env.NODE_ENV || 'development';

    const envFile = `.env.${nodeEnv}`;
    const envFilePath = path.resolve(process.cwd(), envFile);

    try {
      const result = dotenv.config({ path: envFilePath });

      if (result.error) {
        throw result.error;
      }

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

      this.config = configModule;
    } catch (error: any) {
      logger.error(`Error loading ${envFile}:`, error);
      throw error.message;
    }
  }

  get(key: string): any {
    if (!this.config[key]) {
      throw new Error(`No value exists for ${key} in ${process.env.NODE_ENV} config files`);
    }
    return this.config[key];
  }
}

const appConfig = new ConfigManager();

export default appConfig;
