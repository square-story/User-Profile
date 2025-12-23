import { Router } from "express";
import { container } from "../container";
import { TYPES } from "../constants/types";
import { AdminController } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const adminRouter = Router();
const adminController = container.get<AdminController>(TYPES.AdminController);

adminRouter.use(authMiddleware);
adminRouter.use(adminMiddleware);

adminRouter.get("/users", adminController.getUsers);
adminRouter.patch("/users/:userId/status", adminController.toggleStatus);
adminRouter.get("/audit-logs", adminController.getAuditLogs);

export default adminRouter;
