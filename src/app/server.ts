import { Application } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { inject, singleton } from 'tsyringe';
import Database from '../shared/database';
import AppErrorHandler from '../shared/error-handling';
import { Logger } from '../shared/logger/Logger';
import { loggerToken } from '../shared/tokens';
import AppFactory from './app'; // Assuming './app' exports an object with a method `createApp`

interface ServerDto {
  port: number;
  address: string;
}

@singleton()
class Server {
  constructor(
    private readonly appFactory: AppFactory,
    private readonly config: { port: number; environment: string },
    private readonly database: Database,
    private readonly errorHandler: AppErrorHandler,
    @inject(loggerToken) private readonly logger: Logger
  ) {
    this.logger.info('Server instance created with config:', {
      port: config.port,
      environment: config.environment,
    });
  }
  private connection: HTTPServer | undefined;

  public async run(): Promise<ServerDto> {
    try {
      this.logger.info('Creating Express application...');
      const expressApp = this.appFactory.createApp(this.errorHandler);

      this.logger.info('Opening HTTP server connection...');
      const server = await this.openConnection(expressApp);

      this.logger.info('Connecting to database...');
      await this.database.connect();

      return server;
    } catch (error: any) {
      this.logger.error('Error in server.run():', {
        error: error.message,
        stack: error.stack,
      });
      throw error; // Re-throw to be handled by the top-level error handler
    }
  }

  public async terminate(): Promise<void> {
    this.logger.info('Terminating server...');
    return new Promise<void>((resolve) => {
      if (this.connection !== undefined) {
        this.connection.close(() => {
          this.logger.info('Server terminated successfully');
          resolve();
        });
      } else {
        this.logger.warn('No connection to terminate');
        resolve();
      }
    });
  }

  private async openConnection(expressApp: Application): Promise<ServerDto> {
    return new Promise((resolve, reject) => {
      try {
        const server = createServer(expressApp);

        server.on('error', (error) => {
          this.logger.error('Server creation error:', {
            error: error.message,
            stack: error instanceof Error ? error.stack : undefined,
          });
          reject(error);
        });

        this.connection = server.listen(this.config.port, () => {
          this.logger.info(`Server listening in ${this.config.environment} mode`);
          this.errorHandler.listenToErrorEvents(this.connection as HTTPServer);

          const address = this.connection?.address();
          if (address && typeof address !== 'string') {
            resolve({
              port: address.port,
              address: address.address,
            });
          } else {
            const error = new Error('Failed to get server address');
            this.logger.error('Address resolution error:', { error });
            reject(error);
          }
        });
      } catch (error: any) {
        this.logger.error('Error in openConnection:', {
          error: error.message,
          stack: error.stack,
        });
        reject(error);
      }
    });
  }
}

export default Server;
