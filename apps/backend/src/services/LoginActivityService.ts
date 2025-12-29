import { inject, injectable } from "inversify";
import { TYPES } from "../constants/types";
import type { IEmailService } from "../interfaces/IEmailService";
import type { ILoginActivityService } from "../interfaces/ILoginActivityService";
import type { INotificationService } from "../interfaces/INotificationService";
import type { IUserRepository } from "../interfaces/IUserRepository";
import { LoginHistory } from "../models/LoginHistory";

@injectable()
export class LoginActivityService implements ILoginActivityService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.EmailService) private _emailService: IEmailService,
  ) {}

  async recordLogin(
    userId: string,
    ip: string,
    userAgent: string,
  ): Promise<void> {
    // Check if this device/IP has been seen before
    const existingLogin = await LoginHistory.findOne({
      userId,
      $or: [{ ipAddress: ip }, { userAgent }],
    });

    // Strict check to trigger "New Device" alert
    const knownDevice = await LoginHistory.findOne({
      userId,
      ipAddress: ip,
      userAgent,
    });

    if (!knownDevice || !existingLogin) {
      const user = await this._userRepository.findById(userId);
      if (user) {
        const deviceInfo = `${userAgent} (IP: ${ip})`;

        // 1. Send Email Alert
        await this._emailService.sendLoginAlertEmail(
          user.email,
          user.profile.firstName,
          deviceInfo,
        );

        // 2. Create In-App Notification
        await this._notificationService.createNotification(
          userId,
          `New login detected from ${deviceInfo}. If this wasn't you, please change your password immediately.`,
        );
      }
    }

    // Create new history entry
    await LoginHistory.create({
      userId,
      ipAddress: ip,
      userAgent,
      loginAt: new Date(),
    });
  }
}
