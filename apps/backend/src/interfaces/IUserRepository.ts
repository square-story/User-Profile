import { IUser } from "../models/User";
import { CreateUserDto } from "../dtos/CreateUserDto";

export interface IUserRepository {
    create(data: CreateUserDto): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    updateProfile(id: string, data: Partial<IUser["profile"]>): Promise<IUser | null>;
    updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
    saveResetToken(id: string, token: string, expires: Date): Promise<void>;
    findByResetToken(token: string): Promise<IUser | null>;
    updatePassword(id: string, passwordHash: string): Promise<void>;
    findByVerificationCode(email: string, code: string): Promise<IUser | null>;
    verifyUser(id: string): Promise<void>;
}
