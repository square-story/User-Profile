import { INotification } from "../models/Notification";

export interface INotificationRepository {
    create(userId: string, message: string): Promise<INotification>;
    findByUser(userId: string): Promise<INotification[]>;
}
