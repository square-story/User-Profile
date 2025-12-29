import type { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../constants/types";
import type { INotificationService } from "../interfaces/INotificationService";
import type { AuthRequest } from "../middlewares/authMiddleware";
import { StatusCode } from "../types";

@injectable()
export class NotificationController {
  constructor(
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
  ) { }

  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const notifications =
        await this._notificationService.getNotifications(userId as string);
      res
        .status(StatusCode.Success)
        .json({ success: true, data: notifications });
    } catch (error: unknown) {
      next(error);
    }
  };
}
