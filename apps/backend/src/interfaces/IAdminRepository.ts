import { IUser } from "../models/User";
import { IAuditLog } from "../models/AuditLog";

export interface IAdminRepository {
    searchUsers(filters: any, page: number, limit: number): Promise<{ users: IUser[]; total: number }>;
    findById(userId: string): Promise<IUser | null>;
    updateUserStatus(userId: string, status: "active" | "inactive"): Promise<IUser | null>;
    createAuditLog(action: string, adminId: string, targetUserId?: string, details?: string): Promise<void>;
    getAuditLogs(page: number, limit: number): Promise<{ logs: IAuditLog[]; total: number }>;
}
