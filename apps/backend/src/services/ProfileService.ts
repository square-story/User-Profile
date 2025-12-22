import { injectable, inject } from "inversify";
import { IProfileService } from "../interfaces/IProfileService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { INotificationService } from "../interfaces/INotificationService";
import { TYPES } from "../constants/types";

@injectable()
export class ProfileService implements IProfileService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.NotificationService) private notificationService: INotificationService
    ) { }

    async getProfile(userId: string): Promise<any> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user.profile;
    }

    async updateProfile(userId: string, data: any): Promise<any> {
        const updatedUser = await this.userRepository.updateProfile(userId, data);
        if (!updatedUser) {
            throw new Error("User not found");
        }

        // Trigger notification
        await this.notificationService.createNotification(userId, "Your profile has been updated successfully.");

        return updatedUser.profile;
    }
}
