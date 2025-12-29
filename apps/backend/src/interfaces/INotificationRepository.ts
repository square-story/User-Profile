import { INotification } from "../models/Notification";
import { IBaseRepository } from "./IBaseRepository";

export interface INotificationRepository extends IBaseRepository<INotification> {
    findByUser(userId: string): Promise<INotification[]>;
}
