import { UserResponseDTO } from "../dtos/UserDTO";
import { IAuditLog } from "../models/AuditLog";
import { ILoginHistory } from "../models/LoginHistory";

export interface IAdminService {
    getUsers(params: any): Promise<{ users: UserResponseDTO[]; total: number; page: number; limit: number; }>;
    getUserById(userId: string): Promise<UserResponseDTO | null>;
    updateUser(adminId: string, userId: string, updateData: any): Promise<UserResponseDTO>;
    deactivateUser(adminId: string, userId: string): Promise<void>;
    reactivateUser(adminId: string, userId: string): Promise<void>;

    getAuditLogs(params: any): Promise<{ logs: IAuditLog[]; total: number; page: number; limit: number; }>;
    getUserLoginHistory(userId: string): Promise<ILoginHistory[]>;

    // Deprecated compat
    searchUsers(filters: any, page: number, limit: number): Promise<{ users: UserResponseDTO[]; total: number }>;
    toggleUserStatus(adminId: string, userId: string): Promise<UserResponseDTO>;
}
