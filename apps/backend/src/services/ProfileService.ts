import { injectable, inject } from "inversify";
import { IProfileService } from "../interfaces/IProfileService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { INotificationService } from "../interfaces/INotificationService";
import { TYPES } from "../constants/types";
import { IUserProfile } from "../models/User";

import { IEmailService } from "../interfaces/IEmailService";
import { CloudinaryService } from "./CloudinaryService";

@injectable()
export class ProfileService implements IProfileService {
    constructor(
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.NotificationService) private _notificationService: INotificationService,
        @inject(TYPES.EmailService) private _emailService: IEmailService,
        @inject(TYPES.CloudinaryService) private cloudinaryService: CloudinaryService
    ) { }

    async getProfile(userId: string): Promise<IUserProfile> {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user.profile;
    }

    async updateProfile(userId: string, data: Partial<IUserProfile>): Promise<IUserProfile> {
        const updatedUser = await this._userRepository.updateProfile(userId, data);
        if (!updatedUser) {
            throw new Error("User not found");
        }

        // Trigger notification
        await this._notificationService.createNotification(userId, "Your profile has been updated successfully.");

        // Send Email
        this._emailService.sendProfileUpdateEmail(updatedUser.email, updatedUser.profile.firstName);

        return updatedUser.profile;
    }

    async uploadAvatar(userId: string, file: Express.Multer.File): Promise<IUserProfile> {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Delete old avatar if exists
        if (user.profile.avatarPublicId) {
            await this.cloudinaryService.deleteImage(user.profile.avatarPublicId);
        }

        // Upload new avatar
        const { url, publicId } = await this.cloudinaryService.uploadImage(file.buffer);

        // Update user profile
        const updatedUser = await this._userRepository.updateProfile(userId, {
            avatarUrl: url,
            avatarPublicId: publicId,
        });

        if (!updatedUser) {
            throw new Error("User not found after update");
        }

        return updatedUser.profile;
    }
}
