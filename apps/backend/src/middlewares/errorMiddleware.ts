import type { NextFunction, Request, Response } from "express";
import { normalizeError } from "../utils/errorUtils";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const appError = normalizeError(error);

  const LOG_ERRORS = process.env.NODE_ENV === "development";

  if (LOG_ERRORS || !appError.isOperational) {
    console.error("💥 UNEXPECTED ERROR:", appError);
  }

  res.status(appError.statusCode).json({
    success: false,
    message: appError.message,
    ...(process.env.NODE_ENV === "development" && { stack: appError.stack }),
  });
};
