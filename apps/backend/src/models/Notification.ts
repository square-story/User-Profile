import mongoose, { type Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, capped: { size: 1048576, max: 1000 } },
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema,
);
