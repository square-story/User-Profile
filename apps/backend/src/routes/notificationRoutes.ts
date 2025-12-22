import { Router } from "express";
import { container } from "../container";
import { TYPES } from "../constants/types";
import { NotificationController } from "../controllers/NotificationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const notificationRouter = Router();
const notificationController = container.get<NotificationController>(TYPES.NotificationController);

notificationRouter.get("/", authMiddleware, notificationController.list);

export default notificationRouter;
