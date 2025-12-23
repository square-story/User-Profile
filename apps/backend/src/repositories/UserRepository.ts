import { injectable } from "inversify";
import { IUserRepository } from "../interfaces/IUserRepository";
import { User, IUser } from "../models/User";
import { CreateUserDto } from "../dtos/CreateUserDto";

@injectable()
export class UserRepository implements IUserRepository {
    async create(data: CreateUserDto): Promise<IUser> {
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
        if (data.firstName) updateQuery["profile.firstName"] = data.firstName;
        if (data.lastName) updateQuery["profile.lastName"] = data.lastName;
        if (data.bio) updateQuery["profile.bio"] = data.bio;

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
}
