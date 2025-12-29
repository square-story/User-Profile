import type { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../constants/types";
import type { IProfileService } from "../interfaces/IProfileService";
import type { AuthRequest } from "../middlewares/authMiddleware";
import { StatusCode } from "../types";

@injectable()
export class ProfileController {
  constructor(
    @inject(TYPES.ProfileService) private _profileService: IProfileService,
  ) { }

  get = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const profile = await this._profileService.getProfile(userId as string);
      res.status(StatusCode.Success).json({ success: true, data: profile });
    } catch (error: unknown) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const profile = await this._profileService.updateProfile(
        userId as string,
        req.body,
      );
      res.status(StatusCode.Success).json({ success: true, data: profile });
    } catch (error: unknown) {
      next(error);
    }
  };

  uploadAvatar = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.userId;
      if (!req.file) {
        res
          .status(StatusCode.BadRequest)
          .json({ success: false, message: "No file uploaded" });
        return;
      }
      const profile = await this._profileService.uploadAvatar(userId as string, req.file);
      res.status(StatusCode.Success).json({ success: true, data: profile });
    } catch (error: unknown) {
      next(error);
    }
  };
}
