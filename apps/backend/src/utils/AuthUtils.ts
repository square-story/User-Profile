import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { UserPayload } from "../interfaces/UserPayload";

export class AuthUtils {
    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    static generateAccessToken(payload: UserPayload): string {
        return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtAccessExpiry as jwt.SignOptions["expiresIn"] });
    }

    static generateRefreshToken(payload: UserPayload): string {
        return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiry as jwt.SignOptions["expiresIn"] });
    }

    static verifyAccessToken(token: string): UserPayload {
        return jwt.verify(token, config.jwtSecret) as UserPayload;
    }

    static verifyRefreshToken(token: string): UserPayload {
        return jwt.verify(token, config.jwtRefreshSecret) as UserPayload;
    }
}
