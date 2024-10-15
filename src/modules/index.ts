import { Router } from 'express';
import defineProductsModule from './products';

export default function loadAllModules(apiRouter: Router) {
  defineProductsModule(apiRouter);
}
