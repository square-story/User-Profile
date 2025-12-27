import { injectable } from "inversify";
import { IUserRepository } from "../interfaces/IUserRepository";
import { User, IUser } from "../models/User";
import { CreateUserDto } from "../dtos/CreateUserDto";

@injectable()
export class UserRepository implements IUserRepository {
    async create(data: Partial<IUser>): Promise<IUser> {
        const user = new User(data);
        return await user.save();
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }

    async updateProfile(id: string, data: Partial<IUser["profile"]>): Promise<IUser | null> {
        const updateQuery: Record<string, any> = {};
        Object.keys(data).forEach((key) => {
            updateQuery[`profile.${key}`] = (data as any)[key];
        });


        return await User.findByIdAndUpdate(id, { $set: updateQuery }, { new: true });
    }

    async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
        await User.findByIdAndUpdate(id, { refreshToken });
    }

    async saveResetToken(id: string, token: string, expires: Date): Promise<void> {
        await User.findByIdAndUpdate(id, { resetPasswordToken: token, resetPasswordExpires: expires });
    }

    async findByResetToken(token: string): Promise<IUser | null> {
        return await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        });
    }

    async updatePassword(id: string, passwordHash: string): Promise<void> {
        await User.findByIdAndUpdate(id, {
            passwordHash,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
        });
    }

    async findByVerificationCode(email: string, code: string): Promise<IUser | null> {
        return await User.findOne({
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: new Date() },
        });
    }

    async verifyUser(id: string): Promise<void> {
        await User.findByIdAndUpdate(id, {
            status: "active",
            verificationCode: undefined,
            verificationCodeExpires: undefined,
            verificationAttempts: undefined,
        });
    }

    async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }
}
