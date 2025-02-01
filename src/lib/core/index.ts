import { Application, Router } from 'express';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { CONTROLLER_KEY, MIDDLEWARE_KEY, ROUTER_KEY } from './decorators/keys';
import { Constructor, ControllerMetadata } from './types/common.types';

export function registerControllers(app: Application, controllers: Constructor[]) {
  controllers.forEach((controller) => {
    const controllerInstance = container.resolve(controller);
    const controllerMetadata: ControllerMetadata = {
      basePath: Reflect.getMetadata(CONTROLLER_KEY, controller),
      routes: Reflect.getMetadata(ROUTER_KEY, controller.prototype),
      middlewares: Reflect.getMetadata(MIDDLEWARE_KEY, controller) || [],
    };
    if (!controllerMetadata.basePath) {
      throw new Error(`Base path is not defined for controller ${controller.name}`);
    }

    if (!controllerMetadata.routes) {
      throw new Error(`Routes are not defined for controller ${controller.name}`);
    }

    const router = Router();
    if (controllerMetadata.middlewares.length > 0) {
      router.use(controllerMetadata.middlewares);
    }

    controllerMetadata.routes.forEach((route) => {
      if (!(route.methodName in controllerInstance)) {
        throw new Error(`Method ${route.methodName} not found in controller ${controller.name}`);
      }

      const middlewares = Reflect.getMetadata(MIDDLEWARE_KEY, controller.prototype, route.methodName) || [];
      const handler = controllerInstance[route.methodName].bind(controllerInstance);
      router[route.method](route.path, [...middlewares], handler);

      app.use(controllerMetadata.basePath, router);
    });
  });
}
