import { injectable, inject } from "inversify";
import { IAdminService } from "../interfaces/IAdminService";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { TYPES } from "../constants/types";
import { IAuditLog } from "../models/AuditLog";
import { ILoginHistory } from "../models/LoginHistory";
import mongoose from "mongoose";

import { UserResponseDTO } from "../dtos/UserDTO";
import { UserMapper } from "../mappers/UserMapper";
import { UserQueryParams, UpdateUserRequest, AuditLogQueryParams, PaginatedResult, SortOptions } from "../types";

@injectable()
export class AdminService implements IAdminService {
    constructor(@inject(TYPES.AdminRepository) private _adminRepository: IAdminRepository) { }

    async getUsers(params: UserQueryParams): Promise<PaginatedResult<UserResponseDTO>> {
        const page = typeof params.page === 'string' ? parseInt(params.page) : (params.page || 1);
        const limit = typeof params.limit === 'string' ? parseInt(params.limit) : (params.limit || 10);
        const skip = (page - 1) * limit;

        const { search, role, status, sort } = params;
        const query: any = {};

        if (search) {
            query.$or = [
                { email: { $regex: search, $options: "i" } },
                { "profile.firstName": { $regex: search, $options: "i" } },
                { "profile.lastName": { $regex: search, $options: "i" } },
            ];
        }

        if (role) query.role = role;

        if (status) {
            if (status === 'active') query.isActive = true;
            else if (status === 'inactive') query.isActive = false;
            else query.status = status;
        }

        const sortOptions: SortOptions = {};
        if (sort) {
            const sortFields = Array.isArray(sort) ? sort : (sort as string).split(',');
            sortFields.forEach((fieldStr: string) => {
                const [field, order] = fieldStr.split(':');
                if (field) {
                    const sortOrder = order === 'desc' ? -1 : 1;
                    let dbField = field;
                    if (field === 'user') dbField = 'profile.firstName';

                    sortOptions[dbField] = sortOrder;
                }
            });
        }

        if (Object.keys(sortOptions).length === 0) {
            sortOptions.createdAt = -1;
        }

        const [users, total] = await Promise.all([
            this._adminRepository.findAllUsers(query, sortOptions, skip, limit),
            this._adminRepository.countUsers(query)
        ]);

        return { data: UserMapper.toDTOs(users), total, page, limit };
    }

    async getUserById(userId: string): Promise<UserResponseDTO | null> {
        const user = await this._adminRepository.findUserById(userId);
        return user ? UserMapper.toDTO(user) : null;
    }

    async updateUser(adminId: string, userId: string, updateData: UpdateUserRequest): Promise<UserResponseDTO> {
        const user = await this._adminRepository.findUserById(userId);
        if (!user) throw new Error("User not found");

        const { role, isActive, status, firstName, lastName } = updateData;
        const updates: any = {};
        if (role) updates.role = role;
        if (isActive !== undefined) updates.isActive = isActive;
        if (status) updates.status = status;
        if (firstName) updates["profile.firstName"] = firstName;
        if (lastName) updates["profile.lastName"] = lastName;

        const updatedUser = await this._adminRepository.updateUser(userId, updates);
        if (!updatedUser) throw new Error("Failed to update user");

        await this._adminRepository.createAuditLog({
            action: "UPDATE_USER",
            resource: "Admin",
            adminId: new mongoose.Types.ObjectId(adminId),
            targetUserId: new mongoose.Types.ObjectId(userId),
            details: `Updated user ${user.email}`,
            changes: updateData as Record<string, any>
        });

        return UserMapper.toDTO(updatedUser);
    }

    async deactivateUser(adminId: string, userId: string): Promise<void> {
        const user = await this._adminRepository.findUserById(userId);
        if (!user) throw new Error("User not found");

        if (user._id.toString() === adminId) {
            throw new Error("You cannot deactivate your own account");
        }

        await this._adminRepository.updateUser(userId, { isActive: false, status: "inactive" });
        await this._adminRepository.createAuditLog({
            action: "DEACTIVATE_USER",
            resource: "Admin",
            adminId: new mongoose.Types.ObjectId(adminId),
            targetUserId: new mongoose.Types.ObjectId(userId),
            details: `Deactivated user ${user.email}`,
        });
    }

