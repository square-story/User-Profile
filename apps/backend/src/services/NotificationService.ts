import { inject, injectable } from "inversify";
import { TYPES } from "../constants/types";
import type { INotificationRepository } from "../interfaces/INotificationRepository";
import type { INotificationService } from "../interfaces/INotificationService";
import type { INotification } from "../models/Notification";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private _notificationRepository: INotificationRepository,
  ) {}

  async createNotification(userId: string, message: string): Promise<void> {
    await this._notificationRepository.create({ userId, message });
  }

  async getNotifications(userId: string): Promise<INotification[]> {
    return await this._notificationRepository.findByUser(userId);
  }
}
