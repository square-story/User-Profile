import { Request, Response, NextFunction } from "express";
import { AuthUtils } from "../utils/AuthUtils";

import { UserPayload } from "../interfaces/UserPayload";

export interface AuthRequest extends Request {
    user?: UserPayload;
}

import { User } from "../models/User";

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = AuthUtils.verifyAccessToken(token);

        // Immediate blocking check
        const user = await User.findById(decoded.userId).select("status");
        if (!user || user.status !== "active") {
            return res.status(403).json({ success: false, message: "Your account has been deactivated" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
