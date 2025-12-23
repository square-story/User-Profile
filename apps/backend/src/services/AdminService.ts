import { injectable, inject } from "inversify";
import { IAdminService } from "../interfaces/IAdminService";
import { IAdminRepository } from "../interfaces/IAdminRepository";
import { TYPES } from "../constants/types";
import { IUser } from "../models/User";
import { IAuditLog } from "../models/AuditLog";

@injectable()
export class AdminService implements IAdminService {
    constructor(@inject(TYPES.AdminRepository) private adminRepository: IAdminRepository) { }

    async searchUsers(filters: any, page: number, limit: number): Promise<{ users: IUser[]; total: number }> {
        return await this.adminRepository.searchUsers(filters, page, limit);
    }

    async toggleUserStatus(adminId: string, userId: string): Promise<IUser> {
        const user = await this.adminRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Prevent self-deactivation
        if (user._id.toString() === adminId) {
            throw new Error("You cannot deactivate your own account");
        }

        const newStatus = user.status === "active" ? "inactive" : "active";
        const updatedUser = await this.adminRepository.updateUserStatus(userId, newStatus);

        if (!updatedUser) {
            throw new Error("Failed to update user status");
        }

        await this.adminRepository.createAuditLog(
            newStatus === "active" ? "ACTIVATE_USER" : "DEACTIVATE_USER",
            adminId,
            userId,
            `User status changed to ${newStatus}`
        );

        return updatedUser;
    }

    async getAuditLogs(page: number, limit: number): Promise<{ logs: IAuditLog[]; total: number }> {
        return await this.adminRepository.getAuditLogs(page, limit);
    }
}