    async reactivateUser(adminId: string, userId: string): Promise<void> {
        const user = await this._adminRepository.findUserById(userId);
        if (!user) throw new Error("User not found");

        await this._adminRepository.updateUser(userId, { isActive: true, status: "active" });
        await this._adminRepository.createAuditLog({
            action: "REACTIVATE_USER",
            resource: "Admin",
            adminId: new mongoose.Types.ObjectId(adminId),
            targetUserId: new mongoose.Types.ObjectId(userId),
            details: `Reactivated user ${user.email}`,
        });
    }

    async bulkDeactivateUsers(adminId: string, userIds: string[]): Promise<void> {
        if (!userIds || userIds.length === 0) return;

        // Prevent self-deactivation if included
        const filteredIds = userIds.filter(id => id !== adminId);

        if (filteredIds.length === 0) {
            throw new Error("Cannot deactivate your own account");
        }

        await this._adminRepository.updateManyUsers(filteredIds, { isActive: false, status: "inactive" });

        await this._adminRepository.createAuditLog({
            action: "BULK_DEACTIVATE",
            resource: "Admin",
            adminId: new mongoose.Types.ObjectId(adminId),
            details: `Bulk deactivated ${filteredIds.length} users`,
            changes: { userIds: filteredIds }
        });
    }

    async bulkReactivateUsers(adminId: string, userIds: string[]): Promise<void> {
        if (!userIds || userIds.length === 0) return;

        await this._adminRepository.updateManyUsers(userIds, { isActive: true, status: "active" });

        await this._adminRepository.createAuditLog({
            action: "BULK_REACTIVATE",
            resource: "Admin",
            adminId: new mongoose.Types.ObjectId(adminId),
            details: `Bulk reactivated ${userIds.length} users`,
            changes: { userIds }
        });
    }

    async getAuditLogs(params: AuditLogQueryParams): Promise<PaginatedResult<IAuditLog>> {
        const page = typeof params.page === 'string' ? parseInt(params.page) : (params.page || 1);
        const limit = typeof params.limit === 'string' ? parseInt(params.limit) : (params.limit || 20);
        const skip = (page - 1) * limit;

        const { search, action, userId, sort } = params;
        const query: any = {};

        if (action) query.action = action;
        if (userId) query.adminId = userId;

        if (search) {
            const userSearchQuery = {
                $or: [
                    { email: { $regex: search, $options: "i" } },
                    { "profile.firstName": { $regex: search, $options: "i" } },
                    { "profile.lastName": { $regex: search, $options: "i" } },
                ]
            };

            const matchingUsers = await this._adminRepository.findAllUsers(userSearchQuery, {}, 0, 100);
            const matchingUserIds = matchingUsers.map(u => u._id);

            query.$or = [
                { adminId: { $in: matchingUserIds } },
                { targetUserId: { $in: matchingUserIds } },
                { details: { $regex: search, $options: "i" } },
                { action: { $regex: search, $options: "i" } }
            ];
        }

        const sortOptions: SortOptions = {};
        if (sort) {
            const sortFields = Array.isArray(sort) ? sort : (sort as string).split(',');
            sortFields.forEach((fieldStr: string) => {
                const [field, order] = fieldStr.split(':');
                if (field) {
                    const sortOrder = order === 'desc' ? -1 : 1;
                    let dbField = field;
                    if (field === 'admin') dbField = 'adminId';

                    if (dbField !== 'adminId') {
                        sortOptions[dbField] = sortOrder;
                    }
                }
            });
        }

        if (Object.keys(sortOptions).length === 0) {
            sortOptions.createdAt = -1;
        }

        const [logs, total] = await Promise.all([
            this._adminRepository.findAllAuditLogs(query, sortOptions, skip, limit),
            this._adminRepository.countAuditLogs(query)
        ]);

        return { data: logs, total, page, limit };
    }

    async getUserLoginHistory(userId: string): Promise<ILoginHistory[]> {
        return await this._adminRepository.findLoginHistory(userId, 50);
    }
}
