import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Unhandled Error:", err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";

  return sendError(res, message, statusCode, errorCode);
}
