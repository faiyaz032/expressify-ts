import { BaseRepository } from '../../core/abstracts/BaseRepository.abstract';
import { Product, ProductSchema } from './product.model';
import { CreateProductType } from './product.schema';

export default class ProductRepository extends BaseRepository<ProductSchema, CreateProductType> {
  constructor() {
    super(Product);
  }
}
