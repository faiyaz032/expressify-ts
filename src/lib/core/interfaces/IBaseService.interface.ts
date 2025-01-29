import { FilterQuery } from 'mongoose';
import { PaginatedResult } from '../types/common.types';

interface IBaseService<T> {
  getAll(query: FilterQuery<T>): Promise<PaginatedResult<T>>;
  getById(id: string): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
