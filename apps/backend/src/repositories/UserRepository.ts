import { injectable } from "inversify";
import type { IUserRepository } from "../interfaces/IUserRepository";
import { type IUser, User } from "../models/User";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async updateProfile(
    id: string,
    data: Partial<IUser["profile"]>,
  ): Promise<IUser | null> {
    const updateQuery: Record<string, unknown> = {};
    for (const key of Object.keys(data)) {
      const typedKey = key as keyof typeof data;
      if (data[typedKey] !== undefined) {
        updateQuery[`profile.${key}`] = data[typedKey];
      }
    }

    return await this.model.findByIdAndUpdate(
      id,
      { $set: updateQuery },
      { new: true },
    );
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.model.findByIdAndUpdate(id, { refreshToken });
  }

  async saveResetToken(
    id: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.model.findByIdAndUpdate(id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });
  }

  async findByResetToken(token: string): Promise<IUser | null> {
    return await this.model.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, {
      passwordHash,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });
  }

  async findByVerificationCode(
    email: string,
    code: string,
  ): Promise<IUser | null> {
    return await this.model.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: new Date() },
    });
  }

  async verifyUser(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, {
      status: "active",
      verificationCode: undefined,
      verificationCodeExpires: undefined,
      verificationAttempts: undefined,
    });
  }
}
