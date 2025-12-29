import type { INotification } from "../models/Notification";
import type { IBaseRepository } from "./IBaseRepository";

export interface INotificationRepository
  extends IBaseRepository<INotification> {
  findByUser(userId: string): Promise<INotification[]>;
}
