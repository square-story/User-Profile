import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import type { UserPayload } from "../interfaces/UserPayload";

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

function generateAccessToken(payload: UserPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtAccessExpiry as jwt.SignOptions["expiresIn"],
  });
}

function generateRefreshToken(payload: UserPayload): string {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiry as jwt.SignOptions["expiresIn"],
  });
}

function verifyAccessToken(token: string): UserPayload {
  return jwt.verify(token, config.jwtSecret) as UserPayload;
}

function verifyRefreshToken(token: string): UserPayload {
  return jwt.verify(token, config.jwtRefreshSecret) as UserPayload;
}

export const AuthUtils = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
