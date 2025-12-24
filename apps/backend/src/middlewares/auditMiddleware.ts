import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { AuditLog } from "../models/AuditLog";

export const auditMiddleware = (action: string, resource: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (req.user) {
                const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
                const userAgent = req.headers["user-agent"] || "";

                AuditLog.create({
                    action,
                    resource,
                    adminId: req.user.userId,
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
