import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import profileRouter from "./routes/profileRoutes";
import notificationRouter from "./routes/notificationRoutes";
import adminRouter from "./routes/adminRoutes";
import { config } from "./config";
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
app.get("/health", (req, res) => {
    res.status(StatusCode.Success).json({ status: "ok", env: config.env });
});

// Custom Error Interface
interface HttpError extends Error {
    status?: number;
}

// Error Handling Middleware
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || StatusCode.InternalServerError).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;
