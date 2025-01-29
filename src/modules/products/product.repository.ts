import { BaseRepository } from '../../lib/core/abstracts/BaseRepository.abstract';
import { Product, ProductSchema } from './product.model';

export default class ProductRepository extends BaseRepository<ProductSchema> {
  constructor() {
    super(Product);
  }
}
