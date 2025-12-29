import "reflect-metadata";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./config";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import adminRouter from "./routes/adminRoutes";
import authRouter from "./routes/authRoutes";
import notificationRouter from "./routes/notificationRoutes";
import profileRouter from "./routes/profileRoutes";
import { StatusCode } from "./types";

const app = express();
app.use(helmet());
app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/admin", adminRouter);

// Health Check
app.get("/health", (_req, res) => {
  res.status(StatusCode.Success).json({ status: "ok", env: config.env });
});

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
