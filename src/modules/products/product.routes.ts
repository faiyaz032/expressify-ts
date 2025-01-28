import { Router } from 'express';
import validateResource from '../../middlewares/validateResource';
import { objectIdParamSchema } from '../../shared/schemas/objectId.schema';
import ProductController from './product.controller';
import ProductRepository from './product.repository';
import { createProductSchema, updateProductSchema } from './product.schema';
import ProductService from './product.service';

export default function productRoutes() {
  const router = Router();

  //TODO: Resolve these dependency injections
  const controller = new ProductController(new ProductService(new ProductRepository()));

  router.post('/', validateResource({ body: createProductSchema }), controller.createProduct);
  router.get('/', controller.getAllProducts);
  router.get('/:id', validateResource({ params: objectIdParamSchema }), controller.getProductById);
  router.patch(
    '/:id',
    validateResource({ params: objectIdParamSchema, body: updateProductSchema }),
    controller.updateProduct
  );
  router.delete('/:id', validateResource({ params: objectIdParamSchema }), controller.deleteProduct);

  return router;
}
