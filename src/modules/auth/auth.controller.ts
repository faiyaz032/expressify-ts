import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../shared/utils/sendResponse';

class AuthController {
  constructor() {}

  async loginHandler(req: Request, res: Response, next: NextFunction) {
    try {
      sendResponse(res, StatusCodes.OK, 'User Logged in successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
