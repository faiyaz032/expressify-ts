import 'reflect-metadata';
import { Logger } from 'winston';
import Server from './app/server';
import { registerDependencies, resolve } from './registry';
import { loggerToken } from './shared/tokens';

async function bootstrap() {
  try {
    registerDependencies();
    const logger = resolve<Logger>(loggerToken);

    logger.info('Starting server initialization...');

    // Register all dependencies

    // Resolve the server instance from the container
    logger.info('Resolving server instance...');
    const server = resolve<Server>(Server);

    logger.info('Starting server...');
    const info = await server.run();

    logger.info(`Server is successfully running`, {
      port: info.port,
      address: info.address,
      environment: resolve<any>('CoreConfig').environment,
    });
  } catch (error: any) {
    const logger = resolve<Logger>(loggerToken);
    logger.error('Fatal error during server startup:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  const logger = resolve<Logger>(loggerToken);
  logger.error('Top level error:', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
