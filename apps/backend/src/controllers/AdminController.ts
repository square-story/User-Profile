import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";
import { IAdminService } from "../interfaces/IAdminService";
import { AuthRequest } from "../middlewares/authMiddleware";

@injectable()
export class AdminController {
    constructor(@inject(TYPES.AdminService) private adminService: IAdminService) { }

    /**
     * Get all users with filters and pagination
     */
    getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const result = await this.adminService.getUsers(req.query);
            res.json({
                success: true,
                data: {
                    users: result.users,
                    pagination: {
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                        pages: Math.ceil(result.total / result.limit),
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get user details by ID
     */
    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.adminService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update user role or status
     */
    updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const updatedUser = await this.adminService.updateUser(req.user!.userId, req.params.id, req.body);
            res.json({ success: true, data: updatedUser, message: "User updated successfully" });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Deactivate User
     */
    deactivateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this.adminService.deactivateUser(req.user!.userId, req.params.id);
            res.json({ success: true, message: "User deactivated successfully" });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Reactivate User
     */
    reactivateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this.adminService.reactivateUser(req.user!.userId, req.params.id);
            res.json({ success: true, message: "User reactivated successfully" });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Bulk Deactivate Users
     */
    bulkDeactivate = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { userIds } = req.body;
            await this.adminService.bulkDeactivateUsers(req.user!.userId, userIds);
            res.json({ success: true, message: "Users deactivated successfully" });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Bulk Reactivate Users
     */
    bulkReactivate = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { userIds } = req.body;
            await this.adminService.bulkReactivateUsers(req.user!.userId, userIds);
            res.json({ success: true, message: "Users reactivated successfully" });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get Audit Logs
     */
    getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.adminService.getAuditLogs(req.query);
            res.json({
                success: true,
                data: {
                    logs: result.logs,
                    pagination: {
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                        pages: Math.ceil(result.total / result.limit),
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get Login History for a User
     */
    getUserLoginHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const history = await this.adminService.getUserLoginHistory(req.params.id);
            res.json({ success: true, data: history });
        } catch (error) {
            next(error);
        }
    }
}
