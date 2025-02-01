import { ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor, BeAnObject } from '@typegoose/typegoose/lib/types';
import { RequestHandler } from 'express';

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

export type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type RouterOptions = {
  method: HTTPMethod;
  path: string;
  middlewares?: RequestHandler[];
  methodName: string;
};

export type TypegooseModel<T> = ReturnModelType<AnyParamConstructor<T>, BeAnObject>;

export type Constructor = new (...args: any[]) => any;

export type ControllerMetadata = {
  basePath: string;
  routes: RouterOptions[];
  middlewares: RequestHandler[];
};
