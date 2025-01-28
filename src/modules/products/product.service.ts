// class ProductService {
//   private productRepository: ProductRepository;

import BaseService from '../../core/abstracts/BaseService.abstract';
import { ProductSchema } from './product.model';
import ProductRepository from './product.repository';
import { CreateProductType } from './product.schema';

class ProductService extends BaseService<ProductSchema, CreateProductType> {
  constructor(repository: ProductRepository) {
    super(repository);
  }
}

export default ProductService;
