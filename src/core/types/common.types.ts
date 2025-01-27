import { ReturnModelType } from '@typegoose/typegoose';

export interface Pagination {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: Pagination;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  search?: string;
  searchFields?: string[];
  select?: string;
  populate?: string;
}

export type TypegooseModel<T> = ReturnModelType<new () => T>;
