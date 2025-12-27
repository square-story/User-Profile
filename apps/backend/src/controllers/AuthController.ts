import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";
import { IAuthService } from "../interfaces/IAuthService";

@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthService) private _authService: IAuthService) { }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
            const userAgent = req.headers["user-agent"] || "";
            const result = await this._authService.login({ email, passwordHash: password }, { ip, userAgent });

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json({
                success: true,
                data: { accessToken: result.accessToken, user: result.user },
            });
        } catch (error) {
            next(error);
        }
    };

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this._authService.register(req.body);

            res.status(201).json({
                success: true,
                message: "Registration successful. Please check your email for the verification code.",
            });
        } catch (error) {
            next(error);
        }
    };

    verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, code } = req.body;
            const result = await this._authService.verifyEmail(email, code);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json({
                success: true,
                data: { accessToken: result.accessToken, user: result.user },
            });
        } catch (error) {
            next(error);
        }
    };

    resendVerification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this._authService.resendVerification(email);
            res.status(200).json({
                success: true,
                message: "Verification code sent successfully.",
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast to AuthRequest since middleware ensures it
            const userId = (req as AuthRequest).user?.userId;
            if (userId) {
                await this._authService.logout(userId);
            }

            res.clearCookie("refreshToken");
            res.status(200).json({ success: true, message: "Logged out successfully" });
        } catch (error) {
            next(error);
        }
    };

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) throw new Error("No refresh token");

            const result = await this._authService.refreshTokens(refreshToken);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: true, // Always true for Vercel/Production (HTTPS is standard)
                sameSite: "none", // Required for cross-domain (Frontend -> Backend on different Vercel domains)
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                success: true,
                data: { accessToken: result.accessToken },
            });
        } catch (error) {
            next(error);
        }
    }

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await this._authService.forgotPassword(email);
            res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, newPassword } = req.body;
            await this._authService.resetPassword(token, newPassword);
            res.status(200).json({ success: true, message: "Password has been reset successfully." });
        } catch (error) {
            next(error);
        }
    };

    changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = (req as AuthRequest).user?.userId;
            if (!userId) throw new Error("User not found");
            await this._authService.changePassword(userId, currentPassword, newPassword);
            res.status(200).json({ success: true, message: "Password has been changed successfully." });
        } catch (error) {
            next(error);
        }
    };

    validateResetToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.query;
            if (!token || typeof token !== "string") {
                throw new Error("Token is required");
            }
            await this._authService.validateResetToken(token);
            res.status(200).json({ success: true, message: "Token is valid" });
        } catch (error) {
            next(error);
        }
    };
}
