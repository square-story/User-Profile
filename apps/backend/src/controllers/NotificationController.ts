import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";
import { INotificationService } from "../interfaces/INotificationService";
import { AuthRequest } from "../middlewares/authMiddleware";

@injectable()
export class NotificationController {
    constructor(@inject(TYPES.NotificationService) private notificationService: INotificationService) { }

    list = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const notifications = await this.notificationService.getNotifications(userId);
            res.status(200).json({ success: true, data: notifications });
        } catch (error) {
            next(error);
        }
    };
}
