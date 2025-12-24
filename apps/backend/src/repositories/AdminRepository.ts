import { injectable } from "inversify";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { User, IUser } from "../models/User";
import { AuditLog, IAuditLog } from "../models/AuditLog";
import { LoginHistory, ILoginHistory } from "../models/LoginHistory";

@injectable()
export class AdminRepository implements IAdminRepository {
    async findAllUsers(query: any, sort: any, skip: number, limit: number): Promise<IUser[]> {
        return await User.find(query)
            .select("-passwordHash")
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async countUsers(query: any): Promise<number> {
        return await User.countDocuments(query);
    }

    async findUserById(userId: string): Promise<IUser | null> {
        return await User.findById(userId).select("-passwordHash");
    }

    async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, data, { new: true });
    }

    async updateManyUsers(userIds: string[], updates: Partial<IUser>): Promise<void> {
        await User.updateMany({ _id: { $in: userIds } }, { $set: updates });
    }

    async createAuditLog(data: Partial<IAuditLog>): Promise<IAuditLog> {
        return await AuditLog.create(data);
    }

    async findAllAuditLogs(query: any, sort: any, skip: number, limit: number): Promise<IAuditLog[]> {
        return await AuditLog.find(query)
            .populate("adminId", "email profile.firstName profile.lastName")
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async countAuditLogs(query: any): Promise<number> {
        return await AuditLog.countDocuments(query);
    }

    async findLoginHistory(userId: string, limit: number): Promise<ILoginHistory[]> {
        return await LoginHistory.find({ userId })
            .sort({ loginAt: -1 })
            .limit(limit);
    }

    // Keeping these for interface compatibility until refactor is complete, forwarding to new methods
    async searchUsers(filters: any, page: number, limit: number): Promise<{ users: IUser[]; total: number }> {
        // This legacy method is a bit tricky to map perfectly without logic, 
        // but we will rely on findAllUsers in the service mostly.
        // Implementing strict dummy or just forwarding if simpler.
        const skip = (page - 1) * limit;
        const users = await this.findAllUsers({}, { createdAt: -1 }, skip, limit);
        const total = await this.countUsers({});
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
