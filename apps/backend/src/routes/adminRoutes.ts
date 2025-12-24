import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { container } from "../container";
import { TYPES } from "../constants/types";
import { AdminController } from "../controllers/AdminController";

const adminRouter = Router();
const adminController = container.get<AdminController>(TYPES.AdminController);

// User Management
adminRouter.get("/users", authMiddleware, adminMiddleware, adminController.getAllUsers);
adminRouter.get("/users/:id", authMiddleware, adminMiddleware, adminController.getUserById);
adminRouter.put("/users/:id", authMiddleware, adminMiddleware, adminController.updateUser);

// User Actions
adminRouter.post("/users/:id/deactivate", authMiddleware, adminMiddleware, adminController.deactivateUser);
adminRouter.post("/users/:id/reactivate", authMiddleware, adminMiddleware, adminController.reactivateUser);

// Bulk Actions
adminRouter.post("/users/bulk-deactivate", authMiddleware, adminMiddleware, adminController.bulkDeactivate);
adminRouter.post("/users/bulk-reactivate", authMiddleware, adminMiddleware, adminController.bulkReactivate);

// Logs & History
adminRouter.get("/audit-logs", authMiddleware, adminMiddleware, adminController.getAuditLogs);
adminRouter.get("/users/:id/history", authMiddleware, adminMiddleware, adminController.getUserLoginHistory);

export default adminRouter;
