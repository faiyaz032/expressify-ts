import { registerControllers } from '@lib/core';
import { Application } from 'express';
import ProductController from './products/product.controller';

export default function loadAllModules(app: Application) {
  const controllerRegistry = [ProductController];

  registerControllers(app, controllerRegistry);
}
