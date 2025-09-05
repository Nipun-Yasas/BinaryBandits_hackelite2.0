import mongoose, { Schema, InferSchemaType, models, model } from "mongoose";

const UserActivitySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: [
        "login",
        "logout",
        "query",
        "export",
        "profile_update",
        "password_reset",
      ],
      required: true,
    },
    details: { type: mongoose.Schema.Types.Mixed }, // Flexible object for action-specific data
    ipAddress: { type: String },
    userAgent: { type: String },
    location: { type: String },
    sessionId: { type: String, index: true },
    success: { type: Boolean, default: true },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

// Indexes for efficient queries
UserActivitySchema.index({ userId: 1, createdAt: -1 });
UserActivitySchema.index({ action: 1, createdAt: -1 });
UserActivitySchema.index({ createdAt: -1 });

export type UserActivityDoc = InferSchemaType<typeof UserActivitySchema> & {
  _id: mongoose.Types.ObjectId;
};

export default (models.UserActivity as mongoose.Model<UserActivityDoc>) ||
  model<UserActivityDoc>("UserActivity", UserActivitySchema);
