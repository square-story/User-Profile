import { Request, Response, NextFunction } from "express";
import { AuthUtils } from "../utils/AuthUtils";

import { UserPayload } from "../interfaces/UserPayload";

export interface AuthRequest extends Request {
    user?: UserPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = AuthUtils.verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
