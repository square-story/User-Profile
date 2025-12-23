import { injectable, inject } from "inversify";
import { IProfileService } from "../interfaces/IProfileService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { INotificationService } from "../interfaces/INotificationService";
import { TYPES } from "../constants/types";
import { IUserProfile } from "../models/User";

import { IEmailService } from "../interfaces/IEmailService";

@injectable()
export class ProfileService implements IProfileService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.NotificationService) private notificationService: INotificationService,
        @inject(TYPES.EmailService) private emailService: IEmailService
    ) { }

    async getProfile(userId: string): Promise<IUserProfile> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user.profile;
    }

    async updateProfile(userId: string, data: Partial<IUserProfile>): Promise<IUserProfile> {
        const updatedUser = await this.userRepository.updateProfile(userId, data);
        if (!updatedUser) {
            throw new Error("User not found");
        }

        // Trigger notification
        await this.notificationService.createNotification(userId, "Your profile has been updated successfully.");

        // Send Email
        this.emailService.sendProfileUpdateEmail(updatedUser.email, updatedUser.profile.firstName);

        return updatedUser.profile;
    }
}
