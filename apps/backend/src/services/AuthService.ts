import { injectable, inject } from "inversify";
import { IAuthService } from "../interfaces/IAuthService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { TYPES } from "../constants/types";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { IUser } from "../models/User";
import { AuthUtils } from "../utils/AuthUtils";
import { UserPayload } from "../interfaces/UserPayload";

import { IEmailService } from "../interfaces/IEmailService";

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.EmailService) private emailService: IEmailService
    ) { }

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

        // Send Email (Async, non-blocking)
        this.emailService.sendVerificationEmail(newUser.email, newUser.profile.firstName, "mock-verification-token");

        return { accessToken, refreshToken, user: newUser };
    }

    async login(credentials: { email: string; passwordHash: string }): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        if (user.status !== "active") {
            throw new Error("Your account has been deactivated. Please contact support.");
        }

        const isMatch = await AuthUtils.comparePassword(credentials.passwordHash, user.passwordHash);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const payload: UserPayload = { userId: user._id as unknown as string, email: user.email, role: user.role };
        const accessToken = AuthUtils.generateAccessToken(payload);
        const refreshToken = AuthUtils.generateRefreshToken(payload);

        await this.userRepository.updateRefreshToken(user._id as unknown as string, refreshToken);

        // Send Email (Async, non-blocking)
        this.emailService.sendLoginAlertEmail(user.email, user.profile.firstName, "Unknown Device (IP Tracking Not Implemented)");

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

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            // Do not reveal if user exists
            return;
        }

        // Generate simple random token
        const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expires = new Date(Date.now() + 3600000); // 1 hour

        await this.userRepository.saveResetToken(user._id as unknown as string, resetToken, expires);
        await this.emailService.sendPasswordResetEmail(user.email, user.profile.firstName, resetToken);
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findByResetToken(token);
        if (!user) {
            throw new Error("Invalid or expired reset token");
        }

        const passwordHash = await AuthUtils.hashPassword(newPassword);
        await this.userRepository.updatePassword(user._id as unknown as string, passwordHash);
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const isMatch = await AuthUtils.comparePassword(currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new Error("Invalid current password");
        }

        const passwordHash = await AuthUtils.hashPassword(newPassword);
        await this.userRepository.updatePassword(userId, passwordHash);
    }
}
