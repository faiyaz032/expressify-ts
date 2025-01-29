import { ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor, BeAnObject } from '@typegoose/typegoose/lib/types';

export type Pagination = {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: Pagination;
};

export type QueryOptions = {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  search?: string;
  searchFields?: string[];
  select?: string;
  populate?: string;
};

export type TypegooseModel<T> = ReturnModelType<AnyParamConstructor<T>, BeAnObject>;
