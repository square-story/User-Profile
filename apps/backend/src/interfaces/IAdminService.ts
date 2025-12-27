import { UserResponseDTO } from "../dtos/UserDTO";
import { IAuditLog } from "../models/AuditLog";
import { ILoginHistory } from "../models/LoginHistory";
import { UserQueryParams, AuditLogQueryParams, UpdateUserRequest, PaginatedResult } from "../types";

export interface IAdminService {
    getUsers(params: UserQueryParams): Promise<PaginatedResult<UserResponseDTO>>;
    getUserById(userId: string): Promise<UserResponseDTO | null>;
    updateUser(adminId: string, userId: string, updateData: UpdateUserRequest): Promise<UserResponseDTO>;
    deactivateUser(adminId: string, userId: string): Promise<void>;
    reactivateUser(adminId: string, userId: string): Promise<void>;

    bulkDeactivateUsers(adminId: string, userIds: string[]): Promise<void>;
    bulkReactivateUsers(adminId: string, userIds: string[]): Promise<void>;

    getAuditLogs(params: AuditLogQueryParams): Promise<PaginatedResult<IAuditLog>>;
    getUserLoginHistory(userId: string): Promise<ILoginHistory[]>;
}
