import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";
import { IAuthService } from "../interfaces/IAuthService";

@injectable()
export class AuthController {
    constructor(@inject(TYPES.AuthService) private authService: IAuthService) { }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login({ email, passwordHash: password });

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
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
            const result = await this.authService.register(req.body);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(201).json({
                success: true,
                data: { accessToken: result.accessToken, user: result.user },
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
                await this.authService.logout(userId);
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

            const result = await this.authService.refreshTokens(refreshToken);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
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
            await this.authService.forgotPassword(email);
            res.status(200).json({ success: true, message: "If that email exists, a reset link has been sent." });
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, newPassword } = req.body;
            await this.authService.resetPassword(token, newPassword);
            res.status(200).json({ success: true, message: "Password has been reset successfully." });
        } catch (error) {
            next(error);
        }
    };
}
