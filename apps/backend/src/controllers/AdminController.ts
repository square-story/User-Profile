import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";
import { IAdminService } from "../interfaces/IAdminService";
import { AuthRequest } from "../middlewares/authMiddleware";

@injectable()
export class AdminController {
    constructor(@inject(TYPES.AdminService) private adminService: IAdminService) { }

    getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const { email, role, status } = req.query;

            const result = await this.adminService.searchUsers({ email, role, status }, page, limit);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    toggleStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const adminId = req.user!.userId;
            const { userId } = req.params;

            const user = await this.adminService.toggleUserStatus(adminId, userId);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    };

    getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await this.adminService.getAuditLogs(page, limit);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };
}
