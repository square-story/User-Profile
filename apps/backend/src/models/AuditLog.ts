import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
    action: string;
    adminId: string;
    targetUserId?: string;
    details?: string;
    createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
    {
        action: { type: String, required: true },
        adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        targetUserId: { type: Schema.Types.ObjectId, ref: "User" },
        details: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
