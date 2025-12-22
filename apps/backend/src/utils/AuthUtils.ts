import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";

export class AuthUtils {
    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    static generateAccessToken(payload: object): string {
        return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtAccessExpiry as any });
    }

    static generateRefreshToken(payload: object): string {
        return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiry as any });
    }

    static verifyAccessToken(token: string): any {
        return jwt.verify(token, config.jwtSecret);
    }

    static verifyRefreshToken(token: string): any {
        return jwt.verify(token, config.jwtRefreshSecret);
    }
}
