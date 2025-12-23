import { Router } from "express";
import { container } from "../container";
import { TYPES } from "../constants/types";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

authRouter.post("/register", authController.register);
authRouter.post("/verify-email", authController.verifyEmail);
authRouter.post("/resend-verification", authController.resendVerification);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authMiddleware, authController.logout);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.post("/change-password", authMiddleware, authController.changePassword);

export default authRouter;
