import { Application } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import Database from '../shared/database';
import AppErrorHandler from '../shared/error-handling';
import logger from '../shared/logger';
import AppFactory from './app'; // Assuming './app' exports an object with a method `createApp`

interface ServerDto {
  port: number;
  address: string;
}

class Server {
  constructor(
    private readonly appFactory: AppFactory,
    private readonly config: { port: number; environment: string },
    private readonly database: Database,
    private readonly errorHandler: AppErrorHandler
  ) {}
  private connection: HTTPServer | undefined;

  public async run(): Promise<ServerDto> {
    const expressApp = this.appFactory.createApp(this.errorHandler); // Pass errorHandler to createApp
    const server = await this.openConnection(expressApp);

    await this.database.connect();

    return server;
  }

  public async terminate(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.connection !== undefined) {
        this.connection.close(() => {
          resolve();
        });
      }
    });
  }

  private async openConnection(expressApp: Application): Promise<ServerDto> {
    return new Promise((resolve, reject) => {
      const server = createServer(expressApp);
      this.connection = server.listen(this.config.port, () => {
        logger.info(`Configuring ${this.config.environment} server...`);
        this.errorHandler.listenToErrorEvents(this.connection as HTTPServer);

        const address = this.connection?.address();
        if (address && typeof address !== 'string') {
          resolve({
            port: address.port,
            address: address.address,
          });
        } else {
          reject(new Error('Failed to get server address'));
        }
      });
    });
  }
}

export default Server;
