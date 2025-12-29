import { Router } from "express";
import { TYPES } from "../constants/types";
import { container } from "../container";
import type { ProfileController } from "../controllers/ProfileController";
import { auditMiddleware } from "../middlewares/auditMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";

const profileRouter = Router();
const profileController = container.get<ProfileController>(
  TYPES.ProfileController,
);

profileRouter.get("/", authMiddleware, profileController.get);
profileRouter.put(
  "/",
  authMiddleware,
  auditMiddleware("UPDATE_PROFILE", "USER"),
  profileController.update,
);
profileRouter.post(
  "/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  auditMiddleware("UPLOAD_AVATAR", "USER"),
  profileController.uploadAvatar,
);

export default profileRouter;
