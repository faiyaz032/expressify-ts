import { Router } from 'express';
import validateResource from '../../middlewares/validateResource';
import AuthController from './auth.controller';
import { loginSchema } from './auth.schema';

export default function authRoutes() {
  const router = Router();

  const controller = new AuthController();

  router.post('/login', validateResource({ body: loginSchema }), controller.loginHandler);

  return router;
}
