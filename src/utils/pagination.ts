export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function parsePagination(query: any): PaginationParams {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  return { page, limit };
}

export function getSkip(params: PaginationParams): number {
  return (params.page - 1) * params.limit;
}

export function buildPaginatedResult<T>(
  data: T[], total: number, params: PaginationParams
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / params.limit);
  return {
    data,
    pagination: {
      page: params.page, limit: params.limit, total, totalPages,
      hasNext: params.page < totalPages, hasPrev: params.page > 1,
    },
  };
}

export function buildCursorResult<T extends { id: string }>(
  data: T[], limit: number
): { data: T[]; nextCursor: string | null } {
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  return { data: items, nextCursor: hasMore ? items[items.length - 1].id : null };
}
