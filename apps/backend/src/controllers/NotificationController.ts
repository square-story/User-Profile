import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";
import { INotificationService } from "../interfaces/INotificationService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { StatusCode } from "../types";

@injectable()
export class NotificationController {
    constructor(@inject(TYPES.NotificationService) private _notificationService: INotificationService) { }

    list = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const notifications = await this._notificationService.getNotifications(userId);
            res.status(StatusCode.Success).json({ success: true, data: notifications });
        } catch (error: unknown) {
            next(error);
        }
    };
}
