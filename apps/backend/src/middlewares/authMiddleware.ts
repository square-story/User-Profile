import type { NextFunction, Request, Response } from "express";
import type { UserPayload } from "../interfaces/UserPayload";
import { AuthUtils } from "../utils/AuthUtils";

export interface AuthRequest extends Request {
  user?: UserPayload;
}

import { TYPES } from "../constants/types";
import { container } from "../container";
import type { IUserRepository } from "../interfaces/IUserRepository";
import { StatusCode } from "../types";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(StatusCode.Unauthorized)
      .json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = AuthUtils.verifyAccessToken(token);

    // Resolve dependency
    const userRepository = container.get<IUserRepository>(TYPES.UserRepository);

    // Immediate blocking check
    const user = await userRepository.findById(decoded.userId);

    if (!user || user.status !== "active") {
      return res
        .status(StatusCode.Forbidden)
        .json({ success: false, message: "Your account has been deactivated" });
    }

    req.user = decoded;
    next();
  } catch (_err) {
    return res
      .status(StatusCode.Unauthorized)
      .json({ success: false, message: "Invalid token" });
  }
};
