import type { CreateUserDto } from "../dtos/CreateUserDto";
import type { IUser } from "../models/User";

export interface IAuthService {
  register(data: CreateUserDto): Promise<void>;
  verifyEmail(
    email: string,
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }>;
  resendVerification(email: string): Promise<void>;
  login(
    credentials: { email: string; passwordHash: string },
    clientInfo?: { ip: string; userAgent: string },
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }>;
  refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  logout(userId: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  validateResetToken(token: string): Promise<void>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void>;
}
