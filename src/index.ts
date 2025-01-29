import AppFactory from './app/app';
import Server from './app/server';
import configs from './configs';
import Database from './shared/database';
import AppErrorHandler from './shared/error-handling';
import logger from './shared/logger';

async function runServer() {
  try {
    logger.info('Starting server initialization...');

    // Log config values (sanitize sensitive data)
    logger.info('Loading configuration...', {
      port: configs.get('port'),
      environment: configs.get('environment'),
    });

    const config = { port: configs.get('port'), environment: configs.get('environment') };

    logger.info('Initializing components...');
    const database = new Database();
    const errorHandler = new AppErrorHandler(logger, {
      exitOnUnhandledErrors: true,
      gracefulShutdownTimeout: 10000,
    });
    const appFactory = new AppFactory();

    logger.info('Creating server instance...');
    const server = new Server(appFactory, config, database, errorHandler);

    logger.info('Starting server...');
    const info = await server.run();

    logger.info(`Server is successfully running`, {
      port: info.port,
      address: info.address,
      environment: config.environment,
    });
  } catch (error: any) {
    logger.error('Fatal error during server startup:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
    process.exit(1);
  }
}

runServer().catch((error) => {
  logger.error('Top level error:', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
