import 'reflect-metadata';
import { container } from 'tsyringe';

import AppFactory from './app/app';
import Server from './app/server';
import configs from './configs';
import Database from './shared/database';
import AppErrorHandler from './shared/error-handling';
import { Logger } from './shared/logger/Logger';
import { loggerToken } from './shared/tokens';

/**
 * Base interface for all service configurations
 */
interface ServiceConfig {
  enabled: boolean;
}

/**
 * Configuration interface for core application services
 */
interface CoreConfig extends ServiceConfig {
  port: number;
  environment: string;
  gracefulShutdownTimeout: number;
}

/**
 * Registers core application configurations
 */
function registerConfigurations() {
  const coreConfig: CoreConfig = {
    enabled: true,
    port: configs.get('port'),
    environment: configs.get('environment'),
    gracefulShutdownTimeout: 10000,
  };

  container.register('CoreConfig', { useValue: coreConfig });
}

/**
 * Registers core application services
 * These services are fundamental to the application and are always required
 */
function registerCoreServices() {
  // Register logger as a singleton
  container.register(loggerToken, { useClass: Logger });

  // Register Database with singleton lifecycle
  container.register(Database, { useClass: Database });

  // Register AppErrorHandler with configuration
  container.register(AppErrorHandler, {
    useFactory: (container) => {
      const logger: Logger = container.resolve(loggerToken);
      return new AppErrorHandler(logger, {
        exitOnUnhandledErrors: true,
        gracefulShutdownTimeout: 10000,
      });
    },
  });

  // Register AppFactory
  container.register(AppFactory, { useClass: AppFactory });

  // Register Server with all its dependencies
  container.register(Server, {
    useFactory: (container) => {
      const appFactory = container.resolve(AppFactory);
      const database = container.resolve(Database);
      const errorHandler = container.resolve(AppErrorHandler);
      const config = container.resolve<CoreConfig>('CoreConfig');
      const logger: Logger = container.resolve(loggerToken);
      return new Server(appFactory, config, database, errorHandler, logger);
    },
  });
}

/**
 * Registers email service related dependencies
 * This is an example of how to register optional services
 */
function registerEmailService() {
  // Example for future implementation:
  // if (configs.get('email.enabled')) {
  //   container.register('EmailConfig', {
  //     useValue: {
  //       enabled: true,
  //       host: configs.get('email.host'),
  //       port: configs.get('email.port'),
  //       // ... other email configurations
  //     }
  //   });
  //   container.register('EmailService', { useClass: EmailService });
  // }
}

/**
 * Main function to register all dependencies
 * Add new service registrations here as needed
 */
export function registerDependencies() {
  try {
    // Register configurations first
    registerConfigurations();

    // Register core services
    registerCoreServices();

    // Register optional services
    registerEmailService();
  } catch (error: any) {
    console.error('Failed to register dependencies', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

/**
 * Helper function to resolve a registered dependency
 * @param token The dependency token to resolve
 * @returns The resolved dependency instance
 */
export function resolve<T>(token: any): T {
  return container.resolve<T>(token);
}
