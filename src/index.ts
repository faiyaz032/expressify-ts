import Server from './app/server';
import logger from './shared/logger/LoggerManager';

async function runServer() {
  try {
    const server = new Server();
    const info = await server.run();

    logger.info(`Server is successfully alive on PORT: ${info.port}`);
  } catch (error) {
    logger.error(error);
  }
}

runServer().catch((error) => {
  logger.error(error);
});
