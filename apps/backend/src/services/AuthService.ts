import { injectable, inject } from "inversify";
import crypto from "crypto";
import { IAuthService } from "../interfaces/IAuthService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { TYPES } from "../constants/types";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { IUser } from "../models/User";
import { AuthUtils } from "../utils/AuthUtils";
import { UserPayload } from "../interfaces/UserPayload";

import { IEmailService } from "../interfaces/IEmailService";
import { ILoginActivityService } from "../interfaces/ILoginActivityService";
import { AppError } from "../utils/errorUtils";
import { StatusCode } from "../types";

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
        @inject(TYPES.EmailService) private _emailService: IEmailService,
        @inject(TYPES.LoginActivityService) private _loginActivityService: ILoginActivityService
    ) { }



    async register(data: CreateUserDto): Promise<void> {
        const existingUser = await this._userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError("User already exists", StatusCode.Conflict);
        }

        const passwordHash = await AuthUtils.hashPassword(data.passwordHash);

        // Generate 6-digit OTP
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour

        // Create user with inactive status and verification code
        const newUserInitial: Partial<IUser> = {
            ...data,
            passwordHash,
            verificationCode,
            verificationCodeExpires,
            verificationAttempts: 0
        };

        await this._userRepository.create(newUserInitial);

        // Send Email (Async, non-blocking)
        await this._emailService.sendVerificationEmail(data.email, data.profile.firstName, verificationCode);
    }

    async verifyEmail(email: string, code: string): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
        // Find user by email first to check attempts
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new AppError("Invalid or expired verification code", StatusCode.NotFound);
        }

        if (user.status === 'active') {
            throw new AppError("User already verified", StatusCode.Conflict);
        }

        // Check attempts
        if (user.verificationAttempts && user.verificationAttempts >= 5) {
            throw new AppError("Too many failed attempts. Please request a new code.", StatusCode.TooManyAttempts);
        }

        // Check code and expiry
        if (user.verificationCode !== code || !user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
            // Increment attempts
            await this._userRepository.updateUser(user._id as unknown as string, {
                verificationAttempts: (user.verificationAttempts || 0) + 1
            });
            throw new AppError("Invalid or expired verification code", StatusCode.BadRequest);
        }

        await this._userRepository.verifyUser(user._id as unknown as string);

        const payload: UserPayload = { userId: user._id as unknown as string, email: user.email, role: user.role };
        const accessToken = AuthUtils.generateAccessToken(payload);
        const refreshToken = AuthUtils.generateRefreshToken(payload);

        await this._userRepository.updateRefreshToken(user._id as unknown as string, refreshToken);

        return { accessToken, refreshToken, user };
    }

    async resendVerification(email: string): Promise<void> {
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            // Silent failure or generic message to prevent enumeration (security best practice vs UX)
            // For this prompt's UX requirements, might stick to throwing if user not found, or just return.
            // Given user story implies existing user context, throw specific if logical.
            throw new AppError("User not found", StatusCode.NotFound);
        }

        if (user.status === 'active') {
            throw new AppError("User already verified", StatusCode.Conflict);
        }

        // Rate limit: 60s
        if (user.lastOtpSentAt) {
            const timeSinceLastOtp = Date.now() - user.lastOtpSentAt.getTime();
            if (timeSinceLastOtp < 60000) {
                const remaining = Math.ceil((60000 - timeSinceLastOtp) / 1000);
                throw new AppError(`Please wait ${remaining} seconds before requesting a new code.`, StatusCode.TooManyAttempts);
            }
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour

        await this._userRepository.updateUser(user._id as unknown as string, {
            verificationCode,
            verificationCodeExpires,
            verificationAttempts: 0,
            lastOtpSentAt: new Date()
        });

        await this._emailService.sendVerificationEmail(user.email, user.profile.firstName, verificationCode);
    }

    async login(credentials: { email: string; passwordHash: string }, clientInfo?: { ip: string, userAgent: string }): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
        const user = await this._userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new AppError("User not found", StatusCode.NotFound, false);
        }

        if (user.status !== "active") {
            if (user.verificationCode) {
                // If user has a verification code but is inactive, it means they are pending verification
                // Or we can check a specific 'pending' status if we had one.
                // Assuming status 'inactive' + existing code = pending verification.
                throw new AppError("User not verified", StatusCode.BadRequest, false);
            }
            throw new AppError("Your account has been deactivated. Please contact support.", StatusCode.Forbidden, false);
        }

        const isMatch = await AuthUtils.comparePassword(credentials.passwordHash, user.passwordHash);
        if (!isMatch) {
            throw new AppError("Invalid credentials", StatusCode.BadRequest, false);
        }

        const payload: UserPayload = { userId: user._id as unknown as string, email: user.email, role: user.role };
        const accessToken = AuthUtils.generateAccessToken(payload);
        const refreshToken = AuthUtils.generateRefreshToken(payload);

        await this._userRepository.updateRefreshToken(user._id as unknown as string, refreshToken);

        // Send Email (Async, non-blocking)
        // Handle Login History & Notifications
        if (clientInfo) {
            await this._loginActivityService.recordLogin(user._id as unknown as string, clientInfo.ip, clientInfo.userAgent);
        } else {
            // Fallback if no info passed (legacy/test), maybe just log warning or skip
            this._emailService.sendLoginAlertEmail(user.email, user.profile.firstName, "Unknown Device");
        }

        return { accessToken, refreshToken, user };
    }

    async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = AuthUtils.verifyRefreshToken(refreshToken);
        const user = await this._userRepository.findById(payload.userId);

        if (!user || user.refreshToken !== refreshToken) {
            throw new AppError("Invalid refresh token", StatusCode.BadRequest);
        }

        if (user.status !== "active") {
            throw new AppError("Your account has been deactivated", StatusCode.Forbidden);
        }

        const newPayload: UserPayload = { userId: user._id as unknown as string, email: user.email, role: user.role };
        const newAccessToken = AuthUtils.generateAccessToken(newPayload);
        const newRefreshToken = AuthUtils.generateRefreshToken(newPayload);

        await this._userRepository.updateRefreshToken(user._id as unknown as string, newRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    async logout(userId: string): Promise<void> {
        await this._userRepository.updateRefreshToken(userId, null);
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new AppError("User with this email does not exist", StatusCode.BadRequest);
        }

        // Generate a random reset token (32 bytes hex)
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash the token before storing it
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        const expires = new Date(Date.now() + 3600000); // 1 hour

        // Save the *hash* to the database
        await this._userRepository.saveResetToken(user._id as unknown as string, resetTokenHash, expires);

        // Send the *raw* token to the user
        await this._emailService.sendPasswordResetEmail(user.email, user.profile.firstName, resetToken);
    }

    async validateResetToken(token: string): Promise<void> {
        const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const user = await this._userRepository.findByResetToken(resetTokenHash);
        if (!user) {
            throw new AppError("Invalid or expired reset token", StatusCode.BadRequest);
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        // Hash the incoming token to find the user
        const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const user = await this._userRepository.findByResetToken(resetTokenHash);
        if (!user) {
            throw new AppError("Invalid or expired reset token", StatusCode.BadRequest);
        }

        const passwordHash = await AuthUtils.hashPassword(newPassword);

        // Update password and clear reset token
        await this._userRepository.updatePassword(user._id as unknown as string, passwordHash);

        // Invalidate all existing sessions by clearing the refresh token
        await this._userRepository.updateRefreshToken(user._id as unknown as string, null);
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new AppError("User not found", StatusCode.NotFound, false);
        }

        const isMatch = await AuthUtils.comparePassword(currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new AppError("Invalid current password", StatusCode.BadRequest);
        }

        const passwordHash = await AuthUtils.hashPassword(newPassword);
        await this._userRepository.updatePassword(userId, passwordHash);
    }
}
