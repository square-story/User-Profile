import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    userId: string;
    message: string;
    read: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
