import { injectable } from 'tsyringe';
import { BaseRepository } from '../../lib/core/abstracts/BaseRepository.abstract';
import { Product, ProductSchema } from './product.model';

@injectable()
export default class ProductRepository extends BaseRepository<ProductSchema> {
  constructor() {
    super(Product);
  }
}
