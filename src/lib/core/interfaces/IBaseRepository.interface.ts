import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery } from 'mongoose';
import { ObjectIdType } from '../../shared/schemas/objectId.schema';
import { PaginatedResult, QueryOptions } from '../types/common.types';

export default interface IBaseRepository<T, TCreateType> {
  create(data: TCreateType): Promise<DocumentType<T>>;
  findById(id: ObjectIdType): Promise<T | null>;
  findOne(query: FilterQuery<T>): Promise<T | null>;
  updateById(id: ObjectIdType, data: Partial<T>): Promise<T | null>;
  deleteById(id: ObjectIdType): Promise<T | null>;
  findAll(query?: QueryOptions): Promise<PaginatedResult<T>>;
}
