import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../shared/utils/sendResponse';

class AuthController {
  constructor() {}

  async loginHandler(req: Request, res: Response, next: NextFunction) {
    console.log('🚀 ~ AuthController ~ loginHandler ~ req.body:', req.body);

    sendResponse(res, StatusCodes.OK, 'User Logged in successfully');
  }
}

export default AuthController;
