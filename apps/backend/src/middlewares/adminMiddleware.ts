import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { StatusCode } from "../types";

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(StatusCode.Forbidden).json({ success: false, message: "Access denied. Admins only." });
    }
    next();
};
