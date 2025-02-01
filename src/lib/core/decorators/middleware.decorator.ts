import { RequestHandler } from 'express';
import 'reflect-metadata';
import { GLOBAL_MIDDLEWARE_KEY, MIDDLEWARE_KEY } from './keys';

export function Use(middleware: RequestHandler | RequestHandler[]) {
  return function (target: any, propertyKey: string | symbol) {
    const middlewares = Array.isArray(middleware) ? middleware : [middleware];
    if (propertyKey) {
      //Method level middleware3
      const existingMiddlewares = Reflect.getMetadata(MIDDLEWARE_KEY, target, propertyKey) || [];
      const mergedMiddlewares = [...existingMiddlewares, ...middlewares];
      Reflect.defineMetadata(MIDDLEWARE_KEY, mergedMiddlewares, target, propertyKey);
      return;
    }
    // Global level middleware
    const existingMiddlewares = Reflect.getMetadata(GLOBAL_MIDDLEWARE_KEY, target) || [];
    const mergedMiddlewares = [...existingMiddlewares, ...middlewares];
    Reflect.defineMetadata(GLOBAL_MIDDLEWARE_KEY, mergedMiddlewares, target);
  };
}
