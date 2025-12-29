import mongoose, { type Document, Schema } from "mongoose";

export interface ILoginHistory extends Document {
  userId: mongoose.Types.ObjectId;
  ipAddress: string;
  userAgent: string;
  deviceInfo?: string;
  sessionDuration?: number; // in seconds
  loginAt: Date;
}

const LoginHistorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    deviceInfo: { type: String },
    sessionDuration: { type: Number },
    loginAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

LoginHistorySchema.index({ userId: 1, loginAt: -1 });

export const LoginHistory = mongoose.model<ILoginHistory>(
  "LoginHistory",
  LoginHistorySchema,
);
