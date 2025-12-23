import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile {
    firstName: string;
    lastName: string;
    bio?: string;
}

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    role: "admin" | "user";
    profile: IUserProfile;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        profile: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            bio: { type: String },
        },
        refreshToken: { type: String },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
