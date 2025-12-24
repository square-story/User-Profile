import { IUser } from "../models/User";
import { IAuditLog } from "../models/AuditLog";
import { ILoginHistory } from "../models/LoginHistory";

export interface IAdminService {
    getUsers(params: any): Promise<{ users: IUser[]; total: number; page: number; limit: number; }>;
    getUserById(userId: string): Promise<IUser | null>;
    updateUser(adminId: string, userId: string, updateData: any): Promise<IUser>;
    deactivateUser(adminId: string, userId: string): Promise<void>;
    reactivateUser(adminId: string, userId: string): Promise<void>;

    getAuditLogs(params: any): Promise<{ logs: IAuditLog[]; total: number; page: number; limit: number; }>;
    getUserLoginHistory(userId: string): Promise<ILoginHistory[]>;

    // Deprecated compat
    searchUsers(filters: any, page: number, limit: number): Promise<{ users: IUser[]; total: number }>;
    toggleUserStatus(adminId: string, userId: string): Promise<IUser>;
}
