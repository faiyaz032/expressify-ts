import http from 'http';
import { StatusCodes } from 'http-status-codes';
import util from 'util';
import logger from '../logger/LoggerManager';
import CustomError from './CustomError';

class AppErrorHandler {
  private httpServerRef: http.Server | null = null;

  public listenToErrorEvents(httpServer: http.Server): void {
    this.httpServerRef = httpServer;

    process.on('uncaughtException', async (error: Error) => {
      logger.error('Uncaught Exception:', error);
      await this.handleError(error);
    });

    process.on('unhandledRejection', async (reason: unknown) => {
      logger.error('Unhandled Rejection:', reason);
      await this.handleError(reason);
    });

    process.on('SIGTERM', async () => {
      logger.error('Received SIGTERM. Terminating server...');
      await this.terminateServer();
    });

    process.on('SIGINT', async () => {
      logger.error('Received SIGINT. Terminating server...');
      await this.terminateServer();
    });
  }

  public async handleError(error: unknown): Promise<void> {
    try {
      const appError = this.normalizeError(error);

      if (!appError.operational) {
        await this.terminateServer();
      }
    } catch (handlingError) {
      logger.error('The error handler failed.');
      process.stdout.write(
        'The error handler failed. Here are the handler failure and then the origin error that it tried to handle: '
      );
      process.stdout.write(JSON.stringify(handlingError));
      process.stdout.write(JSON.stringify(error));
    }
  }

  private async terminateServer(): Promise<void> {
    if (this.httpServerRef) {
      logger.warn('Gracefully shutting down the server...');
      await new Promise((resolve) => this.httpServerRef!.close(resolve)); // Graceful shutdown
      logger.warn('Server closed.');
    }
    console.log('Exiting process.');
    process.exit();
  }

  private normalizeError(error: unknown): CustomError {
    if (error instanceof CustomError) {
      return error;
    }
    if (error instanceof Error) {
      return new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }

    const inputType = typeof error;
    return new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Error Handler received a non-error instance with type - ${inputType}, value - ${util.inspect(
        error
      )}`
    );
  }
}

export default AppErrorHandler;
