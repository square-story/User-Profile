import { injectable, inject } from "inversify";
import { IAdminService } from "../interfaces/IAdminService";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { TYPES } from "../constants/types";
import { IUser } from "../models/User";
import { IAuditLog } from "../models/AuditLog";
import { ILoginHistory } from "../models/LoginHistory";
import mongoose from "mongoose";

import { UserResponseDTO } from "../dtos/UserDTO";
import { UserMapper } from "../mappers/UserMapper";

@injectable()
export class AdminService implements IAdminService {
    constructor(@inject(TYPES.AdminRepository) private adminRepository: IAdminRepository) { }

    async getUsers(params: any): Promise<{ users: UserResponseDTO[]; total: number; page: number; limit: number }> {
        const page = parseInt(params.page as string) || 1;
        const limit = parseInt(params.limit as string) || 10;
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

        if (status) { // 'active' or 'inactive'
            if (status === 'active') query.isActive = true;
            else if (status === 'inactive') query.isActive = false;
            else query.status = status;
        }

        const sortOptions: any = {};
        if (sort) {
            const sortFields = Array.isArray(sort) ? sort : sort.split(',');
            sortFields.forEach((fieldStr: string) => {
                const [field, order] = fieldStr.split(':');
                if (field) {
                    const sortOrder = order === 'desc' ? -1 : 1;
                    // Map aliases
                    let dbField = field;
                    if (field === 'user') dbField = 'profile.firstName';

                    sortOptions[dbField] = sortOrder;
                }
            });
        }

        // Default sort if none provided
        if (Object.keys(sortOptions).length === 0) {
            sortOptions.createdAt = -1;
        }

        const [users, total] = await Promise.all([
            this.adminRepository.findAllUsers(query, sortOptions, skip, limit),
            this.adminRepository.countUsers(query)
        ]);

        return { users: UserMapper.toDTOs(users), total, page, limit };
    }

    async getUserById(userId: string): Promise<UserResponseDTO | null> {
        const user = await this.adminRepository.findUserById(userId);
        return user ? UserMapper.toDTO(user) : null;
    }

    async updateUser(adminId: string, userId: string, updateData: any): Promise<UserResponseDTO> {
        const user = await this.adminRepository.findUserById(userId);
        if (!user) throw new Error("User not found");

        const { role, isActive, status, firstName, lastName } = updateData;
        const updates: any = {};
        if (role) updates.role = role;
        if (isActive !== undefined) updates.isActive = isActive;
        if (status) updates.status = status;
        if (firstName) updates["profile.firstName"] = firstName;
        if (lastName) updates["profile.lastName"] = lastName;

        const updatedUser = await this.adminRepository.updateUser(userId, updates);
        if (!updatedUser) throw new Error("Failed to update user");

        await this.adminRepository.createAuditLog({
            action: "UPDATE_USER",
            resource: "User",
            adminId: new mongoose.Types.ObjectId(adminId),
            targetUserId: new mongoose.Types.ObjectId(userId),
            details: `Updated user ${user.email}`,
            changes: updateData
        });

        return UserMapper.toDTO(updatedUser);
    }

    async deactivateUser(adminId: string, userId: string): Promise<void> {
        const user = await this.adminRepository.findUserById(userId);
        if (!user) throw new Error("User not found");

        if (user._id.toString() === adminId) {
            throw new Error("You cannot deactivate your own account");
        }

        await this.adminRepository.updateUser(userId, { isActive: false, status: "inactive" });
        await this.adminRepository.createAuditLog({
            action: "DEACTIVATE_USER",
            resource: "User",
            adminId: new mongoose.Types.ObjectId(adminId),
            targetUserId: new mongoose.Types.ObjectId(userId),
            details: `Deactivated user ${user.email}`,
        });
    }

    async reactivateUser(adminId: string, userId: string): Promise<void> {
        const user = await this.adminRepository.findUserById(userId);
        if (!user) throw new Error("User not found");

        await this.adminRepository.updateUser(userId, { isActive: true, status: "active" });
        await this.adminRepository.createAuditLog({
            action: "REACTIVATE_USER",
            resource: "User",
            adminId: new mongoose.Types.ObjectId(adminId),
            targetUserId: new mongoose.Types.ObjectId(userId),
            details: `Reactivated user ${user.email}`,
        });
    }

    async getAuditLogs(params: any): Promise<{ logs: IAuditLog[]; total: number; page: number; limit: number }> {
        const page = parseInt(params.page as string) || 1;
        const limit = parseInt(params.limit as string) || 20;
        const skip = (page - 1) * limit;

        const { action, userId } = params;
        const query: any = {};
        if (action) query.action = action;
        if (userId) query.adminId = userId;

        const [logs, total] = await Promise.all([
            this.adminRepository.findAllAuditLogs(query, { createdAt: -1 }, skip, limit),
            this.adminRepository.countAuditLogs(query)
        ]);

        return { logs, total, page, limit };
    }

    async getUserLoginHistory(userId: string): Promise<ILoginHistory[]> {
        return await this.adminRepository.findLoginHistory(userId, 50);
    }

    // Deprecated / Backwards Compat
    async searchUsers(filters: any, page: number, limit: number): Promise<{ users: UserResponseDTO[]; total: number }> {
        const res = await this.getUsers({ ...filters, page, limit });
        return { users: res.users, total: res.total };
    }

    async toggleUserStatus(adminId: string, userId: string): Promise<UserResponseDTO> {
        // Simple toggle implementation mapping to deactivate/reactivate logic
        const user = await this.adminRepository.findUserById(userId);
        if (!user) throw new Error("User not found");

        if (user.isActive) {
            await this.deactivateUser(adminId, userId);
        } else {
            await this.reactivateUser(adminId, userId);
        }
        const updated = await this.adminRepository.findUserById(userId);
        return UserMapper.toDTO(updated!);
    }
}
