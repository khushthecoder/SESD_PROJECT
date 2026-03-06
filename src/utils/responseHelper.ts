import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendCreated<T>(res: Response, data: T): Response {
  return sendSuccess(res, data, 201);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response {
  return res.status(200).json({
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export function sendError(res: Response, message: string, statusCode = 500): Response {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}

export function sendNotFound(res: Response, resource = "Resource"): Response {
  return sendError(res, `${resource} not found`, 404);
}

export function sendUnauthorized(res: Response, message = "Unauthorized"): Response {
  return sendError(res, message, 401);
}
