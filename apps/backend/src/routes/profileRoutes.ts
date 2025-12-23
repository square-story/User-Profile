import { Router } from "express";
import { container } from "../container";
import { TYPES } from "../constants/types";
import { ProfileController } from "../controllers/ProfileController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";

const profileRouter = Router();
const profileController = container.get<ProfileController>(TYPES.ProfileController);

profileRouter.get("/", authMiddleware, profileController.get);
profileRouter.put("/", authMiddleware, profileController.update);
profileRouter.post("/avatar", authMiddleware, uploadMiddleware.single("avatar"), profileController.uploadAvatar);

export default profileRouter;
