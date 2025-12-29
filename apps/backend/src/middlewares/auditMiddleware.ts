import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "./authMiddleware";
import { container } from "../container";
import { TYPES } from "../constants/types";
import { IAdminRepository } from "../interfaces/IAdminRepository";

export const auditMiddleware = (action: string, resource: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (req.user) {
                const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
                const userAgent = req.headers["user-agent"] || "";

                const adminRepository = container.get<IAdminRepository>(TYPES.AdminRepository);

                adminRepository.createAuditLog({
                    action,
                    resource,
                    adminId: new mongoose.Types.ObjectId(req.user.userId),
                    ipAddress,
                    userAgent,
                    details: `API Call to ${req.originalUrl}`,
                }).catch(err => console.error("Audit Log Error:", err));
            }
        } catch (error) {
            console.error("Audit Middleware Error:", error);
        }

        next();
    };
};
