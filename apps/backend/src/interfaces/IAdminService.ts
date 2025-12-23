import { IUser } from "../models/User";
import { IAuditLog } from "../models/AuditLog";

export interface IAdminService {
    searchUsers(filters: any, page: number, limit: number): Promise<{ users: IUser[]; total: number }>;
    toggleUserStatus(adminId: string, userId: string): Promise<IUser>;
    getAuditLogs(page: number, limit: number): Promise<{ logs: IAuditLog[]; total: number }>;
}
