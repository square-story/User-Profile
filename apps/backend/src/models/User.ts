import mongoose, { type Document, Schema } from "mongoose";

export interface IUserProfile {
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: "admin" | "user" | "moderator";
  isActive: boolean;
  status: "active" | "inactive";
  profile: IUserProfile;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  verificationAttempts?: number;
  lastOtpSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user", "moderator"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      bio: { type: String },
      avatarUrl: { type: String },
      avatarPublicId: { type: String },
    },
    refreshToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    verificationAttempts: { type: Number, default: 0 },
    lastOtpSentAt: { type: Date },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", UserSchema);
