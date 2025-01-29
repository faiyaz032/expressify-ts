import AppFactory from './app/app';
import Server from './app/server';
import Database from './shared/database';
import AppErrorHandler from './shared/error-handling';
import logger from './shared/logger';

async function runServer() {
  const config = { port: 6969, environment: 'development' };
  const database = new Database();
  const errorHandler = new AppErrorHandler(logger, {
    exitOnUnhandledErrors: true,
    gracefulShutdownTimeout: 10000,
  });

  const appFactory = new AppFactory();

  try {
    const server = new Server(appFactory, config, database, errorHandler);
    const info = await server.run();

    logger.info(`Server is successfully alive on PORT: ${info.port}`);
  } catch (error: any) {
    logger.error('Error running server:', error);
  }
}

runServer().catch((error) => {
  logger.error(error);
});
