import { Router } from 'express';
import loadAuthModule from './auth';

export default function loadAllModules(expressRouter: Router) {
  loadAuthModule(expressRouter);
}
