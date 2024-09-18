import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import addRequestId from '../middlewares/addRequestId';
import globalErrorHandler from '../middlewares/globalErrorHandler';
import notFoundHandler from '../middlewares/notFoundHandler';
import requestLogger from '../middlewares/requestLogger';
import loadAllModules from '../modules';
import logger from '../shared/logger/LoggerManager';
import sendResponse from '../shared/utils/sendResponse';

class AppFactory {
  static createApp(): Application {
    logger.info('Creating app...');
    const app = express();

    process.env.DATABASE;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(addRequestId);
    app.use(requestLogger);

    app.get('/health', (req: Request, res: Response) => {
      sendResponse(res, StatusCodes.OK, 'Server is healthy');
    });

    const router = express.Router();
    loadAllModules(router);
    app.use('/api/v1', router);

    app.all('*', notFoundHandler);
    globalErrorHandler(app);

    return app;
  }
}

export default AppFactory;
