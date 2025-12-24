import { IUser } from "../models/User";
import { IAuditLog } from "../models/AuditLog";
import { ILoginHistory } from "../models/LoginHistory";

export interface IAdminRepository {
    findAllUsers(query: any, sort: any, skip: number, limit: number): Promise<IUser[]>;
    countUsers(query: any): Promise<number>;
    findUserById(userId: string): Promise<IUser | null>;
    updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null>;

    createAuditLog(data: Partial<IAuditLog>): Promise<IAuditLog>;
    findAllAuditLogs(query: any, sort: any, skip: number, limit: number): Promise<IAuditLog[]>;
    countAuditLogs(query: any): Promise<number>;

    findLoginHistory(userId: string, limit: number): Promise<ILoginHistory[]>;

    // Deprecated or can be removed if replaced by generalized methods above
    searchUsers(filters: any, page: number, limit: number): Promise<{ users: IUser[]; total: number }>;
    updateUserStatus(userId: string, status: "active" | "inactive"): Promise<IUser | null>;
}
