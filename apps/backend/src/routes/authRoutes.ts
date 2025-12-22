import { Router } from "express";
import { container } from "../container";
import { TYPES } from "../constants/types";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authMiddleware, authController.logout);
authRouter.post("/refresh", authController.refresh);

export default authRouter;
