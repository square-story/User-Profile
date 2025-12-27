import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";
import { IProfileService } from "../interfaces/IProfileService";
import { AuthRequest } from "../middlewares/authMiddleware";

@injectable()
export class ProfileController {
    constructor(@inject(TYPES.ProfileService) private _profileService: IProfileService) { }

    get = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const profile = await this._profileService.getProfile(userId);
            res.status(200).json({ success: true, data: profile });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const profile = await this._profileService.updateProfile(userId, req.body);
            res.status(200).json({ success: true, data: profile });
        } catch (error) {
            next(error);
        }
    };

    uploadAvatar = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            if (!req.file) {
                res.status(400).json({ success: false, message: "No file uploaded" });
                return;
            }
            const profile = await this._profileService.uploadAvatar(userId, req.file);
            res.status(200).json({ success: true, data: profile });
        } catch (error) {
            next(error);
        }
    };
}
