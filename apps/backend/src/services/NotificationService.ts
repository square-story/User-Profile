import { injectable, inject } from "inversify";
import { INotificationService } from "../interfaces/INotificationService";
import { INotificationRepository } from "../interfaces/INotificationRepository";
import { TYPES } from "../constants/types";
import { INotification } from "../models/Notification";

@injectable()
export class NotificationService implements INotificationService {
    constructor(@inject(TYPES.NotificationRepository) private notificationRepository: INotificationRepository) { }

    async createNotification(userId: string, message: string): Promise<void> {
        await this.notificationRepository.create(userId, message);
    }

    async getNotifications(userId: string): Promise<INotification[]> {
        return await this.notificationRepository.findByUser(userId);
    }
}
