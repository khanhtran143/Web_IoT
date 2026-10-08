import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  errorCode?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  pagination?: ApiResponse["pagination"]
) {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    message,
    ...(pagination ? { pagination } : {}),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message = "An error occurred",
  statusCode = 400,
  errorCode?: string,
  data: any = null
) {
  const payload: ApiResponse = {
    success: false,
    data,
    message,
    ...(errorCode ? { errorCode } : {}),
  };
  return res.status(statusCode).json(payload);
}
