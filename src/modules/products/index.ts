import { Router } from 'express';
import productRoutes from './product.routes';

export default function defineProductsModule(apiRouter: Router) {
  apiRouter.use('/products', productRoutes());
}
