import { injectable } from "inversify";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { User, IUser } from "../models/User";
import { AuditLog, IAuditLog } from "../models/AuditLog";

@injectable()
export class AdminRepository implements IAdminRepository {
    async searchUsers(filters: any, page: number, limit: number): Promise<{ users: IUser[]; total: number }> {
        const query: any = {};
        if (filters.email) {
            query.email = { $regex: filters.email, $options: "i" };
        }
        if (filters.role) {
            query.role = filters.role;
        }
        if (filters.status) {
            query.status = filters.status;
        }

        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find(query).select("-passwordHash").skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments(query),
        ]);

        return { users, total };
    }

    async findById(userId: string): Promise<IUser | null> {
        return await User.findById(userId);
    }

    async updateUserStatus(userId: string, status: "active" | "inactive"): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, { status }, { new: true });
    }

    async createAuditLog(action: string, adminId: string, targetUserId?: string, details?: string): Promise<void> {
        await AuditLog.create({ action, adminId, targetUserId, details });
    }

    async getAuditLogs(page: number, limit: number): Promise<{ logs: IAuditLog[]; total: number }> {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            AuditLog.find().populate("adminId", "email").populate("targetUserId", "email").skip(skip).limit(limit).sort({ createdAt: -1 }),
            AuditLog.countDocuments(),
        ]);

        return { logs, total };
    }
}
