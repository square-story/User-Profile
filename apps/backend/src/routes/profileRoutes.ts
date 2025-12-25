import { Router } from "express";
import { container } from "../container";
import { TYPES } from "../constants/types";
import { ProfileController } from "../controllers/ProfileController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";
import { auditMiddleware } from "../middlewares/auditMiddleware";

const profileRouter = Router();
const profileController = container.get<ProfileController>(TYPES.ProfileController);

profileRouter.get("/", authMiddleware, profileController.get);
profileRouter.put("/", authMiddleware, auditMiddleware("UPDATE_PROFILE", "USER"), profileController.update);
profileRouter.post("/avatar", authMiddleware, uploadMiddleware.single("avatar"), auditMiddleware("UPLOAD_AVATAR", "USER"), profileController.uploadAvatar);

export default profileRouter;
