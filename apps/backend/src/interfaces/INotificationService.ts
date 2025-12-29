import type { INotification } from "../models/Notification";

export interface INotificationService {
  createNotification(userId: string, message: string): Promise<void>;
  getNotifications(userId: string): Promise<INotification[]>;
}
