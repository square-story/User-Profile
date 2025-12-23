import { injectable, inject } from "inversify";
import { IAuthService } from "../interfaces/IAuthService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { TYPES } from "../constants/types";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { IUser } from "../models/User";
import { AuthUtils } from "../utils/AuthUtils";
import { UserPayload } from "../interfaces/UserPayload";

@injectable()
export class AuthService implements IAuthService {
    constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) { }

    async register(data: CreateUserDto): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const passwordHash = await AuthUtils.hashPassword(data.passwordHash);

        // We treat data.passwordHash as the plain password input here for simplicity or assume DTO mapping handled it.
        // Ideally, DTO should have 'password' and we map it to 'passwordHash' in model.
        // For now, let's assume the DTO field carries the plain password as intended by the previous step's input.

        const newUser = await this.userRepository.create({ ...data, passwordHash });

        const payload: UserPayload = { userId: newUser._id as unknown as string, email: newUser.email, role: newUser.role };
        const accessToken = AuthUtils.generateAccessToken(payload);
        const refreshToken = AuthUtils.generateRefreshToken(payload);

        await this.userRepository.updateRefreshToken(newUser._id as unknown as string, refreshToken);

        return { accessToken, refreshToken, user: newUser };
    }

    async login(credentials: { email: string; passwordHash: string }): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await AuthUtils.comparePassword(credentials.passwordHash, user.passwordHash);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const payload: UserPayload = { userId: user._id as unknown as string, email: user.email, role: user.role };
        const accessToken = AuthUtils.generateAccessToken(payload);
        const refreshToken = AuthUtils.generateRefreshToken(payload);

        await this.userRepository.updateRefreshToken(user._id as unknown as string, refreshToken);

        return { accessToken, refreshToken, user };
    }

    async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = AuthUtils.verifyRefreshToken(refreshToken);
        const user = await this.userRepository.findById(payload.userId);

        if (!user || user.refreshToken !== refreshToken) {
            throw new Error("Invalid refresh token");
        }

        const newPayload: UserPayload = { userId: user._id as unknown as string, email: user.email, role: user.role };
        const newAccessToken = AuthUtils.generateAccessToken(newPayload);
        const newRefreshToken = AuthUtils.generateRefreshToken(newPayload);

        await this.userRepository.updateRefreshToken(user._id as unknown as string, newRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    async logout(userId: string): Promise<void> {
        await this.userRepository.updateRefreshToken(userId, null);
    }
}
