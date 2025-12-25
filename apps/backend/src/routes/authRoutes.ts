import { Router } from "express";
import { container } from "../container";
import { TYPES } from "../constants/types";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    forgotPasswordSchema,
    validateResetTokenSchema,
    resetPasswordSchema,
    changePasswordSchema,
} from "../validators/auth.schema";

const authRouter = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

authRouter.post(
    "/register",
    validateRequest({ body: registerSchema }),
    authController.register
);
authRouter.post(
    "/verify-email",
    validateRequest({ body: verifyEmailSchema }),
    authController.verifyEmail
);
authRouter.post(
    "/resend-verification",
    validateRequest({ body: resendVerificationSchema }),
    authController.resendVerification
);
authRouter.post(
    "/login",
    validateRequest({ body: loginSchema }),
    authController.login
);
authRouter.post("/logout", authMiddleware, authController.logout);
authRouter.post("/refresh", authController.refresh);
authRouter.post(
    "/forgot-password",
    validateRequest({ body: forgotPasswordSchema }),
    authController.forgotPassword
);
authRouter.get(
    "/reset-password/validate",
    validateRequest({ query: validateResetTokenSchema }),
    authController.validateResetToken
);
authRouter.post(
    "/reset-password",
    validateRequest({ body: resetPasswordSchema }),
    authController.resetPassword
);
authRouter.post(
    "/change-password",
    authMiddleware,
    validateRequest({ body: changePasswordSchema }),
    authController.changePassword
);

export default authRouter;
