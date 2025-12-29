import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
    action: string;
    adminId: mongoose.Types.ObjectId;
    targetUserId?: mongoose.Types.ObjectId;
    resource: string;
    ipAddress?: string;
    userAgent?: string;
    details?: string;
    changes?: Record<string, unknown>;
    createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
    {
        action: { type: String, required: true },
        adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        targetUserId: { type: Schema.Types.ObjectId, ref: "User" },
        resource: { type: String, required: true },
        ipAddress: { type: String },
        userAgent: { type: String },
        details: { type: String },
        changes: { type: Schema.Types.Mixed },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes for efficient filtering
AuditLogSchema.index({ adminId: 1 });
AuditLogSchema.index({ targetUserId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
