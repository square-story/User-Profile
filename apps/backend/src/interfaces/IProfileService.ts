import type { IUserProfile } from "../models/User";

export interface IProfileService {
  getProfile(userId: string): Promise<IUserProfile>;
  updateProfile(
    userId: string,
    data: Partial<IUserProfile>,
  ): Promise<IUserProfile>;
  uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<IUserProfile>;
}
