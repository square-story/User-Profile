import { injectable, inject } from "inversify";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { User, IUser } from "../models/User";
import { AuditLog, IAuditLog } from "../models/AuditLog";
import { LoginHistory, ILoginHistory } from "../models/LoginHistory";
import { SortOptions, UserQueryParams } from "../types";

@injectable()
export class AdminRepository implements IAdminRepository {

    async findAllUsers(query: Record<string, any>, sort: SortOptions, skip: number, limit: number): Promise<IUser[]> {
        return await User.find(query)
            .select("-passwordHash")
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();
    }

    async countUsers(query: Record<string, any>): Promise<number> {
        return await User.countDocuments(query).exec();
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return await User.findById(userId).select("-passwordHash").exec();
    }

    async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, data, { new: true }).exec();
    }

    async updateManyUsers(userIds: string[], updates: Partial<IUser>): Promise<void> {
        await User.updateMany({ _id: { $in: userIds } }, { $set: updates }).exec();
    }

    async createAuditLog(data: Partial<IAuditLog>): Promise<IAuditLog> {
        return await AuditLog.create(data);
    }

    async findAllAuditLogs(query: Record<string, any>, sort: SortOptions, skip: number, limit: number): Promise<IAuditLog[]> {
        return await AuditLog.find(query)
            .populate("adminId", "email profile.firstName profile.lastName")
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();
    }

    async countAuditLogs(query: Record<string, any>): Promise<number> {
        return await AuditLog.countDocuments(query).exec();
    }

    async findLoginHistory(userId: string, limit: number): Promise<ILoginHistory[]> {
        return await LoginHistory.find({ userId })
            .sort({ loginAt: -1 })
            .limit(limit)
            .exec();
    }

    // Deprecated / wrapper for compatibility
    async searchUsers(filters: UserQueryParams, page: number, limit: number): Promise<{ users: IUser[]; total: number }> {
        const skip = (page - 1) * limit;
        const query: Record<string, any> = {};

        if (filters.search) {
            query.$or = [
                { email: { $regex: filters.search, $options: "i" } },
                { "profile.firstName": { $regex: filters.search, $options: "i" } },
                { "profile.lastName": { $regex: filters.search, $options: "i" } },
            ];
        }

        const users = await this.findAllUsers(query, { createdAt: -1 }, skip, limit);
        const total = await this.countUsers(query);
        return { users, total };
    }

    async findById(userId: string): Promise<IUser | null> {
        return this.findUserById(userId);
    }

    async updateUserStatus(userId: string, status: "active" | "inactive"): Promise<IUser | null> {
        return this.updateUser(userId, { status });
    }

    async getAuditLogs(page: number, limit: number): Promise<{ logs: IAuditLog[]; total: number }> {
        const skip = (page - 1) * limit;
        const logs = await this.findAllAuditLogs({}, { createdAt: -1 }, skip, limit);
        const total = await this.countAuditLogs({});
        return { logs, total };
    }
}
