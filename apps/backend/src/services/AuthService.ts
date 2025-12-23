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

    async register(data: CreateUserDto): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const passwordHash = await AuthUtils.hashPassword(data.passwordHash);

        // Generate 6-digit OTP
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour

        // Create user with inactive status and verification code
        // Note: The User model creates status: 'inactive' by default now, but we'll set the code fields explicitly
        // We'll trust the repository create method to handle standard fields, but we might need to update it to accept code fields
        // Or update the user immediately after creation. Since repository.create takes DTO, and DTO doesn't have these codes...
        // We can pass them if we update the DTO/repository signature, OR we act like this:
        // Ideally, we update the user right after creation or pass extra args.
        // Let's assume the repository.create call can take extra fields or we update it.
        // Actually, the simplest way without changing Repository interface too much is to Create then Update, OR
        // Cast the object to any if the repository implementation is flexible (it uses `new User(data)`).
        // Let's modify the data object by casting.

        const newUserInitial: any = {
            ...data,
            passwordHash,
            verificationCode,
            verificationCodeExpires,
            verificationAttempts: 0
        };

        await this.userRepository.create(newUserInitial);

        // Send Email (Async, non-blocking)
        await this.emailService.sendVerificationEmail(data.email, data.profile.firstName, verificationCode);
    }

    async verifyEmail(email: string, code: string): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
        // Find user by email first to check attempts
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid or expired verification code");
        }

        if (user.status === 'active') {
            throw new Error("User already verified");
        }

        // Check attempts
        if (user.verificationAttempts && user.verificationAttempts >= 5) {
            throw new Error("Too many failed attempts. Please request a new code.");
        }

        // Check code and expiry
        if (user.verificationCode !== code || !user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
            // Increment attempts
            await this.userRepository.updateUser(user._id as unknown as string, {
                verificationAttempts: (user.verificationAttempts || 0) + 1
            });
            throw new Error("Invalid or expired verification code");
        }

        await this.userRepository.verifyUser(user._id as unknown as string);

        const payload: UserPayload = { userId: user._id as unknown as string, email: user.email, role: user.role };
        const accessToken = AuthUtils.generateAccessToken(payload);
        const refreshToken = AuthUtils.generateRefreshToken(payload);

        await this.userRepository.updateRefreshToken(user._id as unknown as string, refreshToken);

        return { accessToken, refreshToken, user };
    }

    async resendVerification(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            // Silent failure or generic message to prevent enumeration (security best practice vs UX)
            // For this prompt's UX requirements, might stick to throwing if user not found, or just return.
            // Given user story implies existing user context, throw specific if logical.
            throw new Error("User not found");
        }

        if (user.status === 'active') {
            throw new Error("User already verified");
        }

        // Rate limit: 60s
        if (user.lastOtpSentAt) {
            const timeSinceLastOtp = Date.now() - user.lastOtpSentAt.getTime();
            if (timeSinceLastOtp < 60000) {
                const remaining = Math.ceil((60000 - timeSinceLastOtp) / 1000);
                throw new Error(`Please wait ${remaining} seconds before requesting a new code.`);
            }
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour

        await this.userRepository.updateUser(user._id as unknown as string, {
            verificationCode,
            verificationCodeExpires,
            verificationAttempts: 0,
            lastOtpSentAt: new Date()
        });

        await this.emailService.sendVerificationEmail(user.email, user.profile.firstName, verificationCode);
    }

    async login(credentials: { email: string; passwordHash: string }): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        if (user.status !== "active") {
            if (user.verificationCode) {
                // If user has a verification code but is inactive, it means they are pending verification
                // Or we can check a specific 'pending' status if we had one.
                // Assuming status 'inactive' + existing code = pending verification.
                throw new Error("User not verified");
            }
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
            throw new Error("User with this email does not exist");
        }

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
