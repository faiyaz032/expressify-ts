import http from 'http';
import { StatusCodes } from 'http-status-codes';
import util from 'util';
import { Logger } from '../logger/Logger';
import CustomError from './CustomError';

class AppErrorHandler {
  private httpServerRef: http.Server | null = null;

  constructor(
    private readonly logger: Logger,
    private readonly config: { exitOnUnhandledErrors: boolean; gracefulShutdownTimeout: number },
    private readonly onShutdown?: () => Promise<void>
  ) {}

  public listenToErrorEvents(httpServer: http.Server): void {
    this.httpServerRef = httpServer;

    process.on('uncaughtException', async (error: Error) => {
      this.logger.error('Uncaught Exception:', error);
      await this.handleError(error);
    });

    process.on('unhandledRejection', async (reason: unknown) => {
      this.logger.error('Unhandled Rejection:', reason);
      await this.handleError(reason);
    });

    process.on('SIGTERM', async () => {
      this.logger.warn('Received SIGTERM. Terminating server...');
      await this.terminateServer();
    });

    process.on('SIGINT', async () => {
      this.logger.warn('Received SIGINT. Terminating server...');
      await this.terminateServer();
    });
  }

  public async handleError(error: unknown): Promise<void> {
    try {
      const appError = this.normalizeError(error);

      if (!appError.operational && this.config.exitOnUnhandledErrors) {
        await this.terminateServer();
      }
    } catch (handlingError) {
      this.logger.error('The error handler failed.');
      this.logger.error('Handler failure:', handlingError);
      this.logger.error('Original error:', error);
    }
  }

  private async terminateServer(): Promise<void> {
    try {
      if (this.httpServerRef) {
        this.logger.warn('Gracefully shutting down the server...');

        // Call custom shutdown handler if provided
        if (this.onShutdown) {
          await Promise.race([
            this.onShutdown(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Shutdown timeout')), this.config.gracefulShutdownTimeout)
            ),
          ]);
        }

        // Close HTTP server
        await new Promise<void>((resolve) => {
          this.httpServerRef!.close(() => resolve());
        });

        this.logger.warn('Server closed successfully.');
      }
    } catch (error) {
      this.logger.error('Error during shutdown:', error);
    } finally {
      process.exit();
    }
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
      `Error Handler received a non-error instance with type - ${inputType}, value - ${util.inspect(error)}`
    );
  }
}

export default AppErrorHandler;
