import { Router } from "express";
import { TYPES } from "../constants/types";
import { container } from "../container";
import type { NotificationController } from "../controllers/NotificationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const notificationRouter = Router();
const notificationController = container.get<NotificationController>(
  TYPES.NotificationController,
);

notificationRouter.get("/", authMiddleware, notificationController.list);

export default notificationRouter;
