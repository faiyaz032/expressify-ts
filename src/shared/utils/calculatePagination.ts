import { Pagination, QueryOptions } from '../../lib/core/types/common.types';

export const calculatePagination = <T>({
  page = 1,
  limit = 10,
  total,
}: QueryOptions & { total: number }): Pagination => {
  const totalPages = Math.ceil(total / limit);
  const currentPage = page;
  const pageSize = limit;

  return {
    totalItems: total,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
  };
};
