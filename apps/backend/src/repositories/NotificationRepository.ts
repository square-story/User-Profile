import { injectable } from "inversify";
import { INotificationRepository } from "../interfaces/INotificationRepository";
import { Notification, INotification } from "../models/Notification";

@injectable()
export class NotificationRepository implements INotificationRepository {
    async create(userId: string, message: string): Promise<INotification> {
        const notification = new Notification({ userId, message });
        return await notification.save();
    }

    async findByUser(userId: string): Promise<INotification[]> {
        return await Notification.find({ userId }).sort({ createdAt: -1 });
    }
}
