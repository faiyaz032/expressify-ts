import dotenv from 'dotenv-flow';
import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import '../configs';
import addRequestId from '../middlewares/addRequestId';
import { errorLogger } from '../middlewares/errorLogger';
import globalErrorHandler from '../middlewares/globalErrorHandler';
import notFoundHandler from '../middlewares/notFoundHandler';
import requestLogger from '../middlewares/requestLogger';
import loadAllModules from '../modules';
import AppErrorHandler from '../shared/error-handling';
import logger from '../shared/logger';
import sendResponse from '../shared/utils/sendResponse';

class AppFactory {
  createApp(errorHandler: AppErrorHandler): Application {
    logger.info('Creating app...');
    dotenv.config();
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    //app.use(morgan('dev'));

    app.use(addRequestId);
    app.use(requestLogger);

    app.get('/health', (req: Request, res: Response) => {
      sendResponse(res, StatusCodes.OK, 'Server is healthy');
    });

    app.post('/create', async (req, res) => {
      sendResponse(res, StatusCodes.CREATED, 'User Created successfully', {
        name: req.body.name,
        age: req.body.age,
      });
    });

    const router = express.Router();
    loadAllModules(router);
    app.use('/api/v1', router);

    app.all('*', notFoundHandler);
    app.use(errorLogger);
    globalErrorHandler(app, errorHandler); // Pass errorHandler to globalErrorHandler

    return app;
  }
}

export default AppFactory;
