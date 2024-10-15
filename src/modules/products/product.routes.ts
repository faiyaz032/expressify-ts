import { Router } from 'express';
import validateResource from '../../middlewares/validateResource';
import { objectIdParamSchema } from '../../shared/schemas/objectId.schema';
import ProductController from './product.controller';
import { createProductSchema, updateProductSchema } from './product.schema';

export default function productRoutes() {
  const router = Router();

  const controller = new ProductController();

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
