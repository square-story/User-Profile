import { inject, injectable } from "inversify";
import { TYPES } from "../constants/types";
import type { IEmailService } from "../interfaces/IEmailService";
import type { INotificationService } from "../interfaces/INotificationService";
import type { IProfileService } from "../interfaces/IProfileService";
import type { IUserRepository } from "../interfaces/IUserRepository";
import type { IUserProfile } from "../models/User";
import { StatusCode } from "../types";
import { AppError } from "../utils/errorUtils";
import type { CloudinaryService } from "./CloudinaryService";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.EmailService) private _emailService: IEmailService,
    @inject(TYPES.CloudinaryService)
    private cloudinaryService: CloudinaryService,
  ) {}

  async getProfile(userId: string): Promise<IUserProfile> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", StatusCode.NotFound);
    }
    return user.profile;
  }

  async updateProfile(
    userId: string,
    data: Partial<IUserProfile>,
  ): Promise<IUserProfile> {
    const updatedUser = await this._userRepository.updateProfile(userId, data);
    if (!updatedUser) {
      throw new AppError("User not found", StatusCode.NotFound);
    }

    // Trigger notification
    await this._notificationService.createNotification(
      userId,
      "Your profile has been updated successfully.",
    );

    // Send Email
    this._emailService.sendProfileUpdateEmail(
      updatedUser.email,
      updatedUser.profile.firstName,
    );

    return updatedUser.profile;
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<IUserProfile> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", StatusCode.NotFound);
    }

    // Delete old avatar if exists
    if (user.profile.avatarPublicId) {
      await this.cloudinaryService.deleteImage(user.profile.avatarPublicId);
    }

    // Upload new avatar
    const { url, publicId } = await this.cloudinaryService.uploadImage(
      file.buffer,
    );

    // Update user profile
    const updatedUser = await this._userRepository.updateProfile(userId, {
      avatarUrl: url,
      avatarPublicId: publicId,
    });

    if (!updatedUser) {
      throw new AppError("User not found", StatusCode.NotFound);
    }

    return updatedUser.profile;
  }
}
