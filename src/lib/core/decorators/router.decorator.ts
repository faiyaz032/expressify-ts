import { RequestHandler } from 'express';
import 'reflect-metadata';
import { HTTPMethod, RouterOptions } from '../types/common.types';
import { ROUTER_KEY } from './keys';

export function Route(method: HTTPMethod, path: string, middlewares: RequestHandler[]) {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const routes: RouterOptions[] = Reflect.getMetadata(ROUTER_KEY, target) || [];
    routes.push({
      method,
      path,
      middlewares,
      methodName: propertyKey.toString(),
    });
    Reflect.defineMetadata(ROUTER_KEY, routes, target);
    return descriptor;
  };
}

export const Get = (path: string, middlewares: RequestHandler[] = []) => Route('get', path, middlewares);
export const Post = (path: string, middlewares: RequestHandler[] = []) => Route('post', path, middlewares);
export const Put = (path: string, middlewares: RequestHandler[] = []) => Route('put', path, middlewares);
export const Delete = (path: string, middlewares: RequestHandler[] = []) => Route('delete', path, middlewares);
export const Patch = (path: string, middlewares: RequestHandler[] = []) => Route('patch', path, middlewares);
