import { injectable } from "inversify";
import type { INotificationRepository } from "../interfaces/INotificationRepository";
import { type INotification, Notification } from "../models/Notification";
import { BaseRepository } from "../repositories/BaseRepository";

@injectable()
export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(Notification);
  }

  async findByUser(userId: string): Promise<INotification[]> {
    return await this.model.find({ userId }).sort({ createdAt: -1 });
  }
}
