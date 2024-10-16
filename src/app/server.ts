import { Application } from 'express';
import { Server as HTTPServer } from 'http';
import config from '../configs';
import Database from '../shared/database';
import AppErrorHandler from '../shared/error-handling';
import logger from '../shared/logger/LoggerManager';
import AppFactory from './app'; // Assuming './app' exports an object with a method `createApp`

interface ServerDto {
  port: number;
  address: string;
}

class Server {
  private connection: HTTPServer | undefined;

  public async run(): Promise<ServerDto> {
    const expressApp = AppFactory.createApp();
    const server = await this.openConnection(expressApp);

    const db = Database.getInstance();
    await db.connect();
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

  private async openConnection(expressApp: Application): Promise<any> {
    // Replace 'any' with the actual type of expressApp
    return new Promise<any>((resolve, reject) => {
      // Replace 'any' with the actual type of the resolved value
      const PORT = process.env.PORT || 8080; // Assuming config.get('port') returns a number

      // Configure socket
      //const httpServer = http.createServer(expressApp);
      this.connection = expressApp.listen(PORT, () => {
        logger.info(`Configuring ${config.get('environment')} server...`);
        const errorHandler = new AppErrorHandler();
        errorHandler.listenToErrorEvents(this.connection as HTTPServer);
        resolve(this.connection?.address());
      });
    });
  }
}

export default Server;
