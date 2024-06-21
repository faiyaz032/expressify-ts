import { Router } from 'express';
import authRoutes from './auth.routes';

export default function loadAuthModule(expressRouter: Router) {
  expressRouter.use('/auth', authRoutes());
}
