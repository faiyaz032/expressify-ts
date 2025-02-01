import { injectable } from 'tsyringe';
import BaseService from '../../lib/core/abstracts/BaseService.abstract';
import { ProductSchema } from './product.model';
import ProductRepository from './product.repository';

@injectable()
class ProductService extends BaseService<ProductSchema> {
  constructor(repository: ProductRepository) {
    super(repository);
  }
}

export default ProductService;
