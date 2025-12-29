import type { NextFunction, Response } from "express";
import { StatusCode } from "../types";
import type { AuthRequest } from "./authMiddleware";

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(StatusCode.Forbidden)
      .json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};
