import { IUser } from "../models/User";
import { CreateUserDto } from "../dtos/CreateUserDto";

export interface IAuthService {
    register(data: CreateUserDto): Promise<{ accessToken: string; refreshToken: string; user: IUser }>;
    login(credentials: { email: string; passwordHash: string }): Promise<{ accessToken: string; refreshToken: string; user: IUser }>;
    refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
    logout(userId: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
