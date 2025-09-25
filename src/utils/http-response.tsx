import { Context } from "hono";
import { logger } from "@/config/logger";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function successResponse(
  c: Context,
  message: string,
  data?: any,
  status: ContentfulStatusCode = 200,
  meta?: any
) {
  const res = { success: true, message, data, status, meta };
  return c.json(res, status);
}

export function errorResponse(
  c: Context,
  message: string,
  status: ContentfulStatusCode = 500,
  code: string = "INTERNAL_SERVER_ERROR",
  errors?: Record<string, any>
) {
  const res = { success: false, message, status, code, errors };
  return c.json(res, status);
}

export function paginatedResponse(
  c: Context,
  message: string,
  data: any,
  page: number,
  limit: number,
  total: number
) {
  const pagination = {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
    offset: (page - 1) * limit,
  };
  return successResponse(c, message, data, 200, { pagination });
}

// note : logging is handled in middleware, so no need to log here
