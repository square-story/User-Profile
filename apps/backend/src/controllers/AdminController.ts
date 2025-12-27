import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";
import { IAdminService } from "../interfaces/IAdminService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { StatusCode, UserQueryParams, AuditLogQueryParams } from "../types";

@injectable()
export class AdminController {
    constructor(@inject(TYPES.AdminService) private _adminService: IAdminService) { }

    /**
     * Get all users with filters and pagination
     */
    getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const result = await this._adminService.getUsers(req.query as unknown as UserQueryParams);
            res.json({
                success: true,
                data: {
                    users: result.data,
                    pagination: {
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                        pages: Math.ceil(result.total / result.limit),
                    },
                },
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Get user details by ID
     */
    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this._adminService.getUserById(req.params.id);
            if (!user) {
                return res.status(StatusCode.NotFound).json({ success: false, message: "User not found" });
            }
            res.json({ success: true, data: user });
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Update user role or status
     */
    updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const updatedUser = await this._adminService.updateUser(req.user!.userId, req.params.id, req.body);
            res.status(StatusCode.Success).json({ success: true, data: updatedUser, message: "User updated successfully" });
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Deactivate User
     */
    deactivateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this._adminService.deactivateUser(req.user!.userId, req.params.id);
            res.status(StatusCode.Success).json({ success: true, message: "User deactivated successfully" });
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Reactivate User
     */
    reactivateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            await this._adminService.reactivateUser(req.user!.userId, req.params.id);
            res.status(StatusCode.Success).json({ success: true, message: "User reactivated successfully" });
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Bulk Deactivate Users
     */
    bulkDeactivate = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { userIds } = req.body;
            await this._adminService.bulkDeactivateUsers(req.user!.userId, userIds);
            res.status(StatusCode.Success).json({ success: true, message: "Users deactivated successfully" });
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Bulk Reactivate Users
     */
    bulkReactivate = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { userIds } = req.body;
            await this._adminService.bulkReactivateUsers(req.user!.userId, userIds);
            res.status(StatusCode.Success).json({ success: true, message: "Users reactivated successfully" });
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Get Audit Logs
     */
    getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this._adminService.getAuditLogs(req.query as unknown as AuditLogQueryParams);
            res.status(StatusCode.Success).json({
                success: true,
                data: {
                    logs: result.data,
                    pagination: {
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                        pages: Math.ceil(result.total / result.limit),
                    },
                },
            });
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Get Login History for a User
     */
    getUserLoginHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const history = await this._adminService.getUserLoginHistory(req.params.id);
            res.status(StatusCode.Success).json({ success: true, data: history });
        } catch (error: unknown) {
            next(error);
        }
    }
}
